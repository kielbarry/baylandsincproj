const
	models = require("../db/models.js"),
	pg = require('pg'),
	username = process.env.PGUSER,
	password = process.env.PGPASSWORD,
	host = process.env.PGHOST,
	database = process.env.PGDATABASE,
	port = process.env.PGPORT,
	conn = process.env.DATABASE_URL || `postgres://${username}:${password}@${host}:${port}/${database}`;


module.exports = {
	addCoinbaseBalances,
	addGdaxBalances,
	addPoloniexBalances
}


async function addCoinbaseBalances(req, res, bal, next) {
	let obj = {};
	bal.map(coin => obj[coin.balance.currency] = {
		"value": coin.native_balance.amount,
		"amount": coin.balance.amount,
	})
  	try{
  		const client = new pg.Client(conn);
		await client.connect();
		var pgresult = await client.query(`INSERT INTO coinbaselistings (
 			versionid, userid, userversionid, createdat, BTC, ETH, LTC, BCH, USD)  
 			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
 			ON CONFLICT (userid, userversionid) DO UPDATE 
 			SET versionid=(coinbaselistings.versionid::INT +1)::VARCHAR, 
 			createdat=$4, BTC=$5, ETH=$6, LTC=$7, BCH=$8, USD=$9  RETURNING *;`, 
 			[ 0, req.body.user.id, req.body.user.versionid, new Date(), 
 			obj["BTC"]["amount"], obj["ETH"]["amount"], obj["LTC"]["amount"], obj["BCH"]["amount"], obj["USD"]["amount"]]);
		await client.end((err) => {
			if(err) res.status(401).json({result:err, message: "failure"});
			else {
				models.user = req.body.user;
				if(!models.user.balances) {
					models.user.balances = []
				}
				if(!models.user.pages) {
					models.user.pages = []
				}
				if(!models.user.pages.includes("coinbase")) {
					models.user.pages.push("coinbase")
				}
				models.user.balances["coinbase"] = obj;
				models.user.createdat = pgresult.rows.createdat
				res.status(296).json({result: models.user, token: req.body.user.token, message: "success"})
			}
		});
	} 
	catch(error) {
		res.status(401).json({result:error.message, message: "failure"})
	}
}

async function addGdaxBalances(req, res, bal, next) {
	console.log(req.body)
	console.log(bal)
}

async function addPoloniexBalances(req, res, bal, bitPrice, next) {

	var btcPrice = bitPrice["USDT_BTC"].lowestAsk
	let objects = {};

	Object.keys(bal).filter(key => {
	  	if(bal[key].available > 0){
	  		if(key==="1CR") {
	  			objects["a1cr"] = {
		  			"value" : (parseFloat(bal[key].btcValue) * parseFloat(btcPrice)).toFixed(2),
			  		"amount": bal[key].available
			  	}
	  		} 
	  		else {
	  			objects[key] = {
		  			"value" : (parseFloat(bal[key].btcValue) * parseFloat(btcPrice)).toFixed(2),
			  		"amount": bal[key].available
			  	}
	  		}
	  	}
	})

	var str1 = "";
	var str2 = "";

	var len = Object.keys(objects).length

	Object.keys(objects).map((x,i) => {
		i != (len-1) ? str1 += x + ", " : str1 += x
		i != (len-1) ? str2 += "$" + (i+5) + ", " : str2 += "$" + (i+5)
	})


	var str3 = "";

	str1.split(", ").map((coin,i ) => {
		i != (len-1) ? str3 +=  coin + "=$" + (i+5) + ", " : str3 +=  coin + "=$" + (i+5)
	})
	console.log(str3)

	console.log(...[...objects["amount"]])

	try{
  		const client = new pg.Client(conn);
		await client.connect();
		var pgresult = await client.query(`INSERT INTO poloniexlistings (
			versionid, userid, userversionid, createdat,` + 
			str1+ `)` + ` VALUES(` + 
			str2 + `) ON CONFLICT (userid, userversionid) DO UPDATE 
 			SET versionid=(poloniexlistings.versionid::INT +1)::VARCHAR, ` +
 			str3 , [
			0, req.body.user.id, req.body.user.versionid, new Date(),
			...[...objects]["amount"]]);

		await client.end((err) => {
			if(err) res.status(401).json({result:err, message: "failure"});
			else {

				//fixing but something like this
				// models.user.balances.some(x => {
				// 	if(x["coinbase"]) {
				// 		models.user.balances[x]["coinbase"] = obj
				// 	}
				// })


				if(!models.user.pages) {
					models.user.pages = []
				}
				if(!models.user.pages.includes("poloniex")) {
					models.user.pages.push("poloniex")
				}

				// models.user = req.body.user;
				// if(!models.user.balances) {
				// 	models.user.balances = []
				// } 
				// models.user.balances.push({"coinbase": obj})
				// models.user.createdat = pgresult.rows.createdat
				// res.status(296).json({result: models.user, token: req.body.user.token, message: "success"})
			}
		});
	} 
	catch(error) {
		res.status(401).json({result:error.message, message: "failure"})
	}
	// console.log("HEREEEEEEEE", arr)
	// res.status(200).json({result: arr, message: "hit the spot"})
}














