const logger = require('../utils/logger');
const ApiResponse = require('../utils/reponse');

module.exports = (err, req, res, next) => {
    logger.error('Error occurred', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return ApiResponse.error(res, errors.join(', '), 400);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return ApiResponse.error(res, 'Duplicate entry', 409);
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        return ApiResponse.error(res, 'Invalid ID format', 400);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return ApiResponse.error(res, message, statusCode);
};