const express = require('express');
const router = express.Router();

// --- THE DEFINITIVE FIX IS HERE ---
// We are ensuring that ALL functions used in the routes below, including the
// missing 'getBookingById', are correctly imported from the controller file.
const { 
    createBooking, 
    getMyBookings, 
    getAllBookings, 
    checkInBooking, 
    checkOutBooking,
    getBookingById // <-- THIS WAS THE MISSING PIECE
} = require('../controllers/bookingController');

const { protect, admin } = require('../middleware/authMiddleware');

// === Guest Routes (must be a logged-in user) ===
router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);

// === Admin Routes (must be a logged-in admin) ===
router.get('/', protect, admin, getAllBookings);
router.put('/:id/checkin', protect, admin, checkInBooking);
router.put('/:id/checkout', protect, admin, checkOutBooking);

// === Shared Route (accessible by owner or admin) ===
// This route is now a clean, professional, REST-compliant endpoint.
// It is protected, so only logged-in users can access it. The logic inside
// the controller will further check if they are the owner or an admin.
router.get('/:id', protect, getBookingById);

module.exports = router;