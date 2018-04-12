const path = require("path");

require("dotenv").config({ path : path.join(__dirname, "../.env") });

const
	bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	jwtToken = process.env.JWT_TOKEN,
	salt = process.env.BCRYPT_SALT,
	models = require("../db/models.js"),
	pg = require('pg'),
	username = process.env.PGUSER,
	password = process.env.PGPASSWORD,
	host = process.env.PGHOST,
	database = process.env.PGDATABASE,
	port = process.env.PGPORT,
	conn = process.env.DATABASE_URL || `postgres://${username}:${password}@${host}:${port}/${database}`,
	client = new pg.Client(conn);


// module.exports = (req, res, next) => {
// 	try {
// 		const b = req.headers.authorization.split(" ")[1]	
// 		// const decoded = jwt.verify(b, jwtToken, null)
// 		// console.log("jwt verify result", )
// 		req._userData = jwt.verify(b, jwtToken, null);
// 		next();
// 	} catch(error) {
// 		console.log("error jwt", error)
// 		return res.status(401).json({message: "auth failure"})
// 	}
// }

module.exports = {
	check: checkAuth,
	createUser
}

async function checkAuth (req, res, next) {
	try {
		const b = req.headers.authorization.split(" ")[1]	
		// const decoded = jwt.verify(b, jwtToken, null)
		// console.log("jwt verify result", )
		req._userData = jwt.verify(b, jwtToken, null);
		next();
	} catch(error) {
		console.log("error jwt", error)
		return res.status(401).json({message: "auth failure"})
	}
}



async function createUser(req, res, next) {

	models.user.versionid = "0";
	models.user.createdat = new Date();
	models.user.firstname = req.body.firstname ;
	models.user.lastname = req.body.lastname;
	models.user.fullname = req.body.firstname + " " + req.body.lastname;
	models.user.email = req.body.email;
	models.user.phoneNumber = req.body.phoneNumber;


 	bcrypt.hash(req.body.password, parseInt(salt), async function(err, hash) {
 		// console.log("models.user", models.user)
 		console.log("req.body.password", req.body.password)
 		console.log("hash", hash)
 		console.log("salt", salt)
	  	try{
			await client.connect();
			var result = await client.query(`INSERT INTO users ( 
				versionid, createdat, firstname, lastname, 
				fullname, email, passwordHash, phonenumber,
				emailverified, phoneverified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
				[
				models.user.versionid,
				models.user.createdat,
				models.user.firstname,
				models.user.lastname,
				models.user.fullname,
				models.user.email,
				hash,
				models.user.phoneNumber.toString(),
				false,
				false
				]);
			await client.end();
			console.log("result at bottom", result)

		} 
		catch(error) {
			console.log(error)
		}
	});
}





