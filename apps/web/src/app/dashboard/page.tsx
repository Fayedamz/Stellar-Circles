import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-brand-700">Stellar Circles</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/circles" className="text-slate-600 hover:text-slate-900">Explore</Link>
          <Link href="/circles/create" className="bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 transition-colors">
            New Circle
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Circles Joined", value: "—", sub: "across all verticals" },
            { label: "Total Influence", value: "—", sub: "combined social capital" },
            { label: "Active Streak",   value: "—", sub: "consecutive weeks" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Your Circles</h2>
            <Link href="/circles" className="text-sm text-brand-600 hover:underline">Browse all</Link>
          </div>
          {/* TODO: fetch and render CircleCard list via useCircle hook */}
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">
            <p className="text-lg mb-3">You haven&apos;t joined any circles yet.</p>
            <Link
              href="/circles"
              className="inline-block bg-brand-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-brand-700 transition-colors"
            >
              Discover circles
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
