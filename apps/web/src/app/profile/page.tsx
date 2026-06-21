import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-3xl font-bold text-brand-600">
            U
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
            <p className="text-slate-400 text-sm">Influence scores are context-specific — earned per circle.</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-4">Influence Across Circles</h2>
        {/* TODO: fetch and render InfluenceBar per circle */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
          Your influence history appears here once you start participating in circles.
        </div>
      </main>
    </div>
  );
}
