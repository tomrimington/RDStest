/**
 * Run this file through a process manager like PM2. The node-cron module lets you periodically
 * execute tasks using a cron pattern. It supports second level granularity.
 */
import CoinGecko from 'coingecko-api';
import cron from 'node-cron';
import SalesTracker from './src/main.js';
import yargs from 'yargs'
import fs from 'fs';
import _ from 'lodash';
import * as pg from 'pg'
const { Pool } = pg.default

const pool  = new Pool({
  connectionlimit: 50,
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

const configs = [{
  confpath: './config/sample0.json',
  name: 'SSC'
},{
  confpath: './config/sample2a.json',
  name: 'SMBa'
},{
  confpath: './config/sample3.json',
  name: 'Degenapeacademy'
},{
  confpath: './config/sample4.json',
  name: 'Solpunk'
},{
  confpath: './config/sample5.json',
  name: 'Aurory'
},{
  confpath: './config/sample6.json',
  name: 'Sollamas'
},{
  confpath: './config/sample7.json',
  name: 'Stonedapecrew'
},{
  confpath: './config/sample8.json',
  name: 'Taiyorobotics'
},{
  confpath: './config/sample10.json',
  name: 'Degods'
},{
  confpath: './config/sample11.json',
  name: 'Thugbirdz'
},{
  confpath: './config/sample13.json',
  name: 'Dazedducks'
},{
  confpath: './config/sample14.json',
  name: 'Quantumtraders'
},{
  confpath: './config/sample15.json',
  name: 'OGflowers'
},{
  confpath: './config/sample16.json',
  name: 'Monkeykingdom'
},{
  confpath: './config/sample17.json',
  name: 'Famousfoxfederation'
},{
  confpath: './config/sample18.json',
  name: 'Finefillies'
},{
  confpath: './config/sample20.json',
  name: 'Catalinawhalemixer'
},{
  confpath: './config/sample21.json',
  name: 'Peskypenguinclub'
},{
  confpath: './config/sample22.json',
  name: 'Monkeyball'
},{
  confpath: './config/sample23.json',
  name: 'Artpunks'
},{
  confpath: './config/sample24.json',
  name: 'Monkeybabybusiness'
},{
  confpath: './config/sample25.json',
  name: 'Lifinityflares'
},{
  confpath: './config/sample26.json',
  name: 'GMgroundhogs'
},{
  confpath: './config/sample27.json',
  name: 'Heavenland'
},{
  confpath: './config/sample29.json',
  name: 'Meerkatmillionarescountrycliub'
},{
  confpath: './config/sample30.json',
  name: 'Babyapesocialclub'
},{
  confpath: './config/sample31.json',
  name: 'Dronies'
},{
  confpath: './config/sample32.json',
  name: 'Turtles'
},{
  confpath: './config/sample33.json',
  name: 'Piggysolgang'
},{
  confpath: './config/sample34.json',
  name: 'Thelioncats'
},{
  confpath: './config/sample35.json',
  name: 'Solanamonkerejects'
},{
  confpath: './config/sample37.json',
  name: 'Solarians'
},{
  confpath: './config/sample38.json',
  name: 'Solstein'
},{
  confpath: './config/sample39.json',
  name: 'Botborgs'
},{
  confpath: './config/sample40.json',
  name: 'Ubik'
},{
  confpath: './config/sample41.json',
  name: 'Bestbuds'
},{
  confpath: './config/sample42.json',
  name: 'Mixmob'
},{
  confpath: './config/sample43.json',
  name: 'Solgods'
},{
  confpath: './config/sample45.json',
  name: 'Bolbadgers'
},{
  confpath: './config/sample46.json',
  name: 'Zillasnft'
},{
  confpath: './config/sample47.json',
  name: 'Thefellowship'
},{
  confpath: './config/sample49.json',
  name: 'Panzerdogs'
},{
  confpath: './config/sample50.json',
  name: 'Honeydefi'
}]

// const conversionRate = 92; // just putting in const number until the live api is working  (will be part of the loop)

function datadump(configs) {
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
    let conversionRate = await _coinList.SOL
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
                for (let i = 0; i < metadata.length; i++) {
                    if (metadata[i] != "So11111111111111111111111111111111111111112") {
                        let meta = JSON.parse(metadata[i]);
                        let samplefile = JSON.parse(fs.readFileSync(configPath));
                        let collection = samplefile.collection;
                        let id = samplefile.id;
                        if (id == '0' && !meta.collection.includes('Shadowy Super Coder #')) {
                          console.log('Not of Interest')   
                        } else if (id == '3' && !meta.collection.includes('Degen Ape #')) {
                          console.log('Not of Interest')   
                        } else if (id == '4' && !meta.collection.includes('SolPunk_#')) {
                          console.log('Not of Interest')   
                        } else if (id == '5' && !meta.collection.includes('Aurorian #')) {
                          console.log('Not of Interest')   
                        } else if (id == '6' && !meta.collection.includes(', the ')) {
                          console.log('Not of Interest')   
                        } else if (id == '7' && !meta.collection.includes('Stoned Ape #')) {
                          console.log('Not of Interest')   
                        } else if (id == '8' && meta.collection.includes('Incubator')) {
                          console.log('Not of Interest')   
                        } else if (id == '10' && !meta.collection.includes('DeGod #')) {
                          console.log('Not of Interest')   
                        } else if (id == '11' && !meta.collection.includes('THUG #')) {
                          console.log('Not of Interest')   
                        } else if (id == '14' && !meta.collection.includes('Quantum Trader #')) {
                          console.log('Not of Interest')   
                        } else if (id == '15' && !meta.collection.includes('OG FLOWERS #')) {
                          console.log('Not of Interest')   
                        } else if (id == '17' && !meta.collection.includes('Fox #')) {
                          console.log('Not of Interest')   
                        } else if (id == '16' && !meta.collection.includes('Monkey Kingdom #')) {
                          console.log('Not of Interest')   
                        } else if (id == '18' && !meta.collection.includes('Fine Filly #')) {
                          console.log('Not of Interest')   
                        } else if (id == '20' && !meta.collection.includes('Catalina Whale')) {
                          console.log('Not of Interest')   
                        } else if (id == '21' && !meta.collection.includes('Pesky Penguins #')) {
                          console.log('Not of Interest')   
                        } else if (id == '22' && !meta.collection.includes('Monkey #')) {
                          console.log('Not of Interest')   
                        } else if (id == '23' && !meta.collection.includes('ArtPunk #')) {
                          console.log('Not of Interest')   
                        } else if (id == '24' && !meta.collection.includes('MBB #')) {
                          console.log('Not of Interest')   
                        } else if (id == '25' && !meta.collection.includes('LIFINITY Flares #')) {
                          console.log('Not of Interest')   
                        } else if (id == '26' && !meta.collection.includes('gm groundhog #')) {
                          console.log('Not of Interest')   
                        } else if (id == '27' && !meta.collection.includes('Heaven Land #')) {
                          console.log('Not of Interest')   
                        } else if (id == '29' && !meta.collection.includes('Meerkat #')) {
                          console.log('Not of Interest')   
                        } else if (id == '30' && !meta.collection.includes('Baby Ape Social Club #')) {
                          console.log('Not of Interest')   
                        } else if (id == '31' && !meta.collection.includes('Dronie #')) {
                          console.log('Not of Interest')   
                        } else if (id == '34' && !meta.collection.includes('The Lion Cats #')) {
                          console.log('Not of Interest')   
                        } else if (id == '35' && !meta.collection.includes('Monke #')) {
                          console.log('Not of Interest')   
                        } else if (id == '37' && !meta.collection.includes('Solarian')) {
                          console.log('Not of Interest')   
                        } else if (id == '38' && !meta.collection.includes('SolStein #')) {
                          console.log('Not of Interest')   
                        } else if (id == '39' && !meta.collection.includes('Botborg #')) {
                          console.log('Not of Interest')   
                        } else if (id == '40' && !meta.collection.includes('Ubik #')) {
                          console.log('Not of Interest')   
                        } else if (id == '41' && !meta.collection.includes('Best Buds #')) {
                          console.log('Not of Interest')   
                        } else if (id == '42' && !meta.collection.includes('MixMob Masks')) {
                          console.log('Not of Interest')   
                        } else if (id == '43' && !meta.collection.includes('SOLGods')) {
                          console.log('Not of Interest')   
                        } else if (id == '45' && !meta.collection.includes('Bold Badger #')) {
                          console.log('Not of Interest')   
                        } else if (id == '46' && !meta.collection.includes('Zilla #')) {
                          console.log('Not of Interest')   
                        } else if (id == '47' && !meta.collection.includes('OG Fellow #')) {
                          console.log('Not of Interest')   
                        } else if (id == '49' && !meta.collection.includes(' #')) {
                          console.log('Not of Interest')   
                        } else if (id == '50' && !meta.collection.includes('Honey Genesis Bee #')) {
                          console.log('Not of Interest')   
                        } else {
                        pool.query("insert into public.solana values('"+collection+"',"+id+",'" + meta.collection + "'," + meta.time +","+ meta.saleAmount +","+ meta.USDSale +",'" + meta.Signature + "','"+meta.buyerWallet+"','"+meta.sellerWallet+"') ", (err, res) => {
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

function datadump2(configs) {
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
    let conversionRate = await _coinList.SOL
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
            for (let i = 0; i < metadata.length; i++) {
                if (metadata[i] != "So11111111111111111111111111111111111111112") {
                    let meta = JSON.parse(metadata[i]);
                    let samplefile = JSON.parse(fs.readFileSync(configPath));
                    let collection = samplefile.collection;
                    // Boryoku Fix
                    if (collection == 'Boryoku Dragonz' && !meta.collection.includes('Boryoku Dragonz')) {
                        console.log('Not of Interest')   
                    }
                    // SMB fix
                    else if (collection == 'Solana Monkey Business' && meta.sellerWallet.includes("bDmnDkeV7xqWsEwKQEgZny6vXbHBoCYrjxA4aCr9fHU")) {
                        console.log('Not of Interest')   
                    }
                    // Mindfolk fix
                    else if (collection == 'Mindfolk' && !meta.collection.includes('Mindfolk Founders')) {
                        console.log('Not of Interest')   
                    }
                    // Nyan Heroes Fix
                    else if (collection == 'Nyan Heroes' && meta.sellerWallet.includes('7wzoWjLRJRVKMR7PhGffpXBpBsCqLRks2zb3Cnap8PZ3')) {
                        console.log('Not of Interest')   
                    }
                    // Rude Golems Fix
                    else if (collection == 'Rude Golems' && !meta.collection.includes('Golem')) {
                        console.log('Not of Interest')   
                    }
                    // Mini Royale Fix
                    else if (collection == 'Mini Royale Nations' && !meta.collection.includes('MINIROYALE')) {
                        console.log('Not of Interest')   
                    }
                    // Grim Fix
                    else if (collection == 'Grim Syndicate' && !meta.collection.includes('Grim')) {
                        console.log('Not of Interest')   
                    }
                    else {
                        console.log(i)
                        let id = samplefile.id;
                        pool.query("insert into public.solana values('"+collection+"',"+id+",'" + meta.collection + "'," + meta.time +","+ meta.saleAmount +","+ meta.USDSale +",'" + meta.Signature + "','"+meta.buyerWallet+"','"+meta.sellerWallet+"') ", (err, res) => {
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







// function Converter() {
//   async () => {
//     const CoinGeckoClient = new CoinGecko();
//       let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
//           coin_ids: ['solana']
//       });
//       var _coinList = {};
//       var _datacc = data.data.tickers.filter(t => t.target == 'USD');
//       [
//           'SOL'
//       ].forEach((i) => {
//           var _temp = _datacc.filter(t => t.base == i);
//           var _res = _temp.length == 0 ? [] : _temp[0];
//           _coinList[i] = _res.last;
//       })
//       return _coinList.SOL
//   }
  
// }




cron.schedule('*/1 * * * *', () => {
  // let conversionRate = Number(Converter());
  console.log('Running a task every minute');
  datadump(configs);
  datadump2(confissues)
});