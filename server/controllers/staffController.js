import StaffService from '../services/staffService.js';
import AttendanceService from '../services/attendanceService.js';

// Gets all data needed for the staff dashboard
export const getDashboardData = async (req, res, next) => {
    try {
        const data = await StaffService.getDashboardData(req.user.id);
        res.json(data);
    } catch (error) { next(error); }
};

// --- Staff Attendance Actions ---
export const staffCheckIn = async (req, res, next) => {
    try {
        const record = await AttendanceService.checkIn(req.user.id);
        res.status(201).json(record);
    } catch (error) { next(error); }
};
export const staffCheckOut = async (req, res, next) => {
    try {
        const record = await AttendanceService.checkOut(req.user.id);
        res.json(record);
    } catch (error) { next(error); }
};