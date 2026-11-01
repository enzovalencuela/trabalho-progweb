/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/Product";
import {
  fetchProductsWithCache,
  loadProductCache,
  saveProductCache,
} from "../utils/productCache";

interface ProductContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  searchQuery: string | number | undefined;
  setSearchQuery: React.Dispatch<
    React.SetStateAction<string | number | undefined>
  >;
  searchProducts: boolean;
  setSearchProducts: React.Dispatch<React.SetStateAction<boolean>>;
  produtos: boolean;
  setProdutos: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProductProviderProps {
  children: ReactNode;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | number>();
  const [searchProducts, setSearchProducts] = useState(false);
  const [produtos, setProdutos] = useState(false);

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const cache = loadProductCache();
    if (cache?.products?.length) {
      setProducts(cache.products);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cached = loadProductCache();

        if (!searchProducts && cached?.products?.length) {
          setProducts(cached.products);
          setLoading(false);
        } else {
          setLoading(true);
        }

        const { products: fetchedProducts } = await fetchProductsWithCache(
          VITE_BACKEND_URL
        );
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchProducts, VITE_BACKEND_URL]);

  useEffect(() => {
    if (products.length > 0) {
      saveProductCache(products);
    }
  }, [products]);

  const contextValue = useMemo(
    () => ({
      loading,
      setLoading,
      products,
      setProducts,
      searchQuery,
      setSearchQuery,
      searchProducts,
      setSearchProducts,
      produtos,
      setProdutos,
    }),
    [loading, products, searchQuery, searchProducts, produtos]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct deve ser usado dentro de um ProductProvider");
  }
  return context;
};
