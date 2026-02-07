const mongoose = require('mongoose');
const config = require('../config/config');
const logger = require('../utils/logger');

class DatabaseService {
	constructor() {
		this.mongoose = mongoose;
		this.isConnected = false;
	}

	async connect() {
		if (this.isConnected) return;
			
		try {
			await mongoose.connect(config.mongodb.url, config.mongodb.option);
			this.isConnected = true;

			// Event Listeners
			mongoose.connection.on('connected', () => {
				logger.info('Mongoose connected to mongoDB');
			})

			mongoose.connection.on('error', (err) => {
				logger.error('Mongoose connection error:', { error: err });
			});

			mongoose.connection.on('disconnected', () => {
				logger.warn('Mongoose disconnected from mongoDB');
				this.isConnected = false;
			});

			// graceful shutdown
			process.on('SIGINT', async () => {
				await mongoose.connection.close();
				process.exit(0);
			});

			logger.info('Database connection established.');
		} catch (error) {
			logger.error('Database connection error:', { error: error.message });
			throw error;
			
		}
		
	}

	getConnection() {
		return mongoose.connection;
	}

	getCollection(name) {
		return mongoose.connection.collection(name);
	}

	async healthCheck() {
		try {
			const state = mongoose.connection.readyState;
			if (state === 1) {
				await mongoose.connection.db.admin().ping();
				return {
					status: 'healthy',
					message: 'MongoDB connected'
				};
			}
			return {
				status: 'unhealthy',
				message: 'MongoDB not connected'
			};
		} catch (error) {
			return {
				status: 'unhealthy',
				message: `MongoDB health check failed: ${error.message}`
			};
		}
	}

	async close() {
		if (this.isConnected) {
			await mongoose.connection.close();
			this.isConnected = false;
			logger.info('Database connection closed.');
		}
	}
}

let instance = null;

module.exports = {
	getInstance() {
		if (!instance) {
			instance = new DatabaseService();
		}
		return instance;
	}
}