const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

// A single, efficient endpoint to get all dashboard data at once
router.get('/', protect, admin, getDashboardData);

module.exports = router;