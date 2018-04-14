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
	console.log("req.body in addUserBalances", req.body, bal)
  	try{
  		const client = new pg.Client(conn);

		await client.connect();
		var pgresult = await client.query(`RETURNING *;`,
			[]);

		await client.end((err) => {
			if(err) res.status(401).json({result:err, message: "failure"});
			else {
				models.user.id =  pgresult.rows[0].id
				models.user.createdat = pgresult.rows.createdat
				res.status(296).json({result: models.user, token: t, message: "success"})
			}
		});
	} 
	catch(error) {
		res.status(401).json({result:error.message, message: "failure"})
	}
}