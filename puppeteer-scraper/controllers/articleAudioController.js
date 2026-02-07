const ArticleAudioService = require('../service/articleAudioSrv');
const ArticleAudio = require('../models/articleAudioModel');
const Article = require('../models/articleModel');
const ttsConfig = require('../config/tts');
const logger = require('../utils/logger');

//  FIX: Chỉ truyền 1 tham số
const articleAudioService = new ArticleAudioService(ttsConfig.vbee);

class ArticleAudioController {
	/**
	 * Tạo audio cho 1 article
	 * POST /api/articles/:articleId/audio
	 */
	async createAudio(req, res) {
		try {
			const { articleId } = req.params;
			const {
				textSource = 'summary',
				voiceCode,
				audioType = 'mp3',
				bitrate = 128,
				speedRate = 1.0
			} = req.body;

			const result = await articleAudioService.createAudioForArticle(articleId, {
				textSource,
				voiceCode,
				audioType,
				bitrate,
				speedRate
			});

			res.status(200).json({
				success: true,
				isNew: result.isNew,
				audio: {
					id: result.audio._id,
					status: result.audio.status,
					ttsRequestId: result.audio.ttsRequestId,
					streamUrl: `/api/articles/${articleId}/audio/stream`
				},
				message: result.isNew 
					? 'Audio is being generated'
					: 'Audio already exists'
			});

		} catch (error) {
			logger.error('Create article audio failed', {
				articleId: req.params.articleId,
				error: error.message
			});
			res.status(500).json({
				success: false,
				error: error.message
			});
		}
	}

	/**
	 * Lấy thông tin audio của article
	 * GET /api/articles/:articleId/audio
	 */
	async getAudio(req, res) {
		try {
			const { articleId } = req.params;

			const audio = await articleAudioService.getArticleAudio(articleId);

			if (!audio) {
				return res.status(404).json({
					success: false,
					error: 'Audio not found or expired'
				});
			}

			res.status(200).json({
				success: true,
				audio: {
					id: audio._id,
					status: audio.status,
					audioType: audio.audioType,
					fileSize: audio.fileSize,
					fileSizeMB: (audio.fileSize / 1024 / 1024).toFixed(2),
					duration: audio.duration,
					characters: audio.characters,
					voiceCode: audio.voiceCode,
					playCount: audio.playCount,
					createdAt: audio.createdAt,
					expiresAt: audio.expiresAt,
					// Thêm streamUrl và downloadUrl
					streamUrl: `/api/articles/${articleId}/audio/stream`,
					downloadUrl: `/api/articles/${articleId}/audio/download`
				}
			});

		} catch (error) {
			logger.error('Get article audio failed', {
				articleId: req.params.articleId,
				error: error.message
			});
			res.status(500).json({
				success: false,
				error: error.message
			});
		}
	}

	/**
	 * Stream audio từ MongoDB
	 * GET /api/articles/:articleId/audio/stream
	 */
	async streamAudio(req, res) {
		try {
			const { articleId } = req.params;

			const audio = await articleAudioService.getArticleAudio(articleId);

			if (!audio || audio.status !== 'SUCCESS') {
				return res.status(404).json({
					success: false,
					error: 'Audio not available',
				});
			}

			const fileSize = audio.fileSize;
			const range = req.headers.range;

			// ✅ chỉ tăng play count khi KHÔNG có range
			if (!range) {
				await audio.incrementPlayCount();
			}

			res.set({
				'Content-Type': audio.mimeType || 'audio/mpeg',
				'Accept-Ranges': 'bytes',
				'Content-Disposition': `inline; filename="article-${articleId}.${audio.audioType}"`,
				'Cache-Control': 'public, max-age=86400',
			});

			// ===============================
			// NO RANGE → gửi full file
			// ===============================
			if (!range) {
				res.set('Content-Length', fileSize);
				return res.status(200).send(audio.audioData);
			}

			// ===============================
			// RANGE STREAM
			// ===============================
			const parts = range.replace(/bytes=/, '').split('-');
			const start = parseInt(parts[0], 10);
			const end = parts[1]
			? parseInt(parts[1], 10)
			: fileSize - 1;

			// ❗ validate range
			if (start >= fileSize || end >= fileSize) {
				return res.status(416).set({
					'Content-Range': `bytes */${fileSize}`,
				}).end();
			}

			const chunkSize = end - start + 1;

			res.status(206).set({
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Content-Length': chunkSize,
			});

			return res.send(audio.audioData.slice(start, end + 1));

		} catch (error) {
			logger.error('Stream audio failed', {
			articleId: req.params.articleId,
			error: error.message,
		});

		res.status(500).json({
			success: false,
			error: error.message,
			});
		}
	}

