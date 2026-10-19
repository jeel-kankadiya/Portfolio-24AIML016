// ==========================================
// EVENTS.JS — Custom EventEmitter class
// Practical 10: Asynchronous Event-Driven Architecture
// ==========================================
// Creates a dedicated TaskEvents class extending the built-in
// Node.js EventEmitter. A single shared instance is exported
// so every module (routes, listeners, server) references the
// exact same emitter object.
// ==========================================

const EventEmitter = require('events');

class TaskEvents extends EventEmitter {}

module.exports = new TaskEvents();
