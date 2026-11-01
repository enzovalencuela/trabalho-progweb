import type { Product } from "../types/Product";

const PRODUCT_CACHE_KEY = "products_cache_v1";
const PRODUCT_CACHE_TTL = 5 * 60 * 1000;

interface ProductCachePayload {
  timestamp: number;
  products: Product[];
}

export function loadProductCache(): ProductCachePayload | null {
  try {
    const raw = localStorage.getItem(PRODUCT_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProductCachePayload;
  } catch {
    return null;
  }
}

export function saveProductCache(products: Product[]) {
  try {
    const payload: ProductCachePayload = {
      timestamp: Date.now(),
      products,
    };
    localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache errors
  }
}

export function isProductCacheFresh(cache: ProductCachePayload | null) {
  return Boolean(cache && Date.now() - cache.timestamp < PRODUCT_CACHE_TTL);
}

export function getCachedProducts() {
  return loadProductCache()?.products ?? [];
}

export function filterCachedProducts(query?: string, category?: string) {
  const products = getCachedProducts();
  const normalizedQuery = query?.trim().toLowerCase();
  const normalizedCategory = category?.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = normalizedCategory
      ? product.categoria.toLowerCase() === normalizedCategory
      : true;
    const matchesQuery = normalizedQuery
      ? `${product.titulo} ${product.descricao} ${product.categoria}`
          .toLowerCase()
          .includes(normalizedQuery)
      : true;

    return matchesCategory && matchesQuery;
  });
}

export function getCachedProductById(id: number) {
  return getCachedProducts().find((product) => product.id === id) ?? null;
}

export function upsertCachedProduct(product: Product) {
  const products = getCachedProducts();
  const nextProducts = products.some((item) => item.id === product.id)
    ? products.map((item) => (item.id === product.id ? product : item))
    : [...products, product];

  saveProductCache(nextProducts);
  return nextProducts;
}

export function removeCachedProduct(productId: number) {
  const nextProducts = getCachedProducts().filter(
    (product) => product.id !== productId
  );
  saveProductCache(nextProducts);
  return nextProducts;
}

export async function fetchProductsWithCache(
  baseUrl: string
): Promise<{ products: Product[]; fromCache: boolean }> {
  const cache = loadProductCache();

  if (isProductCacheFresh(cache) && cache) {
    return { products: cache.products, fromCache: true };
  }

  try {
    const response = await fetch(`${baseUrl}/api/products`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao buscar produtos.");
    }

    const products: Product[] = await response.json();
    saveProductCache(products);
    return { products, fromCache: false };
  } catch (error) {
    if (cache?.products?.length) {
      return { products: cache.products, fromCache: true };
    }
    throw error;
  }
}

export async function fetchProductByIdCached(baseUrl: string, id: number) {
  const cached = getCachedProductById(id);
  if (cached) return cached;

  const response = await fetch(`${baseUrl}/api/products/${id}`);
  if (!response.ok) {
    throw new Error("Erro ao buscar produto.");
  }

  const product: Product = await response.json();
  upsertCachedProduct(product);
  return product;
}

export async function fetchProductsByIdsCached(
  baseUrl: string,
  ids: number[]
): Promise<Product[]> {
  const cachedProducts = getCachedProducts();
  const cacheMap = new Map(cachedProducts.map((product) => [product.id, product]));
  const missingIds = ids.filter((id) => !cacheMap.has(id));

  if (missingIds.length > 0) {
    const fetchedProducts = await Promise.all(
      missingIds.map((id) => fetchProductByIdCached(baseUrl, id))
    );
    fetchedProducts.forEach((product) => cacheMap.set(product.id, product));
  }

  return ids
    .map((id) => cacheMap.get(id))
    .filter((product): product is Product => Boolean(product));
}
