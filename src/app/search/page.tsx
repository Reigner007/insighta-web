"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProfileTable from "@/components/ProfileTable";
import Pagination from "@/components/Pagination";
import { api } from "@/lib/api";
import { getCurrentUser, User } from "@/lib/auth";

export default function SearchPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      if (!u) { router.push("/login"); return; }
      setUser(u);
    }
    loadUser();
  }, []);

  async function handleSearch(p = 1) {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await api.get(
        `/api/profiles/search?q=${encodeURIComponent(query)}&page=${p}&limit=15`
      );
      setResults(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
      setPage(p);
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed");
      setResults([]);
    }
    setLoading(false);
  }

  if (!user) return <div className="min-h-screen bg-gray-950" />;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user.username} role={user.role} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Natural Language Search</h1>
        <p className="text-gray-400 text-sm mb-6">
          Search profiles using plain English — e.g. "young males from Nigeria"
        </p>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder='Try "adult females from Kenya" or "seniors above 65"'
            className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {["young males from nigeria", "adult females above 30", "seniors from ghana", "teenagers from kenya"].map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); handleSearch(); }}
              className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-xs hover:bg-gray-700 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {searched && !loading && (
          <>
            <p className="text-gray-400 text-sm mb-4">{total} results found</p>
            <ProfileTable profiles={results} />
            <Pagination page={page} totalPages={totalPages} onPageChange={(p) => handleSearch(p)} />
          </>
        )}
      </main>
    </div>
  );
}