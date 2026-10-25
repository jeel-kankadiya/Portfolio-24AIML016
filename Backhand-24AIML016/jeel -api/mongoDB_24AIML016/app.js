const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const aiRoutes   = require('./routes/ai');
const cache      = require('./cache');

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

// Auth routes: /api/auth/register, /api/auth/login, /api/auth/me
app.use('/api/auth', authRoutes);

// Task routes: /api/tasks (all protected by JWT)
app.use('/api/tasks', taskRoutes);

// AI routes: /api/ai (protected by JWT, proxies Gemini — key never leaves server)
app.use('/api/ai', aiRoutes);


// ==========================================
// DEBUG — GET /api/debug/cache
// ==========================================

app.get('/api/debug/cache', (req, res) => {
    res.status(200).json(cache.stats());
});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    // Mongoose validation error
    if (err.name === 'ValidationError') {

        const errors = {};

        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }

        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            errors: errors
        });

    }

    // Invalid MongoDB ID
    if (err.name === 'CastError') {

        return res.status(400).json({
            error: 'Invalid ID',
            message: 'Invalid ID format'
        });

    }

    // Duplicate key error (e.g., duplicate email)
    if (err.code === 11000) {

        return res.status(400).json({
            error: 'Duplicate Error',
            message: 'A record with this value already exists'
        });

    }

    // Other errors
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });

});


module.exports = { app, mongoose };
