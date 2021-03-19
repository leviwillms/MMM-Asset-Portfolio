# MMM-Asset-Portfolio
A <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> that utilizes the Alpha Vantage API to track the price of cryptocurrencies and stocks to then be added to a portfolio total.

## Features
1. Get data for any currency (Coins and Tokens) listed on [Ahpha Vantage](https://www.alphavantage.co)
2. Automatic download of currency logos
3. Line graph of value changes over 1 day, 1 week, or 1 month
4. Simple built-in view selection with highly customizable view configuration

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/leviwillms/MMM-Asset-Portfolio.git`.
2. Add the module inside `config.js` placing it where you prefer

## Config
|Option|Description|
|---|---|
|`apikey`|MANDATORY: API key from [Alpha Vantage](https://www.alphavantage.co/).<br>**Type:** `string`|
|`Stocks`|The stocks you want to display.<br>**Type:** `JSON array`<br>**Properties:** <br>**Name:**`The name of the stock you wish to display.`<br>**Symbol:**`The symbol of the stock you wish to display.`<br>**Quantity:**`The amount of the stock you own.`<br>**Default:**<i>[`{ name: "Tesla", symbol: "TSLA", quantity: 1}, { name: "Apple", symbol: "AAPL", quantity: 1}, { name: "Amazon", symbol: "AMZN", quantity: 1 }`]</i>|
|`Crypto`|The cryptocurrencies you want to display.<br>**Type:** `JSON array`<br>**Properties:** <br>**Name:**`The name of the crypto you wish to display.`<br>**Symbol:**`The symbol of the crypto you wish to display.`<br>**Quantity:**`The amount of the crypto you own.`<br>**Default:**<i>[`{ name: "Bitcoin", symbol: "BTC", quantity: 1 },{ name: "Ethereum", symbol: "ETH", quantity: 1 }`]</i>|

Here is an example config to insert into `config.js`
```
{
	module: "MMM-Asset-Portfolio",
		position: "top_bar",
		config: {
			apiKey: "Z7QJQLMUY8Y36K1M",
			stocks: [
				{ name: "Tesla", symbol: "TSLA", quantity: 1},
            	{ name: "Apple", symbol: "AAPL", quantity: 1},
                { name: "Amazon", symbol: "AMZN", quantity: 1 }
			],
			crypto: [
				{ name: "Bitcoin", symbol: "BTC", quantity: 5 },
				{ name: "Ethereum", symbol: "ETH", quantity: 15 }
			],
		}
},
```
### Example

### Notes
- Due to API call limits if you wish to display both Crypto + Stocks you can only display a **maximum** limit of 5 assets. However, if you only choose to display one asset class all you enter into the config will be display, it will just add a 1 minute loading time for every additional 5 assets in the config after the additional 5.
- To keep within Alpha Vantage API call limites the update interval has been set to 30 minutes. This will be properly optimized in the future, along with the above issue adressed.
- The Alpha Vantage API call limitiations are 5/minute and 500/day.

### Feedback
This is my first crack at building a Magic Mirror Module, there is still much to do in terms of optimization and additional features. This initial release is primarily to show as a part of my capstone project for my diploma. I plan to continue to work on this project, so please leave any feedback you can think in the forum. Thank you!

The MIT License (MIT)
=====================

Copyright © 2021 Levi Willms

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability,
whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**




