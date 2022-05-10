// credits to: https://ethereum.stackexchange.com/a/3478
import Web3 from "web3"
import { serverRuntimeConfig } from "../../next.config";
var _web3 =""

export default async function handler(req, res) {
    if (req.method !== "POST") { res.status(405).send({message: "Bruh"}) }
    _web3 = new Web3(serverRuntimeConfig.alchemywss)
    // var endBlockNumber = endBlockNumber;
    // var startBlockNumber = startBlockNumber;
    var endBlockNumber   = 27872720;
    var startBlockNumber = 27872560;
    var wallet = req.body.wallet
    console.log("Searching for transactions to/from account \"" + wallet + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
    
    var result = []
    for (var i = startBlockNumber; i <= endBlockNumber; i++) {
      if (i % 1000 == 0) {
        console.log("Searching block " + i);
      }
      var block = await _web3.eth.getBlock(i, true);
      if (block != null && block.transactions != null) {
        block.transactions.forEach( function(e) {
          if (wallet == "*" || wallet == e.from || wallet == e.to) {

            result.push({
              txHash: e.hash,
              nonce: e.nonce,
              blockHash: e.blockHash,
              transactionIndex: e.transactionIndex,
              from: e.from,
              to: e.to,
              value: e.value,
              time: block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString(),
              gasPrice: e.gasPrice,
              gas: e.gas,
              input: e.input
            })
            
          }
        })
      }
    }
    console.log("Sending Results, found: ", result.length, " blocks.")
    res.status(200).send(result)
}
  