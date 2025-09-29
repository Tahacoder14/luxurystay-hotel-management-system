import express from 'express';
const router = express.Router();
import { getDashboardData } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// A single, efficient endpoint to get all dashboard data at once
router.get('/', protect, admin, getDashboardData);

export default router;