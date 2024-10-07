const vcFormatter = require('../utils/vcFormatter.util');
const vcDao = require('../dao/vc.dao');
const DIDDao = require('../dao/did.dao');
const pinata = require('../config/pinata.config');
const { reputationContract, vcRegistryContract } = require('../config/contract-instances.config');
const { keccak256, toUtf8Bytes } = require('ethers');

const issueVC = async (type, issuer, holder, credentialSubject, proof, iat, exp) => {
    console.log("Type: ", type);
    
    const vc = await vcFormatter(type, issuer, iat, exp, holder, credentialSubject, proof);
    const upload = await pinata.upload.json(JSON.parse(vc));
    const newVC = await vcDao.createVC(upload.IpfsHash, issuer, holder, proof, type, iat, exp);
    try {
        const hash = keccak256(toUtf8Bytes(upload.IpfsHash));
        await reputationContract.addVCPoint(holder, hash);
        const reputationPoint = Number(await reputationContract.getReputationByOwner(holder));
        DIDDao.updateReputation(holder, reputationPoint);
        
    } catch (error) {
        console.log(error);
    }
    return newVC;
}

const revokeVC = async (vcHash) => {
    return await vcDao.revokeVC(vcHash, false); 
}


const getVCByIssuer = async (issuer) => {
    return await vcDao.getVCByIssuer(issuer);
}

const getVCBySubject = async (subject) => {
    return await vcDao.getVCBySubject(subject);
}

const grantRole = async (issuer) => {
    await vcRegistryContract.grantRole(await vcRegistryContract.ISSUER_ROLE(), issuer);
    return await vcRegistryContract.hasRole(await vcRegistryContract.ISSUER_ROLE(), issuer);
}

const retrieveVC = async (vcHash) => {
    const vc = await pinata.gateways.get(vcHash);
    return vc;
}



module.exports = {
    issueVC,
    revokeVC,
    getVCByIssuer,
    getVCBySubject,
    grantRole,
    retrieveVC
}
