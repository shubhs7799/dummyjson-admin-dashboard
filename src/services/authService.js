// src/services/authService.js
// All authentication-related API calls live here, NOT inside the UI.
// The components just call these functions and react to the result.

import api from "@/lib/axios";

// Log the user in against DummyJSON's POST /auth/login.
// Returns the full response data: { accessToken, refreshToken, id, username, ... }.
// Any error is already normalized by the axios response interceptor into
// { status, message, data }, so the caller can just read `err.message`.
export async function login({ username, password }) {
  const response = await api.post("/auth/login", {
    username,
    password,
    // Token lifetime in minutes. 60 = valid for an hour after login.
    expiresInMins: 60,
  });
  return response.data;
}

// Fetch the current logged-in user using the stored token.
// DummyJSON exposes GET /auth/me for this. Our request interceptor
// automatically attaches the Bearer token, so no manual header needed.
export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}
