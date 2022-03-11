
import request from "request";
import fs from "fs";
const options = {
  method: "GET",
  url: "https://api.coinranking.com/v2/coin/zNZHO_Sjf/price",
  headers: {
    "x-access-token":
      "coinranking0b2ed2f4e766789db3addd5dbffac7b18bf82fb0d0f0e2cd",
  },
};

let g =   request(options, (error, response) => {
            if (error) throw new Error(error);
           
            let x = JSON.parse(response.body).data.price
            console.log(x)
            return JSON.parse(response.body).data.price;;
          });

// console.log(g);
