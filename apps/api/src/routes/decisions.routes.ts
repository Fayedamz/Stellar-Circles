import { Router } from "express";
import { body } from "express-validator";
import { castVote, getDecisionResults } from "../controllers/decisions.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { VoteChoice } from "@stellar-circles/shared";

const router = Router();

router.get("/:id/results", getDecisionResults);

router.post(
  "/:id/vote",
  authenticate,
  [body("choice").isIn(Object.values(VoteChoice))],
  validate,
  castVote
);

export default router;
