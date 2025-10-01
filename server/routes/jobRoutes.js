import express from 'express';
const router = express.Router();
import { getAllJobs, createJob, deleteJob } from '../controllers/jobController.js'; // Add deleteJob
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/', getAllJobs); // Public route to see jobs
router.post('/', protect, admin, createJob); // Protected admin route
router.delete('/:id', protect, admin, deleteJob); // <-- ADD THIS LINE

export default router;