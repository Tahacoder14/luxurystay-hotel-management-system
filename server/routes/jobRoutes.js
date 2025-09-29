import express from 'express';
const router = express.Router();
import { getAllJobs, createJob } from '../controllers/jobController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/', getAllJobs); // Public route to see jobs
router.post('/', protect, admin, createJob); // Protected admin route

export default router;