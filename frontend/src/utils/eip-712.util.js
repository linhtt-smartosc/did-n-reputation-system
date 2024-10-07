import { keccak256, toUtf8Bytes } from "ethers";
import { initContracts, verifierRegistryContract } from "../config/contract.config";

const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint" },
    { name: "verifyingContract", type: "address" },
]

const verifiableCredential = [
    { name: "issuer", type: "address" },
    { name: "subject", type: "address" },
    { name: "credentialSubject", type: "bytes32" },
    { name: "validFrom", type: "uint" },
    { name: "validTo", type: "uint" },
]

const domain = {
    name: "Didify",
    version: "1",
    chainId: 31337,
    verifyingContract: process.env.REACT_APP_VERIFIER_ADDRESS,
}


const constructMsgAndSign = async (vc) => {
    await initContracts();
    const credentialSubjectHex = keccak256(toUtf8Bytes(JSON.stringify(vc.credentialSubject)));
    if (!verifierRegistryContract) {
        console.error('Verifier Registry Contract is not initialized');
        return;
    }
    const issuanceDate = new Date(vc.issuanceDate);
    const expirationDate = new Date(vc.expirationDate);

    // convert to Unix timestamp in seconds
    const validFrom = Math.floor(issuanceDate.getTime() / 1000);
    const validTo = Math.floor(expirationDate.getTime() / 1000);

    const holder = vc.holder.replace('did:didify:', '')
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    
    
    var msgParams = JSON.stringify({
        types: {
            EIP712Domain: domainType,
            VerifiableCredential: verifiableCredential,
        },
        domain,
        primaryType: "VerifiableCredential",
        message: {
            issuer: accounts[0],
            subject: holder,
            credentialSubject: credentialSubjectHex,
            validFrom,
            validTo,
        }
    });
    const from = accounts[0];

    let signature = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [from, msgParams],
    });

    // try {
    //     const verify = await verifierRegistryContract.verifyCredential(
    //         [accounts[0], holder, credentialSubjectHex, validFrom, validTo],
    //         signature
    //     );
    // } catch (error) {
    //     console.error('Error verifying credential:', error);
    // }

    return signature;
}


export default constructMsgAndSign;