	/**
	 *  Download audio file
	 * GET /api/articles/:articleId/audio/download
	 */
	async downloadAudio(req, res) {
		try {
			const { articleId } = req.params;

			const audio = await articleAudioService.getArticleAudio(articleId);

			if (!audio || audio.status !== 'SUCCESS') {
				return res.status(404).json({
					success: false,
					error: 'Audio not available'
				});
			}

			// Set headers cho download
			res.set({
				'Content-Type': audio.mimeType || 'audio/mpeg',
				'Content-Length': audio.fileSize,
				'Content-Disposition': `attachment; filename="article-${articleId}.${audio.audioType}"`
			});

			res.send(audio.audioData);

		} catch (error) {
			logger.error('Download audio failed', {
				articleId: req.params.articleId,
				error: error.message
			});
			res.status(500).json({
				success: false,
				error: error.message
			});
		}
	}

	/**
	 * Callback từ Vbee TTS
	 * POST /api/articles/audio/callback
	 */
	async handleCallback(req, res) {
		try {
			const callbackData = req.body;

			logger.info('Received TTS callback', {
				requestId: callbackData.request_id,
				status: callbackData.status
			});

			const result = await articleAudioService.handleTTSCallback(callbackData);

			res.status(200).json({
				received: true,
				success: result.success
			});

		} catch (error) {
			logger.error('Callback handling failed', {
				error: error.message
			});
			res.status(500).json({
				received: false,
				error: error.message
			});
		}
	}

