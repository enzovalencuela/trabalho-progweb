/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import { authenticatedFetch } from "../utils/api";

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ReviewEligibility {
  canReview: boolean;
  hasPurchased: boolean;
  hasAlreadyReviewed: boolean;
}

interface ReviewSummary {
  average: number;
  count: number;
}

interface ReviewContextType {
  reviewsCache: Record<number, Review[]>;
  summaryCache: Record<number, ReviewSummary>;
  fetchReviewsByProduct: (productId: number) => Promise<Review[]>;
  addReview: (
    reviewData: Omit<Review, "id" | "createdAt">,
  ) => Promise<{ success: boolean; error?: string }>;
  checkEligibility: (
    userId: number,
    productId: number,
  ) => Promise<ReviewEligibility>;
  getReviewSummary: (productId: number) => ReviewSummary;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reviewsCache, setReviewsCache] = useState<Record<number, Review[]>>(
    {},
  );
  const [summaryCache, setSummaryCache] = useState<
    Record<number, ReviewSummary>
  >({});
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const updateSummary = (productId: number, reviews: Review[]) => {
    const count = reviews.length;

    // Trata tanto 'rating' quanto 'nota' (convertendo para número)
    const totalPoints = reviews.reduce((acc, r: any) => {
      const score = Number(r.rating ?? r.nota ?? 0);
      return acc + (isNaN(score) ? 0 : score);
    }, 0);

    const average = count > 0 ? totalPoints / count : 0;

    setSummaryCache((prev) => ({
      ...prev,
      [productId]: { average, count },
    }));
  };

  const fetchReviewsByProduct = useCallback(
    async (productId: number): Promise<Review[]> => {
      try {
        const response = await fetch(
          `${VITE_BACKEND_URL}/api/reviews/product/${productId}`,
        );
        if (response.ok) {
          const data: Review[] = await response.json();
          setReviewsCache((prev) => ({ ...prev, [productId]: data }));
          updateSummary(productId, data);
          return data;
        }
      } catch (err) {
        console.error("Erro ao buscar avaliações:", err);
      }
      return [];
    },
    [VITE_BACKEND_URL],
  );

  const checkEligibility = useCallback(
    async (userId: number, productId: number): Promise<ReviewEligibility> => {
      try {
        let response = await authenticatedFetch(
          `${VITE_BACKEND_URL}/api/reviews/can-review?userId=${userId}&productId=${productId}`,
        );
        if (!response.ok) {
          response = await authenticatedFetch(
            `${VITE_BACKEND_URL}/api/reviews/eligibility?userId=${userId}&productId=${productId}`,
          );
        }
        if (response.ok) {
          const data = await response.json();
          return {
            canReview: Boolean(data.canReview ?? data.eligible),
            hasPurchased: Boolean(
              data.hasPurchased ?? data.hasApprovedPayment ?? data.paid,
            ),
            hasAlreadyReviewed: Boolean(
              data.alreadyReviewed ??
                data.hasAlreadyReviewed ??
                data.reviewed,
            ),
          };
        }
      } catch (err) {
        console.error("Erro ao checar elegibilidade da avaliação:", err);
      }
      return {
        canReview: false,
        hasPurchased: false,
        hasAlreadyReviewed: false,
      };
    },
    [VITE_BACKEND_URL],
  );

  const addReview = async (
    reviewData: Omit<Review, "id" | "createdAt">,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authenticatedFetch(
        `${VITE_BACKEND_URL}/api/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        },
      );

      if (response.ok) {
        const savedReview: Review = await response.json();
        const currentList = reviewsCache[reviewData.productId] || [];
        const updatedList = [savedReview, ...currentList];

        setReviewsCache((prev) => ({
          ...prev,
          [reviewData.productId]: updatedList,
        }));
        updateSummary(reviewData.productId, updatedList);
        return { success: true };
      }

      let errorMsg = "Não foi possível enviar a avaliação.";
      try {
        const errJson = await response.json();
        if (errJson?.message) {
          errorMsg = errJson.message;
        }
      } catch (parseErr) {
        // use default errorMsg
      }

      return { success: false, error: errorMsg };
    } catch (err: any) {
      console.error("Erro ao enviar avaliação:", err);
      return {
        success: false,
        error: err?.message || "Erro de conexão ao enviar avaliação.",
      };
    }
  };

  const getReviewSummary = (productId: number): ReviewSummary => {
    return summaryCache[productId] || { average: 0, count: 0 };
  };

  return (
    <ReviewContext.Provider
      value={{
        reviewsCache,
        summaryCache,
        fetchReviewsByProduct,
        addReview,
        checkEligibility,
        getReviewSummary,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview deve ser usado dentro de um ReviewProvider");
  }
  return context;
};
