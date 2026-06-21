import { Router } from "express";
import { body } from "express-validator";
import { getStellarChallenge, verifyStellarIdentity } from "../controllers/stellar.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.get("/challenge", authenticate, getStellarChallenge);

router.post(
  "/verify",
  authenticate,
  [
    body("stellarAddress").isLength({ min: 56, max: 56 }).withMessage("Invalid Stellar address"),
    body("signature").notEmpty().withMessage("Signature is required"),
  ],
  validate,
  verifyStellarIdentity
);

export default router;
