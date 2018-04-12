require("dotenv").config();

const
	jwt = require("jsonwebtoken"),
	jwtToken = process.env.JWT_TOKEN;

// module.exports = {
// 	vjt: verifyJwtToken
// }
module.exports = (req, res, next) => {
	try {
		const decoded = jwt.verify(req.body.token, jwtToken, null)
	} catch(error) {
		return res.status(401).json({message: "auth failure"})
	}
}

// function verifyJwtToken(req, res, next) {
// 	try {
// 		const decoded = jwt.verify(req.body.token, jwtToken, null)
// 	} catch(error) {
// 		return res.status(401).json({message: "auth failure"})
// 	}

// }