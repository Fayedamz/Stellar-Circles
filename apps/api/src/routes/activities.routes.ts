/**
 * Standalone activities routes.
 * Most activity routes are nested under /circles/:id/activities.
 * This file handles top-level activity queries.
 */

import { Router } from 'express';

const router = Router();

// TODO: GET /api/activities?userId=... — global activity feed across all circles

export default router;
