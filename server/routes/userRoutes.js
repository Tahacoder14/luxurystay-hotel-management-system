import express from 'express';
const router = express.Router();
// Add 'createStaff' to the import list
import { getStaff, getGuests, updateUserStatus, updateUserRole, deleteUser, createStaff } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/staff', protect, admin, getStaff);
router.get('/guests', protect, admin, getGuests);

// --- NEW ROUTE ---
router.post('/staff', protect, admin, createStaff); // Route to create a new staff member

router.put('/:id/status', protect, admin, updateUserStatus);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

export default router;