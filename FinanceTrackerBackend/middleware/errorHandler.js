const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Email already exists'
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({
            message: messages.join(', ')
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }

    // Default error
    res.status(500).json({
        message: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'An unexpected error occurred'
    });
};

module.exports = errorHandler;