const express = require('express');
const Task     = require('../models/task');
const auth     = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');
const cache    = require('../cache');

const router = express.Router();


// ==========================================
// All task routes are protected by auth
// ==========================================

router.use(auth);


// ==========================================
// CACHE KEY HELPERS
// Per-user keys ensure one user's cache never leaks to another.
// Format matches terminal log output: tasks_<userId>
// ==========================================

const allTasksKey  = (userId) => `tasks_${userId}`;
const oneTaskKey   = (userId, taskId) => `task_${userId}_${taskId}`;


// ==========================================
// GET ALL TASKS — GET /tasks
// ==========================================

router.get('/', async (req, res, next) => {

    try {

        const cacheKey = allTasksKey(req.user.id);

        // ——— Cache CHECK ———
        const cached = cache.get(cacheKey);
        if (cached) {
            // Return cached data immediately (CACHE HIT)
            return res.status(200).json(cached);
        }

        // ——— Cache MISS: query MongoDB ———
        const tasks = await Task.find({ user: req.user.id });

        // Store result in cache with default TTL (60 s)
        cache.set(cacheKey, tasks);

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

        const cacheKey = oneTaskKey(req.user.id, req.params.id);

        // ——— Cache CHECK ———
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        // ——— Cache MISS ———
        const task = await Task.findOne({
            _id : req.params.id,
            user: req.user.id
        });

        if (!task) {

            return res.status(404).json({
                error  : 'Not Found',
                message: 'Task not found'
            });

        }

        // Cache single-task result
        cache.set(cacheKey, task);

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

        // ——— INVALIDATE all-tasks cache for this user ———
        cache.del(allTasksKey(req.user.id));

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
                new          : true,
                runValidators: true
            }
        );

        if (!task) {

            return res.status(404).json({
                error  : 'Not Found',
                message: 'Task not found'
            });

        }

        // ——— INVALIDATE both all-tasks and the specific task caches ———
        cache.del(
            allTasksKey(req.user.id),
            oneTaskKey(req.user.id, req.params.id)
        );

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
                new          : true,
                runValidators: true
            }
        );

        if (!task) {

            return res.status(404).json({
                error  : 'Not Found',
                message: 'Task not found'
            });

        }

        // ——— INVALIDATE both caches ———
        cache.del(
            allTasksKey(req.user.id),
            oneTaskKey(req.user.id, req.params.id)
        );

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
            _id : req.params.id,
            user: req.user.id
        });

        if (!task) {

            return res.status(404).json({
                error  : 'Not Found',
                message: 'Task not found'
            });

        }

        // ——— INVALIDATE both caches ———
        cache.del(
            allTasksKey(req.user.id),
            oneTaskKey(req.user.id, req.params.id)
        );

        res.status(200).json({
            message: 'Task deleted successfully'
        });

    } catch (err) {

        next(err);

    }

});


module.exports = router;
