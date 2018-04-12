const path = require("path");

require("dotenv").config({ path : path.join(__dirname, "../.env")});

const 
	auth = require("./auth.js")
	Nexmo = require('nexmo'),
	nexmo = new Nexmo({
	  apiKey: process.env.NEXMO_KEY,
	  apiSecret: process.env.NEXMO_SECRET
	}),
	redis = require("redis"),
	redisPort = process.env.REDIS_PORT,
	redisHost = process.env.REDIS_HOST,
	redisClient = redis.createClient(redisPort, redisHost),
	pg = require('pg'),
	username = process.env.PGUSER,
	password = process.env.PGPASSWORD,
	host = process.env.PGHOST,
	database = process.env.PGDATABASE,
	port = process.env.PGPORT,
	conn = process.env.DATABASE_URL || `postgres://${username}:${password}@${host}:${port}/${database}`,
	client = new pg.Client(conn);





module.exports = {
	signUp,
	cancel,
	verify
}

async function signUp(req, res) {
	nexmo.verify.request({number: req.body.phoneNumber, brand: "Kiel Barry"}, async function (err, result) {
	  if(err || result.error_text) { console.error(err || result.error_text); }
	  else {
	    redisClient.set(req.body.email, result.request_id)
	    res.json({"result": req.body, "textSent": "success"})
	  }


	  auth.createUser(req, res)

	// var u = req.body
	// console.log("here is u in sign up", u)

 // 	bcrypt.hash(req.body.password, salt, async function(err, hash) {
	//   	try{
	// 		await client.connect();
	// 		var res = await client.query(`INSERT INTO users (id, 
	// 			versionid, createdat, firstname, lastname, 
	// 			fullname, email, passwordHash, activationCode, 
	// 			emailVerified, phoneVerified) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11",`, [...user]);
	// 			await client.end();
	// 	} 
	// 	catch(error) {
	// 		console.log(error)
	// 	}
	// });



	});
};

function cancel(req, res) {
	redisClient.get(req.body.email, function(err, reply) {
	    if(err) res.sendStatus(400)
		nexmo.verify.control({request_id: reply, cmd: 'cancel'}, function(err, result) {
		  if(err || result.error_text) { console.error(err, result.error_text); }
		  else {
		   res.json({"result": req.body, "textCanceled": "success"})
		  }
		});
	});
}

function verify(req, res) {
	redisClient.get(req.body.email, function(err, reply) {
	    if(err) res.sendStatus(400)
		nexmo.verify.check({request_id: reply, code: req.body.nexmoCode}, function(err, result) {
		  if(err || result.error_text) { console.error(err || result.error_text); }
		  else {
		   res.json({"result": req.body, "textVerified": "success"})
		  }
		});
	});
}