require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const cookieParser = require("cookie-parser");
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const {createBullBoard} = require('@bull-board/api');
const {BullAdapter} = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
// const { connectDB, insertNew2DB } = require("./config/db.js");
// const { newRouter } = require("./routes/newRoute.js");
// const { scraper } = require("./scraper/scraper.js");
// const { newsModel } = require("./models/newsModel.js");
// const mongoose = require("mongoose");
// const NewsModel = require("./models/newsModel.js");

const logger = require('./utils/logger.js');
const errorHandler = require('./middleware/errorHandler.js');
const rateLimiter = require('./middleware/rateLimiter.js');


// Services
const FetchService = require('./service/fetch.js');
const { getInstance: getDB } = require('./service/database.js');
const ArticleService = require('./service/articleSrv.js');
const QueueService = require('./service/queue.js');
const { version } = require("joi");


//Routes
const healthRoutes = require('./routes/health.js');
const feedsRoutes = require('./routes/feeds.js');
const articlesRoutes = require('./routes/articles.js');
const statsRoutes = require('./routes/stats.js'); 
const article = require("./validators/article.js");
const articleAudioRoutes = require("./routes/articleAudio.js");


const app = express ();
const PORT = process.env.PORT || 3000;
logger.info(PORT);
// app.use(express.json()); // allow us to parse incoming request: req.body
// app.use(cookieParser()); // allow us to parse incoming cookies
// app.use(cors());z


//Middlewares
app.use(helmet()); // secutiry headers
app.use(cors()); // enable CORS
app.use(express.json({ limit: '10mb' }));// compress responses
app.use(express.urlencoded({ extended: true, limit: '10mb'}));
app.use(mongoSanitize()); // prevent NoSQL injection attacks
//audio routes
// app.use('/api/v1/articles/audios', articleAudioRoutes);
//Rate limiting
app.use('/api', rateLimiter);

//request logging
if(process.env.NODE_ENV === 'production') {
	app.use((req, res, next) => {
		logger.info(`${req.method} ${req.path}`);
		next();
	});
}

// initialize services
let db, articleService, fetchService, queueService;

async function initializeServices() {
	try {
		logger.info('Initializing services...');

		// connect to db
		db = getDB();
		await db.connect();

		//initialize article service
		articleService = new ArticleService();
		articleService.initialize(db.getConnection());

		//initialize fetcher service
		const concurrency = parseInt(process.env.FETCH_CONCURRENVY, 10) || 3;
		fetchService = new FetchService(articleService, concurrency);

		// initialize queue service
		queueService = new QueueService();

		//setup queue processor
		queueService.getQueue().process('fetch-feed', 3, async (job) => {
			const { feed } = job.data;
			logger.info('Processing queue job', {
				jobId: job.id,
				category: feed.category
			});

			const result = await fetchService.fetchFeed(feed);
			return result;
		});

		logger.info('All services initialized successfully');
		
	} catch (error) {
		logger.error('Failed to initialize services', { error: error.message});
		process.exit(1);
	}
}

//Root endpoint
app.get("/", (req, res) => {
	res.json({
		name: 'VnExpress Rss tracker API',
		version: '1.0.0',
		description: 'tracker articles from VnExpress Rss feeds',
		endpoints: {
			health: '/health',
			articles: '/api/v1/articles',
			feeds: '/api/v1/feeds',
			stats: '/api/v1/stats',
			queue: '/admin/queues'
		},
		features: [
			'Mongoose schema validation',
			'Raw MongoDB aggregation',
			'Bull queue processing',
			'Full-text search',
			'Rate limiting',
			'Health checks',
			'Queue dashboard'
		],
		documentation: 'a'
	})
});



// Bull Board (queue dashboard)


//404 handle


//Error handler


