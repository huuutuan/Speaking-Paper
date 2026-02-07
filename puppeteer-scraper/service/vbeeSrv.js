const axios = require('axios');
const logger = require('../utils/logger');

class VbeeTTSService {
	constructor(config) {
		this.apiUrl = 'https://vbee.vn/api/v1/tts';
		this.appId = config.appId;
		this.token = config.token;
		this.defaultVoice = config.defaultVoice || 'hn_female_ngochuyen_full_48k-fhg';
		this.callbackUrl = config.callbackUrl;
	}

	/**
	 * Chuyển văn bản thành giọng nói
	 * @param {Object} options - Tùy chọn TTS
	 * @param {string} options.text - Văn bản cần chuyển đổi
	 * @param {string} [options.voiceCode] - Mã giọng đọc
	 * @param {string} [options.audioType='mp3'] - Định dạng audio (mp3, wav)
	 * @param {number} [options.bitrate=128] - Bitrate (8, 16, 32, 64, 128)
	 * @param {number} [options.speedRate=1.0] - Tốc độ đọc (0.1 - 1.9)
	 * @param {string} [options.callbackUrl] - Webhook nhận kết quả
	 * @returns {Promise<Object>} Kết quả từ API
	 */
	async textToSpeech(options) {
		try {
			const {
				text,
				voiceCode = this.defaultVoice,
				audioType = 'mp3',
				bitrate = 128,
				speedRate = 1.0,
				callbackUrl = this.callbackUrl
			} = options;

			// Validate input
			if (!text || text.trim().length === 0) {
				throw new Error('Text không được để trống');
			}

			if (!callbackUrl) {
				throw new Error('Callback URL là bắt buộc');
			}

			// Validate speed_rate (0.1 - 1.9, 1 chữ số thập phân)
			if (speedRate < 0.1 || speedRate > 1.9) {
				throw new Error('speed_rate phải từ 0.1 đến 1.9');
			}

			// Validate bitrate
			const validBitrates = [8, 16, 32, 64, 128];
			if (!validBitrates.includes(bitrate)) {
				throw new Error(`bitrate phải là một trong: ${validBitrates.join(', ')}`);
			}

			// Validate audio_type
			const validAudioTypes = ['mp3', 'wav'];
			if (!validAudioTypes.includes(audioType)) {
				throw new Error(`audio_type phải là: ${validAudioTypes.join(' hoặc ')}`);
			}

			const requestData = {
				app_id: this.appId,
				response_type: 'indirect',
				callback_url: callbackUrl,
				input_text: text,
				voice_code: voiceCode,
				audio_type: audioType,
				bitrate: bitrate,
				speed_rate: speedRate
			};

			logger.info('Sending TTS request', {
				textLength: text.length,
				voiceCode,
				audioType
			});

			const response = await axios.post(this.apiUrl, requestData, {
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-Type': 'application/json'
				},
				timeout: 30000
			});

			const { data } = response;

			// Kiểm tra status
			if (data.status === 0) {
				logger.error('TTS API error', {
					errorCode: data.error_code,
					errorMessage: data.error_message
				});
				throw new Error(`TTS API Error: ${data.error_message} (Code: ${data.error_code})`);
			}

			logger.info('TTS request successful', {
				requestId: data.result?.request_id,
				characters: data.result?.characters,
				status: data.result?.status
			});

			return {
				success: true,
				requestId: data.result?.request_id,
				characters: data.result?.characters,
				status: data.result?.status,
				data: data.result
			};

		} catch (error) {
			logger.error('TTS service error', {
				error: error.message,
				stack: error.stack
			});

			if (error.response) {
				// Lỗi từ API
				return {
					success: false,
					error: error.response.data?.error_message || 'API Error',
					errorCode: error.response.data?.error_code,
					statusCode: error.response.status
				};
			}

			// Lỗi khác (network, timeout, validation...)
			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Lấy thông tin request TTS
	 * @param {string} requestId - ID của request
	 * @returns {Promise<Object>}
	 */
	async getRequest(requestId) {
		try {
			const response = await axios.get(`https://vbee.vn/api/v1/request/${requestId}`, {
				headers: {
					'Authorization': `Bearer ${this.token}`
				},
				timeout: 10000
			});

			return {
				success: true,
				data: response.data
			};
		} catch (error) {
			logger.error('Get TTS request error', {
				requestId,
				error: error.message
			});

			return {
				success: false,
				error: error.message
			};
		}
	}

	/**
	 * Xử lý callback từ Vbee
	 * @param {Object} callbackData - Dữ liệu từ callback
	 * @returns {Object} Parsed callback data
	 */
	handleCallback(callbackData) {
		try {
			const {
				app_id,
				request_id,
				characters,
				voice_code,
				audio_type,
				speed_rate,
				sample_rate,
				bitrate,
				created_at,
				status,
				audio_link
			} = callbackData;

			logger.info('TTS callback received', {
				requestId: request_id,
				status,
				hasAudioLink: !!audio_link
			});

			// Lưu ý: Audio link chỉ có hiệu lực 3 phút
			if (status === 'SUCCESS' && audio_link) {
				logger.info('TTS conversion successful', {
					requestId: request_id,
					audioLink: audio_link,
					characters
				});
			} else if (status === 'FAILURE') {
				logger.error('TTS conversion failed', {
					requestId: request_id
				});
			}

			return {
				success: status === 'SUCCESS',
				requestId: request_id,
				audioLink: audio_link,
				characters,
				voiceCode: voice_code,
				audioType: audio_type,
				speedRate: speed_rate,
				sampleRate: sample_rate,
				bitrate,
				createdAt: created_at,
				status
			};

		} catch (error) {
			logger.error('Callback handling error', {
				error: error.message
			});
			throw error;
		}
	}

	/**
	 * Download audio từ link (trong vòng 3 phút)
	 * @param {string} audioLink - Link audio từ callback
	 * @param {string} savePath - Đường dẫn lưu file
	 * @returns {Promise<boolean>}
	 */
	async downloadAudio(audioLink, savePath) {
		try {
			const fs = require('fs');
			const path = require('path');

			const response = await axios.get(audioLink, {
				responseType: 'stream',
				timeout: 60000
			});

			// Đảm bảo thư mục tồn tại
			const dir = path.dirname(savePath);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			const writer = fs.createWriteStream(savePath);
			response.data.pipe(writer);

			return new Promise((resolve, reject) => {
				writer.on('finish', () => {
					logger.info('Audio downloaded successfully', { savePath });
					resolve(true);
				});
				writer.on('error', (error) => {
					logger.error('Audio download error', { error: error.message });
					reject(error);
				});
			});

		} catch (error) {
			logger.error('Download audio error', {
				audioLink,
				error: error.message
			});
			return false;
		}
	}

	/**
	 * Cập nhật token mới
	 * @param {string} newToken - Token mới
	 */
	updateToken(newToken) {
		this.token = newToken;
		logger.info('TTS token updated');
	}
}

module.exports = VbeeTTSService;