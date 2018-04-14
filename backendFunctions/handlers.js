const 
	https = require('https'),
	axios = require('axios'),
	coinbase = require('coinbase'),
	qs = require("./userQueries.js");


module.exports = {
	getAllPrices,
	getGDAXPrices,
	getPoloniexPrices,
	getKrakenPrices,
	getBinancePrices,
	getMinAndMax,
	getExchangeHoldings
}

async function getExchangeHoldings(req, res, next) {
	// if(req.body.apiInfo.exchange === "coinbase") {
		return await getCoinbaseHoldings(req, res, next)
	// }
}

async function getCoinbaseHoldings(req, res, next) {
	cbclient = new coinbase.Client({'apiKey': req.body.apiInfo["apiKey"], 'apiSecret': req.body.apiInfo["apiSecret"]})
	let cb = {
		coinname: '',
		coinamount: '',
		coinvalue:'',
		usdbalance: '',
		exchange: '',
	}

	var bitPrice 

	await cbclient.getBuyPrice({'currencyPair': 'BTC-USD'}, async (err, obj)=> bitPrice = obj.data.amount);

	await cbclient.getAccounts({}, async (err, acts) => {		
		if(err) res.status(401).json({result: err})
		else {
			// acts.map((acct, i) => {
			// 	// cb.coinvalue = parseFloat(bitPrice) / parseFloat(acct.native_balance.amount);
			// 	cb.coinvalue = parseFloat(acct.native_balance.amount);
			// 	cb.coinname = acct.currency;
			// 	cb.coinamount = acct.balance.amount;
			// 	cb.usdbalance = acct.native_balance.amount;
			// 	cb.exchange = "Coinbase";
			// 	// console.log(cb)
			// 	// userAccounts[i] = cb
			// 	return cb
			// })
			// try {
				qs.addCoinbaseBalances(req, res, acts, next)
			// }
			// catch (error) {
			// }
		}
	})
}

async function getGDAXPrices(){
	var obj = {};
	obj["BTC"] = await axios.get("https://api.coinbase.com/v2/prices/BTC-USD/buy").then(resp => {
		return parseFloat(resp.data["data"]["amount"])
	})
	obj["ETH"] = await axios.get("https://api.coinbase.com/v2/prices/ETH-USD/buy").then(resp => {
		return parseFloat(resp.data["data"]["amount"])
	})
	obj["LTC"] = await axios.get("https://api.coinbase.com/v2/prices/LTC-USD/buy").then(resp => {
		return parseFloat(resp.data["data"]["amount"])
	})
	obj["BCH"] = await axios.get("https://api.coinbase.com/v2/prices/BCH-USD/buy").then(resp => {
		return parseFloat(resp.data["data"]["amount"])
	})
	return obj
}

async function getPoloniexPrices() {
	return axios.get("https://poloniex.com/public?command=returnTicker")
		.then((resp) => {
			btcPrice = resp.data["USDT_BTC"].lowestAsk
			var obj = {}
			Object.keys(resp.data).map(k => {
				if(k.includes("BTC_")) {
					var coin = k.replace("BTC_", "")
					obj[coin] = (k,resp.data[k].lowestAsk * btcPrice)
				}
			})
			obj["BTC"] = btcPrice;
			return obj
		})
		.catch(err => {
			console.log(err)
		})
}

async function getKrakenPrices() {

	var qs = ""

	axios.get("https://api.kraken.com/0/public/AssetPairs")
	.then((resp) => {
		Object.keys(resp.data.result).map(k => {
			console.log(resp.data.result[k].quote, "", resp.data.result[k].base)
			if(resp.data.result[k].quote === "USD") {
				console.log(resp.data.result[k].quote)
			}	
		})
		return qs
	})
	.catch(err => {
		console.log(err)
	}).then((qs) => {
		console.log(qs)
	})
}

async function getBinancePrices() {
	return axios.get("https://api.binance.com/api/v3/ticker/price")
	.then((resp) => {
		var btcBinancePrice;
		var arr = [];

		var newObj = {};

		var btcBinancePrice; 
		resp.data.find(el => {
			if(el["symbol"] === "BTCUSDT") { 
				btcBinancePrice = el["price"]
			}
		})

		resp.data.map((obj) => {
			if(obj["symbol"].includes("BTC")) {
				var coin = obj["symbol"].replace("BTC", "")
				newObj[coin] = (obj["price"] * btcBinancePrice)
			}
		})
		newObj["BTC"] = btcBinancePrice;
		return newObj;
	})
	.catch(err => {
		console.log(err)
	})
}


async function getAllPrices() {
	var obj = {}
	obj["gdax"] = await this.getGDAXPrices();
	obj["poloniex"] = await this.getPoloniexPrices();
	obj["binance"] = await this.getBinancePrices();
	obj["minAndMaxList"] = this.getMinAndMax(obj)
	return obj;
}

function getMinAndMax(obj) {
	var arr = []
	var keysArr = Object.keys(obj)
	keysArr.map(key => Object.keys(obj[key]).map(coin => arr.push(coin)))
	var set = [...new Set(arr)].sort()

	var minMaxList = {};

	set.map(coin => {
		var coinPrices = {}
		keysArr.map(exchange => {
			if(obj[exchange][coin]!== undefined) {
				//set price as key
				coinPrices[obj[exchange][coin]] = exchange;
			}
		})
		var max = Math.max(...Object.keys(coinPrices).map(k =>parseFloat(k)))
		var min = Math.min(...Object.keys(coinPrices).map(k =>parseFloat(k)))
		// working for all but BTC?!?!!?
		minMaxList[coin] = {
			max: {
				exchange: coinPrices[max],
				price: max
			},
			min: {
				exchange: coinPrices[min],
				price: min
			}
		}	
	})
	return minMaxList;
}






















