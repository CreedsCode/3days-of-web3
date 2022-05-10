import { useWeb3React} from "@web3-react/core"
import { injected } from "../components/wallet/connectors"
import Web3 from "web3"
import {useState} from "react"
import { CSVLink } from "react-csv";

export default function Home() {
  var { active, account, library, connector, activate, deactivate } = useWeb3React();

  const [connectedWallet, setConnectedWallet] = useState();
  const [balance, setBalance] = useState();
  const [transactions, setTransactions] = useState();

  const fromBlock = 27872720
  const toBlock = 27872560

  var _walletInput;
  
  var csvReport = {
    data: transactions,
    headers: [
      { label: "txHash", key: "txHash" },
      { label: "nonce", key: "nonce" },
      { label: "blockHash", key: "blockHash" },
      { label: "transactionIndex", key: "transactionIndex" },
      { label: "fromAlias", key: "fromAlias" },
      { label: "from", key: "from" },
      { label: "toAlias", key: "toAlias" },
      { label: "to", key: "to" },
      { label: "value", key: "value" },
      { label: "time", key: "time" },
      { label: "gasPrice", key: "gasPrice" },
      { label: "gas", key: "gas" },
      { label: "input", key: "input" }
    ],
    filename: "Transactions.csv"
  }
  async function fetchTransactions(){
    var response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({wallet: connectedWallet, startBlockNumber: fromBlock, endBlockNumber: toBlock}),
    });

    var request_data = await response.json()
    console.log(request_data);
    var transactionsView = []
    request_data.forEach(transaction => {
      transactionsView.push({fromAlias: "", toAlias: "", ...transaction})
    });
    setTransactions(transactionsView)
    console.log("DONE");
  }
  async function connect() {
    try {
      await activate(injected)
      setConnectedWallet(account)
      _walletInput.value = connectedWallet
      await displayBalance();
    } catch (ex) {
      console.log(ex);
    }
  }
  async function disconnect() {
    try {
      deactivate()
      setConnectedWallet("")
      _walletInput.value = connectedWallet
      setBalance("")
    } catch (ex) {
      console.log(ex);
    }
  }
  async function search() {
    setConnectedWallet(_walletInput.value)
    await displayBalance();
  }
  async function displayBalance() {
    var response = await fetch('/api/getbalance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({wallet: connectedWallet.trim()}),
    });

    setBalance(response.balance)
  }

  return (
    <div>
      <div>
        <button onClick={connect}>MetaMask</button>
        <button onClick={disconnect}>Disconnect from MetaMask</button>
        <input placeholder="Use MetaMask or enter addr." ref={c => _walletInput = c} />
        <button onClick={search}>Search</button>
      </div>

      <div>
        <span>Blockrange: </span>
        <input placeholder="From" value={fromBlock} />
        <input placeholder="To"   value={toBlock} />
      </div>

      <div>
        {balance ? <span>Connected Address: <b>{connectedWallet}</b> with a balance of: <b>{balance}</b> </span> : <span>🚀🚀🚀🚀🚀</span>}
      </div>

      <div>
        <button onClick={fetchTransactions}>Get Transactions</button>
        <div>
        {transactions ? <CSVLink data={csvReport.data} headers={csvReport.headers} filename={csvReport.filename}>Export to CSV</CSVLink> : ""}
        </div>
      </div>

      <div>
        {transactions ? <table>
          <tr>
            <th>txHash</th>
            <th>nonce</th>
            <th>blockHash</th>
            <th>transactionIndex</th>
            <th>fromAlias</th>
            <th>from</th>
            <th>to</th>
            <th>toAlias</th>
            <th>value</th>
            <th>time</th>
            <th>gasPrice</th>
            <th>gas</th>
            <th>input</th>
          </tr>
          {transactions.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.txHash}</td>
                <td>{val.nonce}</td>
                <td>{val.blockHash}</td>
                <td>{val.transactionIndex}</td>
                <td>{val.fromAlias}</td>
                <td>{val.from}</td>
                <td>{val.toAlias}</td>
                <td>{val.to}</td>
                <td>{val.value/1e18}</td>
                <td>{val.time}</td>
                <td>{val.gasPrice/1e18}</td>
                <td>{val.gas}</td>
                <td>{val.input}</td>
              </tr>
            )
          })}
      </table> : <span>No Transaction fetched.</span>}
      </div>
    </div>
  )
}