//Start Server
async function startServer() {
	try {
		await initializeServices();
		
		// Health check (no rate limit)
		app.use('/health', healthRoutes(db));

		// API ROUTES
		app.use('/api/v1/articles', articlesRoutes(articleService));
		app.use('/api/v1/stats', statsRoutes(articleService));
		app.use('/api/v1/feeds', feedsRoutes(queueService));
		app.use('/api/v1/articles/audios', articleAudioRoutes);

		const serverAdapter = new ExpressAdapter();
		serverAdapter.setBasePath('/admin/queues');

		createBullBoard({
			queues: [new BullAdapter(queueService.getQueue())],
			serverAdapter: serverAdapter
		});

		app.use('/admin/queues', serverAdapter.getRouter());

		app.use((req, res) => {
			res.status(404).json({
				success: false,
				message: 'Route bot found',
				path: req.path
			});
		});
		app.use(errorHandler);

		const server = app.listen(PORT, () => {
			logger.info('='.repeat(50));
			logger.info(`Server Listening on Port: ${PORT}`);
			logger.info(`Enviroment: ${process.env.NODE_ENV || 'development'}`);
			logger.info(`Health Check: http://localhost:${PORT}/health`);
			logger.info(`API Base http://localhost:${PORT}/api/v1`);
			logger.info(`Queue Dashbord: http://localhost:${PORT}/admin/queues`);
			logger.info('='.repeat(50));
		});

		
		//graceful shutdown
		const gracefulShutdown = async (signal) => {
			logger.info(`${signal} received, shutting down gracefully`);

			server.close(async () => {
				logger.info('HTTP server closed');

				try {
					await queueService.getQueue().close();
					logger.info('Queue service closed');

					await db.close();
					logger.info('Database connection closed');

					logger.info('Graceful shutdown completed');
					process.exit(0);
				} catch(e) {
					logger.error('Error during shutdown', { error: e.message});
					process.exit(1);
				}
			});

			//Force shutdown after 30 seconds
			setTimeout(() => {
				logger.error('Forced shutdown after timeout');
				process.exit(1);
			}, 30000);
		};

		process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
		process.on('SIGINT', () => gracefulShutdown('SIGINT'));
	} catch (error) {
		logger.error('Failed to start server', { error: error.message});
		process.exit(1);
	}

}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
	logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection', { reason });
	logger.error('Promise', {promise});
	process.exit(1);
});

startServer();
// app.listen(PORT, () => {
// 	console.log("Server Listening on Port: ", PORT);
// })

// app.get("/", (req, res) => {
// 	const status = {
// 		"Status": "Running"
// 	};

// 	res.send(status);
// })

// app.use("/api/news", newRouter)


// connectDB();

// scraper()
// let myPromise = new Promise(function(myRe))


// const data = await scraper();

// const new1 = {
// 	title: 'Lãnh đạo thế giới ca ngợi lệnh ngừng bắn Israel - Hezbollah ',
//   	date: 'Thứ tư, 27/11/2024, 09:15 (GMT+7)',
//   	author: 'Thanh Danh (Theo AFP)',
//   	image: '',
// 	  content: [
// 	  'Văn phòng Thủ tướng Benjamin Netanyahu ngày 26/11 thông báo Israel đồng ý ngừng bắn với Hezbollah, sau khi 10 bộ trưởng bỏ phiếu thuận và một người bỏ phiếu chống. Tổng thống Mỹ Joe Biden thông báo lệnh ngừng bắn sẽ bắt đầu lúc 4h (9h giờ Hà Nội) ngày 27/11.',
//     	'Trong phát biểu sau đó, lãnh đạo Mỹ, quốc gia đóng vai trò trung tâm trong thúc đẩy thỏa thuận, khẳng định đây là bước đi cần thiết để mang lại ổn định cho khu vực và nhấn mạnh chính phủ Lebanon sẽ chịu trách nhiệm kiểm soát khu vực biên giới, ngăn chặn Hezbollah tái lập hạ tầng quân sự.',
//   	  'Tổng thống Pháp Emmanuel Macron ca ngợi thỏa thuận ngừng bắn là bước khởi đầu để tiến tới kết thúc chiến sự ở Dải Gaza. Ông hy vọng thỏa thuận thúc đẩy tiến trình hòa bình bền vững tại Trung Đông, đồng thời cam kết hỗ trợ Lebanon duy trì chủ quyền và ổn định.',
//   	  '"Thỏa thuận này nên mở đường cho một lệnh ngừng bắn mà người dân Gaza đã chờ đợi quá lâu. Điều này cho thấy chỉ có lòng dũng cảm chính trị mới mang lại hòa bình và ổn định lâu dài cho tất cả mọi người ở Trung Đông", Tổng thống Macron cho hay.',
//   	  'Thủ tướng Lebanon Najib Mikati nói rằng lệnh ngừng bắn là "bước cơ bản" để khôi phục ổn định. Ông cảm ơn sự hỗ trợ của Pháp và Mỹ, đồng thời cam kết chính phủ Lebanon sẽ "tăng cường sự hiện diện của quân đội ở miền nam".',
//   	  'Thủ tướng Anh Keir Starmer khẳng định lệnh ngừng bắn là "giải pháp đáng ra phải có từ lâu" nhằm mang lại "sự bình yên cho dân thường ở cả hai quốc gia". Ông kêu gọi biến lệnh ngừng bắn thành "giải pháp chính trị lâu dài ở Lebanon", cam kết Anh sẽ "đi đầu trong nỗ lực phá vỡ chu kỳ bạo lực hiện nay để hướng tới hòa bình bền vững tại Trung Đông".',
//  	   'Đặc phái viên Liên Hợp Quốc tại Lebanon Jeanine Hennis-Plasschaert hoan nghênh thỏa thuận nhưng cảnh báo về những thách thức trong quá trình thực thi. "Chỉ có cam kết toàn diện và không lay chuyển từ cả hai phía mới đảm bảo lệnh ngừng bắn được thực hiện thành công", bà nhấn mạnh.',
//   	  'Ngoại trưởng Đức Annalena Baerbock gọi thỏa thuận này là "tia hy vọng cho cả khu vực". "Người dân ở cả hai bên biên giới đều muốn sống trong an ninh thực sự và lâu dài. Đây là thành công của ngoại giao", bà nói.',
//  	   'Chủ tịch Ủy ban châu Âu Ursula von der Leyen bày tỏ lạc quan, gọi thỏa thuận là "tin tức rất đáng khích lệ" và nhận định rằng nó sẽ giúp Lebanon tăng cường "an ninh và ổn định nội bộ".',
//   	  'Theo thỏa thuận do Mỹ - Pháp làm trung gian, Israel sẽ dần dần rút quân khỏi miền nam Lebanon trong vòng 60 ngày. Hezbollah chấm dứt hiện diện vũ trang ở phía nam sông Litani, cách biên giới với Israel khoảng 29 km.',
//   	  'Quân đội Lebanon sẽ quản lý vùng lãnh thổ sát biên giới với Israel để đảm bảo Hezbollah không tái xây dựng cơ sở hạ tầng tại đây. Bộ trưởng Ngoại giao Lebanon Abdallah Bou Habib cho biết quân đội Lebanon sẵn sàng triển khai ít nhất 5.000 binh sĩ.',
//   	  'Thủ tướng Netanyahu cho biết lệnh ngừng bắn sẽ giúp Israel tập trung vào mối đe dọa từ Iran, khôi phục kho vũ khí và cho binh sĩ nghỉ ngơi, đồng thời cô lập Hamas, đồng minh của Hezbollah cùng nằm trong Trục Kháng chiến do Iran dẫn đầu. Ông cảnh báo Israel không ngần ngại đáp trả mạnh mẽ nếu Hezbollah vi phạm thỏa thuận ngừng bắn hoặc cố gắng tái vũ trang.',
//   	  'Giao tranh giữa Hezbollah và Israel bùng phát tháng 10/2023, sau cuộc đột kích của Hamas vào miền nam Israel. Hezbollah phóng rocket và máy bay không người lái (UAV) vào miền bắc Israel, cho biết đây là hành động ủng hộ đồng minh Hamas, khiến Tel Aviv đáp trả.',
//   	  'Giao tranh leo thang trong vài tháng gần đây khi Israel liên tục hạ sát thành viên cấp cao của Hezbollah và đưa quân vào miền nam Lebanon.',
//   	  'Xung đột khiến hơn 3.800 người tại Lebanon thiệt mạng, phần lớn là nạn nhân trong các cuộc giao tranh và không kích gần đây. Giới chức Israel cho biết 82 binh sĩ và 47 thường dân nước này cũng thiệt mạng vì đụng độ.',
//    	 'Thanh Danh (Theo AFP)'
//   	],
//  	 topic: 'Thế giới\n\n',
//  	 description: 'Lãnh đạo nhiều nước hoan nghênh thỏa thuận giữa Israel và Hezbollah, kêu gọi hai bên đảm bảo thực thi đầy đủ lệnh ngừng bắn.'
// }

