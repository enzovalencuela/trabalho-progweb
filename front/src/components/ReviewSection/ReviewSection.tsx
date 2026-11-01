import React from "react";
import { BadgeCheck, User } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export interface Review {
  id: number;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  imageUrl?: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

interface ReviewSectionProps {
  reviews: Review[];
  averageRating: string;
  totalReviewsCount: number;
  onImageClick: (url: string) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "Hoje";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews,
  averageRating,
  totalReviewsCount,
  onImageClick,
}) => {
  return (
    <div className="mt-8 flex flex-col gap-6 rounded-[24px] bg-slate-50 p-6 md:flex-row md:items-center">
      <div className="flex flex-col items-center justify-center border-b border-slate-200 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
        <span className="text-5xl font-extrabold text-slate-950">
          {averageRating}
        </span>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <FontAwesomeIcon
              key={s}
              icon={faStar}
              className={
                s <= Math.round(Number(averageRating))
                  ? "text-amber-400"
                  : "text-slate-300"
              }
            />
          ))}
        </div>
        <span className="mt-2 text-xs font-medium text-slate-500">
          Baseado em {totalReviewsCount} avaliações
        </span>
      </div>

      <div className="flex-1 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-md text-slate-500 text-center">
            Nenhuma avaliação disponível para este produto.
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="space-y-2 rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {review.userName}
                    </p>
                    {review.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600">
                        <BadgeCheck className="h-3 w-3" /> Compra Verificada
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <div className="flex gap-1 text-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className={
                      star <= review.rating
                        ? "text-amber-400"
                        : "text-slate-200"
                    }
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-slate-700">
                {review.comment}
              </p>

              {review.imageUrl && (
                <div className="pt-2">
                  <img
                    src={review.imageUrl}
                    alt="Foto da avaliação"
                    onClick={() => onImageClick(review.imageUrl!)}
                    className="h-20 w-20 cursor-pointer rounded-xl border border-slate-200 object-cover transition hover:opacity-85 hover:ring-2 hover:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
