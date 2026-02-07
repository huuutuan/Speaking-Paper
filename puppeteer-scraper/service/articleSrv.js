const Article = require('../models/articleModel');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');
const ArticleAudio = require('../models/articleAudioModel');
const { log } = require('winston');

dayjs.extend(utc);
dayjs.extend(tz);

class ArticleService {
	constructor() {
		this.Article = Article;
		this.collection = null;
		this.connection = null;
	}

	initialize(dbConnection) {
		if (!dbConnection ) throw new Error('Database connection is required to initialize ArticleService');
		this.connection = dbConnection;
		this.collection = this.connection.collection('articles');
	}

	// Operations

	async createArticle(data) {
		try {
			const article = new this.Article(data);
			await article.save();
			return article;
		} catch (error) {
			if (error.code === 11000) return null; //duplicate
			throw error;
		}
	}

	async findById(id) {
		return await Article.findById(id).lean();
	}

	async getRecent(limit = 10, category = null) {
		return await Article.findRecent(limit, category);
	}

	async getByCategory(category, page = 1, limit = 20) {
		page = Math.max(Number(page) || 1, 1);
		limit = Math.max(Number(limit) || 20, 1);

		const skip = (page - 1) * limit;

		const filter = { feedCategory: category };

		const [articles, total] = await Promise.all([
			Article.find(filter)
			.sort({ pubDate: -1, _id: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
			Article.countDocuments(filter)
		]);

		return {
			articles,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		};
	}


	async searchArticle (keyword, options = {}) {
		return await Article.searchArticles(keyword, options);
	}

	async findByTags(tags, limit = 20) {
		return await Article.find({
			tags: { $in: tags.map(t => t.toLowerCase())}
		})
		.sort({pubDate: -1})
		.limit(limit)
		.lean();
	}

	async findByAuthor(author, limit = 20) {
		return await Article.find({
			author: new RegExp(author, 'i')
		})
		.sort({pubDate: -1})
		.limit(limit)
		.lean();
	}

	async incrementViews(id) {
		return await Article.findByIdAndUpdate(
			id,
			{$inc: { viewCount: 1}},
			{ new: true, lean: true }		
		);
	}

	// RAW mongoDB operations

	async bulkInsert(articles) {
  if (!articles || articles.length === 0) {
    return {
      success: true,
      inserted: 0,
      duplicates: 0,
      insertedIds: []
    };
  }

  const ops = articles.map(article => ({
    insertOne: { document: article }
  }));

  try {
    const result = await this.collection.bulkWrite(ops, {
      ordered: false
    });

    const insertedIds = Object.values(result.insertedIds || {});
    const inserted = result.insertedCount || 0;
    const duplicates = articles.length - inserted;

    return {
      success: true,
      inserted,
      duplicates,
      insertedIds
    };

  } catch (err) {
    // 🔥 TRƯỜNG HỢP QUAN TRỌNG: duplicate key
    if (err.name === 'MongoBulkWriteError') {
      const result = err.result || {};

      const insertedIds = Object.values(result.insertedIds || {});
      const inserted = result.insertedCount || 0;
      const duplicates = articles.length - inserted;

      return {
        success: true,
        inserted,
        duplicates,
        insertedIds
      };
    }

    // ❌ lỗi khác thì throw thật
    throw err;
  }
}



	async getStatistics() {
		return await this.collection.aggregate([
			{
				$facet: {
					overview: [
						{
							$group: {
								_id: null,
								total: { $sum: 1 },
								withContent: {
									$sum: {$cond: ['$contentFetched', 1, 0] }
								},
								avgWordCount: { $avg: '$wordCount' },
								totalViews: { $sum: '$viewCount' }
							}
						}
					],

					byCategory: [
						{
							$group: {
								_id: '$feedCategory',
								count: { $sum: 1},
								avgWordCount: {$avg: '$wordCount' },
								latestArticle: { $max: '$pubDate' }
							}
						},
						{ $sort : {count: -1}}
					],

					topTags: [
						{ $unwind: '$tags'},
						{ $group: { _id: '$tags', count: { $sum: 1 } } },
						{ $sort: { count: -1 } },
						{ $limit: 20 }
					],

					topAuthors: [
						{ 
							$match: { 
								author: { $nin: [null, ''] } 
							} 
						}
					]
				}
			}
		]).toArray();
	}

	async getTrendingTags(days = 7, limit =10) {
		const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

		return await this.collection.aggregate([
			{ $match: {pubDate: { $gte: cutoffDate } } },
			{ $unwind: '$tags' },
			{ $group: { _id: '$tags', count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: limit }
		]).toArray();
	}

	async getCategories() {
		return await Article.distinct('feedCategory');
	}

	async getAllTags() {
		return await Article.distinct('tags');
	}

	async countArticles(query = {}) {
		return await Article.countDocuments(query);
	}
	async getArticles({
		category,
		page = 1,
		limit = 20,
		hasAudio
	} = {}) {
		page = Math.max(Number(page) || 1, 1);
		limit = Math.min(100, Number(limit) || 20);

		const skip = (page - 1) * limit;
		const filter = {};

		if (category) {
			filter.feedCategory = category;
		}

		if (hasAudio !== undefined) {
			filter.hasAudio = hasAudio === true || hasAudio === 'true';
		}
		console.log('Filter:', filter);
		const [articles, total] = await Promise.all([
			Article.find(filter)
				.sort({ pubDate: -1, _id: -1 })
				.skip(skip)
				.limit(limit)
				.select('-fullContent -paragraphs') // optional tối ưu
				.lean(),
			Article.countDocuments(filter)
		]);
		console.log(articles);
		
		//  LẤY AUDIO THEO articleId
		const articleIds = articles
			.filter(a => a.hasAudio)
			.map(a => a._id);

		let audioMap = {};

		if (articleIds.length > 0) {
			const audios = await ArticleAudio.find({
				articleId: { $in: articleIds },
				status: 'SUCCESS'
			})
				.select('articleId duration')
				.lean();

			audioMap = audios.reduce((acc, audio) => {
				acc[audio.articleId.toString()] = audio;
				return acc;
			}, {});
		}

		//  GẮN audio vào article
		const enrichedArticles = articles.map(article => {
			if (!article.hasAudio) return article;

			const audio = audioMap[article._id.toString()];

			return {
				...article,
				audio: audio
					? {
							duration: audio.duration,
							streamUrl: `/api/v1/articles/audios/${article._id}/stream`
					}
					: null
			};
		});

		return {
			articles: enrichedArticles,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		};
	}




	async deleteOldArticle (days = 90) {
		const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
		const result = await Article.deleteMany({ fetchedAt: { $lt: cutoffDate } });

		logger.info('Delete oid ariticles', { count : result.deletedCount });
		return result.deletedCount;
	}

	async getByCategoryByTimeSlot(
		category,
		startTime,
		endTime,
		{
			page = 1,
			limit = 20,
			timezone = 'UTC'
		} = {}
	) {
		if (!startTime || !endTime) {
			throw new Error('Start time and end time are required');
		}

		page = Math.max(1, Number(page) || 1);
		limit = Math.min(100, Number(limit) || 20);

		const skip = (page - 1) * limit;

		const start = dayjs.tz(startTime, timezone);
		const end = dayjs.tz(endTime, timezone);

		if (!start.isValid() || !end.isValid()) {
			throw new Error('Invalid datetime format');
		}

		if (!start.isBefore(end)) {
			throw new Error('Start time must be before end time');
		}

		const query = {
			feedCategory: category,
			pubDate: {
				$gte: start.toDate(),
				$lt: end.toDate()
			}
		};

		const [articles, total] = await Promise.all([
			Article.find(query)
			.sort({pubDate: -1})
			.skip(skip)
			.limit(limit)
			.lean(),
			Article.countDocuments(query)
		]);

		return {
			category,
			timeRange: {
				from: start.format(),
				to: end.format()
			},
			articles,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		}
	}
}

module.exports = ArticleService;