const Queue = require('bull');
const config = require('../config/config');
const logger = require('../utils/logger');

class QueueService {
	constructor() {
		this.feedQueue = new Queue('feedQueure', {
			redis: config.redis,
			defaultJobOptions: {
				attempts: config.redis.maxRetriesPerRequest,
				backoff: {
					type: 'exponential',
					delay: config.fetch.retryDelay
				},
				removeOnComplete: 100,
				removeOnFail: 50
			}
		});
		this.setupEventHandlers();
	}

	setupEventHandlers() {
		this.feedQueue.on('completed', (job, result) => {
			logger.info('Feed job completed', { jobId: job.id, category: job.data.feed.category , stats: result.stats}); });
		this.feedQueue.on('failed', (job, err) => {
			logger.error('Feed fetch failed', { jobId: job.id, category: job.data.feed?.category, error: err.message, attempts: job.attemptsMade }); });
		this.feedQueue.on('stalled', (job) => {
			logger.warn('Job stalled', { jobId: job.id, category: job.data.feed?.category});
		});
	}	

	async addFeedJob(feed, options = {}) {
		return await this.feedQueue.add('fetch-feed', { feed }, options);
	}

	async addBulkFeedJobs(feeds, options = {}) {
		const jobs = feeds.map(feed => ({
			name: 'fetch-feed',
			data: { feed },
			opts: options
		}));

		return await this.feedQueue.addBulk(jobs);
	}

	async getStats() {
		const [waiting, active, completed, failed] = await Promise.all([
			this.feedQueue.getWaitingCount(),
			this.feedQueue.getActiveCount(),
			this.feedQueue.getCompletedCount(),
			this.feedQueue.getFailedCount()	
		]);

		return { waiting, active, completed, failed };
	}

	async pause() {
		await this.feedQueue.pause();
	}

	async resume() {
		await this.feedQueue.resume();
	}

	async close() {
		await this.feedQueue.close();
	}

	getQueue() {
		return this.feedQueue;
	}
}

module.exports = QueueService;