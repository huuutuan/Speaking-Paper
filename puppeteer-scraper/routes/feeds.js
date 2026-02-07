const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const feedsConfig = require('../config/feeds');
const ApiResponse = require("../utils/reponse");

const router = express.Router();

module.exports = (queueService) => {
	router.post('/fetch', asyncHandler(async (req, res) => {
		const { categories } = req.body;

		let feeds = feedsConfig.feeds;

		if (categories && categories.length > 0) {
			feeds = feeds.filter(f => categories.includes(f.category));
		}

		if (feeds.length === 0) {
			return ApiResponse.error(res, 'no feeds found', 404);
		}

		const jobs = await queueService.addBulkFeedJobs(feeds);

		ApiResponse.success(res, {
			jobsAdded: jobs.length,
			feeds: feeds.map(f => f.category)
		}, 'fetch jobs added to queue', 202);
	}));

	// GET /api/v1/feeds/status - Queue status
	router.get('/status', asyncHandler(async (req,res) => {
		const stats = await queueService.getStats();
		ApiResponse.success(res, stats);
	}));

	// GET /api/v1/feeds/list - List all configured feeds
	router.get('/list', asyncHandler(async (req, res) => {
		ApiResponse.success(res, feedsConfig.feeds);
	}));

    // POST /api/v1/feeds/pause - Pause queue
    router.post('/pause', asyncHandler(async (req, res) => {
        await queueService.pause();
        ApiResponse.success(res, null, 'Queue paused');
    }));

    // POST /api/v1/feeds/resume - Resume queue
    router.post('/resume', asyncHandler(async (req, res) => {
        await queueService.resume();
        ApiResponse.success(res, null, 'Queue resumed');
    }));

    return router;
};