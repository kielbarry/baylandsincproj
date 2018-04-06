require("dotenv").config();

const 
Nexmo = require('nexmo'),
nexmo = new Nexmo({
  apiKey: process.env.NEXMOKEY,
  apiSecret: process.env.NEXMOSECRET
}),
redis = require("redis"),
redisClient = redis.createClient();



module.exports = {
	signUp,
	cancel,
	verify,
}

function signUp(req, res) {
	nexmo.verify.request({number: req.body.phoneNumber, brand: "Kiel Barry"}, function (err, result) {
	  if(err || result.error_text) { console.error(err || result.error_text); }
	  else {
	    redisClient.set(req.body.email, result.request_id)
	    res.json({"result": req.body, "textSent": "success"})
	  }
	});
}

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