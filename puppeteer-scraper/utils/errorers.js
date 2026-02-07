class AppError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		Error.captureStackTrace(this, this.contructor);
	}
}

class ValidationError extends AppError {
	constructor(message) {
		super(message, 400);
		this.name = 'ValidationError';
	}
}

class NotFoundError extends AppError {
	constructor(message = 'Resource not found') {
		super(message, 404);
	}
}

module.exports = {
	AppError,
	ValidationError,
	NotFoundError
};
