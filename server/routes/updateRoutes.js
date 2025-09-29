import express from 'express';
const router = express.Router();
import { createUpdate, getAllUpdates } from '../controllers/updateController.js';
import { protect, admin, staff } from '../middleware/authMiddleware.js';

router.post('/', protect, admin, createUpdate);
router.get('/', protect, staff, getAllUpdates);

export default router;