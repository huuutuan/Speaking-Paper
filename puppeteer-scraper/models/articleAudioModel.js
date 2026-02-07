const mongoose = require('mongoose');

const ArticleAudioSchema = new mongoose.Schema({
	// Liên kết với Article
	articleId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Article',
		required: true,
		index: true
	},
	
	// Thông tin từ Vbee TTS
	ttsRequestId: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	
	//  AUDIO FILE - Lưu trực tiếp trong MongoDB
	audioData: {
		type: Buffer,  // Binary data của file MP3/WAV
		required: false
	},
	audioType: {
		type: String,
		enum: ['mp3', 'wav'],
		default: 'mp3'
	},
	mimeType: {
		type: String,
		default: 'audio/mpeg'
	},
	fileSize: {
		type: Number, // bytes
		required: true
	},
	duration: {
		type: Number // seconds (optional)
	},
	
	// Thông tin TTS
	voiceCode: {
		type: String,
		required: true
	},
	characters: {
		type: Number,
		required: true
	},
	speedRate: {
		type: Number,
		default: 1.0
	},
	bitrate: {
		type: Number,
		default: 128
	},
	sampleRate: String,
	
	// Trạng thái
	status: {
		type: String,
		enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'],
		default: 'PENDING'
	},
	
	// Văn bản đã chuyển đổi
	convertedText: {
		type: String,
		required: true
	},
	textSource: {
		type: String,
		enum: ['title', 'description', 'fullcontent', 'summary', 'custom'],
		default: 'summary'
	},
	
	// Metadata
	errorMessage: String,
	retryCount: {
		type: Number,
		default: 0
	},
	
	// Timestamps
	createdAt: {
		type: Date,
		default: Date.now,
		index: true
	},
	processedAt: Date,
	expiresAt: {
		type: Date,
		index: true
	},
	lastAccessedAt: Date,
	
	// Stats
	playCount: {
		type: Number,
		default: 0
	}
}, {
	timestamps: true
});

// Index compound
ArticleAudioSchema.index({ articleId: 1, status: 1 });
ArticleAudioSchema.index({ status: 1, createdAt: -1 });
ArticleAudioSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual để lấy article
ArticleAudioSchema.virtual('article', {
	ref: 'Article',
	localField: 'articleId',
	foreignField: '_id',
	justOne: true
});

// Methods
ArticleAudioSchema.methods.incrementPlayCount = function() {
	this.playCount += 1;
	this.lastAccessedAt = new Date();
	return this.save();
};

ArticleAudioSchema.methods.isExpired = function() {
	return this.expiresAt && new Date() > this.expiresAt;
};

// Statics
ArticleAudioSchema.statics.findByArticleId = function(articleId) {
	return this.findOne({ articleId, status: 'SUCCESS' })
		.sort({ createdAt: -1 });
};

ArticleAudioSchema.statics.getExpiredAudios = function() {
	return this.find({
		expiresAt: { $lt: new Date() },
		status: 'SUCCESS'
	});
};

// ⭐ Helper method để lấy audio stream
ArticleAudioSchema.methods.getAudioBuffer = function() {
	return this.audioData;
};

module.exports = mongoose.model('ArticleAudio', ArticleAudioSchema);