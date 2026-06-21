import Link from "next/link";
import { CircleTypeBadge } from "@/components/ui/Badge";
import type { Circle } from "@stellar-circles/shared";

interface CircleCardProps {
  circle: Circle;
}

export function CircleCard({ circle }: CircleCardProps) {
  return (
    <Link
      href={`/circles/${circle.id}`}
      className="block bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-brand-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <CircleTypeBadge type={circle.type} />
        <span className="text-xs text-slate-400">{circle.memberCount} members</span>
      </div>
      <h3 className="font-semibold text-slate-900 text-lg leading-snug mb-2 line-clamp-1">
        {circle.name}
      </h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{circle.description}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className={circle.membershipType === "OPEN" ? "text-emerald-600" : "text-amber-600"}>
          {circle.membershipType === "OPEN" ? "Open to all" : "Invite only"}
        </span>
        <span>{new Date(circle.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
