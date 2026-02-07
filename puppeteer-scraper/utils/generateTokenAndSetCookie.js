const jwt = require('jsonwebtoken')

const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({userId}, process.env.JWT_SECRET, {
		expiresIn: "30d",
	})
	console.log(token);
	
	res.cookie("token", token, {
		httpOnly: true, // xss actack
		secure: process.env.NODE_ENV === 'production',
		sameSite: "strict", // csrf atack
		maxAge: 30 * 24 * 60 * 60 * 1000,

	})
	return token
} 
module.exports = {generateTokenAndSetCookie}