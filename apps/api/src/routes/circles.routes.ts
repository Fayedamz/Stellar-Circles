import { Router } from "express";
import { body } from "express-validator";
import { listCircles, getCircle, createCircle, updateCircle } from "../controllers/circles.controller";
import { listMembers, joinCircle, leaveCircle } from "../controllers/members.controller";
import { logActivity, getActivities } from "../controllers/activities.controller";
import { getCircleInfluence, getMemberInfluenceInCircle } from "../controllers/influence.controller";
import { listDecisions, createDecision } from "../controllers/decisions.controller";
import { authenticate, optionalAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { CircleType, MembershipType, ActivityType } from "@stellar-circles/shared";

const router = Router();

// ── Circle CRUD ──────────────────────────────────────────────────────────────
router.get("/",    optionalAuth, listCircles);
router.get("/:id", optionalAuth, getCircle);

router.post(
  "/",
  authenticate,
  [
    body("name").trim().isLength({ min: 3, max: 80 }),
    body("description").trim().isLength({ min: 10, max: 500 }),
    body("type").isIn(Object.values(CircleType)),
    body("membershipType").optional().isIn(Object.values(MembershipType)),
  ],
  validate,
  createCircle
);

router.put("/:id", authenticate, updateCircle);

// ── Membership ───────────────────────────────────────────────────────────────
router.get("/:id/members", listMembers);
router.post("/:id/join",   authenticate, joinCircle);
router.post("/:id/leave",  authenticate, leaveCircle);

// ── Activities ───────────────────────────────────────────────────────────────
router.get("/:id/activities", getActivities);
router.post(
  "/:id/activities",
  authenticate,
  [
    body("type").isIn(Object.values(ActivityType)),
    body("description").trim().isLength({ min: 5, max: 500 }),
    body("anchorOnStellar").optional().isBoolean(),
  ],
  validate,
  logActivity
);

// ── Influence ────────────────────────────────────────────────────────────────
router.get("/:id/influence",    getCircleInfluence);
router.get("/:id/my-influence", authenticate, getMemberInfluenceInCircle);

// ── Decisions ────────────────────────────────────────────────────────────────
router.get("/:id/decisions", listDecisions);
router.post(
  "/:id/decisions",
  authenticate,
  [
    body("title").trim().isLength({ min: 5, max: 200 }),
    body("description").trim().isLength({ min: 10, max: 2000 }),
    body("closesAt").isISO8601(),
  ],
  validate,
  createDecision
);

export default router;
