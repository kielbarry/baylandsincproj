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
	addCoinbaseBalances
}


async function addCoinbaseBalances(req, res, bal, next) {
	let obj = {};

	bal.map(coin => obj[coin.balance.currency] = coin.balance.amount)


  	try{
  		const client = new pg.Client(conn);
		await client.connect();
		var pgresult = await client.query(`INSERT INTO coinbaselistings (
			versionid,
			userid,
			userversionid,
			createdat,
			BTC,
			ETH,
			LTC,
			BCH,
			USD)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  
			ON CONFLICT (userid, userversionid) DO UPDATE SET
			versionid=(coinbaselistings.versionid::INT +1)::VARCHAR,
			createdat=$4,
			BTC=$5,
			ETH=$6,
			LTC=$7,
			BCH=$8,
			USD=$9 
			RETURNING *;`, [
			0,
			req.body.user.id,
			req.body.user.versionid,
			new Date(),
			obj["BTC"],
			obj["ETH"],
			obj["LTC"],
			obj["BCH"],
			obj["USD"]]);

		await client.end((err) => {
			if(err) res.status(401).json({result:err, message: "failure"});
			else {
				models.user = req.body.user;
				if(!models.user.balances) {
					models.user.balances = []
				} 
				models.user.balances.push({"coinbase": obj})
				models.user.createdat = pgresult.rows.createdat
				res.status(296).json({result: models.user, token: req.body.user.token, message: "success"})
			}
		});
	} 
	catch(error) {
		res.status(401).json({result:error.message, message: "failure"})
	}
}







