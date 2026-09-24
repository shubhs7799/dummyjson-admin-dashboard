"use client";
// src/components/ProtectedRoute.js
// Wraps any page that requires login. If the user is not authenticated once
// the initial auth check finishes, we redirect them to /login. While the
// check is still running we show a simple loading state so we don't briefly
// flash protected content or bounce the user incorrectly.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the initial token check is done before deciding.
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Still checking the token: show a neutral loading screen.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // Not logged in: render nothing while the redirect above kicks in.
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated: show the protected page.
  return children;
}
