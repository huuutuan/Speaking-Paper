const Joi = require('joi');

module.exports = {
    getArticles: Joi.object({
        category: Joi.string().optional(),

    hasAudio: Joi.boolean()
        .truthy('true')
        .falsy('false')
        .optional(),

    page: Joi.number().integer().min(1).default(1),

    limit: Joi.number().integer().min(1).max(100).default(10)
    }),

    searchArticles: Joi.object({
        q: Joi.string().required().min(2),
        category: Joi.string().optional(),
        limit: Joi.number().integer().min(1).max(100).default(20)
    }),

    getArticlesByCategory: Joi.object({
        limit: Joi.number().integer().min(1).max(100).default(20),
        page: Joi.number().integer().min(1).default(1)
    })
};