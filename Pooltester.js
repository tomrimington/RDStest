import mysql from 'mysql';
import request from "request";


// const options = {
//   method: "GET",
//   url: "https://api.coinranking.com/v2/coin/zNZHO_Sjf/price",
//   headers: {
//     "x-access-token":
//       "coinranking0b2ed2f4e766789db3addd5dbffac7b18bf82fb0d0f0e2cd",
//   },
// };
// let d = request(options, (error, response) => {
//     if (error) console.log(`tits`);
//     let x = response.body;
//     console.log(x)
//     return !response.body

// })
import * as pg from 'pg'
const { Pool } = pg.default

const pool  = new Pool({
    connectionlimit: 30,
    // connectTimeout: 60 * 60 * 1000,
    // acquireTimeout: 60 * 60 * 1000,
    // timeout: 60 * 60 * 1000,
    port: 5432,
    host: "testdb.chzn6cnaazyl.eu-west-2.rds.amazonaws.com",
    user: "postgres",
    password: "Toothemoon69",
    database: "Test_db"
})

let meta = {"collection":"Honey Genesis Bee #9852","time":1646051786,"buyerWallet":"FDiN3E9m6VWbqJfSwA2WXSdpnErcURT12xsQxArcj7fL","sellerWallet":"B5dfngrySLsTQmw3G7ghyQpPgLbdnPNJQ97PQPVViDcN","saleAmount":"8.20","USDSale":754.4,"Signature":"4LzZhuS5oyCeuHbfsedEjnMGoZ1ZNAA3PozwL8nbJDESwY5t5eS6t4Ry7nRHhTfhk2DPUYz38sP9zG7oD6aA1twi"}
let collection = "honeybbbb";
let id = 50;
// pool.getConnection(function(err, connection) {
    // Use the connection
    // if (err) {
    //     console.log(err);
    // } else {
pool.query("insert into public.solana2 values('"+collection+"',"+id+",'" + meta.collection + "'," + meta.time +","+ meta.saleAmount +","+ meta.USDSale +",'" + meta.Signature + "','"+meta.buyerWallet+"','"+meta.sellerWallet+"') ", (err, res) => {
    if (!err) {
        console.log(res.rows);
    } else {
        console.log(err, `error error 123`);
    }
        console.log("row added");   
})
//}
//})