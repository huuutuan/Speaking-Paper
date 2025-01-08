// const fs = require("fs");
const {NewsModel, ThoiSuModel, DunngboloModel, GiaitriModel, GocnhinModel, TintheogioiModel, TrangchuModel } = require("../models/newsModel");

const { log } = require("console");
// const { title } = require("process");
// const newModel = require("../models/newsModel");

let date_ob = new Date;


const date1 = date_ob.toLocaleDateString();
const date = date_ob.getDate().toString();
const month = date1.slice(0,2);
const year = date_ob.getFullYear().toString();
const today = date + "/" + month +"/"+ year;
// console.log(today);

const getNewById = async (req, res) => {
	try {
		const id = req.query.id;
		console.log(id);
		const topic = req.query.topic;
		console.log(topic);
		let news = null;
		switch (topic) {
			case "thoi_sus":
				news = await ThoiSuModel.findById(id);
				break;
			case "khampha":
				news = await TrangchuModel.findById(id);
				break;
			case "tin_the_giois":
				news = await TintheogioiModel.findById(id);
				break;
			case "giai_tris":
				news = await GiaitriModel.findById(id);
				break;
			case "goc_nhins":
				news = await GocnhinModel.findById(id);
				break;
			case "duong_bo_los":
				news = await DunngboloModel.findById(id);
				break;
			default:
				console.log("Invalid news");
		}
		// const news = await NewsModel.findById(id);
		return res.send({
			result: "success",
			new: news,
		})
	} catch (error) {
		console.log(error);
		res.send({success: false, message: "Error"})
	}
}

const getNewsHome = async (req, res) => {
	try {	
		
		const page = req.query.page;

		// const news = await NewsModel.find({ date: { "$regex": 'Thứ ba, 10/12/2024,'} }).limit(28).select({title: 1, image: 1, link:1});
		// const news = await getNews1(page, 28);
		const skip = (page-1)*28;
		const news = await TrangchuModel.find({})
		.sort({ _id: -1 })
		.skip(skip)
		.limit(28)
		console.log(page);
		return res.send({
			result: "success",
			a: news,
			page: page,
		})
	} catch (error) {
		console.log(error);
	}
}

const getNewsbyTopic = async (req, res) => {
	try {	
		const topic = req.query.topic;
		console.log(topic);
		let news = null;
		const page = req.query.page;

		// const news = await NewsModel.find({ date: { "$regex": 'Thứ ba, 10/12/2024,'} }).limit(28).select({title: 1, image: 1, link:1});
		// const news = await getNews1(page, 28);
		const skip = (page-1)*28;
		switch (topic) {
			case "thoi_sus":
				news = await ThoiSuModel.find({})
				.sort({ _id: -1 })
				.skip(skip)
				.limit(28);
				break;
			case "tin_the_giois":
				news = await TintheogioiModel.find({})
				.sort({ _id: -1 })
				.skip(skip)
				.limit(28);
				break;
			case "giai_tris":
				news = await GiaitriModel.find({})
				.sort({ _id: -1 })
				.skip(skip)
				.limit(28);
				break;
			case "goc_nhins":
				news = await GocnhinModel.find({})
				.sort({ _id: -1 })
				.skip(skip)
				.limit(28);
				break;
			case "duong_bo_los":
				news = await DunngboloModel.find({})
				.sort({ _id: -1 })
				.skip(skip)
				.limit(28);
				break;
			default:
				console.log("Invalid topic");
		}
		// console.log(page);
		return res.send({
			result: "success",
			a: news,
			page: page,
		})
	} catch (error) {
		console.log(error);
	}
}


const getNews1 = async (page, newsSize) => {
	try {
		const skip = (page-1)*newsSize;	
		const news = await NewsModel.find({})
		.sort({ _id: -1 })
		.skip(skip)
		.limit(newsSize)
		return news;
		
	} catch (error) {
		console.log(error);
		return [];
	}
}
const getTitleImg = async (req, res) => {
	try {	
		const page = req.query.page;

		// const news = await NewsModel.find({ date: { "$regex": 'Thứ ba, 10/12/2024,'} }).limit(28).select({title: 1, image: 1, link:1});
		const news = await getNews1(page, 28, topic);
		console.log(page);
		
		return res.send({
			result: "success",
			a: news,
			page: page,
		})
	} catch (error) {
		console.log(error);
	}
}

// const addNews = async (req, res) => {
// 	const newssssss = new newModel({
// 		title: req.body.title,
// 		date: req.body.date,
// 		author: req.body.author,
// 		image: req.body.image,
// 		topic: req.body.topic,
// 		content: req.body.content,
// 		description: req.body.description,
// 	})
// 	try {	
// 		await newssssss.save();
// 		res.send(newssssss)
// 	} catch (error) {
// 		console.log(error);
		
// 	}
// }

module.exports = {getNewById, getTitleImg, getNewsHome, getNewsbyTopic};