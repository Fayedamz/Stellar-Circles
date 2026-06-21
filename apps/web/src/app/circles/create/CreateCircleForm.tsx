"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { CircleType, MembershipType } from "@stellar-circles/shared";
import type { CreateCircleInput } from "@stellar-circles/shared";

const circleTypes = [
  { value: CircleType.LEARNING, label: "🎓 Learning", desc: "Study groups & knowledge sharing" },
  { value: CircleType.BUSINESS, label: "💼 Business", desc: "Startup accountability & collaboration" },
  { value: CircleType.FITNESS,  label: "💪 Fitness",  desc: "Workout tracking & challenges" },
  { value: CircleType.FARMING,  label: "🌾 Farming",  desc: "Agricultural cooperation & knowledge" },
];

export default function CreateCircleForm() {
  const router = useRouter();
  const [form, setForm] = useState<CreateCircleInput>({
    name: "",
    description: "",
    type: CircleType.LEARNING,
    membershipType: MembershipType.OPEN,
  });
  const [error, setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post("/circles", form);
      router.push(`/circles/${data.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Failed to create circle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Circle type */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">Circle Type</label>
        <div className="grid grid-cols-2 gap-3">
          {circleTypes.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm({ ...form, type: t.value })}
              className={`text-left p-4 rounded-xl border-2 transition-colors ${
                form.type === t.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-medium text-sm">{t.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Circle Name</label>
        <input
          type="text"
          required
          minLength={3}
          maxLength={80}
          placeholder="e.g. Nairobi Web3 Builders"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          required
          minLength={10}
          maxLength={500}
          rows={4}
          placeholder="What is this circle about? Who should join?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </div>

      {/* Membership type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Membership</label>
        <div className="flex gap-4">
          {[
            { value: MembershipType.OPEN,   label: "Open",   desc: "Anyone can join" },
            { value: MembershipType.INVITE, label: "Invite", desc: "Invite link required" },
          ].map((m) => (
            <label key={m.value} className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="membershipType"
                value={m.value}
                checked={form.membershipType === m.value}
                onChange={() => setForm({ ...form, membershipType: m.value })}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-slate-700">{m.label}</div>
                <div className="text-xs text-slate-400">{m.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? "Creating…" : "Create Circle"}
      </button>
    </form>
  );
}
