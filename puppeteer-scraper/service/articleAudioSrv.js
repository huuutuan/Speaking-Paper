const ArticleAudio = require('../models/articleAudioModel');
const VbeeTTSService = require('../service/vbeeSrv');
const Article = require('../models/articleModel');
const logger = require('../utils/logger');
const axios = require('axios');
const mm = require('music-metadata');

class ArticleAudioService {
	constructor(ttsConfig) {
		this.ttsService = new VbeeTTSService(ttsConfig);
	}

	/**
	 * Tạo audio cho article
	 */
	async createAudioForArticle(articleId, options = {}) {
		try {
			const {
				textSource = 'summary',
				voiceCode,
				audioType = 'mp3',
				bitrate = 128,
				speedRate = 1.0,
				customText = null
			} = options;

			// Lấy article
			const article = await Article.findById(articleId);
			if (!article) {
				throw new Error('Article not found');
			}

			// Kiểm tra đã có audio chưa
			const existingAudio = await ArticleAudio.findByArticleId(articleId);
			if (existingAudio && !existingAudio.isExpired()) {
				logger.info('Audio already exists for article', {
					articleId,
					audioId: existingAudio._id
				});
				return {
					success: true,
					audio: existingAudio,
					isNew: false
				};
			}

			// Lấy text cần convert
			let textToConvert;
			if (customText) {
				textToConvert = customText;
			} else {
				textToConvert = this.getTextFromArticle(article, 'short');
			}

			if (!textToConvert || textToConvert.trim().length === 0) {
				throw new Error(`No ${textSource} available for this article`);
			}

			// Giới hạn độ dài
			if (textToConvert.length > 5000) {
				logger.warn('Text too long, truncating', {
					originalLength: textToConvert.length
				});
				textToConvert = textToConvert.substring(0, 4900) + '...';
			}

			// Gọi TTS API
			logger.info('Creating TTS for article', {
				articleId,
				textLength: textToConvert.length,
				textSource
			});

			const ttsResult = await this.ttsService.textToSpeech({
				text: textToConvert,
				voiceCode,
				audioType,
				bitrate,
				speedRate
			});

			if (!ttsResult.success) {
				throw new Error(`TTS API error: ${ttsResult.error}`);
			}

			// Tạo record trong database
			const articleAudio = new ArticleAudio({
				articleId,
				ttsRequestId: ttsResult.requestId,
				convertedText: textToConvert,
				textSource: customText ? 'custom' : textSource,
				voiceCode: voiceCode || this.ttsService.defaultVoice,
				characters: ttsResult.characters,
				audioType,
				speedRate,
				bitrate,
				status: 'PROCESSING',
				audioData: Buffer.alloc(0), // Placeholder
				fileSize: 0
			});

			await articleAudio.save();

			logger.info('ArticleAudio record created', {
				audioId: articleAudio._id,
				ttsRequestId: ttsResult.requestId
			});

			return {
				success: true,
				audio: articleAudio,
				isNew: true,
				ttsRequestId: ttsResult.requestId
			};

		} catch (error) {
			logger.error('Create audio for article failed', {
				articleId,
				error: error.message
			});
			throw error;
		}
	}

