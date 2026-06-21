/**
 * Standalone members routes (for routes not nested under /circles).
 * Circle-scoped member routes are in circles.routes.ts.
 */

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Placeholder for future standalone member management endpoints
// e.g., GET /api/members/:id, PATCH /api/members/:id/role

export default router;
