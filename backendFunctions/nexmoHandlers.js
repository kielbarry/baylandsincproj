require("dotenv").config({ path : path.join(__dirname, "../.env") })



const 
Nexmo = require('nexmo'),
nexmo = new Nexmo({
  apiKey: process.env.NEXMO_KEY,
  apiSecret: process.env.NEXMO_SECRET
}),
redis = require("redis"),
redisPort = process.env.REDIS_PORT,
redisHost = process.env.REDIS_HOST,
redisClient = redis.createClient(redisPort, redisHost);





module.exports = {
	signUp,
	cancel,
	verify
}

function signUp(req, res) {
	nexmo.verify.request({number: req.body.phoneNumber, brand: "Kiel Barry"}, function (err, result) {
	  if(err || result.error_text) { console.error(err || result.error_text); }
	  else {
	    redisClient.set(req.body.email, result.request_id)
	    res.json({"result": req.body, "textSent": "success"})
	  }

	try{
		await client.connect();
		var res = await client.query(str);
		await client.end();
	} catch(error) {
		console.log(error)
	}

	// var u = red.body

 // 	bcrypt.hash(req.body.password, salt, function(err, hash) {
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