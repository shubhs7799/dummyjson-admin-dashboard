"use client";
// src/app/products/page.js
// Product list page. Fetches products from the API and shows the four states:
//  - loading  -> <Loader />
//  - error    -> <ErrorState /> with a Retry button
//  - empty    -> <EmptyState />
//  - success  -> <ProductList /> (table on desktop, cards on mobile)
// Wrapped in <ProtectedRoute> so only logged-in users can view it.

import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductList from "@/components/ProductList";
import { Loader, ErrorState, EmptyState } from "@/components/States";
import { useAuth } from "@/context/AuthContext";
import { getProducts } from "@/services/productService";

function ProductsContent() {
  const { user, logout } = useAuth();

  // Data + async state.
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products. Wrapped in useCallback so the Retry button and the
  // initial effect share the exact same function.
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // For Task #5 we load the first 10. Pagination comes in Task #6.
      const data = await getProducts({ limit: 10, skip: 0 });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError(err?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load once when the page mounts.
  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar: greeting + logout */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Products</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Signed in as{" "}
            <span className="font-medium text-gray-900">
              {user?.firstName || user?.username}
            </span>
          </span>
          <button
            onClick={logout}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-6">
        {/* Render exactly one state at a time. */}
        {loading ? (
          <Loader label="Loading products..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">
              Showing {products.length} of {total} products
            </p>
            <ProductList products={products} />
          </>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsContent />
    </ProtectedRoute>
  );
}
