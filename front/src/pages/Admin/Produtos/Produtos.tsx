import React, { useState } from "react";
import ProductForm from "../../../components/ProductForm/ProductForm";
import type { Product } from "../../../types/Product";
import Loading from "../../../components/Loading/Loading";
import BackButton from "../../../components/BackButton/BackButton";
import SpanMessage from "../../../components/SpanMessage/SpanMessage";
import { useProduct } from "../../../contexts/ProductContext";
import AttentionMessage from "../../../components/AttentionMessage/AttentionMessage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faXmark,
  faBoxOpen,
  faTag,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import {
  removeCachedProduct,
  upsertCachedProduct,
} from "../../../utils/productCache";
import { authenticatedFetch } from "../../../utils/api";

type NewProduct = Omit<Product, "id">;

interface ProdutosDashboardProps {
  embedded?: boolean;
}

const navDepartments = [
  { id: "1", name: "Setups" },
  { id: "2", name: "Notebooks" },
  { id: "3", name: "Periféricos" },
  { id: "4", name: "Consoles" },
  { id: "5", name: "Acessórios" },
  { id: "6", name: "Monitores" },
  { id: "7", name: "Realidade VR" },
  { id: "8", name: "Áudio" },
  { id: "9", name: "Hardware" },
];

const ProdutosDashboard: React.FC<ProdutosDashboardProps> = ({
  embedded = false,
}) => {
  const [showSpan, setShowSpan] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAttentionMessage, setShowAttentionMessage] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const {
    loading,
    products,
    setProducts,
    searchQuery,
    setSearchQuery,
    searchProducts,
    setSearchProducts,
  } = useProduct();

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSave = async (productData: NewProduct) => {
    const isNew = isAdding;
    const url = isNew
      ? `${VITE_BACKEND_URL}/api/products/add`
      : `${VITE_BACKEND_URL}/api/products/${editingProduct?.id}`;
    const method = isNew ? "POST" : "PUT";

    const productWithDisponivel = {
      ...productData,
      disponivel: productData.disponivel ?? true,
    };

    try {
      const response = await authenticatedFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productWithDisponivel),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao salvar o produto.");
      }

      const updatedProduct = await response.json();

      if (isNew) {
        setProducts((currentProducts) => [...currentProducts, updatedProduct]);
      } else {
        setProducts((currentProducts) =>
          currentProducts.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p,
          ),
        );
      }

      upsertCachedProduct(updatedProduct);

      setEditingProduct(null);
      setIsAdding(false);
      setShowSpan(true);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await authenticatedFetch(
        `${VITE_BACKEND_URL}/api/products/${productId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao remover produto.");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((p) => p.id !== productId),
      );
      removeCachedProduct(productId);
      setShowAttentionMessage(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  const filteredProducts =
    searchQuery === undefined
      ? products
      : products.filter((product) =>
          typeof searchQuery === "number"
            ? product.id === searchQuery
            : product.categoria === searchQuery ||
              product.titulo
                .toLowerCase()
                .includes(String(searchQuery).toLowerCase()),
        );

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  return (
    <div className="flex flex-col gap-6 p-2 sm:p-4">
      {showSpan && (
        <SpanMessage message="Produto salvo com sucesso!" status="ok" />
      )}

      {!embedded && <BackButton />}

      {showAttentionMessage && productToDelete !== null && (
        <AttentionMessage
          message="Tem certeza que deseja excluir esse produto?"
          onClose={() => {
            setShowAttentionMessage(false);
            setProductToDelete(null);
          }}
          onClick={() => handleDeleteProduct(productToDelete)}
          buttonContent="Sim, remover"
        />
      )}

      {/* BARRA SUPERIOR DE AÇÕES E FILTROS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Catálogo de Produtos
          </h2>
          <p className="text-xs text-slate-500">
            Gerencie itens, atualize estoque ou adicione novos produtos à loja.
          </p>
        </div>

        {!isAdding && (
          <motion.button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            whileTap={{ scale: 0.98 }}
          >
            <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
            Adicionar Produto
          </motion.button>
        )}
      </div>

      {/* FORMULÁRIO DE ADIÇÃO (QUANDO ATIVO) */}
      {isAdding && (
        <div className="rounded-[28px] border border-slate-200 bg-slate-50/50 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Novo Cadastro de Produto
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <ProductForm
            product={{} as Product}
            onSave={handleSave}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {/* CHIPS DE CATEGORIAS / DEPARTAMENTOS */}
      <div className="flex items-center gap-2">
        <FontAwesomeIcon
          icon={faLayerGroup}
          className="text-slate-400 text-xs"
        />
        <ul className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navDepartments.map((dept) => {
            const isActive = searchQuery === dept.name;
            return (
              <li key={dept.id}>
                <button
                  className={`flex min-h-9 items-center whitespace-nowrap rounded-full border px-3.5 text-xs font-semibold transition active:scale-[0.98] ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() => setSearchQuery(dept.name)}
                >
                  {dept.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* TAG DE FILTRO ATIVO */}
      {searchQuery !== undefined && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <FontAwesomeIcon icon={faTag} className="h-3 w-3" />
            Filtro: {searchQuery}
            <button
              className="ml-1 text-blue-500 hover:text-blue-900"
              onClick={() => {
                setSearchQuery(undefined);
                setTimeout(() => {
                  setSearchProducts(!searchProducts);
                }, 100);
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </span>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.18 }}
            >
              <div className="flex gap-4 flex-row items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Link
                    to={`/product/${product.id}`}
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100"
                  >
                    <img
                      src={product.img}
                      alt={product.titulo}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {product.categoria}
                    </span>
                    <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                      {product.titulo}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-950">
                        R$ {Number(product.preco).toFixed(2)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          product.disponivel
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {product.disponivel ? "Ativo" : "Indisponível"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 self-end sm:self-center">
                  <motion.button
                    onClick={() => setEditingProduct(product)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
                    whileTap={{ scale: 0.97 }}
                  >
                    <FontAwesomeIcon icon={faPen} className="text-slate-500" />
                    Editar
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setProductToDelete(product.id);
                      setShowAttentionMessage(true);
                    }}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-[0.98]"
                    whileTap={{ scale: 0.97 }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Remover
                  </motion.button>
                </div>
              </div>

              {editingProduct?.id === product.id && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-700">
                      Editando: {product.titulo}
                    </p>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                  <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => setEditingProduct(null)}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 p-12 text-center">
          <FontAwesomeIcon
            icon={faBoxOpen}
            className="mb-3 h-8 w-8 text-slate-300"
          />
          <p className="text-sm font-semibold text-slate-700">
            Nenhum produto encontrado
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Tente mudar o termo de busca ou selecionar outra categoria.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProdutosDashboard;
