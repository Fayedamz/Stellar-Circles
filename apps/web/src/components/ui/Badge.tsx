import clsx from "clsx";
import { CircleType } from "@stellar-circles/shared";

const typeStyles: Record<CircleType, string> = {
  [CircleType.LEARNING]: "bg-indigo-100 text-indigo-700",
  [CircleType.BUSINESS]: "bg-amber-100  text-amber-700",
  [CircleType.FITNESS]:  "bg-emerald-100 text-emerald-700",
  [CircleType.FARMING]:  "bg-lime-100   text-lime-700",
};

const typeIcons: Record<CircleType, string> = {
  [CircleType.LEARNING]: "🎓",
  [CircleType.BUSINESS]: "💼",
  [CircleType.FITNESS]:  "💪",
  [CircleType.FARMING]:  "🌾",
};

interface CircleTypeBadgeProps {
  type: CircleType;
  className?: string;
}

export function CircleTypeBadge({ type, className }: CircleTypeBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full",
        typeStyles[type],
        className
      )}
    >
      <span aria-hidden="true">{typeIcons[type]}</span>
      {type.charAt(0) + type.slice(1).toLowerCase()}
    </span>
  );
}
