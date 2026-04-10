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

// POST /api/auth/register - Register a new user (Student or Teacher)
router.post('/register', async (req, res) => {
    try {
        const { username, password, fullName, email, role } = req.body;

        // Validate input
        if (!username || !password || !fullName || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const lowerRole = role.toLowerCase();

        // Check if role is valid for registration (prevent admin registration here)
        if (lowerRole !== 'student' && lowerRole !== 'teacher') {
            return res.status(400).json({
                success: false,
                message: 'Can only register as student or teacher via this portal'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username is already taken'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username: username.toLowerCase(),
            password: hashedPassword,
            fullName,
            email,
            role: lowerRole
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful! You can now log in.',
            user: {
                id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                role: newUser.role,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
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
