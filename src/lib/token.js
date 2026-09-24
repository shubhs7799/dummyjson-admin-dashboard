// src/lib/token.js
// Single place to read/write/remove the auth token.
// We keep this isolated so both the Axios interceptor and the auth flow
// use the exact same storage logic (no duplicated localStorage keys).

// The key under which the DummyJSON access token is stored in localStorage.
const TOKEN_KEY = "accessToken";

// localStorage only exists in the browser. During server-side rendering
// `window` is undefined, so every function guards against that to avoid crashes.
const isBrowser = () => typeof window !== "undefined";

// Return the saved token, or null if there is none / we're on the server.
export function getToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

// Save the token after a successful login.
export function setToken(token) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

// Remove the token on logout or when the server rejects it (401).
export function clearToken() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
}
