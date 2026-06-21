"use client";

import useSWR from "swr";
import { apiClient } from "@/lib/api";
import type { InfluenceScore, InfluenceLeaderboardEntry } from "@stellar-circles/shared";

const fetcher = (url: string) => apiClient.get(url).then((r) => r.data);

/** Get the current user's influence in a specific circle */
export function useMyInfluence(circleId: string | null) {
  const { data, error, isLoading } = useSWR<InfluenceScore>(
    circleId ? `/circles/${circleId}/my-influence` : null,
    fetcher
  );
  return { influence: data, error, isLoading };
}

/** Get the leaderboard for a circle */
export function useCircleLeaderboard(circleId: string | null) {
  const { data, error, isLoading } = useSWR<InfluenceLeaderboardEntry[]>(
    circleId ? `/circles/${circleId}/influence` : null,
    fetcher
  );
  return { leaderboard: data ?? [], error, isLoading };
}

/** Get a user's influence across all their circles */
export function useUserInfluence(userId: string | null) {
  const { data, error, isLoading } = useSWR(
    userId ? `/users/${userId}/influence` : null,
    fetcher
  );
  return { scores: data ?? [], error, isLoading };
}
