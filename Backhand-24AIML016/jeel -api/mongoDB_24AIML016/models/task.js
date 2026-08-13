const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Title is required and must be a non-empty string'],
        trim: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: 'Title is required and must be a non-empty string'
        }
    },

    description: {
        type: String,
        trim: true
    },

    completed: {
        type: Boolean,
        default: false
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', taskSchema);