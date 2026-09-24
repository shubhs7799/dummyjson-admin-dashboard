"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductList from "@/components/ProductList";
import Pagination from "@/components/Pagination";
import Filters from "@/components/Filters";
import { Loader, ErrorState, EmptyState } from "@/components/States";
import { useAuth } from "@/context/AuthContext";
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
} from "@/services/productService";
import { useDebounce } from "@/hooks/useDebounce";

function parseSort(sort) {
  if (!sort) return { sortBy: undefined, order: undefined };
  const [sortBy, order] = sort.split("-");
  return { sortBy, order };
}

function ProductsContent() {
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput.trim(), 500);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const abortRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    try {
      const skip = (page - 1) * pageSize;
      const { sortBy, order } = parseSort(sort);
      const base = {
        limit: pageSize,
        skip,
        sortBy,
        order,
        signal: controller.signal,
      };

      let data;
      if (debouncedSearch) {
        data = await searchProducts({ q: debouncedSearch, ...base });
      } else if (category) {
        data = await getProductsByCategory({ category, ...base });
      } else {
        data = await getProducts(base);
      }

      setProducts(data.products);
      setTotal(data.total);
      setLoading(false);
    } catch (err) {
      if (err?.canceled) {
        return;
      }
      setError(err?.message || "Failed to load products.");
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, category, sort]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort]);

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
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <Filters
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
            categoryDisabled={!!debouncedSearch}
          />
        </div>

        {debouncedSearch && (
          <p className="mb-4 text-xs text-gray-500">
            Category filter is disabled while searching (the API cannot search
            and filter by category at the same time).
          </p>
        )}

        {loading ? (
          <Loader label="Loading products..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : products.length === 0 ? (
          <EmptyState
            message={
              debouncedSearch
                ? `No products found for "${debouncedSearch}".`
                : "No products found."
            }
          />
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
