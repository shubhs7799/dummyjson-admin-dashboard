// src/lib/axios.js
// ONE shared Axios instance for the whole app.
// - Request interceptor: attaches the auth token to every request.
// - Response interceptor: turns every failure into a single, predictable
//   error shape and handles 401 (expired/invalid token) in one place.
// Every API call in the app imports THIS instance, so the token + error
// logic is written exactly once (an assignment requirement).

import axios from "axios";
import { getToken, clearToken } from "./token";

// Base URL comes from env so it can change per environment without code edits.
// Falls back to the public DummyJSON URL if the env var is missing.
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com";

// Create the instance. Every request made with `api` inherits these defaults.
const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  // 15s ceiling so a hanging request eventually fails instead of loading forever.
  timeout: 15000,
});

// ---- REQUEST INTERCEPTOR ----------------------------------------------------
// Runs before every request leaves the app. We read the current token and,
// if present, add it as a Bearer token. DummyJSON expects `Authorization: Bearer <token>`.
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // If building the request itself fails, reject so callers can catch it.
  (error) => Promise.reject(error)
);

// ---- RESPONSE INTERCEPTOR ---------------------------------------------------
// Runs after every response. On success we pass it straight through.
// On failure we normalize the error into a consistent shape:
//   { status, message, data }
// so UI code never has to dig through axios's nested error object.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Default values for the normalized error.
    let status = null;
    let message = "Something went wrong. Please try again.";
    let data = null;

    if (error.response) {
      // Server responded with a non-2xx status (400, 401, 404, 500, ...).
      status = error.response.status;
      data = error.response.data;
      // DummyJSON returns { message: "..." } on errors; prefer that text.
      message = data?.message || `Request failed with status ${status}`;

      // 401 = token missing/expired/invalid. Clear it so the app can send
      // the user back to login. We only clear here (single place); the redirect
      // itself is handled by the auth layer/route guard we build next.
      if (status === 401) {
        clearToken();
      }
    } else if (error.request) {
      // Request was sent but no response came back (network down, CORS, timeout).
      message =
        error.code === "ECONNABORTED"
          ? "The request timed out. Please try again."
          : "Network error. Check your connection and try again.";
    }
    // else: error happened setting up the request; keep the default message.

    // Reject with our normalized object so every `catch` block is consistent.
    return Promise.reject({ status, message, data, original: error });
  }
);

export default api;
