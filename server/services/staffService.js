const Attendance = require('../models/Attendance');
const Update = require('../models/Update');
const { format } = require('date-fns');

class StaffService {
    /**
     * Gathers all necessary data for the staff dashboard in one efficient call.
     * @param {string} staffId - The ID of the logged-in staff member.
     * @returns {Promise<object>} An object containing attendance status and recent updates.
     */
    async getDashboardData(staffId) {
        const today = format(new Date(), 'yyyy-MM-dd');

        // Run database queries concurrently for maximum efficiency
        const [todaysAttendance, recentUpdates] = await Promise.all([
            Attendance.findOne({ staffMember: staffId, date: today }),
            Update.find({}).sort({ createdAt: -1 }).limit(10).populate('author', 'name')
        ]);
        
        // Determine the current check-in/out status
        let attendanceStatus = 'Checked Out';
        if (todaysAttendance && !todaysAttendance.checkOutTime) {
            attendanceStatus = 'Checked In';
        }

        return {
            attendance: todaysAttendance,
            attendanceStatus,
            updates: recentUpdates
        };
    }
}

module.exports = new StaffService();