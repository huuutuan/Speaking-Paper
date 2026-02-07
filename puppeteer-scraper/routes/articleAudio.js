const express = require('express');
const router = express.Router();
const articleAudioController = require('../controllers/articleAudioController');

// Callback từ Vbee (public endpoint)
router.post('/callback', articleAudioController.handleCallback);

// Single article audio
router.post('/:articleId/audio', articleAudioController.createAudio);
router.get('/:articleId/audio', articleAudioController.getAudio);
router.get('/:articleId/stream', articleAudioController.streamAudio);
router.get('/:articleId/audio/download', articleAudioController.downloadAudio);

// Batch operations
router.post('/audio/batch', articleAudioController.batchCreate);
router.post('/audio/batch-by-category', articleAudioController.batchCreateByCategory);

// List & stats
router.get('/with-audio', articleAudioController.getArticlesWithAudio);
router.get('/audio/stats', articleAudioController.getStats);

// Maintenance
router.post('/audio/cleanup', articleAudioController.cleanup);
router.post('/audio/retry-failed', articleAudioController.retryFailed);
console.log('🔥 articleAudioRoutes loaded');

module.exports = router;