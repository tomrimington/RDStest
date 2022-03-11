/**
 * Use this to run your script directly without the cron.
 * node run-script-standalone.js --config='./config/sample.json' --outputType=console
 * Supported outputTypes are console/discord/twitter.
 */
import CoinGecko from 'coingecko-api';
import SalesTracker from './src/main.js';
import yargs from 'yargs'
import fs from 'fs';
import _ from 'lodash';
import * as pg from 'pg'
const { Pool } = pg.default


// const client = new Client ({
//     host:"testdb.chzn6cnaazyl.eu-west-2.rds.amazonaws.com",
//     user:"postgres",
//     post: 5432,
//     password:"Toothemoon69",
//     database:"Test_db"
//     })

var pool  = new Pool ({
    connectionlimit: 30,
        // connectTimeout  : 60 * 60 * 1000,
        //   acquireTimeout  : 60 * 60 * 1000,
        //   timeout         : 60 * 60 * 1000,
    port: 5432,
    host: "testdb.chzn6cnaazyl.eu-west-2.rds.amazonaws.com",
    user: "postgres",
    password: "Toothemoon69",
    database: "Test_db"
})

const confissues = [{
    confpath: './config/sample1.json',
    name: 'Boryokudragon'
  },{
    confpath: './config/sample2b.json',
    name: 'SMBb'
  },{
    confpath: './config/sample9.json',
    name: 'Mindfolk'
  },{
    confpath: './config/sample12.json',
    name: 'Nyanheroes'
  },{
    confpath: './config/sample19.json',
    name: 'Rudegolems'
  },{
    confpath: './config/sample36.json',
    name: 'Miniroyalenations'
  },{
    confpath: './config/sample48.json',
    name: 'Grimsyndicate'
    }]

const conversionRate = 92; // just putting in const number until the live api is working  (will be part of the loop)


 
    
function datadump2( configs) {
    (async () => {
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
    let conversionRate = await _coinList.SOL;
    for (let i = 0; i < configs.length; i++) { 
        let configPath = configs[i].confpath; 
        let collectionss = configs[i].name;
        let overrides = yargs(process.argv).argv;
        let outputType = overrides.outputType || 'console';;
        let config = JSON.parse(fs.readFileSync(configPath).toString());
        
        console.log(configPath)
        config = _.assignIn(config, overrides);
        let tracker = new SalesTracker(config, outputType);
    
        (async () => {
            let metadata = await tracker.checkSales(conversionRate, collectionss);     
            console.log(metadata[0]);
            for (let i = 0; i < metadata.length; i++) {
                if (metadata[i] != "So11111111111111111111111111111111111111112") {
                    let meta = JSON.parse(metadata[i]);
                    let samplefile = JSON.parse(fs.readFileSync(configPath));
                    let collection = samplefile.collection;
                    // Boryoku Fix
                    if (collection == 'Boryoku Dragonz' && !meta.collection.includes('Boryoku Dragonz')) {
                        console.log('caught the bitch')   
                    }
                    // SMB fix
                    else if (collection == 'Solana Monkey Business' && meta.sellerWallet.includes("bDmnDkeV7xqWsEwKQEgZny6vXbHBoCYrjxA4aCr9fHU")) {
                        console.log('caught the bitch')   
                    }
                    // Mindfolk fix
                    else if (collection == 'Mindfolk' && !meta.collection.includes('Mindfolk Founders')) {
                        console.log('caught the bitch')   
                    }
                    // Nyan Heroes Fix
                    else if (collection == 'Nyan Heroes' && meta.sellerWallet.includes('7wzoWjLRJRVKMR7PhGffpXBpBsCqLRks2zb3Cnap8PZ3')) {
                        console.log('caught the bitch')   
                    }
                    // Rude Golems Fix
                    else if (collection == 'Rude Golems' && !meta.collection.includes('Golem')) {
                        console.log('caught the bitch')   
                    }
                    // Mini Royale Fix
                    else if (collection == 'Mini Royale Nations' && !meta.collection.includes('MINIROYALE')) {
                        console.log('caught the bitch')   
                    }
                    // Grim Fix
                    else if (collection == 'Grim Syndicate' && !meta.collection.includes('Grim')) {
                        console.log('caught the bitch')   
                    }
                    else {
                        console.log(i)
                        let id = samplefile.id;
                        pool.query("insert into public.solana2 values('"+collection+"',"+id+",'" + meta.collection + "'," + meta.time +","+ meta.saleAmount +","+ meta.USDSale +",'" + meta.Signature + "','"+meta.buyerWallet+"','"+meta.sellerWallet+"') ", (err, res) => {
                            if (!err) {
                                console.log(res.rows);
                            } else {
                                console.log(err.message);
                            }
                                console.log("row added");   
                        })
                    }
                }
            }
        })();   
        }
        })();
    
}

    // Running this
    function Converter() {
        
        async () => {
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
            return _coinList.SOL
        }
        datadump2(_coinList.SOL, configs);
    }
     

    datadump2(confissues)
    console.log('finito')



