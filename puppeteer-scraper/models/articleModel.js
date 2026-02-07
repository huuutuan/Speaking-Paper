const mongoose = require('mongoose');

const articleModelSchema = new mongoose.Schema({
	// trường bắt buộc
	guid: {
		type: String,
		required: [true, 'GUID is required'],
		unique: true,
		trim: true,
		index: true
	},
	title: {
		type: String,
		required: [true, 'Title is required'],
		trim: true,
		maxlength: [500, 'title too long']
	},

	link: {
		type: String,
		required: [true, 'Link is required'],
		trim: true,
		
	},
	pubDate: {
		type: Date,
		required: [true, 'Publication date is required'],
		index: true
	},
	feedCategory: {
		type: String,
		required: [true, 'Feed category is required'],
		enum: {
			values: ['Thế giới','Thời sự','Giải trí','Tin mới nhất','Kinh doanh','Thể thao','Pháp luật','Giáo dục','Sức khỏe','Du lịch','Khoa học - Công nghệ','Đời sống','Ô tô - Xe máy','Ý kiến','Tâm sự,Cười','Tin nổi bật','Tin xem nhiều'],
			message: '{VALUE} is not a valid feed category'
		},
		index: true
	},

	// trường không bắt buộc
	
	description: {
		type: String,
		trim: true,
		maxlength: 2000
	},
	
	imageUrl:{
		type: String,
		trim: true,
	},

	feedUrl: String,

	//  centent

	fullContent: {
		type: String,
		trim: true,
	},

	paragraphs: [{
		type: String,
		trim: true,
	}],

	summary: {
		type: String,
		trim: true,
		maxlength: 1000
	},
	author: {
		type: String,
		trim: true,
		maxlength: 200
	},
	tags: [{
		type: String,
		trim: true,
		lowercase: true
	}],
	category: String,

	relatedArticles: [{
		title: String,
		link: String
	}],

	audioId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ArticleAudio',
		index: true
	},
	hasAudio: {
		type: Boolean,
		default: false,
		index: true
	},

	// thống kê
	wordCount: {
		type: Number,
		min: 0
	},

	characterCount: {
		type: Number,
		min: 0
	},

	viewCount: {
		type: Number,
		default: 0,
		min: 0
	},
	
	// metadatea 
	contentFetched: {
		type: Boolean,
		default: false
	},
	fetchedAt: {
		type: Date,
		default: Date.now,
		index: true
	},
	
}, {
	timestamps: true,
	collection: 'articles',
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});
// indexes
articleModelSchema.index({ title: 'text', fullContent: 'text', description: 'text' });
articleModelSchema.index({ tags: 1 });
articleModelSchema.index({ author: 1 });
articleModelSchema.index({ feedCategory: 1, pubDate: -1 });
articleModelSchema.index({ contentFetched: 1 });
articleModelSchema.index({ hasAudio: 1 });

// virtuals
articleModelSchema.virtual('isRecent').get(function() {
	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	return this.pubDate >= oneDayAgo;
});

articleModelSchema.virtual('readingTime').get(function() {
	if (!this.wordCount) return 0;
	return Math.ceil(this.wordCount / 200);
})

articleModelSchema.virtual('excerpt').get(function() {
	const text = this.fullContent || this.description || '';
	return text.length > 200
	  ? text.substring(0, 200) + '...'
	  : text;

});

// Static methods 

articleModelSchema.statics.findRecent = function (Limit = 10, category = null) {
	const query = category ? { feedCategory: category } : {};
	return this.find(query)
		.sort({pubDate: -1})
		.limit(Limit)
		.lean();
};

articleModelSchema.statics.searchArticles = function(keyword, options = {}) {
    const { category, limit = 20 } = options;
    const query = { $text: { $search: keyword } };
    
    if (category) query.feedCategory = category;
    
    return this.find(query)
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .lean();
};

const Article = mongoose.model('Article', articleModelSchema);

module.exports = Article;

	



	