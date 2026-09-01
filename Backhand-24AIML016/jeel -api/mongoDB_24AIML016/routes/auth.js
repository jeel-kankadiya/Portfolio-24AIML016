const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validateRegister } = require('../middleware/validate');

const router = express.Router();


// ==========================================
// REGISTER — POST /register
// ==========================================

router.post('/register', validateRegister, async (req, res, next) => {

    try {

        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                error: 'Bad Request',
                message: 'User with this email already exists'
            });

        }

        // Create new user (password will be hashed by pre-save hook)
        const user = await User.create({ email, password });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (err) {

        next(err);

    }

});


// ==========================================
// LOGIN — POST /login
// ==========================================

router.post('/login', async (req, res, next) => {

    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {

            return res.status(400).json({
                error: 'Bad Request',
                message: 'Email and password are required'
            });

        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid email or password'
            });

        }

        // Compare password using bcrypt
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {

            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid email or password'
            });

        }

        // Generate JWT token — expires in 1 hour
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (err) {

        next(err);

    }

});


// ==========================================
// GET CURRENT USER — GET /me
// ==========================================

router.get('/me', auth, async (req, res, next) => {

    try {

        const user = await User.findById(req.user.id).select('-password');

        if (!user) {

            return res.status(404).json({
                error: 'Not Found',
                message: 'User not found'
            });

        }

        res.status(200).json({
            id: user._id,
            email: user.email,
            createdAt: user.createdAt
        });

    } catch (err) {

        next(err);

    }

});


module.exports = router;
