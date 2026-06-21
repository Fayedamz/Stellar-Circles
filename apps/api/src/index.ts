import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import { env } from "./config/env";
import { connectDatabases } from "./config/database";
import { logger } from "./utils/logger";
import { apiLimiter } from "./middleware/rateLimit.middleware";
import routes from "./routes/index";
import { setupWebSocket } from "./websocket/circleEvents";

async function bootstrap() {
  // ── Connect to databases ─────────────────────────────────────────────────
  await connectDatabases();

  // ── Express app ──────────────────────────────────────────────────────────
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*", credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.isDev() ? "dev" : "combined"));
  app.use("/api", apiLimiter);

  // ── Routes ───────────────────────────────────────────────────────────────
  app.use("/api", routes);

  // Global error handler
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error("Unhandled error", { error: err.message, stack: err.stack });
    res.status(500).json({ error: "Internal server error" });
  });

  // ── HTTP + WebSocket server ───────────────────────────────────────────────
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  setupWebSocket(wss);

  httpServer.listen(env.PORT, () => {
    logger.info(`Stellar Circles API running on http://localhost:${env.PORT}`);
    logger.info(`WebSocket server on ws://localhost:${env.PORT}/ws`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
