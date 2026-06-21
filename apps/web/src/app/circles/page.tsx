import type { Metadata } from "next";
import Link from "next/link";
import { CircleType } from "@stellar-circles/shared";

export const metadata: Metadata = { title: "Explore Circles" };

const typeFilters = [
  { value: "", label: "All" },
  { value: CircleType.LEARNING, label: "🎓 Learning" },
  { value: CircleType.BUSINESS, label: "💼 Business" },
  { value: CircleType.FITNESS,  label: "💪 Fitness"  },
  { value: CircleType.FARMING,  label: "🌾 Farming"  },
];

export default function CirclesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-brand-700">Stellar Circles</Link>
        <Link href="/circles/create" className="bg-brand-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-brand-700 transition-colors">
          + New Circle
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Explore Circles</h1>
          <input
            type="search"
            placeholder="Search circles…"
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Type filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {typeFilters.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/circles?type=${f.value}` : "/circles"}
              className="px-4 py-1.5 rounded-full text-sm border border-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors"
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* TODO: fetch circles from API and render CircleCard components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full text-center py-16 text-slate-400">
            <p>Loading circles…</p>
            <p className="text-sm mt-2">Connect to the API to see circles here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
