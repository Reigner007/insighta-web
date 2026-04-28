import { api } from "./api";

export interface User {
  id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
  last_login_at: string;
  created_at: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await api.get("/auth/me");
    return res.data.data;
  } catch {
    return null;
  }
}

export function getLoginUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  return `${base}/auth/github`;
}