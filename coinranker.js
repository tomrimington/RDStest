// //1. Import coinranking-api
// import Coinranking from 'coinranking-api';
 
// //2. Initiate the Coinranking API Client
// const CoinrankingClient = new Coinranking();
 
// //3. Make calls
// var func = async() => {
//   let data = await Coinranking.stats.global();
// };

// let btc = '1'; //Coin ID
// let data = await CoinrankingClient.coins.fetch(btc, {});

// console.log(data);

import CoinGecko from 'coingecko-api';


const CoinGeckoClient = new CoinGecko();
    let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
        coin_ids: ['solana']
    });
    var _coinList = {};
    var _datacc = data.data.tickers.filter(t => t.target == 'USD');
    [
        'SOL'
    ].forEach((i) => {
        var _temp = _datacc.filter(t => t.base == i);
        var _res = _temp.length == 0 ? [] : _temp[0];
        _coinList[i] = _res.last;
    })



    
console.log(Number(_coinList.SOL));