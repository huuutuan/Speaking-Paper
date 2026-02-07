const mm = require('music-metadata');
const ArticleAudio = require('../models/articleAudioModel');
const ArticleAudioService = require('../service/articleAudioSrv');
const axios = require('axios')

const VBEE_API_URL = 'https://vbee.vn/api/v1/tts';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njg3OTA1NTAsImV4cCI6MTc3MTQzMzk5OX0.0mbeaQcdeTeLMuhtvaCHDoErETi7fs--WsyedwkMxxI'
async function getTtsStatus(requestId, token) {
  try {
    const res = await axios.get(`${VBEE_API_URL}/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // optional
    });

    return res.data;
  } catch (error) {
    if (error.response) {
      // API trả lỗi
      console.error('VBEE API error:', error.response.data);
      throw error.response.data;
    }

    console.error('Network / Axios error:', error.message);
    throw error;
  }
}


const articles = await ArticleAudio.find({status: 'PROCESSING'})

await Promise.all(articles.map(async (article) =>  {
	const request_id = article.ttsRequestId
	const data = await getTtsStatus(request_id, token)
	const audio_link = data?.result?.audio_link;
	const result = await ArticleAudioService.handleTTSCallback({request_id, status: 'SUCCESS', audio_link});
	console.log(result);
}))