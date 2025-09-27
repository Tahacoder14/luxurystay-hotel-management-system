const mongoose = require('mongoose');
const AttendanceSchema = new mongoose.Schema({
    staffMember: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date},
    date: { type: String, required: true }, // YYYY-MM-DD for easy querying
}, { timestamps: true });
module.exports = mongoose.model('Attendance', AttendanceSchema);