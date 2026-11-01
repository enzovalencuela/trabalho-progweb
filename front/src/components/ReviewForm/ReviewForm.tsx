import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface ReviewFormProps {
  newRating: number;
  setNewRating: (val: number) => void;
  hoverRating: number;
  setHoverRating: (val: number) => void;
  newComment: string;
  setNewComment: (val: string) => void;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  newRating,
  setNewRating,
  hoverRating,
  setHoverRating,
  newComment,
  setNewComment,
  imagePreview,
  handleImageChange,
  handleRemoveImage,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
    >
      <h4 className="text-base font-semibold text-slate-900">
        Deixe a sua opinião
      </h4>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Nota do produto:
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setNewRating(star)}
              className="p-1 text-xl focus:outline-none"
            >
              <FontAwesomeIcon
                icon={faStar}
                className={
                  star <= (hoverRating || newRating)
                    ? "text-amber-400"
                    : "text-slate-300"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Seu comentário:
        </label>
        <textarea
          required
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Conte o que achou da qualidade, entrega e desempenho..."
          className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-slate-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Foto do Produto (opcional):
        </label>

        {!imagePreview ? (
          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white transition hover:bg-slate-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="mb-2 h-8 w-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-blue-600">
                  Clique para enviar
                </span>{" "}
                ou arraste a imagem
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                PNG, JPG ou WEBP (Max. 5MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative mt-2 inline-block">
            <img
              src={imagePreview}
              alt="Preview da avaliação"
              className="h-24 w-24 rounded-2xl border border-slate-200 object-cover shadow-xs"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-md transition hover:bg-red-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Enviar Avaliação
      </button>
    </form>
  );
};

export default ReviewForm;
