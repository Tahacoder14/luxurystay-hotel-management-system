import express from 'express';
const router = express.Router();
import { createSubmission, getAllSubmissions, updateSubmissionStatus, deleteSubmission } from '../controllers/submissionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.post('/', createSubmission); // Public route for guests
router.get('/', protect, admin, getAllSubmissions);
router.put('/:id/status', protect, admin, updateSubmissionStatus);
router.delete('/:id', protect, admin, deleteSubmission);

export default router;