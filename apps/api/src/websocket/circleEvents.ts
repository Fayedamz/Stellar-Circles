import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { eventBus, CircleEvent } from "../services/notification.service";
import { logger } from "../utils/logger";

interface AuthenticatedSocket extends WebSocket {
  userId?: string;
  subscribedCircles: Set<string>;
  isAlive: boolean;
}

export function setupWebSocket(wss: WebSocketServer): void {
  // Track per-circle subscribers: circleId → Set<socket>
  const circleSubscribers = new Map<string, Set<AuthenticatedSocket>>();

  // Heartbeat — drop stale connections
  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      const socket = ws as AuthenticatedSocket;
      if (!socket.isAlive) {
        socket.terminate();
        return;
      }
      socket.isAlive = false;
      socket.ping();
    });
  }, 30_000);

  wss.on("close", () => clearInterval(heartbeat));

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const socket = ws as AuthenticatedSocket;
    socket.isAlive = true;
    socket.subscribedCircles = new Set();

    // Authenticate via ?token= query param
    const url = new URL(req.url ?? "/", "ws://localhost");
    const token = url.searchParams.get("token");

    if (token) {
      try {
        const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
        socket.userId = payload.userId;
      } catch {
        // Unauthenticated — read-only events allowed
      }
    }

    socket.on("pong", () => { socket.isAlive = true; });

    socket.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "subscribe" && msg.circleId) {
          socket.subscribedCircles.add(msg.circleId);
          if (!circleSubscribers.has(msg.circleId)) {
            circleSubscribers.set(msg.circleId, new Set());
          }
          circleSubscribers.get(msg.circleId)!.add(socket);
          socket.send(JSON.stringify({ type: "subscribed", circleId: msg.circleId }));
        }

        if (msg.type === "unsubscribe" && msg.circleId) {
          socket.subscribedCircles.delete(msg.circleId);
          circleSubscribers.get(msg.circleId)?.delete(socket);
        }
      } catch {
        // Ignore malformed messages
      }
    });

    socket.on("close", () => {
      socket.subscribedCircles.forEach((circleId) => {
        circleSubscribers.get(circleId)?.delete(socket);
      });
    });
  });

  // Forward internal events to subscribed WebSocket clients
  const broadcast = (event: CircleEvent) => {
    const subscribers = circleSubscribers.get(event.circleId);
    if (!subscribers) return;

    const message = JSON.stringify({ type: event.type, ...event });
    subscribers.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    });
  };

  const events: CircleEvent["type"][] = [
    "circle:activity_logged",
    "circle:member_joined",
    "circle:member_left",
    "circle:decision_created",
    "circle:vote_cast",
    "influence:updated",
  ];

  events.forEach((eventType) => {
    eventBus.on(eventType, broadcast);
  });

  logger.info("WebSocket server initialized");
}
