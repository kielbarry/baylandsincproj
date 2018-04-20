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
	conn = process.env.DATABASE_URL || `postgres://${username}:${password}@${host}:${port}/${database}`;
	// client = new pg.Client(conn);


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
	login,
	createUser,
	verifyNexmo
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
	const t = jwt.sign({email: req.body.email, id: req.body._id}, jwtToken, {expiresIn: "2 days"});
 	bcrypt.hash(req.body.password, parseInt(salt), async function(err, hash) {
	  	try{

	  		const client = new pg.Client(conn);

			await client.connect();
			var pgresult = await client.query(`INSERT INTO users ( 
				versionid, createdat, firstname, lastname, 
				fullname, email, passwordHash, phonenumber,
				emailverified, phoneverified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
				[ "0", new Date(), req.body.firstname, req.body.lastname, 
				req.body.firstname + " " + req.body.lastname, req.body.email, 
				hash, req.body.phoneNumber.toString(), false, false]);

			await client.end((err) => {
				if(err) res.status(401).json({result:err, message: "failed to create user"});
				else {
					models.user.id =  pgresult.rows[0].id
					models.user.createdat = pgresult.rows.createdat
					res.status(296).json({result: models.user, token: t, message: "success sign up"})
				}
			});
		} 
		catch(error) {
			res.status(401).json({result:error.message, message: "failed to create user"})
		}
	});
}

async function verifyNexmo(req, res, next) {
	try{
		const client = new pg.Client(conn);

		await client.connect();
		var pgresult = await client.query(`UPDATE users SET phoneverified = $1 WHERE id=$2 and versionid=$3`, [true, req.body.id, req.body.versionid]);
		await client.end((err) => {
			if(err) res.status(401).json({result:err, message: "failed to update db with nexmo"})
			else {
				req.body.phoneverified = true;
				req.body.phoneNumberVerified = true;
				res.status(296).json({result: req.body, token: req.body.token, message: "success"})
			}
		});
	} 
	catch(error) {
		res.status(401).json({result:error.message, message: "failed to update db with nexmo"})
	}
}

async function login(req, res, next) {
	try{
  		const client = new pg.Client(conn);
		await client.connect();
		var pgresult = await client.query(`SELECT * FROM users WHERE email=$1 ORDER BY versionid LIMIT 1`, [req.body.email]);
		await client.end((err) => {
			if(err) res.status(401).json({result:err, message: "failure"});
			else {
				models.user =  pgresult.rows[0]
				bcrypt.compare(req.body.password, models.user.passwordhash, function(err, result) {
					if(err || !result) res.status(401).json({message: "auth failure"});
				    else {
				    	const t = jwt.sign({email: req.body.email, id: req.body._id}, 
				    		jwtToken,
				    		{expiresIn: "2 days"});
				    	models.user.token = t;
				    	models.user.passwordhash = "";
				    	res.status(200).json({result: models.user,message: "success", token: t}, );
				    }
				});
			}
		});
	} 
	catch(error) {
		res.status(401).json({result:error.message, message: "failed to connect"})
	}

}








