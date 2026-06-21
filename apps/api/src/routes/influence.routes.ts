import { Router } from 'express';
import { InfluenceController } from '../controllers/influence.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/users/:id/influence
 * Get a user's influence scores across all their circles.
 */
router.get('/users/:id/influence', InfluenceController.getUserInfluence);

export default router;
