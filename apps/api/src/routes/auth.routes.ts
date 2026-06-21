import { Router } from "express";
import { body } from "express-validator";
import { register, login, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { authLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post(
  "/register",
  authLimiter,
  [
    body("username").trim().isLength({ min: 3, max: 30 }).withMessage("Username must be 3–30 chars"),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("stellarAddress").optional().isLength({ min: 56, max: 56 }).withMessage("Invalid Stellar address"),
  ],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
  ],
  validate,
  login
);

router.get("/me", authenticate, getMe);

export default router;
