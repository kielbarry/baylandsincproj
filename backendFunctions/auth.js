require("dotenv").config();

const
	jwt = require("jsonwebtoken"),
	jwtToken = process.env.JWT_TOKEN;


module.exports = (req, res, next) => {
	try {
		const b = req.headers.authorization.split(" ")[1]	
		const decoded = jwt.verify(b, jwtToken, null)
		console.log("jwt verify result", )
		req._userData = decoded;
		next();
	} catch(error) {
		console.log("error jwt", error)
		return res.status(401).json({message: "auth failure"})
	}
}