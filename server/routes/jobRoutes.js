const express = require('express');
const router = express.Router();
const { getAllJobs, createJob } = require('../controllers/jobController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllJobs); // Public route to see jobs
router.post('/', protect, admin, createJob); // Protected admin route

module.exports = router;