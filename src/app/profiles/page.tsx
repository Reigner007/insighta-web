"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProfileTable from "@/components/ProfileTable";
import Pagination from "@/components/Pagination";
import { api } from "@/lib/api";
import { getCurrentUser, User } from "@/lib/auth";

export default function ProfilesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: "", age_group: "", country_id: "", min_age: "", max_age: "",
  });

  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      if (!u) { router.push("/login"); return; }
      setUser(u);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchProfiles();
  }, [user, page, filters]);

  async function fetchProfiles() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "15");
      if (filters.gender) params.set("gender", filters.gender);
      if (filters.age_group) params.set("age_group", filters.age_group);
      if (filters.country_id) params.set("country_id", filters.country_id.toUpperCase());
      if (filters.min_age) params.set("min_age", filters.min_age);
      if (filters.max_age) params.set("max_age", filters.max_age);

      const res = await api.get(`/api/profiles?${params.toString()}`);
      setProfiles(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch {}
    setLoading(false);
  }

  if (!user) return <div className="min-h-screen bg-gray-950" />;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user.username} role={user.role} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Profiles</h1>
            <p className="text-gray-400 text-sm mt-1">{total.toLocaleString()} total profiles</p>
          </div>
          
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/export?format=csv`}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors"
          >
            Export CSV
          </a>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <select
            value={filters.gender}
            onChange={(e) => { setFilters({ ...filters, gender: e.target.value }); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={filters.age_group}
            onChange={(e) => { setFilters({ ...filters, age_group: e.target.value }); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Age Groups</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>

          <input
            type="text"
            placeholder="Country (e.g. NG)"
            value={filters.country_id}
            onChange={(e) => { setFilters({ ...filters, country_id: e.target.value }); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm placeholder-gray-500"
          />

          <input
            type="number"
            placeholder="Min Age"
            value={filters.min_age}
            onChange={(e) => { setFilters({ ...filters, min_age: e.target.value }); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm placeholder-gray-500"
          />

          <input
            type="number"
            placeholder="Max Age"
            value={filters.max_age}
            onChange={(e) => { setFilters({ ...filters, max_age: e.target.value }); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm placeholder-gray-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : (
          <>
            <ProfileTable profiles={profiles} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </main>
    </div>
  );
}