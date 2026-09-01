const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');

const router = express.Router();


// ==========================================
// All task routes are protected by auth
// ==========================================

router.use(auth);


// ==========================================
// GET ALL TASKS — GET /tasks
// ==========================================

router.get('/', async (req, res, next) => {

    try {

        // Only return tasks belonging to the logged-in user
        const tasks = await Task.find({ user: req.user.id });

        res.status(200).json(tasks);

    } catch (err) {

        next(err);

    }

});


// ==========================================
// GET TASK BY ID — GET /tasks/:id
// ==========================================

router.get('/:id', async (req, res, next) => {

    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

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
// CREATE TASK — POST /tasks
// ==========================================

router.post('/', validateTask, async (req, res, next) => {

    try {

        const task = await Task.create({
            ...req.body,
            user: req.user.id
        });

        res.status(201).json(task);

    } catch (err) {

        next(err);

    }

});


// ==========================================
// UPDATE TASK — PUT /tasks/:id
// ==========================================

router.put('/:id', validateTask, async (req, res, next) => {

    try {

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
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
// PARTIAL UPDATE TASK — PATCH /tasks/:id
// ==========================================

router.patch('/:id', async (req, res, next) => {

    try {

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
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
// DELETE TASK — DELETE /tasks/:id
// ==========================================

router.delete('/:id', async (req, res, next) => {

    try {

        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

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


module.exports = router;
