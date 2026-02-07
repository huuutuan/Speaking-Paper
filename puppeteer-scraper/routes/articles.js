const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate')
const validators = require('../validators/article')
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/reponse');

module.exports = (articleService) => {
	// GET /api/v1/articles - recent articles
	router.get('/',
		validate(validators.getArticles),
		asyncHandler(async (req, res) => {
			const {category, page, limit, hasAudio } = req.query;
			console.log(category, page, limit, hasAudio);
			
			const result = await articleService.getArticles({category, page, limit, hasAudio} );
			ApiResponse.success(res, result.articles, result.pagination);
		})
	);

	// GET /api/v1/articles/:id - Get by ID

	router.get('/:id', asyncHandler(async (req,res) => {
		const article = await articleService.findById(req.params.id);

		if (!article) {
			return ApiResponse.error(res, 'Article not found', 404);
		}

		await articleService.incrementViews(req.params.id);
		ApiResponse.success(res, article);
	}));

	//GET /api/v1/articles/category/:category - By category with pagination
	router.get('/category/:category',
		validate(validators.getArticlesByCategory),
		asyncHandler(async (req, res) => {
			const {page, limit} = req.query;
			const result = await articleService.getByCategory(
				req.params.category,
				page,
				limit
			);
			ApiResponse.success(res, result.articles, result.pagination);
		})
	);

	//get /api/v1/articles/search - Full-text search
	router.get('/search',
		validate(validators.searchArticles),
		asyncHandler(async (req, res) => {
			const {q, category, limit } = req.query;
			const articles = await articleService.searchArticles(q, { category, limit });
			ApiResponse.success(res, articles);
		})
	);

	//Get /api/v1/articles/tags/:tags - By tags (comma-separated)
	router.get('/tags/:tags', asyncHandler(async (req, res) => {
		const tags = req.params.tags.split(',');
		const { limit = 20 } = req.query;
		const articles = await articleService.fingByTag(tags, parseInt(limit));
		ApiResponse.success(res, articles);
	}));

	// GET /api/v1/articles/author/:author - By author
	router.get('/author/:author', asyncHandler(async (req,res) => {
		const {limit = 20} = req.query;
		const articles = await articleService.findByAuthor(
			req.params.author,
			parseInt(limit)
		);
		ApiResponse.success(res, articles);
	}));

	// GET /api/v1/articles/

	return router;
};