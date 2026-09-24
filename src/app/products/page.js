"use client";
// src/app/products/page.js
// TEMPORARY placeholder so we can test route protection + logout.
// Task #5 replaces this with the real product list (table/cards).
//
// It is wrapped in <ProtectedRoute> so only logged-in users can see it;
// anyone without a valid token is redirected to /login.

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

function ProductsContent() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar with a greeting and a logout button */}
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

      <div className="p-6">
        <p className="text-gray-600">
          You are logged in. The product list will appear here (Task #5).
        </p>
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
