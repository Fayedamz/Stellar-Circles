"use client";

import useSWR from "swr";
import { apiClient } from "@/lib/api";
import type { Circle, Member, Activity } from "@stellar-circles/shared";

const fetcher = (url: string) => apiClient.get(url).then((r) => r.data);

/** Fetch a single circle by ID */
export function useCircle(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Circle>(
    id ? `/circles/${id}` : null,
    fetcher
  );
  return { circle: data, error, isLoading, mutate };
}

/** Fetch paginated list of circles (with optional type filter) */
export function useCircles(type?: string) {
  const params = type ? `?type=${type}` : "";
  const { data, error, isLoading } = useSWR<{ data: Circle[]; total: number }>(
    `/circles${params}`,
    fetcher
  );
  return { circles: data?.data ?? [], total: data?.total ?? 0, error, isLoading };
}

/** Fetch members of a circle */
export function useCircleMembers(circleId: string | null) {
  const { data, error, isLoading } = useSWR<Member[]>(
    circleId ? `/circles/${circleId}/members` : null,
    fetcher
  );
  return { members: data ?? [], error, isLoading };
}

/** Fetch activity feed for a circle */
export function useCircleActivities(circleId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ data: Activity[]; total: number }>(
    circleId ? `/circles/${circleId}/activities` : null,
    fetcher
  );
  return { activities: data?.data ?? [], total: data?.total ?? 0, error, isLoading, mutate };
}
