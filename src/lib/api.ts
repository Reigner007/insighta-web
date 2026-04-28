import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "x-api-version": "1",
  },
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
          { withCredentials: true }
        );
        return api(original);
      } catch {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);