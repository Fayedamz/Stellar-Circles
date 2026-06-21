import { EventEmitter } from "events";
import { logger } from "../utils/logger";

/**
 * Internal event bus for real-time notifications.
 * The WebSocket handler subscribes to these events and forwards them to connected clients.
 */
export const eventBus = new EventEmitter();
eventBus.setMaxListeners(100);

export type CircleEvent =
  | { type: "circle:activity_logged";  circleId: string; payload: unknown }
  | { type: "circle:member_joined";    circleId: string; payload: unknown }
  | { type: "circle:member_left";      circleId: string; payload: unknown }
  | { type: "circle:decision_created"; circleId: string; payload: unknown }
  | { type: "circle:vote_cast";        circleId: string; payload: unknown }
  | { type: "influence:updated";       circleId: string; payload: unknown };

export function emit(event: CircleEvent): void {
  logger.debug("Event emitted", { type: event.type, circleId: event.circleId });
  eventBus.emit(event.type, event);
  eventBus.emit(`circle:${event.circleId}`, event); // per-circle channel
}
