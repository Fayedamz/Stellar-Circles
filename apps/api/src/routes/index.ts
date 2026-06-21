import { Router } from "express";
import authRoutes      from "./auth.routes";
import circlesRoutes   from "./circles.routes";
import decisionsRoutes from "./decisions.routes";
import usersRoutes     from "./users.routes";
import stellarRoutes   from "./stellar.routes";

const router = Router();

router.use("/auth",      authRoutes);
router.use("/circles",   circlesRoutes);
router.use("/decisions", decisionsRoutes);
router.use("/users",     usersRoutes);
router.use("/stellar",   stellarRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
