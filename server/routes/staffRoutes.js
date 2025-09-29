import express from 'express';
const router = express.Router();
import { getDashboardData, staffCheckIn, staffCheckOut } from '../controllers/staffController.js';
import { protect, staff } from '../middleware/authMiddleware.js';

// This one endpoint provides all data for the staff dashboard
router.get('/dashboard', protect, staff, getDashboardData);

// These handle the attendance actions
router.post('/attendance/checkin', protect, staff, staffCheckIn);
router.put('/attendance/checkout', protect, staff, staffCheckOut);

export default router;