	/**
	 *  Xử lý callback từ Vbee - Download và lưu vào MongoDB
	 */
	async handleTTSCallback(callbackData) {
		const { request_id, status, audio_link } = callbackData;

		try {
			// Tìm ArticleAudio record
			const articleAudio = await ArticleAudio.findOne({
				ttsRequestId: request_id
			});

			if (!articleAudio) {
				logger.warn('ArticleAudio not found for request', {
					ttsRequestId: request_id
				});
				return { success: false, error: 'Audio record not found' };
			}

			logger.info('Processing TTS callback', {
				ttsRequestId: request_id,
				audioId: articleAudio._id,
				status
			});

			if (status === 'SUCCESS' && audio_link) {
				//  DOWNLOAD AUDIO VÀ LƯU VÀO MONGODB
				logger.info('Downloading audio from Vbee', {
					audioLink: audio_link
				});

				const audioBuffer = await this.downloadAudioToBuffer(audio_link);

				if (!audioBuffer) {
					throw new Error('Failed to download audio');
				}
				let duration = null;
				try {
					const metadata = await mm.parseBuffer(
						audioBuffer,
						articleAudio.audioType === 'mp3' ? 'audio/mpeg' : 'audio/wav'
					);
					duration = metadata.format.duration
						? Math.round(metadata.format.duration)
						: null;
				} catch (err) {
					logger.warn('Cannot read audio duration', {
						audioId: articleAudio._id,
						error: err.message
					});
				}
				// Cập nhật ArticleAudio với binary data
				articleAudio.duration = duration;
				articleAudio.audioData = audioBuffer;
				articleAudio.fileSize = audioBuffer.length;
				articleAudio.status = 'SUCCESS';
				articleAudio.processedAt = new Date();
				articleAudio.expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 30 ngày
				articleAudio.mimeType = articleAudio.audioType === 'mp3' ? 'audio/mpeg' : 'audio/wav';
				articleAudio.sampleRate = callbackData.sample_rate;

				await articleAudio.save();
				await Article.updateOne(
					{ _id: articleAudio.articleId },
					{  $set: { hasAudio: true } }
				)			
				logger.info('Audio saved to MongoDB successfully', {
					audioId: articleAudio._id,
					fileSize: audioBuffer.length,
					fileSizeMB: (audioBuffer.length / 1024 / 1024).toFixed(2)
				});

				return {
					success: true,
					audio: articleAudio
				};

			} else {
				// TTS thất bại
				articleAudio.status = 'FAILED';
				articleAudio.errorMessage = 'TTS conversion failed';
				articleAudio.processedAt = new Date();
				await articleAudio.save();

				return {
					success: false,
					error: 'TTS conversion failed'
				};
			}

		} catch (error) {
			logger.error('Callback handling failed', {
				ttsRequestId: request_id,
				error: error.message
			});

			// Update status
			try {
				await ArticleAudio.updateOne(
					{ ttsRequestId: request_id },
					{
						status: 'FAILED',
						errorMessage: error.message,
						processedAt: new Date()
					}
				);
			} catch (updateError) {
				logger.error('Failed to update error status', {
					error: updateError.message
				});
			}

			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 *  Download audio từ URL và trả về Buffer
	 */
	async downloadAudioToBuffer(audioUrl) {
		try {
			const response = await axios.get(audioUrl, {
				responseType: 'arraybuffer',
				timeout: 120000, // 2 phút
				maxContentLength: 5 * 1024 * 1024 // Max 5MB
			});

			const buffer = Buffer.from(response.data);
			
			logger.info('Audio downloaded to buffer', {
				size: buffer.length,
				sizeMB: (buffer.length / 1024 / 1024).toFixed(2)
			});

			return buffer;

		} catch (error) {
			logger.error('Download audio to buffer failed', {
				audioUrl,
				error: error.message
			});
			return null;
		}
	}

	/**
	 * Lấy audio của article
	 */
	async getArticleAudio(articleId) {
		try {
			const audio = await ArticleAudio.findByArticleId(articleId);
			
			if (!audio) {
				return null;
			}

			if (audio.isExpired()) {
				logger.info('Audio expired', { audioId: audio._id });
				return null;
			}

			return audio;

		} catch (error) {
			logger.error('Get article audio failed', {
				articleId,
				error: error.message
			});
			return null;
		}
	}

	/**
	 * Batch tạo audio
	 */
	async batchCreateAudio(articleIds, options = {}) {
		const results = [];
		const { concurrency = 3, delay = 1000 } = options;

		logger.info('Starting batch audio creation', {
			totalArticles: articleIds.length,
			concurrency
		});

		for (let i = 0; i < articleIds.length; i += concurrency) {
			const batch = articleIds.slice(i, i + concurrency);
			
			const batchResults = await Promise.allSettled(
				batch.map(articleId => this.createAudioForArticle(articleId, options))
			);

			for (const result of batchResults) {
				if (result.status === 'fulfilled') {
					results.push({
						success: true,
						data: result.value
					});
				} else {
					results.push({
						success: false,
						error: result.reason.message
					});
				}
			}

			if (i + concurrency < articleIds.length) {
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}

		const successCount = results.filter(r => r.success).length;
		logger.info('Batch audio creation completed', {
			total: articleIds.length,
			success: successCount,
			failed: articleIds.length - successCount
		});

		return results;
	}

	/**
	 * Cleanup expired audios
	 */
	async cleanupExpiredAudios() {
		try {
		const expiredAudios = await ArticleAudio.find(
		{ expiresAt: { $lt: new Date() } },
		{ articleId: 1 }
		).lean();

		if (expiredAudios.length === 0) return 0;

		const articleIds = [...new Set(expiredAudios.map(a => a.articleId.toString()))];

		const result = await ArticleAudio.deleteMany({
		expiresAt: { $lt: new Date() }
		});

		const stillHasAudio = await ArticleAudio.distinct(
		'articleId',
		{ articleId: { $in: articleIds } }
		);

		const noAudioArticleIds = articleIds.filter(
		id => !stillHasAudio.includes(id)
		);

		if (noAudioArticleIds.length > 0) {
		await Article.updateMany(
			{ _id: { $in: noAudioArticleIds } },
			{ $set: { hasAudio: false } }
		);
		}

		logger.info('Expired audios cleaned up', {
		deletedCount: result.deletedCount,
		articlesUpdated: noAudioArticleIds.length
		});

		return result.deletedCount;

		} catch (error) {
		logger.error('Cleanup failed', { error: error.message });
		return 0;
		}
	}


	/**
	 * Helper
	 */
	getTextFromArticle(article = {}, mode = 'short') {
		const clean = (text) => (text || '').trim();

		const title = clean(article.title);
		const description = clean(article.description);
		const summary = clean(article.summary);
		const fullcontent = clean(article.fullContent);

		switch (mode) {
			case 'full':
				return [title, description, fullcontent]
					.filter(Boolean)
					.join('. ');

			case 'short':
			default:
				return [title, description, summary]
					.filter(Boolean)
					.join('. ');
		}
	}


	/**
	 * Retry failed audios
	 */
	async retryFailedAudios(maxRetries = 3) {
		try {
			const failedAudios = await ArticleAudio.find({
				status: 'FAILED',
				retryCount: { $lt: maxRetries }
			}).limit(10);

			logger.info('Retrying failed audios', {
				count: failedAudios.length
			});

			for (const audio of failedAudios) {
				try {
					audio.retryCount += 1;
					audio.status = 'PROCESSING';
					await audio.save();

					const ttsResult = await this.ttsService.textToSpeech({
						text: audio.convertedText,
						voiceCode: audio.voiceCode,
						audioType: audio.audioType,
						bitrate: audio.bitrate,
						speedRate: audio.speedRate
					});

					if (ttsResult.success) {
						audio.ttsRequestId = ttsResult.requestId;
						await audio.save();
						logger.info('Retry successful', { audioId: audio._id });
					}

				} catch (error) {
					logger.error('Retry failed', {
						audioId: audio._id,
						error: error.message
					});
					audio.status = 'FAILED';
					audio.errorMessage = error.message;
					await audio.save();
				}
			}

		} catch (error) {
			logger.error('Retry failed audios error', {
				error: error.message
			});
		}
	}
}

module.exports = ArticleAudioService;