import Web3 from "web3"
import { serverRuntimeConfig } from "../../next.config";

export default async function handler(req, res) {
    if (req.method !== "GET") { res.status(405).send({message: "Bruh"}) }
    var _web3 = new Web3(serverRuntimeConfig.alchemywss)
    var data = await _web3.eth.getBlockNumber();
    res.status(200).send({number: data})
}
  