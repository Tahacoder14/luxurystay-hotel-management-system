import Room from  '../models/Room.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

class DashboardService {
    async getStats() {
        // Run all database queries at the same time for maximum speed
        const [
            totalRooms, 
            occupiedRooms,
            recentGuests // The new data for your "Guest List"
        ] = await Promise.all([
            Room.countDocuments(),
            Room.countDocuments({ status: 'Occupied' }),
            User.find({ role: 1 }).sort({ createdAt: -1 }).limit(5).select('name email createdAt')
        ]);

        const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
        
        // This is a more accurate calculation for today's check-ins
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todaysCheckIns = await Booking.countDocuments({
            checkInDate: { $gte: startOfToday }
        });
        
        // Placeholder for a more complex calculation you could add later
        const todaysRevenue = 4520;

        return { totalRooms, occupiedRooms, occupancyRate, todaysCheckIns, todaysRevenue, recentGuests };
    }
}
export default new DashboardService();