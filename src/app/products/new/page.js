"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductForm from "@/components/ProductForm";
import { createProduct, getCategories } from "@/services/productService";

function NewProductContent() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(payload) {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await createProduct({ payload });
      setCreated(result);
    } catch (err) {
      setError(err?.message || "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <button
          onClick={() => router.push("/products")}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to products
        </button>
      </header>

      <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Add product</h1>

        {created ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <p className="font-medium text-green-800">
              Product created (id #{created.id}).
            </p>
            <p className="mt-1 text-sm text-green-700">
              Note: DummyJSON does not actually save new products, so this ID is
              simulated and will not appear in the list on refresh.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => router.push("/products")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Back to products
              </button>
              <button
                onClick={() => setCreated(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Add another
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <ProductForm
              categories={categories}
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/products")}
              submitLabel="Create product"
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <NewProductContent />
    </ProtectedRoute>
  );
}
