/**
 * 
 * API Key: VBGNTS1SWIS9USX9
 * Backup:  Z7QJQLMUY8Y36K1M
 * 
 * 
 */

"use strict";

 Module.register("MMM-Asset-Portfolio", {
    defaults: {
        header: "MMM-Asset-Portfolio",
        stocks: [
            { name: "Tesla", symbol: "TSLA", quantity: 1},
            { name: "Apple", symbol: "AAPL", quantity: 1},
            { name: "Amazon", symbol: "AMZN", quantity: 1 }
        ],
        crypto: [
            { name: "Bitcoin", symbol: "BTC", quantity: 1 },
            { name: "Ethereum", symbol: "ETH", quantity: 1 }
        ],
        baseURL: "https://www.alphavantage.co/",
        apiKey: "",
    },
    /**
     * 
     */
    start() {
        // create an array to hold exchange data
        this.retreivedAssets = {
            asset: []
        }
        this.cryptoTotal = 0;
        this.stocksTotal = 0;
        this.portfolioTotal = 0;

        
        this.getCrypto();
        // call get stocks after all the crypto calls have been made
        // let timeout = (this.config.crypto.length / 5) * 60000;
        // Log.log(this.config.crypto.length);
        // Log.log(timeout);
        // setTimeout(this.getStocks(), timeout);
        this.getStocks();
        setTimeout(this.scheduleUpdate(), 1800000);
    },
    /**
     * Updates every 5 minutes
     */
    scheduleUpdate() {
        const self = this;
        setInterval(function () {
            self.getCrypto();
            self.getStocks();
        }, 1800000 /*this.config.requestIntervalInSeconds * 1000*/);
    },
    /**
     * 
     */
    getStyles() {
        return ["MMM-Asset-Portfolio.css"];
    },
    /**
     * executes everytime updateDom() function is called
     */
    getDom() {
        let assets = this.retreivedAssets.asset;
        var wrapper = document.createElement("table");
        wrapper.className = "MMM-Asset-Portfolio";
        var tableHeader = document.createElement("tr");
        tableHeader.className = 'header-row';

        // Currencry formatter
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });

        var tableHeaderTitles = [
            'Name (Symbol)',
            'Price',
            'Quantity',
            'Value'
        ];
        for (var i = 0; i < tableHeaderTitles.length; i++) {
            var tableHeadSetup = document.createElement('th');
            tableHeadSetup.innerHTML = tableHeaderTitles[i];
            tableHeader.appendChild(tableHeadSetup);
        }
        wrapper.appendChild(tableHeader);

        // loop and push all assets into the table
        for (i = 0; i < assets.length; i++) {
            var currentAsset = this.retreivedAssets.asset[i];
            var trWrapper = document.createElement('tr');
            trWrapper.className = 'asset';
            // instance variables for the current asset
            var name = currentAsset.name;
            var symbol = currentAsset.symbol;
            var price = currentAsset.price;
            var quantity = currentAsset.quantity;
            var value = currentAsset.value.toFixed(2);


            var tdValues = [
                name+" ("+symbol+")",
                formatter.format(price),
                quantity,
                formatter.format(value)
            ];
            
            // loop through and add each value to the table row
            for(var j = 0; j < tdValues.length; j++) {
                var tdWrapper = document.createElement("td");
                var currentValue = tdValues[j];

                tdWrapper.innerHTML = currentValue;
                trWrapper.appendChild(tdWrapper);
                
                

            }
            
            wrapper.appendChild(trWrapper);

        }
        var portfolioTotal = [
            "TOTAL VALUE:",
            formatter.format(this.portfolioTotal)
        ]
        var trTotal = document.createElement('tr');
        trTotal.className = 'total-row';
        // loop to display totals
        for (var k = 0; k < portfolioTotal.length; k++) {
            
            var tdWrapper = document.createElement("td");
            tdWrapper.colSpan = "2";
            tdWrapper.className = "total-"+k;

            var currentValue = portfolioTotal[k];


            tdWrapper.innerHTML = currentValue;
            trTotal.appendChild(tdWrapper);

            wrapper.appendChild(trTotal);
        }


        return wrapper;
    },
    /**
     * 
     */
    getHeader() {
        return this.config.header;
    },
    /**
     * Note 1: When a node helper sends a notification, all modules of that module type receive the same notifications.
     * Note 2: The socket connection is established as soon as the module sends its first message using sendSocketNotification.
     * @param {String - The notification identifier} notification 
     * @param {AnyType - The payload of a notification} payload 
     */
    socketNotificationReceived(notification, payload) {
        if (notification === "CRYPTO_RESULT") {
            // set an instance object for the payload
            //const {symbol, price} = payload;
            Log.log(payload);
            payload.crypto.forEach((crypto) => {
                const {symbol, price, quantity, name} = crypto;
                // find the crypto in the config
                const currentCrypto = this.config.crypto.find((crypto) => 
                    crypto.symbol === symbol
                );

                // if it exists
                if (currentCrypto) {
                    // multiply the price by the quantity
                    let value = (parseFloat(quantity)) * parseFloat(price).toFixed(2);
                    // add the amount to the total
                    this.portfolioTotal += value;
                    this.retreivedAssets.asset.push({
                        name: name,
                        symbol: symbol,
                        price: price, 
                        value: value,
                        quantity: quantity
                    });
                    this.cryptoTotal += value;
                }
            });
        } else if (notification === "STOCK_RESULT") {
            // set an instance object for the payload
            payload.stocks.forEach((stock) => {
                const {symbol, price, quantity, name} = stock;
                // find the stock in the config
                const currentStock = this.config.stocks.find((stock) => 
                    stock.symbol === symbol
                );

                // if it exists
                if (currentStock) {
                    // multiply the price by the quantity
                    let value = (parseFloat(quantity)) * parseFloat(price).toFixed(2);
                    // add the amount to the total
                    this.portfolioTotal += value;
                    //Log.log(value);
                    this.retreivedAssets.asset.push({
                        name: name,
                        symbol: symbol,
                        price: price, 
                        value: value,
                        quantity: quantity
                    });
                    this.stockTotal += value;
                }
            });
            
        }
        this.updateDom();
    },
    /**
     * 
     */
    getCrypto() {
        this.sendSocketNotification('GET_CRYPTO', this.config);
    },
    /**
     * Set with a timeout to execute after all the crypto assets have been retreived.
     */
    getStocks() {
        // let timeout = (this.config.crypto.length / 5) * 60000;
        // setTimeout(this.sendSocketNotification('GET_STOCKS', this.config),timeout);
        this.sendSocketNotification('GET_STOCKS', this.config)
    }

     
 });