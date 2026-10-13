const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const cache      = require('./cache');          // Practical 8 — shared cache

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });


// ==========================================
// ROUTES
// ==========================================

// Auth routes: /api/auth/register, /api/auth/login, /api/auth/me
app.use('/api/auth', authRoutes);

// Task routes: /api/tasks (all protected by JWT)
app.use('/api/tasks', taskRoutes);


// ==========================================
// DEBUG — GET /api/debug/cache
// ==========================================
// Returns live cache hit/miss counters and the list of active keys.
// Supplementary task: cache-hit/miss counter endpoint.

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


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});