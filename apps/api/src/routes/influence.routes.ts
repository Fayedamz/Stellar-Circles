import { Router } from "express";
import { getCircleInfluence, getMemberInfluenceInCircle } from "../controllers/influence.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router({ mergeParams: true });

router.get("/",            getCircleInfluence);
router.get("/me",          authenticate, getMemberInfluenceInCircle);

export default router;
