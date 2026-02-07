const RSSParser = require('rss-parser');
const axios = require('axios');
const logger = require('../utils/logger');
const cheerio = require('cheerio');
const pLimit = require('p-limit').default;
const feedsconfig = require('../config/feeds');
const { error, log } = require('winston');
const ArticleAudioService = require('../service/articleAudioSrv');
const ttsConfig = require('../config/tts');


class FetchService {
	constructor(articleService, concurrency = 3) {
		this.articleService = articleService;
		this.parser = new RSSParser({
			customFields: {item: ['enclosure']}
		});
		this.concurrency = concurrency;
		this.settings = feedsconfig.settings;
		this.audioService = new ArticleAudioService(ttsConfig.vbee);
		this.audioSettings = ttsConfig.autoGenerate;
	}

	async summarizeContent(text, topN = 3) {
		try {
			const res = await axios.post(
				'http://127.0.0.1:8000/summarize',
				{ text, top_n: topN },
				{ timeout: 15000 }
			);
			// logger.info(res.data.summary);
			return res.data.summary || '';
		} catch (error) {
			logger.error('Summarization error', { error: error.message });
			return '';
		}
	}

	async scrapeArticlecontent(url) {
		try {
			const response =await axios.get(url, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
				},
				timeout: 10000
			});
			const $ = cheerio.load(response.data);
			const content = { paragraphs: [], tags: []};

			$('.fck_detail .Normal').each((i, elem) => {
				let text = $(elem).text().trim();
				text = text.replace(/\s+/g, ' '); // bỏ space, xuống dòng
				if (text && !text.startsWith('Ảnh:') && !text.startsWith('Video:')) {
					content.paragraphs.push(text);
				}
			})
			content.author = content.paragraphs.pop() || '';
			content.fullContent = content.paragraphs.join('\n\n').trim();
			content.description = $('.description').text().trim() || '';
			content.category = $('.breadcrumb li').last().find('a').text().trim() || '';
			content.summary = await this.summarizeContent(content.fullContent, 3);

			//tags
			// console.log($('.tags h4 a'));
			// $('.tags h4 a').each((i, elem) => {
			// 	const tag = $(elem).text().trim();
			// 	if (tag) {
			// 		content.tags.push(tag);
			// 	}
			// })
			const tagsMeta = $('meta[name="its_tag"]').attr('content');
			
			if (tagsMeta) {
				content.tags = tagsMeta.split(',').map(t => t.trim()).filter(Boolean);
			}
			// console.log(content.summary);


			//related articles bo

			return content;



		} catch (error) {
			logger.warn('scrape failed', { url, error: error.message });
			return null;
		}
	} 

	async processArticle(feed, item) {
		const sleep = (ms) =>  new Promise(resolve => setTimeout(resolve, ms)); 

		const articleData = {
			guid: item.guid || item.link,
			title: item.title,
			link: item.link,
			pubDate: new Date(item.pubDate),
			imageUrl: item.enclosure?.url || null,
			feedUrl: feed.url,
			feedCategory: feed.category,
			contentFetched: false
		};

		if (this.settings.fetchFullcontent) {
			await sleep(this.settings.requestDelay);
			const content = await this.scrapeArticlecontent(item.link);
			if (content && content.fullContent) {
				// articleData.summary = await this.summarizeContent(content.fullContent, 3);
				// logger.info(articleData.summary);
				Object.assign(articleData, content);
				articleData.contentFetched = true;

				//api sumarize
			}
		}

		return articleData;
	}
	async generateAudioForArticles(articleIds) {
		console.log(this.audioSettings.enabled);
		console.log(articleIds.length);
		if (!this.audioSettings.enabled || articleIds.length === 0) {
			return;
		}
		// logger.info(articleIds);
		try {
			logger.info('Starting audio generation for new articles', {
				count: articleIds.length,
				textSource: this.audioSettings.textSource
			});

			// Tạo audio với rate limiting
			const results = await this.audioService.batchCreateAudio(articleIds, this.audioSettings);

			const successCount = results.filter(r => r.success).length;
			
			logger.info('Audio generation completed', {
				total: articleIds.length,
				success: successCount,
				failed: articleIds.length - successCount
			});

			return results;

		} catch (error) {
			logger.error('Audio generation failed', {
				error: error.message,

				articleIds: articleIds.length
			});
		}
	}

	async fetchFeed(feed) {
		const stats = {
			total: 0,
			new: 0,
			duplicate: 0,
			error: 0
		};
		try {
			logger.info('Fetching feed', { url: feed.url, category: feed.category });
			const rssFeed = await this.parser.parseURL(feed.url);
			stats.total = rssFeed.items.length;

			const Limit = pLimit(this.concurrency);

			const articlePromises = rssFeed.items
				.slice(0, this.settings.maxArticlesPerFetch)
				.map(item => Limit(() => this.processArticle(feed, item)));
			
			const articlesData = await Promise.allSettled(articlePromises);

			const validArticles = articlesData
				.filter(result => result.status === 'fulfilled' && result.value)
				.map(result => result.value);
			
			if (validArticles.length > 0) {

				const result = await this.articleService.bulkInsert(validArticles);
				stats.new = result.inserted;
				stats.duplicate = result.duplicates;
				console.log(result)
				// TỰ ĐỘNG TẠO AUDIO CHO CÁC ARTICLES MỚI
				if (result.insertedIds && result.insertedIds.length > 0) {
					logger.info('Auto-generating audio for new articles', {
						count: result.insertedIds.length,
						category: feed.category
					});

					// Chạy background
					this.generateAudioForArticles(result.insertedIds)
						.then(audioResults => {
							if (audioResults) {
								const audioSuccess = audioResults.filter(r => r.success).length;
								stats.audioGenerated = audioSuccess;
								logger.info('Audio generation background task completed', {
									category: feed.category,
									generated: audioSuccess
								});
							}
						})
						.catch(error => {
							logger.error('Background audio generation failed', {
								category: feed.category,
								error: error.message
							});
						});
				}
			}
			stats.error = articlesData.filter(result => result.status === 'rejected').length;

			logger.info('feed fetch completed', {
				category: feed.category,
				stats
			});
			return { stats, success: true };
		} catch (error) {
			logger.error('Feed fetch error', { url: feed.url, category: feed.category, error: error.message });
			throw error;
		}
	}
	
	async fetchAllFeeds(categories = null) {
		let feeds = feedsconfig.feeds;

		if (categories && categories.length > 0) {
			feeds = feeds.filter(f => categories.includes(f.category));
		}

		const overallStats = {
			totalFeeds: feeds.length,
			totalArticels: 0,
			totalNew: 0,
			totalDuplicates: 0,
			totalErrors: 0,
			byCategory: {},
			startTime: new Date()
		};

		for (const feed of feeds) {
			try {
				const result = await this.fetchFeed(feed);

				overallStats.totalArticels += result.stats.total;
				overallStats.totalNew += result.stats.new;
				overallStats.totalDuplicates += result.stats.duplicate;
				overallStats.totalErrors += result.stats.error;
				overallStats.byCategory[feed.category] = result.stats;
			} catch (error) {
				logger.error('Feed processing failed',{
					category: feed.category,
					error: error.message
				});
			}
 		}

		overallStats.endTime = new Date();
		overallStats.duration = (overallStats.endTime - overallStats.startTime) / 1000;

		logger.info('All feeds fetch completed', {
			duration: overallStats.duration,
			new: overallStats.totalNew,
		});

		return overallStats;
	}

	setconcurrency(concurrency) {
		this.concurrency = concurrency;
	}
}

module.exports = FetchService;