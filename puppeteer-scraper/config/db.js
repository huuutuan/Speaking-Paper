// const db = require("mongoose")

// const connectDB = async () => {
// 	await db.connect("mongodb+srv://huutuan2001:huutuan2001@huutuan2001.7his2.mongodb.net/?retryWrites=true&w=majority&appName=huutuan2001").then(()=> console.log("DB Connected"));
// }
// module.exports = { connectDB }

const e = require("express");
const {MongoClient, ServerApiVersion} = require("mongodb")
const uri = "mongodb+srv://huutuan2001:huutuan2001@huutuan2001.7his2.mongodb.net/?retryWrites=true&w=majority&appName=huutuan2001";

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

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