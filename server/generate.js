const secp = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils");

const priv = secp.secp256k1.utils.randomPrivateKey();

const pub = secp.secp256k1.getPublicKey(priv);

console.log("secret key: ", toHex(priv));
console.log("pub key: ", toHex(pub));