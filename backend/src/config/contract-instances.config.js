const { ethers, JsonRpcProvider } = require('ethers');
const didRegistryArtifact = require('../artifacts/DIDRegistry.json');
const reputationRegistryArtifact = require('../artifacts/Reputation.json');
const vcRegistryArtifact = require('../artifacts/CredentialRegistry.json');
const verifierRegistryArtifact = require('../artifacts/Verifier.json');

const network = process.env.LOCAL_NETWORK_RPC;
const provider = new JsonRpcProvider(network);
const signer = new ethers.Wallet(process.env.DEFAULT_PRIVATE_KEY, provider);

const didRegistryContract = new ethers.Contract(process.env.DID_REGISTRY_ADDRESS, didRegistryArtifact.abi, signer);
const reputationContract = new ethers.Contract(process.env.REPUTATION_ADDRESS, reputationRegistryArtifact.abi, signer);
const vcRegistryContract = new ethers.Contract(process.env.CREDENTIAL_REGISTRY_ADDRESS, vcRegistryArtifact.abi, signer);
const verifierRegistryContract = new ethers.Contract(process.env.VERIFIER_ADDRESS, verifierRegistryArtifact.abi, signer);

module.exports = {
    network,
    provider,
    signer,
    didRegistryContract,
    reputationContract,
    vcRegistryContract,
    verifierRegistryContract
};
