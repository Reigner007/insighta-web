import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Generate a CSRF token
function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Store CSRF token in memory
let csrfToken: string = generateCSRFToken();

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "x-api-version": "1",
  },
});

api.interceptors.request.use((config) => {
  // Attach CSRF token to all state-changing requests
  if (["post", "put", "patch", "delete"].includes(config.method || "")) {
    config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
  await axios.post(
    `${BASE_URL}/auth/refresh`,
    {},
    { 
      withCredentials: true,
      headers: { "Content-Type": "application/json" }
    }
  );
  return api(original);
} catch {
  window.location.href = "/login";
}
    }

    return Promise.reject(error);
  }
);