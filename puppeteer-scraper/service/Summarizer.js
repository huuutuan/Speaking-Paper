
class processTextSummarization {
	constructor(articleService) {
		this.articleService = articleService;
	}

	async summarizeArticleContent() {
		this.articleService.getByCategoryByTimeSlot('')
	}
}