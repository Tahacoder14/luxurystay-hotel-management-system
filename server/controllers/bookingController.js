import BookingService from '../services/bookingService.js';
import Booking from '../models/Booking.js';

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private (User must be logged in)
 */
export const createBooking = async (req, res, next) => {
    try {
        // The service layer handles the complex logic of checking for availability.
        // The controller simply passes the data along.
        const bookingData = { ...req.body, user: req.user.id };
        const booking = await BookingService.createBooking(bookingData);
        res.status(201).json(booking);
    } catch (error) {
        // If the service throws an error (e.g., "Room not available"), it gets passed here.
        next(error);
    }
};

/**
 * @desc    Get bookings for the currently logged-in user
 * @route   GET /api/bookings/mybookings
 * @access  Private (User must be logged in)
 */
export const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await BookingService.getBookingsForUser(req.user.id);
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single booking by its ID
 * @route   GET /api/bookings/:id
 * @access  Private (User must be logged in)
 */
export const getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('room', 'name type price imageUrl') // Get details from the Room model
            .populate('user', 'name email uniqueId');      // Get details from the User model
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // --- THE CRITICAL SECURITY FIX ---
        // This check ensures that a random logged-in user cannot view someone else's booking.
        // It allows access ONLY if the user's ID matches the booking's user ID, OR if the user is an 'Admin'.
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        next(error); // Pass any errors to the central error handler
    }
};
// ===================================
// --- ADMIN-ONLY FUNCTIONS ---
// ===================================

/**
 * @desc    Get all bookings in the system
 * @route   GET /api/bookings
 * @access  Private/Admin
 */
export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await BookingService.getAllBookings();
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Check a guest in for a booking
 * @route   PUT /api/bookings/:id/checkin
 * @access  Private/Admin
 */
export const checkInBooking = async (req, res, next) => {
    try {
        const booking = await BookingService.checkIn(req.params.id);
        res.json({ message: 'Guest checked in successfully.', booking });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Check a guest out from a booking
 * @route   PUT /api/bookings/:id/checkout
 * @access  Private/Admin
 */
export const checkOutBooking = async (req, res, next) => {
    try {
        const booking = await BookingService.checkOut(req.params.id);
        res.json({ message: 'Guest checked out successfully.', booking });
    } catch (error) {
        next(error);
    }
};