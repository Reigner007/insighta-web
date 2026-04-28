"use client";

import Link from "next/link";

interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  age_group: string;
  country_name: string;
  country_id: string;
  gender_probability: number;
  country_probability: number;
}

export default function ProfileTable({ profiles }: { profiles: Profile[] }) {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No profiles found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-800 text-gray-400 text-left">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Gender</th>
            <th className="px-4 py-3 font-medium">Age</th>
            <th className="px-4 py-3 font-medium">Age Group</th>
            <th className="px-4 py-3 font-medium">Country</th>
            <th className="px-4 py-3 font-medium">G. Prob</th>
            <th className="px-4 py-3 font-medium">C. Prob</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p, i) => (
            <tr
              key={p.id}
              className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors ${
                i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"
              }`}
            >
              <td className="px-4 py-3 text-white font-medium">{p.name}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  p.gender === "male"
                    ? "bg-blue-900 text-blue-300"
                    : "bg-pink-900 text-pink-300"
                }`}>
                  {p.gender}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-300">{p.age}</td>
              <td className="px-4 py-3 text-gray-300 capitalize">{p.age_group}</td>
              <td className="px-4 py-3 text-gray-300">
                {p.country_name} <span className="text-gray-500">({p.country_id})</span>
              </td>
              <td className="px-4 py-3 text-gray-400">{p.gender_probability.toFixed(2)}</td>
              <td className="px-4 py-3 text-gray-400">{p.country_probability.toFixed(2)}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/profiles/${p.id}`}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}