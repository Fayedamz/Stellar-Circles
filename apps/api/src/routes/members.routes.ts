import { Router } from "express";
import { listMembers, joinCircle, leaveCircle } from "../controllers/members.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router({ mergeParams: true });

router.get("/",      listMembers);
router.post("/join", authenticate, joinCircle);
router.post("/leave",authenticate, leaveCircle);

export default router;
