import express from 'express';
const router = express.Router();
import { getAllRooms, getRoomById, createRoom, getRoomImage } from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Public routes
router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.get('/:id/image', getRoomImage);

// Admin-only: create room with image upload
router.post('/', protect, admin, upload.single('image'), createRoom);

// Add update/delete routes as needed..
// // Add these if not present
export const updateRoom = async (req, res, next) => { 
    try {
        const room = await RoomService.update(req.params.id, req.body, req.file);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        next(error);
    }
};
export const deleteRoom = async (req, res, next) => { 
    try {
        const room = await RoomService.delete(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        next(error);
    }
 };


export default router;