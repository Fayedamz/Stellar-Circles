import type { Metadata } from "next";
import Link from "next/link";
import CreateCircleForm from "./CreateCircleForm";

export const metadata: Metadata = { title: "Create a Circle" };

export default function CreateCirclePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <Link href="/circles" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to circles
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create a Circle</h1>
        <p className="text-slate-500 mb-8">
          Define your micro-society. Choose a type, set participation rules, and invite your community.
        </p>
        <CreateCircleForm />
      </main>
    </div>
  );
}
