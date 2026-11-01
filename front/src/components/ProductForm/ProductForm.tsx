// src/components/ProductForm.tsx

import React, { useState, useEffect } from "react";
import "./ProductForm.css";
import type { Product } from "../../types/Product";

interface ProductFormProps {
  product?: Product | null;
  onSave: (
    product: Omit<
      Product,
      "id" | "desconto" | "avaliacoes" | "mediaAvaliacao" | "tamanhos"
    >,
  ) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
}) => {
  const categoriasDisponiveis = [
    "Áudio",
    "Periféricos",
    "Consoles",
    "Hardware",
    "Realidade VR",
    "Acessórios",
    "Notebooks",
    "Setups",
    "Monitores",
  ];

  const [formData, setFormData] = useState({
    titulo: "",
    preco: 0,
    preco_original: 0,
    max_parcelas: 1,
    taxa_parcela: 0,
    img: "",
    descricao: "",
    categoria: "",
    tags: "",
    cores: "",
    disponivel: true,
    estoque: 0,
    peso_kg: 0.5,
    largura_cm: 20,
    altura_cm: 10,
    comprimento_cm: 20,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        titulo: product.titulo || "",
        preco: product.preco,
        preco_original: product.preco_original || 0,
        max_parcelas: product.max_parcelas || 1,
        taxa_parcela: product.taxa_parcela || 0,
        img: product.img || "",
        descricao: product.descricao || "",
        categoria: product.categoria || "",
        tags: product.tags?.join(", ") || "",
        cores: product.cores?.join(", ") || "",
        disponivel: product.disponivel,
        estoque: product.estoque || 0,
        peso_kg: product.peso_kg || 0.5,
        largura_cm: product.largura_cm || 20,
        altura_cm: product.altura_cm || 10,
        comprimento_cm: product.comprimento_cm || 20,
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    setFormData((prevData) => ({
      ...prevData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleClear = (name: keyof typeof formData) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: "",
    }));
  };

  const valor_parcela =
    (formData.preco / Number(formData.max_parcelas)) *
    (1 + formData.taxa_parcela / 100);

  const parcela = `${formData.max_parcelas}x de R$${(valor_parcela || 0)
    .toFixed(2)
    .replace(".", ",")}`;

  const valor_total = formData.max_parcelas * (valor_parcela || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      titulo: formData.titulo,
      preco: parseFloat(String(formData.preco)),
      preco_original: formData.preco_original
        ? parseFloat(String(formData.preco_original))
        : undefined,
      max_parcelas: parseInt(String(formData.max_parcelas)),
      taxa_parcela: parseInt(String(formData.taxa_parcela)),
      img: formData.img,
      descricao: formData.descricao,
      categoria: formData.categoria,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      cores: formData.cores.split(",").map((cor) => cor.trim()),
      disponivel: formData.disponivel,
      estoque: parseInt(String(formData.estoque)),
      peso_kg: parseFloat(String(formData.peso_kg)),
      largura_cm: parseInt(String(formData.largura_cm)),
      altura_cm: parseInt(String(formData.altura_cm)),
      comprimento_cm: parseInt(String(formData.comprimento_cm)),
    };

    onSave(newProduct);
  };

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
          {formData.titulo && (
            <button type="button" onClick={() => handleClear("titulo")}>
              X
            </button>
          )}
        </label>

        <label>
          Estoque:
          <input
            type="number"
            name="estoque"
            value={formData.estoque}
            onChange={handleChange}
            required
          />
        </label>

        <div className="div-row-label">
          <label>
            Preço: (R$)
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  preco: value,
                }));
              }}
              step="0.01"
              required
            />
          </label>
          <label>
            Preço Original: (R$)
            <input
              type="number"
              name="preco_original"
              value={formData.preco_original}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  preco_original: value,
                }));
              }}
              step="0.01"
            />
          </label>
        </div>

        {formData.preco_original > formData.preco && (
          <label>
            Desconto: (%)
            <input
              type="number"
              name="preco_original"
              value={(
                100 -
                (formData.preco * 100) / (formData.preco_original || 1)
              ).toFixed(2)}
              onChange={(e) => {
                const desconto = parseFloat(e.target.value);
                const novoPreco =
                  formData.preco_original -
                  (formData.preco_original * desconto) / 100;
                setFormData((prev) => ({
                  ...prev,
                  preco: parseFloat(novoPreco.toFixed(2)),
                }));
              }}
              step="0.01"
            />
          </label>
        )}

        {/* SESSÃO DE DIMENSÕES E PESO PARA FRETE */}
        <div className="div-row-label">
          <label>
            Peso (kg):
            <input
              type="number"
              name="peso_kg"
              value={formData.peso_kg}
              onChange={handleChange}
              step="0.001"
              required
            />
          </label>
          <label>
            Comprimento (cm):
            <input
              type="number"
              name="comprimento_cm"
              value={formData.comprimento_cm}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="div-row-label">
          <label>
            Largura (cm):
            <input
              type="number"
              name="largura_cm"
              value={formData.largura_cm}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Altura (cm):
            <input
              type="number"
              name="altura_cm"
              value={formData.altura_cm}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="div-row-label">
          <label>
            Max. de parcelas:
            <input
              type="number"
              name="max_parcelas"
              value={formData.max_parcelas}
              onChange={handleChange}
            />
          </label>
          <label>
            Taxa da parcela: (%)
            <input
              type="number"
              name="taxa_parcela"
              value={formData.taxa_parcela}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Parcelas:
          <br />
          {parcela} = {valor_total.toFixed(2).replace(".", ",")}
        </label>

        <label>
          URL da Imagem:
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
            required
          />
          {formData.img && (
            <button type="button" onClick={() => handleClear("img")}>
              X
            </button>
          )}
        </label>
        {formData.img && <img src={formData.img} alt="" />}

        <label>
          Descrição:
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          ></textarea>
          {formData.descricao && (
            <button type="button" onClick={() => handleClear("descricao")}>
              X
            </button>
          )}
        </label>

        <label>
          Cores (separadas por vírgula):
          <input
            type="text"
            name="cores"
            value={formData.cores}
            onChange={handleChange}
          />
          {formData.cores && (
            <button type="button" onClick={() => handleClear("cores")}>
              X
            </button>
          )}
        </label>

        <label>
          Tags (separadas por vírgula):
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
          {formData.tags && (
            <button type="button" onClick={() => handleClear("tags")}>
              X
            </button>
          )}
        </label>

        <label>
          Categoria:
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categoriasDisponiveis.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="checkbox">
          Disponível:
          <input
            type="checkbox"
            name="disponivel"
            checked={formData.disponivel}
            onChange={handleChange}
          />
        </label>

        <div className="form-buttons">
          <button type="submit">
            {product ? "Salvar Alterações" : "Adicionar Produto"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
