// Booking Model - Tracks classroom resource bookings
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    resourceName: {
        type: String,
        required: true,
        enum: ['Projector', 'Computer Lab', 'Science Lab', 'Smart Board', 'Audio System', 'Library'],
    },
    timeSlot: {
        type: String,
        required: true,
        enum: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00']
    },
    date: {
        type: Date,
        required: true
    },
    bookedBy: {
        type: String, // Username of person who made the booking
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'confirmed',
        enum: ['confirmed', 'cancelled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index to prevent duplicate bookings for same resource, date, and time
bookingSchema.index({ resourceName: 1, date: 1, timeSlot: 1 }, { unique: true });

// Export the Booking model
module.exports = mongoose.model('Booking', bookingSchema);
