const path = require('path')

require("dotenv").config({ path : path.join(__dirname, "../.env") })

const 
models = require("./models.js"),
pg = require('pg'),
username = process.env.PGUSER,
password = process.env.PGPASSWORD,
host = process.env.PGHOST,
database = process.env.PGDATABASE,
port = process.env.PGPORT,
conn = process.env.DATABASE_URL || `postgres://${username}:${password}@${host}:${port}/${database}`,
client = new pg.Client(conn);

async function initQuery() {
	var str = `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY,
		versionid varchar(64),
		createdat DATE,
		firstname varchar(64),
		lastname varchar(64),
		fullname NAME,
		email varchar(64) NOT NULL UNIQUE,
		passwordHash varchar(64) NOT NULL,
		activationCode varchar(64) NOT NULL,
		emailVerified BOOLEAN,
		phoneVerified BOOLEAN
	);
	CREATE INDEX IF NOT EXISTS email_idx ON users (lower(email));
	CREATE INDEX IF NOT EXISTS full_name_idx ON users (lower(fullname));

	CREATE TABLE IF NOT EXISTS exchanges (
		id INTEGER PRIMARY KEY,
		exchange NAME
	);
	CREATE INDEX IF NOT EXISTS exchange_idx ON exchanges (lower(exchange));

`	
	models.exchanges.map((x, i) => xsstr += "INSERT INTO exchanges (id, exchange) VALUES(" + (i+1) + ", '" + x + "') ON CONFLICT DO NOTHING; ")

	try{
		await client.connect();
		var res = await client.query(str);
		await client.end();
	} catch(error) {
		console.log(error)
	}
}

module.exports = {
	initQuery: initQuery
}
