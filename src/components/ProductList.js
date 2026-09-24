"use client";

import Link from "next/link";
import StarRating from "@/components/StarRating";

export default function ProductList({ products }) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-12 w-12 rounded object-cover"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/products/${p.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize text-gray-700">
                  {p.category}
                </td>
                <td className="px-4 py-3 text-gray-900">${p.price}</td>
                <td className="px-4 py-3">
                  <StarRating value={p.rating} />
                </td>
                <td className="px-4 py-3 text-gray-700">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.thumbnail}
              alt={p.title}
              className="h-20 w-20 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h3 className="truncate font-medium text-gray-900">{p.title}</h3>
              <p className="mt-0.5 text-sm capitalize text-gray-500">
                {p.category}
              </p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="font-semibold text-gray-900">${p.price}</span>
                <StarRating value={p.rating} size={14} />
                <span className="text-gray-500">Stock: {p.stock}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
