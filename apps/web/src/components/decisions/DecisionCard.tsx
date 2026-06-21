"use client";

import { useState } from "react";
import clsx from "clsx";
import { apiClient } from "@/lib/api";
import type { Decision, VoteChoice } from "@stellar-circles/shared";
import { DecisionStatus } from "@stellar-circles/shared";

interface DecisionCardProps {
  decision: Decision;
  onVoted?: () => void;
}

const CHOICES: { value: VoteChoice; label: string; color: string }[] = [
  { value: "FOR",     label: "✅ For",     color: "bg-emerald-600 hover:bg-emerald-700" },
  { value: "AGAINST", label: "❌ Against", color: "bg-red-600    hover:bg-red-700"     },
  { value: "ABSTAIN", label: "⬜ Abstain", color: "bg-slate-500  hover:bg-slate-600"   },
];

export function DecisionCard({ decision, onVoted }: DecisionCardProps) {
  const [loading, setLoading] = useState(false);
  const [voted,   setVoted]   = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const isOpen    = decision.status === DecisionStatus.OPEN;
  const isClosed  = decision.status === DecisionStatus.CLOSED;
  const closesAt  = new Date(decision.closesAt);
  const isPast    = closesAt < new Date();

  const castVote = async (choice: VoteChoice) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/decisions/${decision.id}/vote`, { choice });
      setVoted(true);
      onVoted?.();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Vote failed");
    } finally {
      setLoading(false);
    }
  };

  const result = decision.result;

  return (
    <article className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-semibold text-slate-900 text-base leading-snug">{decision.title}</h3>
        <span
          className={clsx(
            "shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full",
            isOpen  && !isPast ? "bg-emerald-100 text-emerald-700" :
            isClosed            ? "bg-slate-100   text-slate-600"   :
                                  "bg-amber-100   text-amber-700"
          )}
        >
          {isClosed ? "Closed" : isPast ? "Pending close" : "Open"}
        </span>
      </div>

      <p className="text-sm text-slate-500 mb-4">{decision.description}</p>

      <p className="text-xs text-slate-400 mb-4">
        {isClosed
          ? `Closed ${closesAt.toLocaleDateString()}`
          : `Voting closes ${closesAt.toLocaleString()}`}
      </p>

      {/* Results (closed) */}
      {result && (
        <div className="mb-4 bg-slate-50 rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium text-slate-700">
            {result.passed ? "✅ Passed" : "❌ Did not pass"} — {result.participationRate.toFixed(0)}% participation
          </p>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${result.forPercentage}%` }}
            />
          </div>
          <p className="text-slate-500">
            For {result.forPercentage.toFixed(1)}% · Against {result.againstPercentage.toFixed(1)}% · {result.totalVotes} votes
          </p>
        </div>
      )}

      {/* Voting buttons */}
      {isOpen && !isPast && !voted && !isClosed && (
        <div className="space-y-2">
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2 flex-wrap">
            {CHOICES.map((c) => (
              <button
                key={c.value}
                onClick={() => castVote(c.value as VoteChoice)}
                disabled={loading}
                className={clsx(
                  "text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50",
                  c.color
                )}
              >
                {loading ? "…" : c.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">Your vote is weighted by your influence in this circle.</p>
        </div>
      )}

      {voted && (
        <p className="text-sm text-emerald-600 font-medium">Vote cast ✓</p>
      )}
    </article>
  );
}
