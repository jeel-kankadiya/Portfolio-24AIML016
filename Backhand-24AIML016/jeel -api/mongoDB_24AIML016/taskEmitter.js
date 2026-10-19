// ==========================================
// TASK EMITTER — taskEmitter.js
// ==========================================
// Shared EventEmitter instance used across the application.
// Routes emit events; listeners (wired in server) handle them
// asynchronously — demonstrating non-blocking event-driven design.
// ==========================================

const EventEmitter = require('events');

const taskEmitter = new EventEmitter();

module.exports = taskEmitter;
