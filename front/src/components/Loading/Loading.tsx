import { motion } from "framer-motion";
import "./Loading.css";

type LoadingVariant = "overlay" | "products" | "cart" | "dashboard";

interface LoadingProps {
  variant?: LoadingVariant;
  message?: string;
}

function shimmerTransition(index = 0) {
  return {
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "reverse" as const,
    duration: 1.1,
    delay: index * 0.08,
  };
}

const SkeletonBlock = ({
  className,
  index = 0,
}: {
  className: string;
  index?: number;
}) => (
  <motion.div
    className={`loading-skeleton ${className}`}
    animate={{ opacity: [0.45, 0.9, 0.45] }}
    transition={shimmerTransition(index)}
  />
);

function ProductSkeleton() {
  return (
    <div className="loading-grid-shell">
      <div className="loading-grid-title">
        <SkeletonBlock className="loading-line loading-line-short" />
        <SkeletonBlock className="loading-line loading-line-medium" index={1} />
      </div>
      <div className="loading-product-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="loading-product-card">
            <SkeletonBlock className="loading-product-image" index={index} />
            <SkeletonBlock className="loading-line loading-line-short" index={index + 1} />
            <SkeletonBlock className="loading-line loading-line-medium" index={index + 2} />
            <SkeletonBlock className="loading-line loading-line-price" index={index + 3} />
            <SkeletonBlock className="loading-button" index={index + 4} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="loading-cart-shell">
      <SkeletonBlock className="loading-line loading-line-medium" />
      <div className="loading-cart-content">
        <div className="loading-cart-list">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="loading-cart-item">
              <SkeletonBlock className="loading-cart-check" index={index} />
              <SkeletonBlock className="loading-cart-image" index={index + 1} />
              <div className="loading-cart-copy">
                <SkeletonBlock className="loading-line loading-line-medium" index={index + 2} />
                <SkeletonBlock className="loading-line loading-line-short" index={index + 3} />
              </div>
            </div>
          ))}
        </div>
        <div className="loading-cart-summary">
          <SkeletonBlock className="loading-line loading-line-medium" />
          <SkeletonBlock className="loading-line loading-line-medium" index={1} />
          <SkeletonBlock className="loading-line loading-line-medium" index={2} />
          <SkeletonBlock className="loading-button" index={3} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="loading-dashboard-shell">
      <div className="loading-dashboard-stats">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="loading-dashboard-card">
            <SkeletonBlock className="loading-dashboard-icon" index={index} />
            <SkeletonBlock className="loading-line loading-line-short" index={index + 1} />
            <SkeletonBlock className="loading-line loading-line-medium" index={index + 2} />
            <SkeletonBlock className="loading-line loading-line-long" index={index + 3} />
          </div>
        ))}
      </div>
      <div className="loading-dashboard-table">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock
            key={index}
            className="loading-dashboard-row"
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function Loading({ variant = "overlay", message }: LoadingProps) {
  if (variant === "products") return <ProductSkeleton />;
  if (variant === "cart") return <CartSkeleton />;
  if (variant === "dashboard") return <DashboardSkeleton />;

  return (
    <div className="loading-container">
      <motion.div
        className="loading-panel"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="loading-spinner-lg"
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
        />
        <p>{message || "Carregando..."}</p>
      </motion.div>
    </div>
  );
}

export default Loading;
