const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getAllAttendance } = require('../controllers/attendanceController');
const { protect, staff, admin } = require('../middleware/authMiddleware');

// Staff-specific routes
router.post('/checkin', protect, staff, checkIn);
router.put('/checkout', protect, staff, checkOut);

// Admin-only route
router.get('/', protect, admin, getAllAttendance);

module.exports = router;