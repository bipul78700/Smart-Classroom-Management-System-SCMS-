// Authentication Routes - Handle user login
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate input
        if (!username || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, password, and role'
            });
        }

        // Find user in database
        const user = await User.findOne({ username: username.toLowerCase() });

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if role matches
        if (user.role !== role.toLowerCase()) {
            return res.status(401).json({
                success: false,
                message: 'Invalid role selected for this user'
            });
        }

        // Compare password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Login successful - return user information (excluding password)
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// GET /api/auth/users - Get all users (for admin purposes)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password field
        res.json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
