const { encodeBytes32String, toUtf8String, Wallet } = require('ethers');
const { signer } = require('../config/contract-instances.config');
const { reputationContract, vcRegistryContract } = require('../config/contract-instances.config');
const DIDDao = require('../dao/did.dao');

const createDID = async (address, email, encryptedKey, role, signInType) => {
    const chainId = Number((await signer.provider.getNetwork()).chainId);
    const did = `did:didify:${chainId}:${address}`;
    let tx;
    // if sign in type is not by using web3Auth
    if (signInType === 4) {
        tx = await reputationContract.addHistoricalTxPoint(address);
    } else {
        tx = await reputationContract.addSocialReputationPoint(address, signInType);
    }
    const reputationPoint = Number(await reputationContract.getReputationByOwner(address));
    if (role === 'issuer') {
        const nonce = await signer.getNonce();
        await vcRegistryContract.grantRole(await vcRegistryContract.ISSUER_ROLE(), address, { nonce });
    }
    const newUser = await DIDDao.createUser(address, email, role, encryptedKey, reputationPoint);
    const newDID = await DIDDao.createDID(address, chainId);
    return { did, newUser, newDID };
}


const updateOwner = async (sig, newOwner) => {
    const { v, r, s } = sig;
    const tx = await didContractInstance.changeOwnerSigned(identity, v, r, s, newOwner);
    const receipt = tx.wait();
    const identity = receipt.logs[0].args[0];
    const owner = receipt.logs[0].args[1];
    const updatedDID = await DIDDao.updateOwner(identity, owner);
    return updatedDID;
}

const updateAttribute = async (sig, attribute, validity) => {
    const { v, r, s } = sig;
    const { name, value } = attribute;
    const tx = setAttributeSigned(identity, v, r, s, encodeBytes32String(name), toUtf8Bytes(value), validity);
    const receipt = tx.wait();
    const newName = receipt.logs[0].args[1];
    let newValue = receipt.logs[0].args[2];
    newValue = toUtf8String(newValue);
    return { newName, newValue, validity };
}

const getUser = async (address) => {
    return await DIDDao.getUser(address);
}



module.exports = {
    createDID,
    updateOwner,
    updateAttribute,
    getUser
}