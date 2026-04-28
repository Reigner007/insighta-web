"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Navbar({ username, role }: { username: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profiles", label: "Profiles" },
    { href: "/search", label: "Search" },
    { href: "/account", label: "Account" },
  ];

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch {}
    router.push("/login");
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-white font-bold text-lg">Insighta Labs</span>
          <div className="flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            @{username}
            <span className="ml-2 px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
              {role}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}