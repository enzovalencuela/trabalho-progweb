// src/components/ProductCarousel.tsx

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./ProductCarousel.css";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import type { Product } from "../../types/Product";
import ProductCard from "../ProductCard/ProductCard";

interface ProductCarouselProps {
  products: Product[];
  sectionTitle?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  sectionTitle,
}) => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="card_container">
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => setShowErrorMessage(false)}
          buttonContent="Ir Para Login"
          onClick={() => navigate("/login")}
        />
      )}
      <Swiper
        grabCursor
        initialSlide={2}
        speed={800}
        breakpoints={{
          0: { slidesPerView: 2, spaceBetween: 10 },
          660: { slidesPerView: 3 },
          860: { slidesPerView: 4 },
          1160: { slidesPerView: 5 },
          1290: { slidesPerView: 6 },
        }}
        spaceBetween={10}
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <ProductCard product={product} sectionTitle={sectionTitle} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;
