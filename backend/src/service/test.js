const {ethers, toUtf8String, toNumber} = require('ethers');
const signer = require('../config/contract-instances.config');

const wallet = ethers.Wallet.createRandom();

console.log("address:", wallet.address);
console.log("mnemonic:", wallet.mnemonic.phrase);
console.log("privateKey:", wallet.privateKey);

async function main() {
    const chainId = (await signer.provider.getNetwork()).chainId;
    console.log("Chain id", chainId);
    console.log(toUtf8String("0x6d796b6579"));
    console.log(toNumber());
    
    
}
main();