"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { getCurrentUser, User } from "@/lib/auth";

export default function ProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      if (!u) { router.push("/login"); return; }
      setUser(u);

      try {
        const res = await api.get(`/api/profiles/${params.id}`);
        setProfile(res.data.data);
      } catch {
        router.push("/profiles");
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;
  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar username={user.username} role={user.role} />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <Link href="/profiles" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">
          ← Back to Profiles
        </Link>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6">{profile.name}</h1>

          <div className="grid grid-cols-2 gap-4">
            <Field label="ID" value={profile.id} mono />
            <Field label="Gender" value={`${profile.gender} (${profile.gender_probability})`} />
            <Field label="Age" value={String(profile.age)} />
            <Field label="Age Group" value={profile.age_group} />
            <Field label="Country" value={`${profile.country_name} (${profile.country_id})`} />
            <Field label="Country Probability" value={String(profile.country_probability)} />
            <Field label="Created" value={new Date(profile.created_at).toDateString()} />
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className={`text-white text-sm ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}