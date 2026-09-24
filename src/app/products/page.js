"use client";

import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductList from "@/components/ProductList";
import Pagination from "@/components/Pagination";
import { Loader, ErrorState, EmptyState } from "@/components/States";
import { useAuth } from "@/context/AuthContext";
import { getProducts } from "@/services/productService";

function ProductsContent() {
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const skip = (page - 1) * pageSize;
      const data = await getProducts({ limit: pageSize, skip });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError(err?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  function handlePageSizeChange(nextSize) {
    setPageSize(nextSize);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-gray-50">
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
        {loading ? (
          <Loader label="Loading products..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ProductList products={products} />
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
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
