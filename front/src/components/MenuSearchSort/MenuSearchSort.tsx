import { useEffect, useRef, useState } from "react";
import type { Product } from "../../types";
import "./MenuSearchSort.css";
import Loading from "../Loading/Loading";

interface MenuSearchSortProps {
  results: Product[];
  setResults: (products: Product[]) => void;
  isAscending: boolean;
  setIsAscending: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

function MenuSearchSort({
  results,
  setResults,
  isAscending,
  setIsAscending,
  onClose,
}: MenuSearchSortProps) {
  const [loading, setLoading] = useState(false);
  const searchSort = ["Preço", "Pedidos"];
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const sortSearchBy = (sortBy: string) => {
    setLoading(true);

    setTimeout(() => {
      const newResults = [...results];

      if (sortBy === "Preço") {
        if (isAscending) {
          newResults.sort((a, b) => a.preco - b.preco);
        } else {
          newResults.sort((a, b) => b.preco - a.preco);
        }
        setIsAscending(!isAscending);
      }

      setResults(newResults);
      setLoading(false);
      onClose();
    }, 500);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="menu-search-sort" ref={menuRef}>
      {searchSort.map((sortBy, index) => (
        <div
          key={index}
          className="sort-item"
          onClick={() => sortSearchBy(sortBy)}
        >
          <span>{sortBy}</span>
          {sortBy === "Preço" && (
            <span className="sort-direction">
              {isAscending ? "Menor ↑" : "Maior ↓"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default MenuSearchSort;
