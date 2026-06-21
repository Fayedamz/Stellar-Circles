import { Router } from "express";
import { getUserInfluence } from "../controllers/influence.controller";
import { db } from "../config/database";

const router = Router();

router.get("/:id/influence", getUserInfluence);

router.get("/:id/profile", async (req, res) => {
  const user = await db("users")
    .where({ id: req.params.id })
    .select("id", "username", "avatar_url", "bio", "stellar_address", "created_at")
    .first();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    stellarAddress: user.stellar_address,
    createdAt: user.created_at,
  });
});

export default router;
