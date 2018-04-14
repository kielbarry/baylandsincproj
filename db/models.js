
const exchanges = ["Bitfinex", "coinone", "Kraken", "Coinbase", "GDAX", "Bitstamp", "Bithumb", "HitBTC", 
"Bittrex", "Gemini", "Quoine", "bitFlyer", "Poloniex", "Binance", "itBit"]

const poloniexListings =  ["BCN", "BELA", "BLK", "BTCD", "BTM", "BTS", "BURST", "CLAM", "DASH", "DGB", "DOGE", "EMC2", "FLDC", "FLO", "GAME", "GRC", "HUC", "LTC", "MAID", "OMNI", "NAV", "NEOS", "NMC", "NXT", "PINK", "POT", "PPC", "RIC", "STR", "SYS", "VIA", "XVC", "VRC", "VTC", "XBC", "XCP", "XEM", "XMR", "XPM", "XRP", "ETH", "SC", "BCY", "EXP", "FCT", "RADS", "AMP", "DCR", "LSK", "LBC", "STEEM", "SBD", "ETC", "REP", "ARDR", "ZEC", "STRAT", "NXC", "PASC", "GNT", "GNO", "BCH", "ZRX", "CVC", "OMG", "GAS", "STORJ", "BTC"]


module.exports = {
      user: {
            'id': '',
            'versionid': '',
            'createdat': '',
            'firstname': '',
            'lastname': '',
            'fullname': '',
            'email': '',
            'phoneNumber': '',
            'emailverified': '',
            'phoneNumberVerified': '',
            'balances': []

      },
      exchanges,
      poloniexListings: poloniexListings
}

