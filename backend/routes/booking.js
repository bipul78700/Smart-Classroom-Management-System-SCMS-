// Booking Routes - Handle resource booking management
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings - Create a new resource booking
router.post('/', async (req, res) => {
    try {
        const { resourceName, timeSlot, date, bookedBy, purpose } = req.body;

        // Validate required fields
        if (!resourceName || !timeSlot || !date || !bookedBy || !purpose) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: resourceName, timeSlot, date, bookedBy, purpose'
            });
        }

        // Check if booking already exists for this resource, date, and time slot
        const bookingDate = new Date(date);
        const existingBooking = await Booking.findOne({
            resourceName: resourceName,
            date: bookingDate,
            timeSlot: timeSlot,
            status: 'confirmed'
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: `This ${resourceName} is already booked for ${timeSlot} on ${bookingDate.toDateString()}`
            });
        }

        // Create new booking
        const booking = new Booking({
            resourceName,
            timeSlot,
            date: bookingDate,
            bookedBy,
            purpose
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Resource booked successfully',
            booking: booking
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating booking'
        });
    }
});

// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ date: 1, timeSlot: 1 }); // Sort by date and time

        res.json({
            success: true,
            count: bookings.length,
            bookings: bookings
        });

    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings'
        });
    }
});

// GET /api/bookings/date/:date - Get bookings for a specific date
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;

        // Create date range for the entire day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Find all bookings for this date
        const bookings = await Booking.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ timeSlot: 1 });

        res.json({
            success: true,
            count: bookings.length,
            bookings: bookings
        });

    } catch (error) {
        console.error('Get date bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching bookings'
        });
    }
});

// GET /api/bookings/resource/:resourceName - Get bookings for a specific resource
router.get('/resource/:resourceName', async (req, res) => {
    try {
        const { resourceName } = req.params;

        const bookings = await Booking.find({
            resourceName: resourceName
        }).sort({ date: 1, timeSlot: 1 });

        res.json({
            success: true,
            count: bookings.length,
            bookings: bookings
        });

    } catch (error) {
        console.error('Get resource bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching resource bookings'
        });
    }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Cancel the booking
        booking.status = 'cancelled';
        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            booking: booking
        });

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while cancelling booking'
        });
    }
});

module.exports = router;
