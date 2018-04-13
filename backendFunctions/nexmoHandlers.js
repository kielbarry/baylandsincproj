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
	verify,
	getNewNexmoCode
}

async function signUp(req, res) {
	nexmo.verify.request({number: req.body.phoneNumber, brand: "Kiel Barry"}, async function (err, result) {
	  if(err || result.error_text) { 
	  	console.error(err || result.error_text); 
	  	res.json({"result": err, "message": "failed to send sms"})
	  }
	  else {
	    redisClient.set(req.body.email, result.request_id)
	    auth.createUser(req, res)
	  }
	});
};

function cancel(req, res) {
	redisClient.get(req.body.email, function(err, reply) {
	    if(err) res.sendStatus(400)
		nexmo.verify.control({request_id: reply, cmd: 'cancel'}, function(err, result) {
		  if(err)  res.json({"result": err, "textCanceled": "failure"})
		  else if(!result.error_text) {
		  	res.json({"result": req.body, "textCanceled": "success"})
		  } 
		  else {
		   res.json({"result": result.error_text, "textCanceled": "failure"})
		  }
		});
	});
}

function verify(req, res) {
	redisClient.get(req.body.email, function(err, reply) {
	    if(err) res.sendStatus(400)
		nexmo.verify.check({request_id: reply, code: parseInt(req.body.nexmoCode)}, function(err, result) {
		  if(err)  res.json({"result": err, message: "failure"})
		  else if(!result.error_text) {
		  	auth.verifyNexmo(req, res)
		  }
		  else {
		  	res.json({"result": result.error_text, message: "failure"})
		  }
		});
	});
}

function getNewNexmoCode(req, res) {
	nexmo.verify.request({number: req.body.phoneNumber, brand: "Kiel Barry"}, async function (err, result) {
	  if(err || result.error_text) { 
	  	console.error(err || result.error_text); 
	  	res.json({"result": err, "message": "failed to send sms"})
	  }
	  else {
	    redisClient.set(req.body.email, result.request_id)
	  }
	});
}












