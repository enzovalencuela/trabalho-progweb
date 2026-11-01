import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Produtos from "../../components/Produtos/Produtos";
import BackButton from "../../components/BackButton/BackButton";
import SpanMessage from "../../components/SpanMessage/SpanMessage";
import Loading from "../../components/Loading/Loading";
import type { Product } from "../../types/Product";
import { useReview } from "../../contexts/ReviewContext";
import { mockProducts } from "../../mocks/products";
import { fetchProductByIdCached } from "../../utils/productCache";
import ImageModal from "../../components/ImageModal/ImageModal";
import ReviewForm from "../../components/ReviewForm/ReviewForm";
import ReviewSection from "../../components/ReviewSection/ReviewSection";
import type { Review } from "../../components/ReviewSection/ReviewSection";
import ProductDescription from "../../components/ProductDescription/ProductDescription";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorMessage, setsShowErrorMessage] = useState(false);
  const [showOkMessage, setsShowOkMessage] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Estados de elegibilidade para avaliação
  const [canReview, setCanReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);
  const [loadingEligibility, setLoadingEligibility] = useState(false);

  // Modal Image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Form states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const { user, cart, addToCart } = useAuth();
  const { checkEligibility, fetchReviewsByProduct, addReview } = useReview();
  const navigate = useNavigate();

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) throw new Error("Produto inválido.");
        const data =
          (await fetchProductByIdCached(VITE_BACKEND_URL, Number(id))) ||
          mockProducts.find((p) => p.id === Number(id));
        setProduct(data ?? null);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o produto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, VITE_BACKEND_URL]);

  // Consulta elegibilidade no backend via ReviewContext
  useEffect(() => {
    const verifyPermissions = async () => {
      if (user?.id && id) {
        setLoadingEligibility(true);
        try {
          const eligibility = await checkEligibility(
            Number(user.id),
            Number(id),
          );
          setCanReview(eligibility.canReview);
          setHasPurchased(eligibility.hasPurchased);
          setHasAlreadyReviewed(eligibility.hasAlreadyReviewed);
        } catch (err) {
          console.error("Erro ao verificar permissões de avaliação:", err);
        } finally {
          setLoadingEligibility(false);
        }
      }
    };

    verifyPermissions();
  }, [user?.id, id, checkEligibility]);

  useEffect(() => {
    if (id) {
      fetchReviewsByProduct(Number(id)).then((data) => {
        if (data) setReviews(data as unknown as Review[]);
      });
    }
  }, [id, fetchReviewsByProduct]);

  useEffect(() => {
    setIsAddedToCart(
      product ? cart.some((item) => item.id === product.id) : false,
    );
  }, [cart, product]);

  const handleAddToCart = async () => {
    if (!user) return setsShowErrorMessage(true);
    if (product) {
      const status = await addToCart(product);
      if (status === "ok") setsShowOkMessage(true);
      else setsShowErrorMessage(true);
    }
  };

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !product) return;

    const success = await addReview({
      productId: product.id,
      userId: user?.id ? Number(user.id) : 1,
      userName: user?.name || user?.email?.split("@")[0] || "Cliente NexGen",
      rating: newRating,
      comment: newComment,
      imageUrl: imagePreview || undefined,
      verifiedPurchase: true,
    });

    if (success) {
      const updated = await fetchReviewsByProduct(product.id);
      setReviews(updated as unknown as Review[]);
      setNewComment("");
      setImagePreview(null);
      setShowReviewForm(false);
      setsShowOkMessage(true);

      // Reavalia a elegibilidade após salvar a nova avaliação
      if (user?.id) {
        const eligibility = await checkEligibility(Number(user.id), product.id);
        setCanReview(eligibility.canReview);
        setHasPurchased(eligibility.hasPurchased);
        setHasAlreadyReviewed(eligibility.hasAlreadyReviewed);
      }
    } else {
      setsShowErrorMessage(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("Máximo de 5MB.");
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <Loading variant="products" />;
  if (error || !product)
    return (
      <div className="p-8">
        <BackButton />
        {error}
      </div>
    );

  const totalReviewsCount = reviews.length;
  const averageRating =
    totalReviewsCount > 0
      ? (
          reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) /
          totalReviewsCount
        ).toFixed(1)
      : "0.0";

  const parcela =
    (product.preco / product.max_parcelas) * (1 + product.taxa_parcela / 100);

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8 lg:pb-4">
      {showErrorMessage && (
        <ErrorMessage onClose={() => setsShowErrorMessage(false)} />
      )}
      {showOkMessage && (
        <SpanMessage message="Operação realizada com sucesso." status="ok" />
      )}

      {/* Lightbox Modal */}
      <ImageModal
        isOpen={Boolean(selectedImage)}
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <BackButton />

      <div className="mt-4 flex flex-col gap-10">
        {/* Produto Principal */}
        <section className="shadow-soft rounded-[36px] border border-slate-200 bg-white p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-[3] flex-col">
              <div className="flex aspect-square items-center justify-center">
                <img
                  src={product.img}
                  alt={product.titulo}
                  onClick={() => setSelectedImage(product.img)}
                  className="h-full w-full cursor-pointer rounded-[28px] border border-slate-200 object-contain transition hover:opacity-90"
                />
              </div>
            </div>

            <div className="flex flex-[5] flex-col justify-between gap-8">
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {product.categoria}
                  </p>
                  {parseFloat(averageRating) > 0 ? (
                    <div className="flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1">
                      <span className="text-xs font-bold text-amber-900">
                        {averageRating}
                      </span>
                      <FontAwesomeIcon
                        icon={faStar}
                        className="h-3 w-3 text-amber-400"
                      />
                      <span className="text-xs text-slate-400">
                        ({totalReviewsCount})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      Sem avaliações
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                  {product.titulo}
                </h1>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {product.descricao}
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-950">
                  R$ {product.preco}
                </h2>
                <span className="mt-2 block text-sm text-slate-600">
                  em até{" "}
                  <b>
                    {product.max_parcelas}x de R$ {parcela.toFixed(2)}
                  </b>
                </span>
                <div className="mt-6 space-y-3 block">
                  {!isAddedToCart ? (
                    <button
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag className="h-4 w-4" /> Adicionar ao carrinho
                    </button>
                  ) : (
                    <button
                      className="min-h-12 w-full rounded-full bg-blue-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                      onClick={() => navigate("/carrinho")}
                    >
                      Ir para o carrinho
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProductDescription descricao={product.descricao} />

        {/* Seção de Avaliações */}
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Opinião dos compradores
              </p>
              <h3 className="font-display text-2xl font-semibold text-slate-950">
                Avaliações do Produto
              </h3>
            </div>

            {/* Controle de Permissões para Avaliar */}
            {user && !loadingEligibility && (
              <div>
                {hasAlreadyReviewed ? (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
                    ✓ Você já avaliou este produto
                  </span>
                ) : (
                  hasPurchased && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {showReviewForm
                        ? "Cancelar Avaliação"
                        : "Escrever Avaliação"}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Renderização do Formulário se Elegível */}
          {showReviewForm && canReview && (
            <ReviewForm
              newRating={newRating}
              setNewRating={setNewRating}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
              newComment={newComment}
              setNewComment={setNewComment}
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
              handleRemoveImage={() => setImagePreview(null)}
              onSubmit={handleAddReviewSubmit}
            />
          )}

          <ReviewSection
            reviews={reviews}
            averageRating={averageRating}
            totalReviewsCount={totalReviewsCount}
            onImageClick={(url) => setSelectedImage(url)}
          />
        </section>

        <Produtos
          categoria={product.categoria as never}
          titulo="Produtos Relacionados"
        />
      </div>
    </div>
  );
};

export default ProductPage;
