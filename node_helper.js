/**
 * 
 */

const NodeHelper = require("node_helper");
const request = require("request");

module.exports = NodeHelper.create({
    callCounter: 0,
    retreivedCrypto: {
            crypto: [/*"BTC": 15000*/]
    },
    retreivedStocks: {
        stocks: [/*"BTC": 15000*/]
    },
    assetsProcessed: 0,
    cryptoProcessed: 0,
    stocksProcessed: 0,

    /**
     * 
     */
    start(){
        console.log(`${this.name} helper method started...`);
        // declare counterfor api call delays
        var callCounter = 0;
    },
    /**
     * 
     * @param {*} config 
     */
    sendStockRequest(config) {
        let self = this;
        const notification = "REQUEST_STOCK";
        // if there's an error display defaults
        if (config.debug) {
            self.sendSocketNotification("STOCK_RESULT",{
                symbol: "TSLA",
                price: 600
            });
        }
        // loop through each stock entered into the config
        config.stocks.forEach((stock)=>{
            // generate url to send with request
            let url = `${config.baseURL}query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&to_currency=CAD&apikey=${config.apiKey}`;
            this.callCounter += 1;
            console.log(this.callCounter);
            // if there's been less than 5 api calls in the last minute send a request, else wait 1 minute
            if (self.callCounter <= 5) {

                this.sendRequest(notification, url, stock, config);

            }else if(this.callCounter > 5) {
                var delayInMilliseconds = 61000; //1 second
                console.log("waiting 1 minute to fetch additional stock results...");
                
                setTimeout( function() {
                    this.callCounter = 0;
                    this.sendRequest(notification, url, stock, config);
                }, delayInMilliseconds);
            }
        })
    },
    /**
     * 
     *  @param {*} config 
     */
    sendCryptoRequest(config) {
        let self = this;
        const notification = "REQUEST_CRYPTO";
        
        // if in debugging mode, show default
        if (config.debug) {
            self.sendSocketNotification("CRYPTO_RESULT",{
                symbol: "BTC",
                price: 60000
            });
        }
        // loop through each crypto entered into the config
        config.crypto.forEach((crypto) => {
            // generate url to send with request
            const url = `${config.baseURL}query?function=CURRENCY_EXCHANGE_RATE&from_currency=${crypto.symbol}&to_currency=CAD&apikey=${config.apiKey}`;
            this.callCounter += 1;
            console.log(this.callCounter);
            // send request to the api
            if (this.callCounter <= 5) {
                
                this.sendRequest(notification, url, crypto, config);
            }else if(this.callCounter > 5) {
                var delayInMilliseconds = 61000; //1 second
                console.log("waiting 1 minute to fetch additional crypto results...");
                
                setTimeout( function() {
                    this.callCounter = 0;
                    self.sendRequest(notification, url, crypto, config);
                }, delayInMilliseconds);
            }
        });
    },
    /**
     * Helper function to send the request along with the url to the api
     * @param {*} url 
     * @param {*} crypto 
     */
    sendRequest(notification, url, asset, config) {
        let self = this;
        
        // make api call
        request(url, {json: true}, (error, _res, body) =>{
            if (error) {
                console.error('Error requesting Crypto data');
            }
            if (notification === "REQUEST_CRYPTO") {
                // try to grab the symbol and price from the api and push it to array, catch any error
                try {
                        
                    const symbol = body["Realtime Currency Exchange Rate"]["1. From_Currency Code"];
                    const price = parseFloat(body["Realtime Currency Exchange Rate"]["5. Exchange Rate"]).toFixed(2);

                    console.log("Retreiving crypto result: ",{ symbol, price });
                    
                    self.retreivedCrypto.crypto.push({
                        name: asset.name, 
                        symbol: symbol,
                        quantity: asset.quantity,
                        price: price
                    });
                    //console.log(retreivedCrypto);
                    //console.log(config.crypto[assetsProcessed].name);
                    console.log(config.crypto.length);
                    self.assetsProcessed += 1;
                    self.cryptoProcessed += 1;
                    if (self.cryptoProcessed === config.crypto.length) { //this conditional statement is why I cant do both at the same time.
                        console.log("Sending crypto results: " + self.retreivedCrypto);
                        self.sendSocketNotification("CRYPTO_RESULT", self.retreivedCrypto);
                    }
                } catch (error) {
                        console.error('Error requesting Crypto response', body);
                }
            } else if (notification === "REQUEST_STOCK") {
                // try to grab the symbol and price from the api and push it to array, catch any error
                try {
                    
                    const symbol = body["Global Quote"]["01. symbol"];
                    const price = parseFloat(body["Global Quote"]["05. price"]);

                    console.log("Retreiving stock result: ",{ symbol, price });
                    
                    self.retreivedStocks.stocks.push({
                        name: asset.name, 
                        symbol: symbol,
                        quantity: asset.quantity,
                        price: price
                    });
                    //console.log(retreivedCrypto);
                    //console.log(config.crypto[assetsProcessed].name);
                    self.assetsProcessed += 1;
                    self.stocksProcessed += 1;
                    console.log(self.stocksProcessed +" STOCKS PROCESSED");
                    console.log(config.stocks.length);
                    if (self.stocksProcessed === config.stocks.length) {
                        //console.log("test");
                        console.log(self.retreivedStocks);
                        self.sendSocketNotification("STOCK_RESULT", self.retreivedStocks);
                    }
                } catch (error) {
                        console.error('Error requesting Crypto response', body);
                }
            }
        });
    },

    /**
     * 
     * @param {*} payload 
     */
    sendExchangeRequest(payload){

    },
    /**
     * Routing function to determine the course of action based off the notification
     * @param {String - The notification identifier} notification 
     * @param {AnyType - The payload of a notification} payload 
     */
    socketNotificationReceived(notification, payload) {
        let self = this;
        this.callCounter = 0;
        console.log(this.callCounter);
        //log for bug checking
        console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
        if (notification === "GET_CRYPTO") {
            this.sendCryptoRequest(payload);
        } else if (notification === "GET_STOCKS") {
            this.sendStockRequest(payload);
        } else {
            console.warn(`${notification} is an invalid notification`);
        }
    }

});