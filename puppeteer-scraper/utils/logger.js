const winston = require('winston');
const config = require('../config/config');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
    level: config.logging.level,
    format: winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	winston.format.errors({ stack: true }),
	winston.format.json()
    ),
    defaultMeta: { service: 'rss-tracker' },
    transports: [
	new winston.transports.File({ 
	    filename: config.logging.errorFile, 
	    level: 'error',
	    maxsize: 5242880, // 5MB
	    maxFiles: 5
	}),
	new winston.transports.File({ 
	    filename: config.logging.combinedFile,
	    maxsize: 5242880,
	    maxFiles: 5
	})
    ]
});

if (config.env !== 'production') {
    logger.add(new winston.transports.Console({
	format: winston.format.combine(
	    winston.format.colorize(),
	    winston.format.simple()
	)
    }));
}

module.exports = logger;

// Sử dụng
// const logger = require('./utils/logger');
// logger.info('Server started');
// logger.error('Database error', { error: err });