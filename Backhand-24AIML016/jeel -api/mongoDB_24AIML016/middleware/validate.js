// ==========================================
// VALIDATION MIDDLEWARE
// ==========================================
// Checks required fields before reaching
// MongoDB or controllers
// ==========================================


// ==========================================
// Validate Register Input
// ==========================================

const validateRegister = (req, res, next) => {

    const { email, password } = req.body;

    const errors = {};

    // Check email
    if (!email || !email.trim()) {
        errors.email = 'Email is required';
    } else {
        // Simple email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Please provide a valid email address';
        }
    }

    // Check password
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    // If there are errors, return 400
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Please fix the following errors',
            errors: errors
        });
    }

    next();

};


// ==========================================
// Validate Task Input
// ==========================================

const validateTask = (req, res, next) => {

    const { title } = req.body;

    const errors = {};

    // Check title
    if (!title || !title.trim()) {
        errors.title = 'Task title is required and cannot be empty';
    }

    // If there are errors, return 400
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Please fix the following errors',
            errors: errors
        });
    }

    next();

};


module.exports = { validateRegister, validateTask };
