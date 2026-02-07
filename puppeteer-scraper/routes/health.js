require('dotenv').config();
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const ApiResponse = require('../utils/reponse');

module.exports = (db) =>{
	router.get('/', async (req, res) => {
		
		const health = {
			status: 'OK',
			timestamp: new Date(),
			eviroment: process.env.NODE_ENV || 'development',
			service: {
				database: 'unknown',
				mongoose: 'unkown'
			},
			memory: {
				rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
				heapUsed: `${Math.round(process.memoryUsage().heapUsed /1024 /1024)}MB`
			}
		};

		try {
			//check db
			const dbHealth = await db.healthCheck();
			health.service.database = dbHealth.status;

			//check mongoose
			const mongooseState = mongoose.connection.readyState;
			const states = {
				0: 'disconnected',
				1: 'connected',
				2: 'connecting',
				3: 'disconnecting'
			};
			health.service.mongoose = states[mongooseState];

			//overall status

			if (dbHealth.status === 'unhealthy' || mongooseState !== 1) {
				health.status = 'unhealthy';
				return res.status(503).json(health);
			}

			res.json(health);
		} catch(error) {
			health.status = 'ERROR';
			health.error= error.message;
			res.status(500).json(health);
		}
	});
	return router;
}