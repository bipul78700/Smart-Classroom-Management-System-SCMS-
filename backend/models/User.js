// User Model - Stores information about students, teachers, and admins
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Each username must be unique
        trim: true // Remove extra whitespace
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'admin'], // Only these three roles are allowed
        lowercase: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
