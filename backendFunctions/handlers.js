const 
https = require('https'),
axios = require('axios')
coinbase = require('coinbase');
// mycbkey = process.env.cbAPIK,
// mycbsecret = process.env.cbAPIS,
// cbclient = new coinbase.Client({'apiKey': mycbkey, 'apiSecret': mycbsecret})
;




module.exports = {
	getAllPrices,
	getGDAXPrices,
	getPoloniexPrices,
	getKrakenPrices,
	getBinancePrices,
	getMinAndMax,
	getExchangeHoldings
}

async function getExchangeHoldings(req) {
	// console.log("req.body in getExchangeHoldings", req.body)
	if(req.body.exchange === "coinbase") {
		return await getCoinbaseHoldings(req)
	}
}

async function getCoinbaseHoldings(req) {
	console.log("req.body in getCoinbaseHoldings", req.body)

	console.log(req.body["apiKey"])
	console.log(req.body["apiSecret"])

	cbclient = new coinbase.Client({'apiKey': req.body["apiKey"], 'apiSecret': req.body["apiSecret"]})
	let cb = {
		coinname: '',
		coinamount: '',
		coinvalue:'',
		usdbalance: '',
		exchange: '',
	}
	// var arr = [];
	var bitPrice = await cbclient.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, obj) {
		console.log(obj.data.amount)
		return obj.data.amount;
	});

	 await cbclient.getAccounts({}, (err, accounts) => {
		var arr = accounts.map(acct => {
			cb.coinname = acct.currency;
			cb.coinamount = acct.balance.amount;
			cb.coinvalue = parseFloat(bitPrice) / parseFloat(acct.native_balance.amount);
			cb.usdbalance = acct.native_balance.amount;
			cb.exchange = "Coinbase"
			// arr.push(cb)
			console.log(cb)
			return cb
		})
		// console.log(arr)
	}).then((arr) => {
		console.log(arr)
	})
	
	// return arr
	
	
}


async function getGDAXPrices(){

	// return axios.get("https://api.coinbase.com/v2/prices/BTC-USD/buy")
	// .then((resp) => {
	// 	return [{
	// 		"symbol": resp.data["data"]["base"],
	// 		"price": parseFloat(resp.data["data"]["amount"])
	// 	}]
	// }).then(arr => {
	// 	axios.get("https://api.coinbase.com/v2/prices/BCH-USD/buy")
	// 	.then((resp, arr) => {
	// 		return arr.push([{
	// 			"symbol": resp.data["data"]["base"],
	// 			"price": parseFloat(resp.data["data"]["amount"])
	// 		}])
	// 	})
	// }).then(arr => {
	// 	axios.get("https://api.coinbase.com/v2/prices/ETH-USD/buy")
	// 	.then((resp, arr) => {
	// 		return arr.push([{
	// 			"symbol": resp.data["data"]["base"],
	// 			"price": parseFloat(resp.data["data"]["amount"])
	// 		}])
	// 	})
	// }).then(arr => {
	// 	axios.get("https://api.coinbase.com/v2/prices/LTC-USD/buy")
	// 	.then((resp, arr) => {
	// 		return arr.push([{
	// 			"symbol": resp.data["data"]["base"],
	// 			"price": parseFloat(resp.data["data"]["amount"])
	// 		}])
	// 	})
	// }).catch(err => console.log(err))

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


	// return axios.all([
	// 	axios.get("https://api.coinbase.com/v2/prices/BTC-USD/buy"),
	// 	axios.get("https://api.coinbase.com/v2/prices/BCH-USD/buy"),
	// 	axios.get("https://api.coinbase.com/v2/prices/ETH-USD/buy"),
	// 	axios.get("https://api.coinbase.com/v2/prices/LTC-USD/buy")
	// ])
	// .then(axios.spread((resp1, resp2, resp3, resp4) => {
	// 	console.log(resp1.data["data"]["base"])
	// 	console.log(resp2.data["data"]["base"])
	// 	console.log(resp3.data["data"]["base"])
	// 	console.log(resp4.data["data"]["base"])
	// 	console.log(resp1.data["data"]["amount"])
	// 	console.log(resp2.data["data"]["amount"])
	// 	console.log(resp3.data["data"]["amount"])
	// 	console.log(resp4.data["data"]["amount"])
	//   return [
	//   	{
	// 		"symbol": resp1.data["data"]["base"],
	// 		"price": parseFloat(resp1.data["data"]["amount"])
	// 	},
	// 	{
	// 		"symbol": resp2.dat["data"]["base"],
	// 		"price": parseFloat(resp2.data["data"]["amount"])
	// 	},
	// 	{
	// 		"symbol": resp3.dat["data"]["base"],
	// 		"price": parseFloat(resp3.data["data"]["amount"])
	// 	},
	// 	{
	// 		"symbol": resp4.dat["data"]["base"],
	// 		"price": parseFloat(resp4.data["data"]["amount"])
	// 	}]

	// })).catch((e1,e2,e3,e4) => {
	// 	console.log("ERRROR1", e1)
	// 	console.log("ERRROR2",e2)
	// 	console.log("ERRROR3",e3)
	// 	console.log("ERRROR4", e4)
	// });
}

