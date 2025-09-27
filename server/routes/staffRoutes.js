const express = require('express');
const router = express.Router();
const { getDashboardData, staffCheckIn, staffCheckOut } = require('../controllers/staffController');
const { protect, staff } = require('../middleware/authMiddleware');

// This one endpoint provides all data for the staff dashboard
router.get('/dashboard', protect, staff, getDashboardData);

// These handle the attendance actions
router.post('/attendance/checkin', protect, staff, staffCheckIn);
router.put('/attendance/checkout', protect, staff, staffCheckOut);

module.exports = router;