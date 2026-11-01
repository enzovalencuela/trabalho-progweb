import type { Product } from "../types/Product";

export type ProductCategory =
  | "Setups"
  | "Notebooks"
  | "Periféricos"
  | "Consoles"
  | "Acessórios"
  | "Monitores"
  | "Hardware"
  | "Realidade VR"
  | "Áudio";

export type ProductCollectionType =
  | "maisVendidos"
  | "recomendados"
  | "emPromocao";

interface ProductCollectionOptions {
  products: Product[];
  categoria?: ProductCategory;
  tipoSessao?: ProductCollectionType;
  titulo?: string;
}

export function getCollectionTitle({
  categoria,
  tipoSessao,
  titulo,
}: Omit<ProductCollectionOptions, "products">) {
  if (titulo) return titulo;

  if (tipoSessao === "maisVendidos") return "Mais Vendidos";
  if (tipoSessao === "emPromocao") return "Em Promoção";
  if (tipoSessao === "recomendados") return "Recomendados para Você";

  return categoria || "Produtos";
}

export function getCollectionProducts({
  products,
  categoria,
  tipoSessao,
}: ProductCollectionOptions) {
  if (tipoSessao) {
    switch (tipoSessao) {
      case "maisVendidos":
        return [...products].sort((a, b) => b.id - a.id);

      case "emPromocao":
        return products.filter(
          (product) =>
            Boolean(product.preco_original) &&
            Number(product.preco_original) > product.preco,
        );

      case "recomendados": {
        const recommended = products.filter((product) => product.disponivel);
        return recommended.length > 0 ? recommended : products;
      }

      default:
        return products;
    }
  }

  if (categoria) {
    return products.filter((product) => product.categoria === categoria);
  }

  return products;
}
