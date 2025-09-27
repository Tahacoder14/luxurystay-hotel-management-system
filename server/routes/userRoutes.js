// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
// Add 'createStaff' to the import list
const { getStaff, getGuests, updateUserStatus, updateUserRole, deleteUser, createStaff } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/staff', protect, admin, getStaff);
router.get('/guests', protect, admin, getGuests);

// --- NEW ROUTE ---
router.post('/staff', protect, admin, createStaff); // Route to create a new staff member

router.put('/:id/status', protect, admin, updateUserStatus);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;