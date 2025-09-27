const Booking = require('../models/Booking');
const Room = require('../models/Room');

class BookingService {
    // This is a critical function to prevent double-booking
    async isRoomAvailable(roomId, checkInDate, checkOutDate) {
        const conflictingBookings = await Booking.find({
            room: roomId,
            $or: [
                { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
            ],
            status: { $in: ['Upcoming', 'Checked-In'] } // Only consider active bookings
        });
        return conflictingBookings.length === 0;
    }

    async createBooking(bookingData) {
        const { room, checkInDate, checkOutDate } = bookingData;
        
        const isAvailable = await this.isRoomAvailable(room, checkInDate, checkOutDate);
        if (!isAvailable) {
            throw new Error('Room is not available for the selected dates.');
        }

        const newBooking = new Booking(bookingData);
        return await newBooking.save();
    }

    async getBookingsForUser(userId) {
        return await Booking.find({ user: userId }).populate('room').sort({ checkInDate: 1 });
    }
    
    async getAllBookings() {
        // Populate brings in the full Room and User details
        return await Booking.find({}).populate('room').populate('user', 'name email').sort({ checkInDate: -1 });
    }

    async checkIn(bookingId) {
        const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'Checked-In' }, { new: true });
        await Room.findByIdAndUpdate(booking.room, { status: 'Occupied' });
        return booking;
    }
    
    async checkOut(bookingId) {
        const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'Checked-Out' }, { new: true });
        // After checkout, the room needs to be cleaned
        await Room.findByIdAndUpdate(booking.room, { status: 'Cleaning' });
        // Here you would trigger invoice generation in a real system
        return booking;
    }
}

module.exports = new BookingService();