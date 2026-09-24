import api from "@/lib/axios";

export async function getProducts({ limit = 10, skip = 0, signal } = {}) {
  const response = await api.get("/products", {
    params: { limit, skip },
    signal,
  });
  return response.data;
}

export async function searchProducts({ q, limit = 10, skip = 0, signal } = {}) {
  const response = await api.get("/products/search", {
    params: { q, limit, skip },
    signal,
  });
  return response.data;
}
