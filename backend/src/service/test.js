const {ethers, toUtf8String, toNumber} = require('ethers');
const {signer, vcRegistryContract} = require('../config/contract-instances.config');

const wallet = ethers.Wallet.createRandom();

console.log("address:", wallet.address);
console.log("mnemonic:", wallet.mnemonic.phrase);
console.log("privateKey:", wallet.privateKey);

async function main() {
    const chainId = (await signer.provider.getNetwork()).chainId;
    console.log("Chain id", chainId);
    console.log(toUtf8String("0x6d796b6579"));
    // await vcRegistryContract.connect(signer).grantRole(await vcRegistryContract.ISSUER_ROLE(), "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
    const check = await vcRegistryContract.hasRole(await vcRegistryContract.ISSUER_ROLE(), "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");
    console.log("Check", check);
    
}
main();