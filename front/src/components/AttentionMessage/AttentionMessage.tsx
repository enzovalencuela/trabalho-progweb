import React, { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface AttentionMessageProps {
  message: string;
  onClose: () => void;
  onClick?: () => void;
  buttonContent?: string;
}

const AttentionMessage: React.FC<AttentionMessageProps> = ({
  message,
  onClose,
  onClick,
  buttonContent,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/25 p-4 backdrop-blur-sm sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg rounded-t-[28px] bg-white p-6 shadow-2xl sm:rounded-[28px] sm:p-7"
          initial={{ opacity: 0, scale: 0.96, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 20 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <p className="text-center text-base leading-7 text-slate-700 sm:text-lg">
            {message}
          </p>

          {message ==
            "Este site é um projeto de estudo e os produtos expostos são fictícios e não estão à venda. Todos os direitos são de seus respectivos proprietários. Aproveite o site!" && (
            <label className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <input
                type="checkbox"
                id="acknowledge-checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span>Estou ciente de que este é um site para estudos.</span>
            </label>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <motion.button
              onClick={onClose}
              className="flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 active:scale-[0.98]"
              disabled={
                message ==
                "Este site é um projeto de estudo e os produtos expostos são fictícios e não estão à venda. Todos os direitos são de seus respectivos proprietários. Aproveite o site!"
                  ? !isChecked
                  : false
              }
              whileTap={{ scale: 0.97 }}
            >
              Fechar
            </motion.button>
            {onClick && buttonContent && (
              <motion.button
                onClick={onClick}
                className="flex min-h-12 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
                whileTap={{ scale: 0.97 }}
              >
                {buttonContent}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

export default AttentionMessage;
