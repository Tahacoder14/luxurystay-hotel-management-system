import express from 'express';
const router = express.Router();
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// --- Public Route ---
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// --- Admin-Only Protected Routes ---
// The user must be logged in (protect) AND be an admin (admin) to access these.
router.post('/', protect, admin, upload.single('image'), createRoom);
router.put('/:id', protect, admin, updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

export default router;