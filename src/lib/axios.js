import axios from "axios";
import { getToken, clearToken } from "./token";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let status = null;
    let message = "Something went wrong. Please try again.";
    let data = null;

    if (error.response) {
      status = error.response.status;
      data = error.response.data;
      message = data?.message || `Request failed with status ${status}`;

      if (status === 401) {
        clearToken();
      }
    } else if (error.request) {
      message =
        error.code === "ECONNABORTED"
          ? "The request timed out. Please try again."
          : "Network error. Check your connection and try again.";
    }

    return Promise.reject({ status, message, data, original: error });
  }
);

export default api;
