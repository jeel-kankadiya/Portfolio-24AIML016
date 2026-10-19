// ==========================================
// ROUTES — tasks_events.js
// Practical 10: Asynchronous Event-Driven Architecture
// ==========================================
// Standard CRUD routes for /api/tasks.
// On POST and DELETE, the event is emitted AFTER the HTTP
// response is sent — proving the response is non-blocking.
//
// Emit order (POST):
//   1. Save task to MongoDB
//   2. Log "[API] Response sent at <time>"
//   3. Send 201 response   ← client receives this immediately
//   4. emit('task-created', task)  ← handler runs ~2 s later
// ==========================================

const express    = require('express');
const Task       = require('../models/task');
const auth       = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');
const cache      = require('../cache');
const taskEvents = require('../events');          // ← shared emitter

const router = express.Router();


// ==========================================
// All task routes protected by JWT auth
// ==========================================
router.use(auth);


// ==========================================
// CACHE KEY HELPERS
// ==========================================
const allTasksKey = (userId) => `tasks_${userId}`;
const oneTaskKey  = (userId, taskId) => `task_${userId}_${taskId}`;


// ==========================================
// GET ALL TASKS — GET /api/tasks
// ==========================================
router.get('/', async (req, res, next) => {
    try {
        const cacheKey = allTasksKey(req.user.id);
        const cached   = cache.get(cacheKey);
        if (cached) return res.status(200).json(cached);

        const tasks = await Task.find({ user: req.user.id });
        cache.set(cacheKey, tasks);
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});


// ==========================================
// GET TASK BY ID — GET /api/tasks/:id
// ==========================================
router.get('/:id', async (req, res, next) => {
    try {
        const cacheKey = oneTaskKey(req.user.id, req.params.id);
        const cached   = cache.get(cacheKey);
        if (cached) return res.status(200).json(cached);

        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ error: 'Not Found', message: 'Task not found' });

        cache.set(cacheKey, task);
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});


// ==========================================
// CREATE TASK — POST /api/tasks
// ==========================================
// Step 3 (per lab spec):
//   save → log → res.json → emit
// The emit is placed AFTER res.json so the timestamp ordering
// in the console clearly proves non-blocking behaviour.

router.post('/', validateTask, async (req, res, next) => {
    try {
        const task = await Task.create({ ...req.body, user: req.user.id });

        // Invalidate all-tasks cache
        cache.del(allTasksKey(req.user.id));

        // ——— Log & send response FIRST ———
        console.log(`[API] Response sent at ${new Date().toISOString()}`);
        res.status(201).json(task);

        // ——— Emit event AFTER response is sent ———
        // Listener runs ~2 s later (see listeners.js)
        taskEvents.emit('task-created', task);

    } catch (err) {
        next(err);
    }
});


// ==========================================
// UPDATE TASK — PUT /api/tasks/:id
// ==========================================
router.put('/:id', validateTask, async (req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ error: 'Not Found', message: 'Task not found' });

        cache.del(allTasksKey(req.user.id), oneTaskKey(req.user.id, req.params.id));
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});


// ==========================================
// PARTIAL UPDATE — PATCH /api/tasks/:id
// ==========================================
router.patch('/:id', async (req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) return res.status(404).json({ error: 'Not Found', message: 'Task not found' });

        cache.del(allTasksKey(req.user.id), oneTaskKey(req.user.id, req.params.id));
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});


// ==========================================
// DELETE TASK — DELETE /api/tasks/:id  (Supplementary)
// ==========================================
// Same non-blocking pattern: respond first, emit after.

router.delete('/:id', async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ error: 'Not Found', message: 'Task not found' });

        cache.del(allTasksKey(req.user.id), oneTaskKey(req.user.id, req.params.id));

        // ——— Log & send response FIRST ———
        console.log(`[API] Response sent at ${new Date().toISOString()}`);
        res.status(200).json({ message: 'Task deleted successfully' });

        // ——— Emit event AFTER response ———
        taskEvents.emit('task-deleted', task);

    } catch (err) {
        next(err);
    }
});


// ==========================================
// TEST ERROR EVENT — POST /api/tasks/test/error-event
// (Supplementary) Triggers 'task-error' listener
// NOTE: Defined BEFORE /:id to prevent route conflict
// ==========================================
router.post('/test/error-event', (req, res) => {
    taskEvents.emit('task-error', new Error('Task title is required for notification processing'));
    res.status(200).json({
        message: 'task-error event emitted — check terminal for [Notification] error log'
    });
});


module.exports = router;
