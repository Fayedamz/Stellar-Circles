import clsx from "clsx";
import { CircleType } from "@stellar-circles/shared";

const types = [
  {
    value: CircleType.LEARNING,
    icon: "🎓",
    label: "Learning",
    desc: "Study groups, knowledge sharing, skill progression",
    accent: "border-indigo-400  bg-indigo-50  text-indigo-700",
    selected: "ring-2 ring-indigo-500",
  },
  {
    value: CircleType.BUSINESS,
    icon: "💼",
    label: "Business",
    desc: "Startup accountability, idea validation, founder circles",
    accent: "border-amber-400   bg-amber-50   text-amber-700",
    selected: "ring-2 ring-amber-500",
  },
  {
    value: CircleType.FITNESS,
    icon: "💪",
    label: "Fitness",
    desc: "Workout tracking, group challenges, health habits",
    accent: "border-emerald-400 bg-emerald-50 text-emerald-700",
    selected: "ring-2 ring-emerald-500",
  },
  {
    value: CircleType.FARMING,
    icon: "🌾",
    label: "Farming",
    desc: "Agricultural cooperation, seasonal planning, shared knowledge",
    accent: "border-lime-400    bg-lime-50    text-lime-700",
    selected: "ring-2 ring-lime-500",
  },
];

interface CircleTypeSelectorProps {
  value: CircleType;
  onChange: (type: CircleType) => void;
}

export function CircleTypeSelector({ value, onChange }: CircleTypeSelectorProps) {
  return (
    <fieldset>
      <legend className="block text-sm font-semibold text-slate-700 mb-3">Circle Type</legend>
      <div className="grid grid-cols-2 gap-3">
        {types.map((t) => (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={value === t.value}
            onClick={() => onChange(t.value)}
            className={clsx(
              "text-left p-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500",
              t.accent,
              value === t.value ? t.selected : "border-slate-200 bg-white hover:border-slate-300"
            )}
          >
            <div className="text-2xl mb-1">{t.icon}</div>
            <div className="font-semibold text-sm">{t.label}</div>
            <div className="text-xs opacity-70 mt-0.5 leading-snug">{t.desc}</div>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
