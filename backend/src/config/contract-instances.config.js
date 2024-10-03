const { ethers, JsonRpcProvider } = require('ethers');
const didRegistryArtifact = require('../artifacts/DIDRegistry.json');
const entryPointArtifact = require('../artifacts/EntryPoint.json');
const reputationRegistryArtifact = require('../artifacts/Reputation.json');
const vcRegistryArtifact = require('../artifacts/CredentialRegistry.json');
const simpleAccountArtifact = require('../artifacts/SimpleAccountFactory.json');
const verifierRegistryArtifact = require('../artifacts/Verifier.json');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.LOCAL_NETWORK_RPC));

require('dotenv').config();

const network = process.env.LOCAL_NETWORK_RPC;
const provider = new JsonRpcProvider(network);
const signer = new ethers.Wallet(process.env.DEFAULT_PRIVATE_KEY, provider);

const entryPointContract = new ethers.Contract(process.env.ENTRYPOINT_ADDRESS, entryPointArtifact.abi, signer);
const didRegistryContract = new ethers.Contract(process.env.DID_REGISTRY_ADDRESS, didRegistryArtifact.abi, signer);
const reputationContract = new ethers.Contract(process.env.REPUTATION_ADDRESS, reputationRegistryArtifact.abi, signer);
const vcRegistryContract = new ethers.Contract(process.env.CREDENTIAL_REGISTRY_ADDRESS, vcRegistryArtifact.abi, signer);
const simpleAccountContract = new ethers.Contract(process.env.SIMPLE_ACCOUNT_ADDRESS, simpleAccountArtifact.abi, signer);
const verifierRegistryContract = new ethers.Contract(process.env.VERIFIER_ADDRESS, verifierRegistryArtifact.abi, signer);
const simpleAccountFactory = new web3.eth.Contract(simpleAccountArtifact.abi, process.env.SIMPLE_ACCOUNT_FACTORY_ADDRESS);

async function executeOnChainTransaction(ethervalue, callData, to, signPrivateKey) {

    const value = web3.utils.toWei(ethervalue, 'ether');
    const rawTxn = { to, gas: 396296, maxFeePerGas: 44363475285, value, data: callData };
    const signedTx = await web3.eth.accounts.signTransaction(rawTxn, signPrivateKey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
        if (!error) { console.log(`Transaction Success 🎉: ${hash} `) }
        else { console.log(`Transaction Fail ❗❗: ${error}`) }
    });

}

module.exports = {
    network,
    provider,
    signer,
    entryPointContract,
    didRegistryContract,
    reputationContract,
    vcRegistryContract,
    simpleAccountContract,
    verifierRegistryContract,
    simpleAccountFactory,
    executeOnChainTransaction
};
