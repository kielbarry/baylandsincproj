require("dotenv").config();

const
express = require("express"),
app = express(),
router = express.Router(),
http = require("http"),
path = require("path"),
PORT = process.env.PORT || 3000,
bodyParser = require("body-parser"),
request = require("request"),
URL = require("url-parser");

// initDb = require("./db/init.js"),
// pg = require('pg'),
// { Client } = require('pg'),
// username = process.env.PGUSER,
// password = process.env.PGPASSWORD,
// host = process.env.PGHOST,
// database = process.env.PGDATABASE,
// port = process.env.PGPORT,
// connectionString = process.env.DATABASE_URL || `postgres://${username}:${password}@${host}:${port}/${database}`,
// client = new pg.Client(connectionString);{}




// salt = process.env.BCRYPT_SALT,
// jwt = require("jsonwebtoken"),
// jwtToken = process.env.JWT_TOKEN,
// checkAuth = require("./backendFunctions/auth.js"),
// redis = require("redis"),
// redisPort = process.env.REDIS_PORT,
// redisHost = process.env.REDIS_HOST,
// redisClient = redis.createClient(redisPort, redisHost),
// handler = require("./backendFunctions/handlers.js"),
// nexmoHandler = require("./backendFunctions/nexmoHandlers.js"),
// rcsk = process.env.recaptchaSecret;


// client.connect()

// initDb.initQuery();


// handler.getExchangeHoldings();



app
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended : true }))
	.use(express.static(__dirname + "/"))
	.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

http
	.createServer(app)
	.listen(PORT)
	.on("error", (error) => console.log("error: ", error))
	.on("listening", () => console.log("serving port: ", PORT))


// redisClient.on('connect', (err, res) => err ? console.log(err) : console.log('redis connected'))

// app.put("/newEmail", (req, res) => {
// 	if (!req.body) return res.sendStatus(400)
// 	redisClient.HEXISTS("emailList", req.body.email, (err, exists) => {
// 		exists === 1 ? redisClient.HGET("emailList", req.body.email) : res.json({"valid": "true"})
// 	})
// })

// app.post("/signup", (req, res) => {
// 	if (!req.body) return res.sendStatus(400)
// 	nexmoHandler.signUp(req, res)
// });

// app.put("/cancelNexmo", (req, res) => {
// 	nexmoHandler.cancel(req, res)
// })

// app.put("/verifyNexmo", (req, res) => {
// 	nexmoHandler.verify(req, res)
// })

// app.put("/getNewNexmoCode", (req, res) => {
// 	nexmoHandler.getNewNexmoCode(req, res)
// })

// app.put("/login", (req, res) => {
// 	if(!req.body) return res.sendStatus(400)
// 	checkAuth.login(req,res);
// })



// app.put("/getBalances", (req, res) => {
// 	if (!req.body) return res.sendStatus(400)
// 	handler.getExchangeHoldings(req, res)

// // .then(resp => res.send(resp))
// })

// app.get("/getAllHoldings/:id/:versionid", (req, res) => {
// 	if (!req.body) return res.sendStatus(400)

// 	console.log(req.params.id, req.params.versionid)

// })

// app.get("/getMinAndMaxCoinPrice", (req, res) => {

// 	// console.log(handler.getGDAXPrices());
// 	// handler.getPoloniexPrices().then(e=>console.log(e))
// 	// handler.getKrakenPrices();
// 	// handler.getBinancePrices().then(e=>console.log(e))

// 	// repeater(getAllandSend(res), 10000)
// 	handler.getAllPrices().then(resp => {
// 		res.send(resp)
// 	})
// 	// .then(e => console.log(e["poloniex"]))
// });