//connectDB
// connectDB();

// insertNew2DB(new1);

// api endpoints

// app.use("/api/new", newRouter())

// const openPage = async () => {
// 	const URL = "https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo";
// 	const browser = await puppeteer.launch({
// 		headless: false,
// 		defaultViewport: null,
// 	});	
// 	const page = await browser.newPage();
// 	await page.goto(URL, {waitUntil: "networkidle0"});

// 	let previousHeight = -1;
// 	let maxScrolls = 20;
// 	let scrollCount = 0;
// 	let shouldContinue = true;


	// while (scrollCount < maxScrolls && shouldContinue){
	// 	await page.evaluate(() => {
			
	// 		const abc = document.querySelector("#sidebar-quicklinks");
	// 		const a = abc.scrollHeight;
	// 		// console.log(a);
	// 		abc.scrollIntoView();
	// 		// abc.scrollTo(0, a);
	// 	})

	// 	setTimeout( async ()=>{
	// 		let newHeight = await page.evaluate(() => document.querySelector("#sidebar-quicklinks").scrollHeight);
	// 		if (newHeight == previousHeight){
	// 			shouldContinue = false;
	// 		}
	// 		previousHeight = newHeight;
	// 		scrollCount +=1;



	// 	}, 2000)
	// }
	// const abc = await page.locator('#root > msn-windows-page > fluent-design-system-provider > div.root > div.content').waitHandle();
	// abc.scrollIntoView();

// 	await page.evaluate(() => {
			
// 			const abc = document.querySelector("#sidebar-quicklinks");
// 			const a = abc.scrollHeight;
// 			console.log(a);
// 			abc.scrollIntoView({ behavior: "instant", block: "end" });
// 	})
		

// }
// openPage();