async function getPoloniexPrices() {
	return axios.get("https://poloniex.com/public?command=returnTicker")
		.then((resp) => {
			btcPrice = resp.data["USDT_BTC"].lowestAsk
			// var arr = [];
			var obj = {}
			Object.keys(resp.data).map(k => {
				if(k.includes("BTC_")) {

					var coin = k.replace("BTC_", "")

					// arr.push(k.replace("BTC_", ""): {
					// 	"symbol": k.replace("BTC_", ""), 
					// 	"price": (k,resp.data[k].lowestAsk * btcPrice),
					// 	get [k.replace("BTC_", "")]() {
					// 		return this.price
					// 	},
					// 	get coin(){
					// 		return this.symbol;
					// 	}
					// })
					obj[coin] = (k,resp.data[k].lowestAsk * btcPrice)
				}
			})
			obj["BTC"] = btcPrice;
			// return arr;
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
			// if(k.includes("USD" && !k.includes(".d"))){
			// 	qs += ","+k;
			// }	
		})
		return qs
	})
	.catch(err => {
		console.log(err)
	}).then((qs) => {
		console.log(qs)
	})

	// console.log("")

	// axios.get("https://api.kraken.com/0/public/Ticker?pair=")
	// .then((resp) => {
	// 	console.log(resp.data)
	// })
	// .catch(err => {
	// 	console.log(err)
	// })
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
			// if(obj["symbol"] == "BTCUSDT") btcBinancePrice = obj["price"]
			if(obj["symbol"].includes("BTC")) {
				var coin = obj["symbol"].replace("BTC", "")
				// arr.push({
				// 	"symbol": obj["symbol"].replace("BTC", ""),
				// 	"price": obj["price"],
				// 	get [obj["symbol"].replace("BTC", "")]() {
				// 		return this.price
				// 	},
				// 	get coin(){
				// 		return this.symbol;
				// 	}
				// })

				// console.log(obj)
				newObj[coin] = (obj["price"] * btcBinancePrice)
			}
		})
		newObj["BTC"] = btcBinancePrice;
		// arr.map((nObj, i) => {
		// 	return arr[i]["price"] = (nObj["price"] * btcBinancePrice);
		// })
		// return arr
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

		// if(coin == "BTC") {
		// 		console.log("coinPrices btc", coinPrices)
		// 	}
		// 	if(coin == "ETH") {
		// 		console.log("coinPrices eth", coinPrices)
		// 	}
		// 	if(coin == "LTC") {
		// 		console.log("coinPrices ltc", coinPrices)
		// 	}
		// 	if(coin == "BCH") {
		// 		console.log("coinPrices bch", coinPrices)
		// 	}


		var max = Math.max(...Object.keys(coinPrices).map(k =>parseFloat(k)))
		var min = Math.min(...Object.keys(coinPrices).map(k =>parseFloat(k)))

		// if(coinPrices[max] == "GDAX" || coinPrices[min] == "GDAX") console.log("GDAX WINS")


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






















