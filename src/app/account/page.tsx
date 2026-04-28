"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getCurrentUser, User } from "@/lib/auth";
import { api } from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      if (!u) { router.push("/login"); return; }
      setUser(u);
    }
    load();
  }, []);

  async function handleLogout() {
    try { await api.post("/auth/logout"); } catch {}
    router.push("/login");
  }

  if (!user) return <div className="min-h-screen bg-gray-950" />;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user.username} role={user.role} />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Account</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-16 h-16 rounded-full border-2 border-gray-700"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">@{user.username}</h2>
              <p className="text-gray-400 text-sm">{user.email || "No email"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-xs mb-1">Role</p>
              <p className="text-white font-medium capitalize">{user.role}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-xs mb-1">Status</p>
              <p className={`font-medium ${user.is_active ? "text-green-400" : "text-red-400"}`}>
                {user.is_active ? "Active" : "Disabled"}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-xs mb-1">Last Login</p>
              <p className="text-white text-sm">{new Date(user.last_login_at).toDateString()}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-xs mb-1">Member Since</p>
              <p className="text-white text-sm">{new Date(user.created_at).toDateString()}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-900/30 border border-red-800 text-red-400 rounded-xl text-sm font-medium hover:bg-red-900/50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}