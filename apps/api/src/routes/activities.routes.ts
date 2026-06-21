import { Router } from "express";
import { body } from "express-validator";
import { logActivity, getActivities } from "../controllers/activities.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { ActivityType } from "@stellar-circles/shared";

const router = Router({ mergeParams: true });

router.get("/", getActivities);

router.post(
  "/",
  authenticate,
  [
    body("type").isIn(Object.values(ActivityType)).withMessage("Invalid activity type"),
    body("description").trim().isLength({ min: 5, max: 500 }),
    body("anchorOnStellar").optional().isBoolean(),
  ],
  validate,
  logActivity
);

export default router;
