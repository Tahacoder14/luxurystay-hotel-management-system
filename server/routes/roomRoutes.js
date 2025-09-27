const express = require('express');
const router = express.Router();
const { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // We will create this next

// --- Public Route ---
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// --- Admin-Only Protected Routes ---
// The user must be logged in (protect) AND be an admin (admin) to access these.
router.post('/', protect, admin, upload.single('image'), createRoom);
router.put('/:id', protect, admin, updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;