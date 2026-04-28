"use client";

import { getLoginUrl } from "@/lib/auth";

export default function LoginPage() {
  const loginUrl = getLoginUrl();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-md text-center shadow-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Insighta Labs</h1>
          <p className="text-gray-400 text-sm">Demographic Intelligence Platform</p>
        </div>

        <div className="w-16 h-1 bg-blue-500 mx-auto mb-8 rounded-full" />

        <p className="text-gray-300 mb-8 text-sm leading-relaxed">
          Sign in to access demographic profiles, analytics, and intelligence tools.
        </p>

        <a href={loginUrl} className="flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 w-full">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </a>

        <p className="text-gray-600 text-xs mt-6">
          Access is restricted to authorized users only.
        </p>
      </div>
    </div>
  );
}