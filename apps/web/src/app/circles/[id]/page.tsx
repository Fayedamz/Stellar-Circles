import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Circle" };

interface Props {
  params: { id: string };
}

export default function CircleDetailPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <Link href="/circles" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to circles
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* TODO: fetch circle data for params.id */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-indigo-600 mb-2 block">
                Learning Circle
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Circle #{params.id.slice(0, 8)}</h1>
              <p className="text-slate-500">Circle details load here once connected to the API.</p>
            </div>
            <button className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors">
              Join Circle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Activity Feed</h2>
            {/* TODO: render ActivityFeed component */}
            <p className="text-slate-400 text-sm">No activities yet.</p>
          </div>

          {/* Influence Leaderboard */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Top Contributors</h2>
            {/* TODO: render influence leaderboard */}
            <p className="text-slate-400 text-sm">Influence scores load here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
