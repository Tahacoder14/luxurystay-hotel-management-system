const Attendance = require('../models/Attendance');
const { format } = require('date-fns');

// @desc    Staff member checks in for the day
exports.checkIn = async (req, res, next) => {
    try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const existingRecord = await Attendance.findOne({ staffMember: req.user.id, date: today });
        if (existingRecord) {
            return res.status(400).json({ message: 'Already checked in for today.' });
        }
        const record = new Attendance({ staffMember: req.user.id, checkInTime: new Date(), date: today });
        await record.save();
        res.status(201).json(record);
    } catch (error) { next(error); }
};

// @desc    Staff member checks out for the day
exports.checkOut = async (req, res, next) => {
    try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const record = await Attendance.findOne({ staffMember: req.user.id, date: today });
        if (!record || record.checkOutTime) {
            return res.status(400).json({ message: 'No active check-in found for today.' });
        }
        record.checkOutTime = new Date();
        await record.save();
        res.json(record);
    } catch (error) { next(error); }
};

// @desc    Admin gets all attendance records
exports.getAllAttendance = async (req, res, next) => {
    try {
        const records = await Attendance.find({}).populate('staffMember', 'name').sort({ checkInTime: -1 });
        res.json(records);
    } catch (error) { next(error); }
};