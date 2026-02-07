module.exports = {
	// Cấu hình Vbee TTS API
	vbee: {
		appId: process.env.VBEE_APP_ID || 'your_app_id',
		token: process.env.VBEE_API_KEY || 'your_bearer_token',
		defaultVoice: process.env.VBEE_DEFAULT_VOICE || 'hn_female_ngochuyen_full_48k-fhg',
		callbackUrl: process.env.VBEE_CALLBACK_URL
	},

	// Cấu hình tự động tạo audio
	autoGenerate: {
		enabled: true,
		textSource: 'summary', // Lấy text từ summary
		voiceCode: 'hn_female_ngochuyen_full_48k-fhg',
		audioType: 'mp3', // 'mp3' hoặc 'wav'
		bitrate: 128, // 8, 16, 32, 64, 128
		speedRate: 1.0, // 0.1 - 1.9
		sampleRate: null, // null = auto, hoặc số cụ thể tùy giọng
		emphasisIntensity: null, // 0-100 (bội số 10), chỉ cho giọng có hỗ trợ
		concurrency: 2, // Số audio tạo đồng thời
		delay: 2000, // Delay giữa các requests (ms)
		minTextLength: 1, // Độ dài text tối thiểu
		maxTextLength: 5000 // Độ dài text tối đa
	},

	// Storage settings (MongoDB)
	storage: {
		expirationDays: 3, // Số ngày lưu audio trong MongoDB
		maxFileSizeMB: 4, // Giới hạn file size (MongoDB document < 16MB)
		cleanupSchedule: '0 2 * * *' // Cron schedule cleanup (2AM hàng ngày)
	},

	// Danh sách giọng đọc phổ biến
	voices: {
		// Giọng nữ Hà Nội
		hn_female_ngochuyen: {
			code: 'hn_female_ngochuyen_full_48k-fhg',
			name: 'Ngọc Huyền',
			region: 'Hà Nội',
			gender: 'female',
			description: 'Giọng nữ Hà Nội chuẩn, tự nhiên'
		},
		hn_female_thuminh: {
			code: 'hn_female_thuminh_full_48k-fhg',
			name: 'Thu Minh',
			region: 'Hà Nội',
			gender: 'female',
			description: 'Giọng nữ Hà Nội trẻ trung'
		},
		
		// Giọng nam Hà Nội
		hn_male_xuantin: {
			code: 'hn_male_xuantin_full_48k-fhg',
			name: 'Xuân Tín',
			region: 'Hà Nội',
			gender: 'male',
			description: 'Giọng nam Hà Nội lịch thiệp'
		},
		
		// Giọng nữ miền Nam
		sg_female_myan: {
			code: 'sg_female_myan_full_48k-fhg',
			name: 'My An',
			region: 'Miền Nam',
			gender: 'female',
			description: 'Giọng nữ miền Nam dễ nghe'
		},
		
		// Giọng nam miền Nam
		sg_male_minh: {
			code: 'sg_male_minh_full_48k-fhg',
			name: 'Minh',
			region: 'Miền Nam',
			gender: 'male',
			description: 'Giọng nam miền Nam ấm áp'
		}
	},

	// Retry settings
	retry: {
		maxRetries: 3,
		retryDelay: 5000, // 5 giây
		retrySchedule: '0 */6 * * *' // Mỗi 6 giờ
	}
};