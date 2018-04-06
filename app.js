require("dotenv").config();

const
express = require("express"),
app = express(),
router = express.Router()
http = require("http"),
path = require("path"),
PORT = process.env.PORT || 3000,
bodyParser = require("body-parser"),
request = require("request"),
URL = require("url-parser"),
// Nexmo = require('nexmo'),
// nexmo = new Nexmo({
//   apiKey: process.env.NEXMOKEY,
//   apiSecret: process.env.NEXMOSECRET
// }),
redis = require("redis"),
redisClient = redis.createClient(),
handler = require("./backendFunctions/handlers.js"),
nexmoHandler = require("./backendFunctions/nexmoHandlers.js"),
rcsk = process.env.recaptchaSecret;


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


redisClient.on('connect', (err, res) => err ? console.log(err) : console.log('redis connected'))

app.put("/newEmail", (req, res) => {
	if (!req.body) return res.sendStatus(400)
	redisClient.HEXISTS("emailList", req.body.email, (err, exists) => {
		exists === 1 ? redisClient.HGET("emailList", req.body.email) : res.json({"valid": "true"})
	})
})

app.post("/signup", (req, res) => {
	if (!req.body) return res.sendStatus(400)
	nexmoHandler.signUp(req, res)
});

app.put("/cancelNexmo", (req, res) => {
	nexmoHandler.cancel(req, res)
})

app.put("/verifyNexmo", (req, res) => {
	nexmoHandler.verify(req, res)
})


app.put("/getBalances", (req, res) => {
	if (!req.body) return res.sendStatus(400)
	handler.getExchangeHoldings(req).then(resp => res.send(resp))
})

app.get("/getMinAndMaxCoinPrice", (req, res) => {
	// console.log(handler.getGDAXPrices());
	// handler.getPoloniexPrices().then(e=>console.log(e))
	// handler.getKrakenPrices();
	// handler.getBinancePrices().then(e=>console.log(e))

	// repeater(getAllandSend(res), 10000)
	handler.getAllPrices().then(resp => {
		res.send(resp)
	})
	// .then(e => console.log(e["poloniex"]))
});