	/**
	 * Batch tạo audio
	 * POST /api/articles/audio/batch
	 */
	async batchCreate(req, res) {
		try {
			const {
				articleIds,
				textSource = 'summary',
				voiceCode,
				concurrency = 3
			} = req.body;

			if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
				return res.status(400).json({
					success: false,
					error: 'articleIds array is required'
				});
			}

			// Start batch processing (async)
			articleAudioService.batchCreateAudio(articleIds, {
				textSource,
				voiceCode,
				concurrency
			}).catch(error => {
				logger.error('Batch create audio failed', {
					error: error.message
				});
			});

			res.status(202).json({
				success: true,
				message: 'Batch processing started',
				totalArticles: articleIds.length
			});

		} catch (error) {
			logger.error('Batch create failed', {
				error: error.message
			});
			res.status(500).json({
				success: false,
				error: error.message
			});
		}
	}

	/**
	 * Batch by category
	 * POST /api/articles/audio/batch-by-category
	 */
	async batchCreateByCategory(req, res) {
		try {
			const {
				feedCategory,
				limit = 50,
				textSource = 'summary',
				voiceCode
			} = req.body;

			if (!feedCategory) {
				return res.status(400).json({
					success: false,
					error: 'feedCategory is required'
				});
			}

			//  Thêm filter summary exists
			const articles = await Article.find({
				feedCategory,
				contentFetched: true,
				summary: { $exists: true, $ne: '' }  // ← Quan trọng!
			})
			.limit(limit)
			.select('_id');

			const articleIds = articles.map(a => a._id.toString());

			// Lọc bỏ articles đã có audio
			const existingAudios = await ArticleAudio.find({
				articleId: { $in: articleIds },
				status: 'SUCCESS'
			}).select('articleId');

			const existingArticleIds = new Set(
				existingAudios.map(a => a.articleId.toString())
			);

			const newArticleIds = articleIds.filter(
				id => !existingArticleIds.has(id)
			);

			if (newArticleIds.length === 0) {
				return res.status(200).json({
					success: true,
					message: 'All articles already have audio',
					total: 0
				});
			}

			// Start batch processing
			articleAudioService.batchCreateAudio(newArticleIds, {
				textSource,
				voiceCode,
				concurrency: 3,
				delay: 2000
			}).catch(error => {
				logger.error('Batch by category failed', {
					error: error.message
				});
			});

			res.status(202).json({
				success: true,
				message: 'Batch processing started',
				totalArticles: newArticleIds.length,
				category: feedCategory
			});

		} catch (error) {
			logger.error('Batch by category failed', {
				error: error.message
			});
			res.status(500).json({
				success: false,
				error: error.message
			});
		}
	}

	/**
	 * List articles with audio
	 * GET /api/articles/with-audio
	 */
	async getArticlesWithAudio(req, res) {
		try {
			const {
				page = 1,
				limit = 20,
				feedCategory,
				status = 'SUCCESS'
			} = req.query;

			const skip = (page - 1) * limit;
			const query = { status };

			//  FIX: Exclude audioData để giảm tải
			const audios = await ArticleAudio.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(parseInt(limit))
				.populate('article', 'title link feedCategory pubDate')
				.select('-audioData');  // ← Không lấy binary!

			const total = await ArticleAudio.countDocuments(query);

			res.status(200).json({
				success: true,
				data: audios.map(audio => ({
					audioId: audio._id,
					article: {
						id: audio.article?._id,
						title: audio.article?.title,
						link: audio.article?.link,
						category: audio.article?.feedCategory,
						pubDate: audio.article?.pubDate
					},
					audio: {
						status: audio.status,
						fileSize: audio.fileSize,
						fileSizeMB: (audio.fileSize / 1024 / 1024).toFixed(2),
						duration: audio.duration,
						playCount: audio.playCount,
						createdAt: audio.createdAt,
						// ✅ FIX: Thêm URLs
						streamUrl: `/api/articles/${audio.article?._id}/audio/stream`,
						downloadUrl: `/api/articles/${audio.article?._id}/audio/download`
					}
				})),
				pagination: {
					page: parseInt(page),
					limit: parseInt(limit),
					total,
					pages: Math.ceil(total / limit)
				}
			});

		} catch (error) {
			logger.error('Get articles with audio failed', {
				error: error.message
			});
			res.status(500).json({
				success: false,
				error: error.message
			});
		}
	}

	/**
	 * Statistics
	 * GET /api/articles/audio/stats
	 */
	async getStats(req, res) {
		try {
			const stats = await ArticleAudio.aggregate([
				{
					$group: {
						_id: '$status',
						count: { $sum: 1 },
						totalSize: { $sum: '$fileSize' },
						totalCharacters: { $sum: '$characters' },
						totalPlays: { $sum: '$playCount' }
					}
				}
			]);

			const totalArticlesWithAudio = await Article.countDocuments({
				_id: {
					$in: await ArticleAudio.distinct('articleId', { status: 'SUCCESS' })
				}
			});

			res.status(200).json({
				success: true,
				stats: {
					byStatus: stats.map(s => ({
						status: s._id,
						count: s.count,
						totalSizeMB: (s.totalSize / 1024 / 1024).toFixed(2),
						totalCharacters: s.totalCharacters,
						totalPlays: s.totalPlays
					})),
					totalArticlesWithAudio,
					storage: {
						totalSizeBytes: stats.reduce((sum, s) => sum + (s.totalSize || 0), 0),
						totalSizeMB: (stats.reduce((sum, s) => sum + (s.totalSize || 0), 0) / 1024 / 1024).toFixed(2)
					}
				}
			});

		} catch (error) {
			logger.error('Get stats failed', {
				error: error.message
			});
			res.status(500).json({
				success: false,
				error: error.message
			});
		}
	}

	/**
	 * Cleanup expired
	 * POST /api/articles/audio/cleanup
	 */
	async cleanup(req, res) {
		try {
			const deletedCount = await articleAudioService.cleanupExpiredAudios();

			res.status(200).json({
				success: true,
				deletedCount
			});

		} catch (error) {
			logger.error('Cleanup failed', {
				error: error.message
			});
			res.status(500).json({
				success: false,
				error: error.message
			});
		}
	}

	/**
	 * Retry failed
	 * POST /api/articles/audio/retry-failed
	 */
	async retryFailed(req, res) {
		try {
			await articleAudioService.retryFailedAudios();

			res.status(200).json({
				success: true,
				message: 'Retry process started'
			});

		} catch (error) {
			logger.error('Retry failed audios error', {
				error: error.message
			});
			res.status(500).json({
				success: false,
				error: error.message
			});
		}
	}
}

module.exports = new ArticleAudioController();