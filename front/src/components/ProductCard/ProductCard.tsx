import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Tag } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import type { Product } from "../../types/Product";
import { useAuth } from "../../contexts/AuthContext";
import { useReview } from "../../contexts/ReviewContext";
import SpanMessage from "../SpanMessage/SpanMessage";

interface ProductCardProps {
  product: Product;
  sectionTitle?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, sectionTitle }) => {
  const [showSpanOkMessage, setShowSpanOkMessage] = React.useState(false);
  const [showSpanErrorMessage, setShowSpanErrorMessage] = React.useState(false);
  const navigate = useNavigate();
  const { user, addToCart, cart } = useAuth();
  const { summaryCache } = useReview();

  const isProductInCart = cart.some((item) => item.id === product.id);

  const totalReviewsCount = summaryCache[product.id]?.count || 0;
  const averageRating = summaryCache[product.id]?.average ?? 0;

  const handleAddToCart = async (selectedProduct: Product) => {
    if (!user) return;

    const status = await addToCart(selectedProduct);
    if (status === "error") {
      setShowSpanErrorMessage(true);
    } else {
      setShowSpanOkMessage(true);
    }
  };

  const parcela =
    (product.preco / product.max_parcelas) * (1 + product.taxa_parcela / 100);
  const desconto = 100 - (product.preco * 100) / (product.preco_original || 1);
  const hasPromotion =
    Boolean(product.preco_original) && Number(desconto.toFixed(0)) > 0;
  const createdAt = product.created_at ?? product.createdAt;
  const isNewProduct = createdAt
    ? Date.now() - new Date(createdAt).getTime() <
      1000 * 60 * 60 * 24 * 45
    : sectionTitle === "Novidades";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl select-none sm:rounded-[24px] sm:p-3">
      {showSpanOkMessage && (
        <SpanMessage message="Produto adicionado ao carrinho!" status="ok" />
      )}
      {showSpanErrorMessage && (
        <SpanMessage
          message="Produto já adicionado ao carrinho!"
          status="error"
        />
      )}

      <div className="absolute left-2.5 top-2.5 z-10 flex flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
        {isNewProduct && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
            <Sparkles className="h-3 w-3" />
            Novo
          </span>
        )}
        {hasPromotion && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-900 sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
            <Tag className="h-3 w-3" />
            Oferta
          </span>
        )}
      </div>

      <Link
        to={`/product/${product.id}`}
        className="relative flex aspect-[4/3.4] items-center justify-center overflow-hidden rounded-[18px] bg-white sm:aspect-[4/3.45] sm:rounded-[20px]"
      >
        <img
          src={product.img}
          alt={product.titulo}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="max-h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-2.5 sm:pt-3.5">
        <div className="mb-2 space-y-1 sm:mb-3 sm:space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-xs sm:tracking-[0.18em]">
              {product.categoria}
            </p>
            {averageRating > 0 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5">
                <span className="text-xs font-bold text-slate-400">
                  {averageRating.toFixed(1)}
                </span>
                <FontAwesomeIcon
                  icon={faStar}
                  className="h-3 w-3 text-amber-400"
                />
                <span className="text-[10px] text-slate-400">
                  ({totalReviewsCount})
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">
                Sem avaliações
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 overflow-hidden text-[14px] font-semibold leading-snug text-slate-950 sm:text-[1rem] sm:leading-tight">
            {product.titulo}
          </h3>

          <div className="min-h-[4.25rem] space-y-0.5 sm:min-h-[4.85rem]">
            {product.preco_original && (
              <p className="text-[11px] text-slate-400 line-through sm:text-sm">
                R$ {product.preco_original}
              </p>
            )}
            <h4 className="text-[16px] font-extrabold tracking-tight text-slate-950 sm:text-[20px]">
              R$ {product.preco}
            </h4>
            <span className="block text-[11px] leading-4 text-slate-500 sm:text-sm sm:leading-5">
              em até{" "}
              <b className="text-slate-700">
                {product.max_parcelas}x de R$ {Number(parcela).toFixed(2)}
              </b>
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-1.5 sm:gap-2">
          <motion.button
            onClick={() =>
              isProductInCart ? navigate("/carrinho") : handleAddToCart(product)
            }
            className={`flex min-h-10 flex-1 items-center justify-center rounded-full px-2.5 py-2 text-[13px] font-semibold transition active:scale-[0.98] sm:min-h-10 sm:px-3.5 sm:py-2.5 sm:text-sm ${
              isProductInCart
                ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                : "bg-primary text-white hover:bg-lightprimary"
            }`}
            whileTap={{ scale: 0.97 }}
          >
            <span className="inline-flex items-center gap-1 sm:gap-2 ">
              <ShoppingBag className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 " />
              <span>{isProductInCart ? "Ver carrinho" : "Adicionar"}</span>
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
