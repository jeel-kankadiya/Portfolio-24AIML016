const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./models/Task');

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

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
// GET ALL TASKS
// ==========================================

app.get('/tasks', async (req, res, next) => {

    try {

        const tasks = await Task.find();

        res.status(200).json(tasks);

    } catch (err) {

        next(err);

    }

});


// ==========================================
// GET TASK BY ID
// ==========================================

app.get('/tasks/:id', async (req, res, next) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {

            return res.status(404).json({
                error: 'Not Found',
                message: 'Task not found'
            });

        }

        res.status(200).json(task);

    } catch (err) {

        next(err);

    }

});


// ==========================================
// CREATE TASK
// ==========================================

app.post('/tasks', async (req, res, next) => {

    try {

        const task = await Task.create(req.body);

        res.status(201).json(task);

    } catch (err) {

        next(err);

    }

});


// ==========================================
// UPDATE TASK - PUT
// ==========================================

app.put('/tasks/:id', async (req, res, next) => {

    try {

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {

            return res.status(404).json({
                error: 'Not Found',
                message: 'Task not found'
            });

        }

        res.status(200).json(task);

    } catch (err) {

        next(err);

    }

});


// ==========================================
// PARTIAL UPDATE TASK - PATCH
// ==========================================

app.patch('/tasks/:id', async (req, res, next) => {

    try {

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {

            return res.status(404).json({
                error: 'Not Found',
                message: 'Task not found'
            });

        }

        res.status(200).json(task);

    } catch (err) {

        next(err);

    }

});


// ==========================================
// DELETE TASK
// ==========================================

app.delete('/tasks/:id', async (req, res, next) => {

    try {

        const task = await Task.findByIdAndDelete(
            req.params.id
        );

        if (!task) {

            return res.status(404).json({
                error: 'Not Found',
                message: 'Task not found'
            });

        }

        res.status(200).json({
            message: 'Task deleted successfully'
        });

    } catch (err) {

        next(err);

    }

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
            message: 'Invalid task ID'
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

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});