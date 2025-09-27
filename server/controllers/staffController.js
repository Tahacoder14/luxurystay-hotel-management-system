const StaffService = require('../services/staffService');
const AttendanceService = require('../services/attendanceService'); // We'll create this next

// Gets all data needed for the staff dashboard
exports.getDashboardData = async (req, res, next) => {
    try {
        const data = await StaffService.getDashboardData(req.user.id);
        res.json(data);
    } catch (error) { next(error); }
};

// --- Staff Attendance Actions ---
exports.staffCheckIn = async (req, res, next) => {
    try {
        const record = await AttendanceService.checkIn(req.user.id);
        res.status(201).json(record);
    } catch (error) { next(error); }
};
exports.staffCheckOut = async (req, res, next) => {
    try {
        const record = await AttendanceService.checkOut(req.user.id);
        res.json(record);
    } catch (error) { next(error); }
};