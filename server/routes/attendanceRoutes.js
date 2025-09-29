import express from 'express';
const router = express.Router();
import { checkIn, checkOut, getAllAttendance } from '../controllers/attendanceController.js';
import { protect, staff, admin } from '../middleware/authMiddleware.js';

// Staff-specific routes
router.post('/checkin', protect, staff, checkIn);
router.put('/checkout', protect, staff, checkOut);

// Admin-only route
router.get('/', protect, admin, getAllAttendance);

export default router;