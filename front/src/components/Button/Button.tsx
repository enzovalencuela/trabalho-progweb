import { motion } from "framer-motion";

interface ButtonProps {
  child: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}

export default function Button({
  child,
  disabled,
  loading = false,
  type = "submit",
  onClick,
  className = "submit-button",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      {loading ? (
        <span className="button-loading-content">
          <span className="button-spinner" />
          Carregando...
        </span>
      ) : (
        child
      )}
    </motion.button>
  );
}
