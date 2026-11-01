import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface OkMessageProps {
  message: string;
  onClose: () => void;
  onClick?: () => void;
  buttonContent?: string;
}

const overlayClass =
  "fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/25 p-4 backdrop-blur-sm sm:items-center";
const containerClass =
  "w-full max-w-md rounded-t-[28px] bg-white p-6 shadow-2xl sm:rounded-[28px] sm:p-7";
const buttonClass =
  "flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]";

const OkMessage: React.FC<OkMessageProps> = ({
  message,
  onClose,
  onClick,
  buttonContent,
}) => {
  return createPortal(
    <AnimatePresence>
      <motion.div
        className={overlayClass}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={containerClass}
          initial={{ opacity: 0, scale: 0.96, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 20 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <p className="text-center text-base leading-7 text-slate-700 sm:text-lg">
            {message}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <motion.button
              onClick={onClose}
              className={buttonClass}
              whileTap={{ scale: 0.97 }}
            >
              Fechar
            </motion.button>
            {onClick && buttonContent && (
              <motion.button
                onClick={onClick}
                className={buttonClass}
                whileTap={{ scale: 0.97 }}
              >
                {buttonContent}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default OkMessage;
