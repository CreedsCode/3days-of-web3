// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Web3 from "web3"

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).send({message: "Bruh"}) }
  
  var account = req.body.address
  // var account = "0x225f137127d9067788314bc7fcc1f36746a3c3b5"
  var web3 = new Web3("wss://polygon-mainnet.g.alchemy.com/v2/26YvnQGt-jw2MOZ3yNrg2zNqpSCovrCA")
  
  var blockNumber = await web3.eth.getBlockNumber();
  var currentTransactionCount = await web3.eth.getTransactionCount(account,blockNumber)
  var currentBalance = await web3.eth.getBalance(account, blockNumber)
  
  console.log(
    ` currentBlock: ${blockNumber}\n`,
    `currentTransactionCount: ${currentTransactionCount}\n`,
    `currentBalance: ${currentBalance/1e18}`
  );
  for (var x = blockNumber; x >= 0 || currentTransactionCount >= 0; x--){
    var block = await web3.eth.getBlock(blockNumber, true)
    var transactions = block.transactions
    transactions.forEach(transaction => {
      if(transaction.from == account) {
        console.log(transaction);
        currentTransactionCount--;
      }
      if(transaction.to == account) {
        console.log(transaction);
        currentTransactionCount--;
      }
    });
  }

  for (let x = currentBlock; x >= 0 && currentTransactionCount > 0; --x) {
    var block = await web3.eth.getBlock(x, true)
    console.log(x, block);
    if (!block && !block.transactions) return;

    var transactions = await block.transactions
    for (let x = 0; x < transactions.length; x++) {
      var transaction = transactions[x];
      if (transaction.from == account) {
        console.log(`[${x}]${transaction.from} => ${transaction.to} (${transaction.value}) `)
      }

      if (transaction.to == account) {
        console.log("Found",transaction)
        console.log(`[${x}]${transaction.from} => ${transaction.to} (${transaction.value}) `)
      }
  }
}
  res.status(200).json({message:"This is too slow. Alchemy is the new way to go."})
}