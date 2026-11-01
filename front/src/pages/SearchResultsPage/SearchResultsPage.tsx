import React, { useEffect, useState } from "react";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import type { Product } from "../../types/Product";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loading from "../../components/Loading/Loading";
import MenuSearchSort from "../../components/MenuSearchSort/MenuSearchSort";
import {
  fetchProductsWithCache,
  filterCachedProducts,
} from "../../utils/productCache";
import {
  getCollectionProducts,
  getCollectionTitle,
  type ProductCategory,
  type ProductCollectionType,
} from "../../utils/productCollections";
import { mockProducts } from "../../mocks/products";

const SearchResultsPage: React.FC = () => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLabel, setSearchLabel] = useState("");
  const [showMenuSort, setShowMenuSort] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const category = params.get("categoria") || "";
    const session = params.get("sessao") as ProductCollectionType | null;
    const title = params.get("titulo") || "";

    setSearchLabel(
      title ||
        getCollectionTitle({
          categoria: (category || undefined) as ProductCategory | undefined,
          tipoSessao: session || undefined,
          titulo: query || undefined,
        }),
    );

    const fetchResults = async () => {
      setLoading(true);
      try {
        const { products } =
          (await fetchProductsWithCache(VITE_BACKEND_URL)) || mockProducts;

        if (session) {
          setResults(
            getCollectionProducts({
              products,
              tipoSessao: session,
              titulo: title || undefined,
            }),
          );
        } else if (category) {
          setResults(
            getCollectionProducts({
              products,
              categoria: category as ProductCategory,
            }),
          );
        } else {
          setResults(filterCachedProducts(query, category));
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [location.search, VITE_BACKEND_URL]);

  const handleClearSearch = () => {
    navigate("/");
  };

  if (loading) {
    return <Loading variant="products" />;
  }

  return (
    <div className="mx-auto min-h-[70vh] w-full max-w-[1440px] px-4 pb-10 sm:px-6 lg:px-8">
      {searchLabel && (
        <div className="relative mb-6 flex items-center justify-between gap-3">
          <div className="inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-100 px-4 text-sm font-medium text-slate-700 shadow-sm">
            <span className="capitalize">{searchLabel}</span>
            <button
              onClick={handleClearSearch}
              className="flex min-h-8 min-w-8 items-center justify-center rounded-full text-slate-500 transition hover:text-slate-900 active:scale-[0.98]"
            >
              &times;
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowMenuSort(!showMenuSort)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition active:scale-[0.98]"
          >
            <FontAwesomeIcon icon={faSort} />
          </button>
          {showMenuSort && (
            <MenuSearchSort
              results={results}
              setResults={setResults}
              isAscending={isAscending}
              setIsAscending={setIsAscending}
              onClose={() => setShowMenuSort(false)}
            />
          )}
        </div>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4 2xl:grid-cols-5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-base text-slate-500">
          Nenhum produto encontrado.
        </p>
      )}
    </div>
  );
};

export default SearchResultsPage;
