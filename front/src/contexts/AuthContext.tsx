/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import type { Product, User } from "../types";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import type { User as FirebaseAuthUser } from "firebase/auth";
import { getFirestore, doc, setDoc, setLogLevel } from "firebase/firestore";
import { fetchProductsByIdsCached } from "../utils/productCache";
import { authenticatedFetch } from "../utils/api";

setLogLevel("debug");

type UserData = FirebaseAuthUser & User;

interface AuthContextType {
  user: UserData | null | undefined;
  cart: Product[];
  login: (userData: User) => Promise<void>;
  googleLogin: (user: any) => Promise<boolean>;
  logout: () => Promise<void>;
  addToCart: (item: Product) => Promise<"ok" | "error">;
  removeFromCart: (itemId: number) => Promise<void>;
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  paymentStatus: PaymentStatus | null;
  purchasedProducts: Product[];
  loading: boolean;
  isAuthReady: boolean;
  setAtualizarQuery: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface Items {
  id: string;
  description: string;
  quantity: string;
  title: string;
  unit_price: string;
}

interface AdditionalInfo {
  items: Items[];
}

interface PointOfInteraction {
  transaction_data: {
    qr_code?: string;
    qr_code_base64?: string;
    ticket_url?: string;
  };
}

interface PixPayload {
  qr_code?: string;
  qr_code_base64?: string;
  ticket_url?: string;
}

interface PaymentStatus {
  id: number;
  status: string;
  status_detail?: string;
  total_amount?: number;
  transaction_amount?: number;
  payment_type?: string;
  payment_method?: string;
  date_approved?: string;
  additional_info?: AdditionalInfo;
  installments?: number;
  point_of_interaction?: PointOfInteraction;
  pix?: PixPayload;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let app: any;
let auth: any;
let db: any;
let appId: string;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  appId = import.meta.env.VITE_FIREBASE_APP_ID || "default-app-id";
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.length < 10) {
    throw new Error(
      "VITE_FIREBASE_API_KEY não está configurada ou é inválida.",
    );
  }
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch((error) =>
    console.error("Erro ao definir persistência:", error),
  );

