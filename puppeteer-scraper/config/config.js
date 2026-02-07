// const db = require("mongoose")

// const connectDB = async () => {
// 	await db.connect("mongodb+srv://huutuan2001:huutuan2001@huutuan2001.7his2.mongodb.net/?retryWrites=true&w=majority&appName=huutuan2001").then(()=> console.log("DB Connected"));
// }
// module.exports = { connectDB }
require('dotenv').config();

module.exports = {
	env: process.env.NODE_ENV || 'development',
	mongodb: {
		url: process.env.MONGO_URL,
		option: {
			//connection pool
			maxPoolSize: 10,
			minPoolSize: 2,

			//timeouts
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,

			//retry
			retryWrites: true,
			retryReads: true,

			//monitoring
			monitorCommands: true,
		}
	},

	logging: {
        level: process.env.LOG_LEVEL || 'info',
        errorFile: process.env.LOG_FILE_ERROR || 'logs/error.log',
        combinedFile: process.env.LOG_FILE_COMBINED || 'logs/combined.log'
    	},
	
	redis: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT),
		password: process.env.REDIS_PASSWORD,
		maxRetriesPerRequest: 3
	},
	fetch: {
		concurrency: parseInt(process.env.FETCH_CONCURRENCY, 10) || 3,
		retryAttempts: parseInt(process.env.FETCH_RETRY_ATTEMPTS, 10)|| 3,
		retryDelay: parseInt(process.env.FETCH_RETRY_DELAY, 10) || 2000,
		aricleDelay: parseInt(process.env.ARTICLE_REQUEST_DELAY, 10) || 1000
	},
	vbee: {
		appId: process.env.VBEE_APP_ID,
		apiKey: process.env.VBEE_API_KEY,
		defaultVoice: process.env.VBEE_DEFAULT_VOICE,
		callbackUrl: process.env.VBEE_CALLBACK_URL
	}
	

	// redis: {
		
	// }
};

// const {MongoClient, ServerApiVersion} = require("mongodb")
// const uri = "mongodb+srv://huutuan2001:huutuan2001@huutuan2001.7his2.mongodb.net/?retryWrites=true&w=majority&appName=huutuan2001";





// async function connectDB() {
// 	try {
// 		await client.connect();
// 		await client.db("newsData").command({ping:1});
// 		console.log("connected to DB");
		
// 		// console.log(`a document was inserted with the _id: ${result.insertedId}`);
		
		
// 	} finally{
// 		// await client.close();
// 	}
// }

// async function insertNews2DB(news1) {
// 	const mydb = client.db("newsData"); 
// 	const myColl = mydb.collection("newsss");

// 	try {
// 		const insertNew = await myColl.insertOne(news1);
// 		console.log(`id:${insertNew.insertedId} `);
		
		
// 	}catch(e) {
// 		console.log(e);
		
// 	}
// }

// async function fetchNews(date) {
// 	const mydb = client.db("newsData");
// 	const myColl = mydb.collection("newsss");
// 	try {
// 		const query = {}
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

// const newsSchema = new mongoose.Schema({
// 	title: String,
// 	date: String,
// 	author: String,
// 	image: String,
// 	content: Array,
// 	topic: String,
// 	description: String,
// })

// module.exports = {connectDB, insertNews2DB};