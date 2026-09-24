"use client";
// src/app/login/page.js
// Login screen. "use client" because it uses React state and event handlers.
// Responsibilities:
//  - collect username + password
//  - basic validation (both required)
//  - call the auth service
//  - show an error message on failure
//  - disable the button while submitting so rapid clicks can't fire
//    multiple login requests (an assignment rule)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginRequest } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Controlled form fields. Prefilled with the assignment's demo credentials
  // so testing is quick; the user can change them.
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  // UI state: an error message to show, and whether a request is in flight.
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // Guard: if a request is already running, ignore extra clicks/submits.
    if (submitting) return;

    // Simple client-side validation before hitting the API.
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      // Call the auth service (which uses the shared axios instance).
      const data = await loginRequest({ username: username.trim(), password });
      // Store token + user in context (also persists the token).
      login(data);
      // Go to the products page (built in a later task).
      router.push("/products");
    } catch (err) {
      // err is the normalized error from the axios interceptor.
      // DummyJSON returns "Invalid credentials" on wrong username/password.
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      // Always re-enable the button, whether we succeeded or failed.
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="mb-6 text-sm text-gray-500">
          Use <span className="font-medium">emilys</span> /{" "}
          <span className="font-medium">emilyspass</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username field */}
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter username"
            />
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter password"
            />
          </div>

          {/* Error message (only shown when there is one) */}
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {/* Submit button. Disabled + label change while submitting. */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
