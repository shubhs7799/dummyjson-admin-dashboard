// src/services/productService.js
// All product-related API calls live here, not in the UI.
// Uses the shared axios instance (token + error handling built in).

import api from "@/lib/axios";

// Fetch a page of products.
//  - limit: how many items to return (page size)
//  - skip: how many items to skip (for pagination: skip = (page-1) * limit)
//  - signal: an optional AbortController signal so a request can be cancelled
//    (used later for race-condition-safe search).
// Returns the raw DummyJSON shape: { products, total, skip, limit }.
export async function getProducts({ limit = 10, skip = 0, signal } = {}) {
  const response = await api.get("/products", {
    params: { limit, skip },
    signal,
  });
  return response.data;
}
