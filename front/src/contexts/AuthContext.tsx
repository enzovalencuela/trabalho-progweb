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
import { fetchProductsByIdsCached } from "../utils/productCache";
import { authenticatedFetch } from "../utils/api";

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
  setPaymentStatus: React.Dispatch<React.SetStateAction<PaymentStatus | null>>;
  purchasedProducts: Product[];
  loading: boolean;
  isAuthReady: boolean;
  setAtualizarQuery: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface Items {
  id: string | number;
  description?: string;
  quantity?: string | number;
  title?: string;
  titulo?: string;
  unit_price?: string | number;
  preco?: string | number;
  img?: string;
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
  id: number | string;
  status: string;
  status_detail?: string;
  total_amount?: number;
  transaction_amount?: number;
  amount?: number;
  payment_type?: string;
  payment_method?: string;
  payment_method_id?: string;
  date_approved?: string;
  created_at?: string;
  provider_payment_id?: string;
  providerPaymentId?: string;
  transaction_id?: string;
  additional_info?: AdditionalInfo;
  items?: Items[] | any[];
  installments?: number;
  point_of_interaction?: PointOfInteraction;
  pix?: PixPayload;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let app: any;
let auth: any;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
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
} catch (e) {
  console.error("Erro ao inicializar Firebase Auth:", e);
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
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        const response = await authenticatedFetch(
          `${VITE_BACKEND_URL}/api/session`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const backendData = await response.json();
          setUser(
            firebaseUser
              ? { ...firebaseUser, ...backendData, id: backendData.id }
              : backendData,
          );
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

  const login = async (backendData: User) => {
    const firebaseUser = auth?.currentUser;
    const combinedUser = firebaseUser
      ? { ...firebaseUser, ...backendData }
      : backendData;

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
    return () => {
      cancelled = true;
    };
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
      const response = await authenticatedFetch(
        `${VITE_BACKEND_URL}/api/cart/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId: item.id }),
          credentials: "include",
        },
      );
      if (!response.ok)
        throw new Error(`Falha ao adicionar ao carrinho: ${response.status}`);
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
      const response = await authenticatedFetch(
        `${VITE_BACKEND_URL}/api/cart/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId: itemId }),
          credentials: "include",
        },
      );
      if (!response.ok)
        throw new Error(`Falha ao remover do carrinho: ${response.status}`);
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== itemId),
      );
    } catch (error) {
      console.error("Erro ao remover produto do carrinho:", error);
    }
  };

  useEffect(() => {
    const syncQuery = () => {
      setPaymentId(new URLSearchParams(window.location.search));
    };
    syncQuery();
    window.addEventListener("popstate", syncQuery);
    return () => window.removeEventListener("popstate", syncQuery);
  }, []);

  useEffect(() => {
    if (atualizarQuery) {
      setTimeout(() => {
        setPaymentId(new URLSearchParams(window.location.search));
      }, 50);
      setAtualizarQuery(false);
    }
  }, [atualizarQuery]);

  useEffect(() => {
    if (!isAuthReady || !user) {
      setLoading(false);
      return;
    }

    const queryStr = paymentId
      ? paymentId.toString()
      : new URLSearchParams(window.location.search).toString();

    const cleanQuery = queryStr.includes("payment_id=undefined")
      ? ""
      : queryStr;

    setLoading(true);
    const fetchPaymentStatus = async () => {
      try {
        const url = cleanQuery
          ? `${VITE_BACKEND_URL}/api/payments/status?${cleanQuery}`
          : `${VITE_BACKEND_URL}/api/payments/status`;

        const response = await authenticatedFetch(url, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok && (data.payment || data.id)) {
          const p = data.payment || data;
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

          const rawAmount = p.transaction_amount ?? p.total_amount ?? p.amount;
          const total_amount = rawAmount != null ? Number(rawAmount) : 0;
          const transactionId =
            p.id ||
            p.provider_payment_id ||
            p.providerPaymentId ||
            p.transaction_id;

          const updatedStatus: PaymentStatus = {
            ...p,
            id: transactionId,
            total_amount,
            transaction_amount: total_amount,
            point_of_interaction,
          };

          setPaymentStatus(updatedStatus);
        } else {
          setPaymentStatus(null);
        }
      } catch (error) {
        console.error("Erro de rede ao buscar status:", error);
        setPaymentStatus(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentStatus();
  }, [user, paymentId, isAuthReady]);

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      const items =
        paymentStatus?.additional_info?.items ||
        (paymentStatus as any)?.items;

      if (!items || !items.length) {
        setPurchasedProducts([]);
        return;
      }

      try {
        const ids = items
          .map((item: any) => Number(item.id))
          .filter((id: any) => Number.isFinite(id));

        let products: Product[] = [];
        if (ids.length > 0) {
          products = await fetchProductsByIdsCached(VITE_BACKEND_URL, ids);
        }

        if (products.length === 0 && items.length > 0) {
          products = items.map((item: any) => ({
            id: Number(item.id),
            titulo: item.title || item.titulo || "Produto",
            descricao: item.description || "",
            img: item.img || "",
            preco: Number(item.unit_price || item.preco || 0),
            max_parcelas: 1,
            taxa_parcela: 0,
            categoria: item.category_id || "",
            estoque: 1,
            disponivel: true,
          }));
        } else {
          products = products.map((prod) => {
            const itemMatch = items.find((it: any) => Number(it.id) === prod.id);
            return {
              ...prod,
              img: prod.img || itemMatch?.img || "",
              titulo: prod.titulo || itemMatch?.title || itemMatch?.titulo || "",
              preco: prod.preco ?? Number(itemMatch?.unit_price || itemMatch?.preco || 0),
            };
          });
        }

        setPurchasedProducts(products);
      } catch (error) {
        console.error("Erro ao buscar produtos comprados:", error);
        if (items) {
          setPurchasedProducts(
            items.map((item: any) => ({
              id: Number(item.id),
              titulo: item.title || item.titulo || "Produto",
              descricao: item.description || "",
              img: item.img || "",
              preco: Number(item.unit_price || item.preco || 0),
              max_parcelas: 1,
              taxa_parcela: 0,
              categoria: item.category_id || "",
              estoque: 1,
              disponivel: true,
            })),
          );
        }
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
      setPaymentStatus,
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
