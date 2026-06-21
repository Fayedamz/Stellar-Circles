import clsx from "clsx";
import type { InfluenceScore } from "@stellar-circles/shared";

interface InfluenceBarProps {
  score: InfluenceScore;
  maxScore?: number;
  showDetails?: boolean;
}

export function InfluenceBar({ score, maxScore = 100, showDetails = true }: InfluenceBarProps) {
  const percent = Math.min((score.score / maxScore) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-700">Influence</span>
        <span className="font-bold text-slate-900">{score.score.toFixed(1)}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={clsx(
            "h-2.5 rounded-full transition-all duration-500",
            percent >= 75 ? "bg-brand-500" :
            percent >= 40 ? "bg-brand-400" :
                            "bg-brand-300"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex gap-4 mt-2 text-xs text-slate-400">
          <span>
            🔥 {score.streakWeeks}w streak
          </span>
          <span>
            ×{score.consistencyMultiplier.toFixed(2)} consistency
          </span>
          <span>
            ×{score.qualityFactor.toFixed(2)} quality
          </span>
        </div>
      )}
    </div>
  );
}
