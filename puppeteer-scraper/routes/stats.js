const express = require("express");

const router = express.Router();
// const asyncHandle = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/reponse');
const asyncHandler = require("../middleware/asyncHandler");

module.exports = (articleService) => {
	router.get('/', asyncHandler(async (req, res) =>{
		const stats = await articleService.getStatistics();
		ApiResponse.success(res, stats[0]);
	}))

	// GET /api/v1/stats/categories - All categories

	router.get('/categories', asyncHandler(async (req, res) => {
		const categories = await articleService.getCategories();
		ApiResponse.success(res, categories);
	}));

	// GET /api/v1/stats/tags - All tags
	router.get('/tags', asyncHandler(async (req, res) => {
		const tags = await articleService.getAllTags();
		ApiResponse.success(res, tags);
	}));

	// GET /api/v1/stats/trending - Trending tags
	router.get('/trending', asyncHandler(async (req, res) => {
		const { days = 7, limit = 10 } = req.query;
		const trending = await articleService.getTrendingTags(
		parseInt(days),
		parseInt(limit)
		);
		ApiResponse.success(res, trending);
	}));

	// GET /api/v1/stats/count - Article count
	router.get('/count', asyncHandler(async (req, res) => {
		const { category } = req.query;
		const query = category ? { feedCategory: category } : {};
		const count = await articleService.countArticles(query);
		ApiResponse.success(res, { count });
	}));

	return router;
}