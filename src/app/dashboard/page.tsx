"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { getCurrentUser, User } from "@/lib/auth";

interface Stats {
  total: number;
  male: number;
  female: number;
  byAgeGroup: Record<string, number>;
  topCountries: { country_name: string; count: number }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      if (!u) { router.push("/login"); return; }
      setUser(u);

      try {
        const [totalRes, maleRes, femaleRes, childRes, teenRes, adultRes, seniorRes] =
          await Promise.all([
            api.get("/api/profiles?limit=1"),
            api.get("/api/profiles?gender=male&limit=1"),
            api.get("/api/profiles?gender=female&limit=1"),
            api.get("/api/profiles?age_group=child&limit=1"),
            api.get("/api/profiles?age_group=teenager&limit=1"),
            api.get("/api/profiles?age_group=adult&limit=1"),
            api.get("/api/profiles?age_group=senior&limit=1"),
          ]);

        setStats({
          total: totalRes.data.total,
          male: maleRes.data.total,
          female: femaleRes.data.total,
          byAgeGroup: {
            child: childRes.data.total,
            teenager: teenRes.data.total,
            adult: adultRes.data.total,
            senior: seniorRes.data.total,
          },
          topCountries: [],
        });
      } catch {}

      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user.username} role={user.role} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-8">Welcome back, @{user.username}</p>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard label="Total Profiles" value={stats.total} color="blue" />
              <StatCard label="Male" value={stats.male} color="indigo" />
              <StatCard label="Female" value={stats.female} color="pink" />
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">By Age Group</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byAgeGroup).map(([group, count]) => (
                <StatCard key={group} label={group.charAt(0).toUpperCase() + group.slice(1)} value={count} color="gray" />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "border-blue-500/30 bg-blue-500/10",
    indigo: "border-indigo-500/30 bg-indigo-500/10",
    pink: "border-pink-500/30 bg-pink-500/10",
    gray: "border-gray-700 bg-gray-800/50",
  };

  return (
    <div className={`rounded-xl border p-6 ${colors[color]}`}>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  );
}