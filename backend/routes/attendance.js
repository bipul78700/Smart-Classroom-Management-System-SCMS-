// Attendance Routes - Handle attendance marking and retrieval
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// POST /api/attendance - Mark attendance for a student
router.post('/', async (req, res) => {
    try {
        const { studentId, studentName, status, date, markedBy } = req.body;

        // Validate required fields
        if (!studentId || !studentName || !status || !markedBy) {
            return res.status(400).json({
                success: false,
                message: 'Please provide studentId, studentName, status, and markedBy'
            });
        }

        // Use current date if not provided
        const attendanceDate = date ? new Date(date) : new Date();

        // Check if attendance already exists for this student on this date
        const existingAttendance = await Attendance.findOne({
            studentId: studentId,
            date: attendanceDate
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked for this student today'
            });
        }

        // Create new attendance record
        const attendance = new Attendance({
            studentId,
            studentName,
            status,
            date: attendanceDate,
            markedBy
        });

        await attendance.save();

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            attendance: attendance
        });

    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while marking attendance'
        });
    }
});

// GET /api/attendance/date/:date - Get attendance for a specific date
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;

        // Create date range for the entire day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Find all attendance records for this date
        const attendanceRecords = await Attendance.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ studentName: 1 });

        res.json({
            success: true,
            count: attendanceRecords.length,
            attendance: attendanceRecords
        });

    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching attendance'
        });
    }
});

// GET /api/attendance/student/:studentId - Get attendance for a specific student
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find all attendance records for this student
        const attendanceRecords = await Attendance.find({
            studentId: studentId
        }).sort({ date: -1 }); // Most recent first

        // Calculate attendance statistics
        const totalDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter(record => record.status === 'present').length;
        const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

        res.json({
            success: true,
            studentId: studentId,
            totalDays: totalDays,
            presentDays: presentDays,
            absentDays: totalDays - presentDays,
            attendancePercentage: attendancePercentage + '%',
            attendance: attendanceRecords
        });

    } catch (error) {
        console.error('Get student attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching student attendance'
        });
    }
});

// GET /api/attendance/summary - Get attendance summary statistics
router.get('/summary', async (req, res) => {
    try {
        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get today's attendance
        const todayAttendance = await Attendance.find({
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        const presentCount = todayAttendance.filter(record => record.status === 'present').length;
        const absentCount = todayAttendance.filter(record => record.status === 'absent').length;

        // Get total unique students who have attendance records
        const uniqueStudents = await Attendance.distinct('studentId');

        res.json({
            success: true,
            totalStudents: uniqueStudents.length,
            todayPresent: presentCount,
            todayAbsent: absentCount,
            todayTotal: todayAttendance.length,
            attendanceRate: todayAttendance.length > 0
                ? ((presentCount / todayAttendance.length) * 100).toFixed(2) + '%'
                : '0%'
        });

    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching summary'
        });
    }
});

module.exports = router;
