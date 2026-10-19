// ==========================================
// SERVER — server_events.js
// Practical 10: Asynchronous Event-Driven Architecture
// ==========================================
// Key points:
//  • require('./listeners') is called ONCE at startup to register
//    all EventEmitter handlers before any request arrives.
//  • Routes use the shared events.js emitter to fire events.
//  • The listener file (listeners.js) is the only place .on() is
//    called — clean separation of concerns.
// ==========================================

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const authRoutes  = require('./routes/auth');
const taskRoutes  = require('./routes/tasks_events');   // event-aware routes
const cache       = require('./cache');

// ==========================================
// REGISTER LISTENERS — must happen before any emit()
// ==========================================
require('./listeners');   // sets up task-created, task-deleted, task-error

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
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));


// ==========================================
// ROUTES
// ==========================================
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);


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

    if (err.name === 'ValidationError') {
        const errors = {};
        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }
        return res.status(400).json({
            error  : 'Validation Error',
            message: err.message,
            errors
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            error  : 'Invalid ID',
            message: 'Invalid ID format'
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            error  : 'Duplicate Error',
            message: 'A record with this value already exists'
        });
    }

    res.status(500).json({
        error  : 'Internal Server Error',
        message: err.message
    });

});


// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('EventEmitter listeners registered (listeners.js):');
    console.log('  • task-created  → async notification (2 s delay)');
    console.log('  • task-deleted  → async notification (2 s delay)');
    console.log('  • task-error    → error notification (immediate)');
});
