import { Contract } from "ethers";
import DIDRegistry from "../artifacts/DIDRegistry.json";
import Reputation from "../artifacts/Reputation.json";
import CredentialRegistry from "../artifacts/CredentialRegistry.json";
import Verifier from "../artifacts/Verifier.json";
import { ethers } from "ethers";

const DIDRegistryAddress = process.env.REACT_APP_DID_REGISTRY_ADDRESS;
const CredentialRegistryAddress = process.env.REACT_APP_CREDENTIAL_REGISTRY_ADDRESS;
const VerifierAddress = process.env.REACT_APP_VERIFIER_ADDRESS;
const ReputationAddress = process.env.REACT_APP_REPUTATION_ADDRESS;

let provider, signer, didRegistryContract, reputationContract, vcRegistryContract, verifierRegistryContract;

export const initContracts = async () => {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    
    didRegistryContract = new Contract(DIDRegistryAddress, DIDRegistry.abi, signer);
    reputationContract = new Contract(ReputationAddress, Reputation.abi, signer);
    vcRegistryContract = new Contract(CredentialRegistryAddress, CredentialRegistry.abi, signer);
    verifierRegistryContract = new Contract(VerifierAddress, Verifier.abi, signer);
    
}

export { provider, signer, didRegistryContract, reputationContract, vcRegistryContract, verifierRegistryContract };