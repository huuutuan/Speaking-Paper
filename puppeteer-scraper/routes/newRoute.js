const express = require("express");
const multer = require("multer");
const {getTitleImg, getNewById, getNewsHome, getNewsbyTopic, signup, login, logout, verifyEmail, fogotPassword, resetPassword, checkAuth } = require("../controllers/newController");
const { verifyToken } = require("../middleware/verifyToken");
// const { addNew } = require("../controllers/newController.js");


const newRouter = express.Router();

// im
newRouter.get("/getNews", getNewById);
newRouter.get("/getNewsHome", getNewsHome);
newRouter.get("/getNewsTopic", getNewsbyTopic);
newRouter.get("/check-auth", verifyToken, checkAuth);

newRouter.post("/signup", signup);
newRouter.post("/login", login);
newRouter.post("/logout", logout)
newRouter.post("/verifyEmail", verifyEmail)
newRouter.post("/forgotPassword", fogotPassword)
newRouter.post("/resetPassword/:token", resetPassword)
// newRouter.post("/add", addNews);

module.exports = {newRouter};