// ==========================================
// LISTENERS.JS — Event listener registration
// Practical 10: Asynchronous Event-Driven Architecture
// ==========================================
// This file is required ONCE at server startup (in server.js).
// Registering listeners here — separate from the route file —
// demonstrates the decoupled, event-driven design pattern.
//
// Events handled:
//   task-created  → background notification with 2 s delay
//   task-deleted  → supplementary: deletion notification
//   task-error    → supplementary: error handler / safety net
// ==========================================

const taskEvents = require('./events');


// ==========================================
// task-created LISTENER
// ==========================================
// Runs AFTER the API has already sent its 201 response.
// The artificial 2-second delay makes the non-blocking
// behaviour visible in the console timestamp ordering.

taskEvents.on('task-created', async (task) => {

    // Simulate slow work: e.g. sending an email, analytics ping
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(
        `[Notification] Task "${task.title}" created at ${new Date().toISOString()}, assigned to ${task.assignedTo || task.user}`
    );
    console.log(`[Notification] Handler finished at ${new Date().toISOString()}`);

});


// ==========================================
// task-deleted LISTENER  (Supplementary)
// ==========================================

taskEvents.on('task-deleted', async (task) => {

    // Simulate async cleanup
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(
        `[Notification] Task "${task.title}" (ID: ${task._id}) deleted at ${new Date().toISOString()}`
    );
    console.log(`[Notification] Handler finished at ${new Date().toISOString()}`);

});


// ==========================================
// task-error LISTENER  (Supplementary)
// ==========================================
// Safety net: catches and logs any error emitted during
// task processing without crashing the server.
// NOTE: EventEmitter reserves the name 'error' — an unhandled
// 'error' event would throw and crash the process.
// 'task-error' is used here as the safe custom name.

taskEvents.on('task-error', (err) => {

    console.error(
        `[Notification] Error in task processing at ${new Date().toISOString()}: ${err.message}`
    );

});
