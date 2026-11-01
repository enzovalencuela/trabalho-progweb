import React from "react";

interface ProductDescriptionProps {
  descricao?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  descricao = "",
}) => {
  const sentences = descricao
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        Descrição
      </p>
      <h3 className="font-display text-2xl font-semibold text-slate-950">
        O que esperar deste produto
      </h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {sentences.length > 0 ? (
          sentences.map((sentence, index) => (
            <div
              key={`${sentence}-${index}`}
              className="rounded-[24px] bg-slate-50 p-5"
            >
              <p className="text-sm leading-7 text-slate-700">{sentence}.</p>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] bg-slate-50 p-5 col-span-2">
            <p className="text-sm leading-7 text-slate-500">
              Sem descrição adicional disponível para este produto.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDescription;
