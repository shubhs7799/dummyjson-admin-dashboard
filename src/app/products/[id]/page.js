"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageGallery from "@/components/ImageGallery";
import StarRating from "@/components/StarRating";
import { Loader, ErrorState } from "@/components/States";
import { getProduct } from "@/services/productService";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="text-2xl font-semibold text-gray-900">
        Product not found
      </h2>
      <p className="text-gray-500">
        The product you are looking for does not exist.
      </p>
      <Link
        href="/products"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Back to products
      </Link>
    </div>
  );
}

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotFound(false);
    try {
      const data = await getProduct({ id });
      setProduct(data);
      setLoading(false);
    } catch (err) {
      if (err?.status === 404) {
        setNotFound(true);
      } else {
        setError(err?.message || "Failed to load product.");
      }
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

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

      <div className="mx-auto max-w-5xl p-6">
        {loading ? (
          <Loader label="Loading product..." />
        ) : notFound ? (
          <NotFound />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : product ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ImageGallery images={product.images} title={product.title} />

            <div>
              <p className="mb-1 text-sm capitalize text-gray-500">
                {product.category}
                {product.brand ? ` · ${product.brand}` : ""}
              </p>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {product.title}
              </h1>

              <div className="mb-4 flex items-center gap-3">
                <StarRating value={product.rating} />
                <span className="text-sm text-gray-500">
                  {product.stock > 0
                    ? `In stock (${product.stock})`
                    : "Out of stock"}
                </span>
              </div>

              <p className="mb-4 text-3xl font-semibold text-gray-900">
                ${product.price}
                {product.discountPercentage ? (
                  <span className="ml-2 text-sm font-normal text-green-600">
                    {product.discountPercentage}% off
                  </span>
                ) : null}
              </p>

              <p className="mb-6 text-gray-700">{product.description}</p>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {product.sku && (
                  <>
                    <dt className="text-gray-500">SKU</dt>
                    <dd className="text-gray-900">{product.sku}</dd>
                  </>
                )}
                {product.warrantyInformation && (
                  <>
                    <dt className="text-gray-500">Warranty</dt>
                    <dd className="text-gray-900">
                      {product.warrantyInformation}
                    </dd>
                  </>
                )}
                {product.shippingInformation && (
                  <>
                    <dt className="text-gray-500">Shipping</dt>
                    <dd className="text-gray-900">
                      {product.shippingInformation}
                    </dd>
                  </>
                )}
                {product.returnPolicy && (
                  <>
                    <dt className="text-gray-500">Return policy</dt>
                    <dd className="text-gray-900">{product.returnPolicy}</dd>
                  </>
                )}
              </dl>
            </div>

            <div className="md:col-span-2">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Reviews ({product.reviews?.length || 0})
              </h2>
              {product.reviews?.length ? (
                <div className="space-y-4">
                  {product.reviews.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {r.reviewerName}
                        </span>
                        <StarRating value={r.rating} showValue={false} size={14} />
                      </div>
                      <p className="text-sm text-gray-700">{r.comment}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(r.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default function ProductDetailsPage() {
  return (
    <ProtectedRoute>
      <ProductDetailsContent />
    </ProtectedRoute>
  );
}
