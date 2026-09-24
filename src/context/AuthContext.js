"use client";
// src/context/AuthContext.js
// App-wide authentication state. Any component can read whether the user is
// logged in, who they are, and can trigger logout — without prop drilling.
//
// How it works:
//  - On mount we check localStorage for a token. If present, we fetch the
//    current user (/auth/me) to confirm the token is still valid.
//  - `login()` stores the token + user after the login page succeeds.
//  - `logout()` clears the token and sends the user back to /login.

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, setToken, clearToken } from "@/lib/token";
import { getCurrentUser } from "@/services/authService";

// The context object. Components read it via the useAuth() hook below.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  // The logged-in user object (or null when logged out).
  const [user, setUser] = useState(null);
  // `loading` is true only during the initial token check so guards can wait
  // instead of flashing the login page before we know the auth state.
  const [loading, setLoading] = useState(true);

  // On first mount: if a token exists, verify it by fetching the user.
  useEffect(() => {
    async function bootstrap() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Token is attached automatically by the axios interceptor.
        const me = await getCurrentUser();
        setUser(me);
      } catch {
        // Token invalid/expired. The interceptor already cleared it on 401,
        // but clear again defensively so state is consistent.
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  // Called by the login page after a successful /auth/login.
  // Stores the token and sets the user in state.
  function login(data) {
    setToken(data.accessToken);
    setUser(data);
  }

  // Clears everything and returns to the login screen.
  function logout() {
    clearToken();
    setUser(null);
    router.push("/login");
  }

  // `isAuthenticated` is a simple derived boolean for convenience.
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Convenience hook so components can do: const { user, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used inside an <AuthProvider>.");
  }
  return ctx;
}
