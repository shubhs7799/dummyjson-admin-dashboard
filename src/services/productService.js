import api from "@/lib/axios";

export async function getProducts({
  limit = 10,
  skip = 0,
  sortBy,
  order,
  signal,
} = {}) {
  const response = await api.get("/products", {
    params: { limit, skip, sortBy, order },
    signal,
  });
  return response.data;
}

export async function searchProducts({
  q,
  limit = 10,
  skip = 0,
  sortBy,
  order,
  signal,
} = {}) {
  const response = await api.get("/products/search", {
    params: { q, limit, skip, sortBy, order },
    signal,
  });
  return response.data;
}

export async function getProductsByCategory({
  category,
  limit = 10,
  skip = 0,
  sortBy,
  order,
  signal,
} = {}) {
  const response = await api.get(
    `/products/category/${encodeURIComponent(category)}`,
    {
      params: { limit, skip, sortBy, order },
      signal,
    }
  );
  return response.data;
}

export async function getCategories({ signal } = {}) {
  const response = await api.get("/products/categories", { signal });
  return response.data;
}

export async function getProduct({ id, signal } = {}) {
  const response = await api.get(`/products/${id}`, { signal });
  return response.data;
}
