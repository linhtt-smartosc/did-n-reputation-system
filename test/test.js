const { ec } = require('elliptic');
const crypto = require('crypto');

const ecInstance = new ec('secp256k1');

// Generate key pair
const keyPair = ecInstance.genKeyPair();
const privateKey = keyPair.getPrivate('hex');
const publicKey = keyPair.getPublic('hex');

console.log("Private Key:", privateKey);
console.log("Public Key:", publicKey);

// Sign the message
const message = JSON.stringify({ msg: "Hello World!" });
const messageHash = crypto.createHash('sha256').update(message).digest();
const signature = keyPair.sign(messageHash);
const signatureHex = signature.toDER('hex');

console.log("Message:", message);
console.log("Signature:", signatureHex);

// Verify the signature
const publicKeyFromDID = ecInstance.keyFromPublic(publicKey, 'hex');
const isValid = publicKeyFromDID.verify(messageHash, signature);

console.log("Is the signature valid?", isValid);
