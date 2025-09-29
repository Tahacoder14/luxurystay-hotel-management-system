import Attendance from '../models/Attendance.js';
import { format } from 'date-fns';

/**
 * A professional service class to handle all attendance-related business logic.
 */
class AttendanceService {
    /**
     * Checks a staff member in for the current day.
     * @param {string} staffId - The ID of the staff member checking in.
     * @returns {Promise<Document>} The new attendance record.
     */
    async checkIn(staffId) {
        const today = format(new Date(), 'yyyy-MM-dd');
        const existingRecord = await Attendance.findOne({ staffMember: staffId, date: today });
        
        // Prevent duplicate check-ins
        if (existingRecord) {
            throw new Error('You have already checked in for today.');
        }
        
        const record = new Attendance({ 
            staffMember: staffId, 
            checkInTime: new Date(), 
            date: today 
        });

        return await record.save();
    }

    /**
     * Checks a staff member out for the current day.
     * @param {string} staffId - The ID of the staff member checking out.
     * @returns {Promise<Document>} The updated attendance record.
     */
    async checkOut(staffId) {
        const today = format(new Date(), 'yyyy-MM-dd');
        const record = await Attendance.findOne({ staffMember: staffId, date: today });
        
        // Prevent checking out if not checked in or already checked out
        if (!record || record.checkOutTime) {
            throw new Error('No active check-in found to check out from.');
        }

        record.checkOutTime = new Date();
        return await record.save();
    }
}

export default new AttendanceService();