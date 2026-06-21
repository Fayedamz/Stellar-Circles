"use client";

import { useEffect, useRef, useCallback } from "react";

type CircleEventType =
  | "circle:activity_logged"
  | "circle:member_joined"
  | "circle:member_left"
  | "circle:decision_created"
  | "circle:vote_cast"
  | "influence:updated";

interface CircleSocketEvent {
  type: CircleEventType;
  circleId: string;
  payload: unknown;
}

type EventHandler = (event: CircleSocketEvent) => void;

/**
 * Subscribe to real-time events for a circle via WebSocket.
 *
 * Usage:
 *   useCircleSocket(circleId, (event) => {
 *     if (event.type === "circle:activity_logged") mutate();
 *   });
 */
export function useCircleSocket(
  circleId: string | null,
  onEvent: EventHandler
) {
  const wsRef = useRef<WebSocket | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!circleId) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:4000";
    const token = typeof window !== "undefined" ? localStorage.getItem("sc_token") : null;
    const url = token ? `${wsUrl}/ws?token=${token}` : `${wsUrl}/ws`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", circleId }));
    };

    ws.onmessage = (msg) => {
      try {
        const event: CircleSocketEvent = JSON.parse(msg.data);
        onEventRef.current(event);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = (err) => {
      console.warn("Stellar Circles WebSocket error", err);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe", circleId }));
      }
      ws.close();
      wsRef.current = null;
    };
  }, [circleId]);
}
