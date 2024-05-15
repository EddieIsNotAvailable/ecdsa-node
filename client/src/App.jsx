import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Balances from "./Balances";
import "./App.scss";
import {useState} from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [balanceChanged, setBalanceChanged] = useState(Date.now());


  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer setBalance={setBalance} address={address} privateKey={privateKey} setBalanceChanged={setBalanceChanged}/>
      <Balances balanceChanged={balanceChanged}/>
    </div>
  );
}

export default App;
