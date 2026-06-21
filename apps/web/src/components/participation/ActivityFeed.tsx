import type { Activity } from "@stellar-circles/shared";

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
}

const activityIcons: Record<string, string> = {
  SESSION_ATTENDED:      "📅",
  RESOURCE_SHARED:       "📚",
  SKILL_MILESTONE:       "🏆",
  PEER_MENTORED:         "🤝",
  IDEA_SUBMITTED:        "💡",
  TASK_COMPLETED:        "✅",
  PROGRESS_UPDATE:       "📈",
  ACCOUNTABILITY_CHECK:  "🔔",
  WORKOUT_LOGGED:        "🏋️",
  CHALLENGE_COMPLETED:   "🎯",
  HABIT_CHECKED:         "✔️",
  PERSONAL_RECORD:       "⭐",
  PLANTING_LOGGED:       "🌱",
  HARVEST_RECORDED:      "🌾",
  KNOWLEDGE_SHARED:      "💬",
  COOPERATIVE_TASK:      "👥",
  DISCUSSION_POST:       "💬",
  DECISION_VOTED:        "🗳️",
  MEMBER_ENDORSED:       "👍",
};

export function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-8">
        No activities yet. Be the first to contribute!
      </p>
    );
  }

  return (
    <ul className="space-y-3" aria-label="Activity feed">
      {activities.map((activity) => (
        <li key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
          <span className="text-xl" aria-hidden="true">
            {activityIcons[activity.type] ?? "📌"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 line-clamp-2">{activity.description}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span>{activity.type.replace(/_/g, " ").toLowerCase()}</span>
              {activity.influenceDelta && (
                <span className="text-emerald-600 font-medium">+{activity.influenceDelta.toFixed(1)} influence</span>
              )}
              {activity.stellarTxHash && (
                <span title="Anchored on Stellar" className="text-brand-500">⚓</span>
              )}
              <span>{new Date(activity.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
