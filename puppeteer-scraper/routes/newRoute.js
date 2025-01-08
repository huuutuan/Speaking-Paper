const express = require("express");
const multer = require("multer");
const {getTitleImg, getNewById, getNewsHome, getNewsbyTopic } = require("../controllers/newController");
// const { addNew } = require("../controllers/newController.js");


const newRouter = express.Router();

// im
newRouter.get("/getNews", getNewById);
newRouter.get("/getNewsHome", getNewsHome);
newRouter.get("/getNewsTopic", getNewsbyTopic);
// newRouter.post("/add", addNews);

module.exports = {newRouter};