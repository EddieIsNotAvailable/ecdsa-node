import {useState} from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils";


function Transfer({address, setBalance, privateKey, setBalanceChanged}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [notification, setNotification] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {

      if(!privateKey) {
        setNotification("No private key. Enter in wallet.");
        setTimeout(() => setNotification(""), 2000);
      }

      if(!secp.secp256k1.utils.isValidPrivateKey(privateKey)) {
        setNotification("Invalid private key. Correct in wallet.");
        setTimeout(() => setNotification(""), 2000);
      }

      const intSendAmount = parseInt(sendAmount).toString();
      const msg = utf8ToBytes(`send${address}${intSendAmount}${recipient}`);
      const hash = keccak256(msg);
      const sig = secp.secp256k1.sign(hash, privateKey, {lowS: true});

      const {
        data: {balance},
      } = await server.post(`send`, {
        sender: address,
        amountStr: intSendAmount,
        recipient,
        signature: sig.toCompactHex(),
        rbit: sig.recovery.toString(),
      });

      setBalance(balance);
      setBalanceChanged(Date.now());
    } catch (ex) {
      if(ex.response) {
        alert(ex.response.data.message);
      } else {
        console.error(ex);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      {notification && <p>{notification}</p>}
      <label>
        Send Amount
        <input
          placeholder="Integer amound to send"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Enter a recipient address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer"/>
    </form>
  );
}

export default Transfer;