  db = getFirestore(app);
} catch (e) {
  console.error("Erro ao inicializar Firebase:", e);
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [paymentId, setPaymentId] = useState<URLSearchParams | null>(null);
  const [atualizarQuery, setAtualizarQuery] = useState(false);
  const [user, setUser] = useState<any>();
  const googleLoginInFlight = React.useRef(false);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    if (!auth || !db) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        const response = await authenticatedFetch(`${VITE_BACKEND_URL}/api/session`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const backendData = await response.json();
          setUser(firebaseUser
            ? { ...firebaseUser, ...backendData, id: backendData.id }
            : backendData);
        } else {
          setUser(firebaseUser as UserData | null);
        }
      } catch (error) {
        console.error("Erro ao recuperar dados do backend no reload:", error);
        setUser(firebaseUser as UserData | null);
      } finally {
        setIsAuthReady(true);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const syncUserToFirestore = async (
    firebaseUser: FirebaseAuthUser,
    backendData: User,
  ) => {
    const userId = firebaseUser.uid;
    const userDocRef = doc(
      db,
      "artifacts",
      appId,
      "users",
      userId,
      "user_data",
      "profile",
    );

    const dataToSave: User = {
      name: backendData.name || firebaseUser.displayName,
      id: backendData.id,
      role: backendData.role || "user",
    };

    try {
      await setDoc(userDocRef, dataToSave, { merge: true });
      console.debug("Dados do usuário sincronizados com o Firestore.");
      return dataToSave;
    } catch (e) {
      console.error("Erro ao salvar dados no Firestore:", e);
      return {};
    }
  };

  const login = async (backendData: User) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;

    const syncedData = await syncUserToFirestore(firebaseUser, backendData);
    const combinedUser: UserData = { ...firebaseUser, ...syncedData };
    setCart([]);
    setUser(combinedUser);
  };

  const googleLogin = async (firebaseUser: any): Promise<boolean> => {
    if (googleLoginInFlight.current) return false;
    googleLoginInFlight.current = true;
    try {
      const firebaseIdToken = await firebaseUser.getIdToken();

      const response = await fetch(`${VITE_BACKEND_URL}/api/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseToken: firebaseIdToken,
          name: firebaseUser.displayName,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Erro na resposta do backend:", response.status);
        return false;
      }

      const data = await response.json();

      if (data.user) {
        await login(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao autenticar via Google (Firebase/Backend):", error);
      return false;
    } finally {
      googleLoginInFlight.current = false;
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await authenticatedFetch(`${VITE_BACKEND_URL}/api/logout`, {
          method: "POST",
          credentials: "include",
        });
        await signOut(auth);
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    }
    setUser(null);
    setCart([]);
  };

  useEffect(() => {
    let cancelled = false;
    const userId = user?.id;
    const fetchCart = async () => {
      if (!isAuthReady || !userId) {
        setCart([]);
        setSelectedItems([]);
        setLoading(false);
        return;
      }

      setCart([]);
      setSelectedItems([]);
      setLoading(true);
      try {
        const response = await authenticatedFetch(
          `${VITE_BACKEND_URL}/api/cart/${userId}`,
          {
            credentials: "include",
          },
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar o carrinho");
        }
        const productIds: number[] = await response.json();
        const fetchedItems = await fetchProductsByIdsCached(
          VITE_BACKEND_URL,
          productIds,
        );
        if (!cancelled) setCart(fetchedItems);
      } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCart();
    return () => { cancelled = true; };
  }, [user?.id, isAuthReady]);

  const addToCart = async (item: Product) => {
    if (!user || !user.id) {
      console.error(
        "Usuário não logado ou sem ID. Não é possível adicionar ao carrinho.",
      );
      return "error";
    }

    const itemExists = cart.some((cartItem) => cartItem.id === item.id);
    if (itemExists) {
      return "error";
    }
    try {
      const response = await authenticatedFetch(`${VITE_BACKEND_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: item.id }),
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Falha ao adicionar ao carrinho: ${response.status}`);
      setCart((prevCart) => [...prevCart, item]);
      return "ok";
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      return "error";
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user || !user.id) return;
    try {
      const response = await authenticatedFetch(`${VITE_BACKEND_URL}/api/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: itemId }),
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Falha ao remover do carrinho: ${response.status}`);
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== itemId),
      );
    } catch (error) {
      console.error("Erro ao remover produto do carrinho:", error);
    }
  };

  useEffect(() => {
    setPaymentId(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    if (atualizarQuery) {
      setPaymentId(new URLSearchParams(window.location.search));
    }
    setAtualizarQuery(false);
  }, [atualizarQuery]);

  useEffect(() => {
    if (!isAuthReady || !user || !paymentId) return;

    setLoading(true);
    const fetchPaymentStatus = async () => {
      try {
        const response = await authenticatedFetch(
          `${VITE_BACKEND_URL}/api/payments/status?${paymentId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();
        if (response.ok && data.payment) {
          const p = data.payment;
          const point_of_interaction =
            p.point_of_interaction ||
            (p.pix
              ? {
                  transaction_data: {
                    qr_code: p.pix.qr_code,
                    qr_code_base64: p.pix.qr_code_base64,
                    ticket_url: p.pix.ticket_url,
                  },
                }
              : undefined);

          const updatedStatus = {
            ...p,
            total_amount: p.transaction_amount || p.total_amount,
            point_of_interaction,
          };

          setPaymentStatus(updatedStatus);
        } else {
          console.error("Erro ao obter status do pagamento:", data.error);
          setPaymentStatus(null);
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erro de rede ao buscar status:", error);
        setPaymentStatus(null);
        setLoading(false);
      }
    };
    fetchPaymentStatus();
  }, [user, paymentId, isAuthReady]);

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      if (!paymentStatus?.additional_info?.items) {
        setPurchasedProducts([]);
        return;
      }

      setLoading(true);
      try {
        const ids = paymentStatus.additional_info.items
          .map((item) => Number(item.id))
          .filter((id) => Number.isFinite(id));
        const products = await fetchProductsByIdsCached(VITE_BACKEND_URL, ids);
        setPurchasedProducts(products);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erro ao buscar produtos comprados:", error);
        setLoading(false);
      }
    };

    fetchPurchasedProducts();
  }, [paymentStatus]);

  const contextValue = useMemo(
    () => ({
      user,
      cart,
      login,
      googleLogin,
      logout,
      addToCart,
      removeFromCart,
      selectedItems,
      setSelectedItems,
      paymentStatus,
      purchasedProducts,
      loading: loading || !isAuthReady,
      isAuthReady,
      setAtualizarQuery,
    }),
    [
      user,
      cart,
      selectedItems,
      paymentStatus,
      purchasedProducts,
      loading,
      isAuthReady,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
