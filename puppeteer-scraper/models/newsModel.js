const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
	title: {
		type:String,
		require: true,
		default: 0
	},
	date: {
		type:String,
		require: true,
		default: 0
	},
	author: {
		type:String,
		require: true,
		default: 0
	},
	image: {
		type:String,
		require: false,
		default: 0
	},
	content: {
		type:Array,
		require: true,
		default: 0
	},	
	topic: {
		type:String,
		require: true,
		default: 0
	},
	description: {
		type:String,
		require: true,
		default: 0
	},
	link: {
		type:String,
		require:true,
		default:0,
	},
},{
	timestamps: true
})

const NewsModel = mongoose.model("newssss", newsSchema);
const ThoiSuModel = mongoose.model("thoi_su", newsSchema);
const GocnhinModel = mongoose.model("goc_nhin", newsSchema);
const TintheogioiModel = mongoose.model("tin_theo_gioi", newsSchema);
const GiaitriModel = mongoose.model("giai_tri", newsSchema);
const DunngboloModel = mongoose.model("duong_bo_lo", newsSchema);
const TrangchuModel = mongoose.model("trang_chu", newsSchema);
module.exports = {NewsModel, ThoiSuModel, GocnhinModel, TintheogioiModel, GiaitriModel, DunngboloModel, TrangchuModel};