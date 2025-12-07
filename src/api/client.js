const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getAuthToken = () => localStorage.getItem("bh_token") || "";

export async function apiFetch(path, options = {}) {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
