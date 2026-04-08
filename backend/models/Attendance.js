// Attendance Model - Tracks student attendance records
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['present', 'absent'], // Only present or absent
        default: 'present'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    markedBy: {
        type: String, // Username of teacher who marked attendance
        required: true
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index to prevent duplicate attendance for same student on same date
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// Export the Attendance model
module.exports = mongoose.model('Attendance', attendanceSchema);
