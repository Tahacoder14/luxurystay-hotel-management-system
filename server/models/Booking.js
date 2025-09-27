const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    // --- THE DETAILED GUEST INFO UPGRADE ---
    guestDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        specialRequests: { type: String, default: '' },
    },
    status: {
        type: String,
        required: true,
        enum: ['Upcoming', 'Checked-In', 'Checked-Out', 'Cancelled'],
        default: 'Upcoming',
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);