"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductForm from "@/components/ProductForm";
import { Loader, ErrorState } from "@/components/States";
import {
  getProduct,
  updateProduct,
  getCategories,
} from "@/services/productService";

function EditProductContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getProduct({ id });
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setLoadError(err?.message || "Failed to load product.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleSubmit(payload) {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await updateProduct({ id, payload });
      setSaved(true);
    } catch (err) {
      setSubmitError(err?.message || "Failed to update product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <button
          onClick={() => router.push(`/products/${id}`)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to product
        </button>
      </header>

      <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit product</h1>

        {loading ? (
          <Loader label="Loading product..." />
        ) : loadError ? (
          <ErrorState message={loadError} onRetry={load} />
        ) : saved ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <p className="font-medium text-green-800">Product updated.</p>
            <p className="mt-1 text-sm text-green-700">
              Note: DummyJSON does not persist edits, so this change will not
              survive a refresh from the server.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => router.push(`/products/${id}`)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Back to product
              </button>
              <button
                onClick={() => setSaved(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Keep editing
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            {submitError && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            )}
            <ProductForm
              initialValues={product}
              categories={categories}
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/products/${id}`)}
              submitLabel="Save changes"
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function EditProductPage() {
  return (
    <ProtectedRoute>
      <EditProductContent />
    </ProtectedRoute>
  );
}
