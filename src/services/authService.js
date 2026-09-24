import api from "@/lib/axios";

export async function login({ username, password }) {
  const response = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}
