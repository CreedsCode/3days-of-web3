import Web3 from "web3"
import { serverRuntimeConfig } from "../../next.config";
var _web3 =""

export default async function handler(req, res) {
    if (req.method !== "POST") { res.status(405).send({message: "Bruh"}) }
    _web3 = new Web3(serverRuntimeConfig.alchemywss)
    
    var wallet = req.body.wallet
    
    await _web3.eth.getBalance(wallet).then((result)=>{
        res.status(200).send({balance: result/1e18})
    })
}
  