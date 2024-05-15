const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const {utf8ToBytes, toHex, hexToBytes} = require("ethereum-cryptography/utils");
const {keccak256} = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "029d43a893ffb0b66d094601103cd58f79bb828960252db4b8077483afd7a17ac8": 100,
  "02c38c35adf532c4194695c66f3edc46bf8df7a7a11e04bba68b1819573bc880c8": 55,
  "031c38aea58c8f1774ba05c765fd9a44f7fc5f8d58a0008450c726cbd05d4a4b10": 75,
  "02f8419c82816f8842d5e5b31960ed38ea070ddf7234031a8b5e06bb88fa8579e8": 1000,
};

/* Corresponding Secret Keys
6a6535d4cb723ab000a1f44d06cc4b2817e234b9adc45a95ab14946f703be607
e70f5b8dfe09e340801c88d13ea6d21650330658b0628d86eacddea96bf2195d
b0b26ccab5324bf8db01c5c94e2d614bb7ff63aed6019e3953b55dd0828c389c
49c45e787ecad01aafa71f82dc59b6c2125cf699edd66871d0ab83daa58e6abd
*/

app.get("/balance/:address", (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({balance});
});

app.get("/balances", (req, res) => {
  res.send(balances);
});

app.post("/send", (req, res) => {
  //Get sig from client,
  // recover pub address,
  // check if equal to sender

  const {sender, amountStr, recipient, signature, rbit} = req.body;

  const msg = utf8ToBytes("send" + sender + amountStr + recipient);
  const amount = parseInt(amountStr);
  const msgHash = keccak256(msg);

  let sig;
  try {
    sig = secp.secp256k1.Signature.fromCompact(signature).addRecoveryBit(parseInt(rbit));
    sig.assertValidity();
  } catch(e) {
    res.status(400).send({message: "Signature error"});
    return;
  }

  let publicKeyHex = sig.recoverPublicKey(msgHash).toHex();

  if(!secp.secp256k1.verify( sig, msgHash, publicKeyHex)) {
    res.status(400).send({message: "Invalid signature!"});
    return;
  }

  if(sender !== publicKeyHex) {
    console.log(sender);
    console.log(publicKeyHex);

    res.status(400).send({message: "Non-matching recovered address!"});
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({message: "Not enough funds!"});
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({balance: balances[sender]});
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
