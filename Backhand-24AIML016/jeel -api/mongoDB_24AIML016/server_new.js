const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

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

// Auth routes: /register, /login, /me
app.use('/', authRoutes);

// Task routes: /tasks (all protected by JWT)
app.use('/tasks', taskRoutes);


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