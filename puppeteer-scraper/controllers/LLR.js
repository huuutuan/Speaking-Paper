// const fs = require("fs");
const {NewsModel, ThoiSuModel, DunngboloModel, GiaitriModel, GocnhinModel, TintheogioiModel, TrangchuModel } = require("../models/newsModel");
const crypto = require("crypto");
const { log } = require("console");
const { User } = require("../models/userModel");
const bcrypt = require('bcryptjs');
const { generateTokenAndSetCookie } = require("../utils/generateTokenAndSetCookie");
const { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendSuccessPasswordResetEmail } = require("../mailtrap/email");
const { send } = require("process");
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

const signup = async (req, res) => {
	const {email, password, name} = req.body;
	console.log(email, password, name);
	

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}
		const userAlreadyExists = await User.findOne({email});
		console.log(userAlreadyExists);
		
		if (userAlreadyExists) {
			return res.status(400).json({success: false, message: "User already exists"});
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 * 30 // 1 thang
		})
		await user.save();

		await sendVerificationEmail(user.email, verificationToken);

		// jwt

		generateTokenAndSetCookie(res, user._id)
		res.status(201).json({
			success: true,
			message: "User created Successfully",
			user: {
				...user._doc,
				password: undefined,
			}
		})
	} catch (error) {
		res.status(400).json({success: false, message: error.message});
		console.log(error);
	}
	// res.send("signup route")
}


const verifyEmail = async(req, res) => {
	const {code} = req.body
	console.log(code);
	try {
		const user = await User.findOne({
			verificationToken: code,
			// verificationTokenExpiresAt: {  : Date.now() },
		})
		console.log(user);
		console.log(!user);
		
		
		if (!user){
			return res.status(400).json({success: false, message: "Invalid or Expired Verification code"});
		}
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);
		res.status(200).json({success: true, message: "Email verified successfully", user : {...user._doc, password: undefined}});

		
	} catch (error) {
		
	}
	
}

const login = async (req, res) => {
	// res.send("login route")
	const {email, password} = req.body;
	try {
		const user = await User.findOne({email});
		if (!user) {
			return res.status(400).json({success: false, message: "Invalid credentials"});
		}
		const isPassword = await bcrypt.compare(password,user.password);
		if (!isPassword) {
			return res.status(400).json({success: false, message: "Invalid credentials"});
		}
		generateTokenAndSetCookie(res,user._id);

		user.lastLogin = new Date(); 
		await user.save();

		res.status(200).json({success: true, message: "Login successfully", user: {...user._doc, password: undefined}});
		
		
	} catch (error) {
		console.log("Error in login", error);
		res.status(400).json({success: false, message: error.message});
	}
}

const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({success:true, message:"Logged out successfully"});
}

const checkAuth = async(req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			res.status(400).json({success: false, message: "User not found"});
		}
		res.status(200).json({success: true, user});
	} catch (error) {
		console.log("Error in checkAuth", error);
		res.status(400).json({success: false, message: error.message});
		
	}
}

const fogotPassword = async (req, res) => {
	const {email} = req.body;
	try {
		const user = await User.findOne({email});
		if (!user) {
			return res.status(400).json({success: false, message: "User not found"});
		}
		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 h

		user.resetPasswordToken = resetToken; 
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		//send email
		await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
		res.status(200).json({success: true, message: "Password reset link sent to your email"});
	} catch (error) {
		console.log("Error in forgot password", error);
		res.status(400).json({success: false, message: error.message});
	}
}
const resetPassword = async (req, res) => {
	const token = req.params
	const {password} = req.body;
	try {
		
	
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() }
		})

		if(!user) {
			return res.status(400).json({success: false, message: "Invalid or Expired reset token"});
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendSuccessPasswordResetEmail(user.email);
		res.status(200).json({success: true, message: "Password reset successfully"});
	} catch (error) {
		console.log("Error in reset Password", error.message);
		res.status(400).json({success: false, message: error.mesage});
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



module.exports = {getNewById, getTitleImg, getNewsHome, getNewsbyTopic, login, logout, signup, verifyEmail, fogotPassword, resetPassword, checkAuth};