/**
 * Tasks API Integration Tests
 *
 * Tests the three core task endpoints:
 *   GET  /api/tasks        — returns 200 with an array
 *   GET  /api/tasks/:id    — returns 200 with task details
 *   POST /api/tasks        — creates a task and returns 201
 *
 * Strategy:
 *  - Register + login a test user at the start of the suite to obtain a JWT.
 *  - Use that JWT for all subsequent requests (Bearer token).
 *  - Seed one task in beforeAll so that GET /:id has something to fetch.
 *  - Clean up (delete the test user's tasks) in afterAll.
 */

const request  = require('supertest');
const path     = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { app, mongoose } = require('../app');
const Task = require('../models/task');
const User = require('../models/User');


// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const TEST_EMAIL    = `jest_tasks_${Date.now()}@test.com`;
const TEST_PASSWORD = 'JestPass123!';

let token   = '';   // JWT set after login
let taskId  = '';   // ID of the seeded task


// ────────────────────────────────────────────────────────────────────────────
// Suite setup / teardown
// ────────────────────────────────────────────────────────────────────────────

beforeAll(async () => {

    // Connect to MongoDB (reuse existing connection if already open)
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }

    // Register a fresh test user
    await request(app)
        .post('/api/auth/register')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    // Login and capture JWT
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    token = loginRes.body.token;

    // Seed one task so GET /:id has a real ID to fetch
    const seedRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Seeded test task', priority: 'low' });

    taskId = seedRes.body._id;

});


afterAll(async () => {

    // Clean up: remove all tasks and user created during the test
    const testUser = await User.findOne({ email: TEST_EMAIL });
    if (testUser) {
        await Task.deleteMany({ user: testUser._id });
        await User.deleteOne({ _id: testUser._id });
    }

    await mongoose.connection.close();

});


// ────────────────────────────────────────────────────────────────────────────
// Tests
// ────────────────────────────────────────────────────────────────────────────

describe('Tasks API Integration Tests', () => {

    // ── GET /api/tasks ──────────────────────────────────────────────────────

    it('GET /tasks returns status 200', async () => {

        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

    });


    // ── GET /api/tasks/:id ──────────────────────────────────────────────────

    it('GET /tasks/:id returns status 200 and task details', async () => {

        const res = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', taskId);
        expect(res.body).toHaveProperty('title', 'Seeded test task');

    });


    // ── POST /api/tasks ─────────────────────────────────────────────────────

    it('POST /tasks creates a task and returns status 201', async () => {

        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'New task via Jest', priority: 'high' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('title', 'New task via Jest');
        expect(res.body).toHaveProperty('priority', 'high');

    });

});
