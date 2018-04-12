require("dotenv").config({ path : path.join(__dirname, "../.env") })

const
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


module.exports = (req, res, next) => {
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
	models.user = req.body

 	bcrypt.hash(req.body.password, salt, function(err, hash) {
	  	try{
			await client.connect();
			var res = await client.query(`INSERT INTO users (id, 
				versionid, createdat, firstname, lastname, 
				fullname, email, passwordHash, activationCode, 
				emailVerified, phoneVerified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11",`, [...user]);
				await client.end();
		} 
		catch(error) {
			console.log(error)
		}
	});
}