import express from 'express';
const router = express.Router();
import { 
    getAllRooms, 
    getRoomById,
    createRoom, 
    updateRoom, 
    deleteRoom 
} from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// ===============================
// --- PUBLIC ROUTES ---
// ===============================

// @route   GET /api/rooms
// @desc    Get a list of all rooms
router.get('/', getAllRooms);

// @route   GET /api/rooms/:id
// @desc    Get a single room's details
router.get('/:id', getRoomById);

// ===============================
// --- ADMIN-ONLY PROTECTED ROUTES ---
// ===============================

// @route   POST /api/rooms
// @desc    Create a new room (requires image upload)
router.post('/', protect, admin, upload.single('image'), createRoom);

// @route   PUT /api/rooms/:id
// @desc    Update a specific room's details
router.put('/:id', protect, admin, updateRoom);

// @route   DELETE /api/rooms/:id
// @desc    Delete a specific room
router.delete('/:id', protect, admin, deleteRoom);

export default router;