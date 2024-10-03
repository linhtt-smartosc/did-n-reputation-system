const vcFormatter = require('../utils/vcFormatter.util');
const vcDao = require('../dao/vc.dao');
const DIDDao = require('../dao/did.dao');
const pinata = require('../config/pinata.config');
const { reputationContract } = require('../config/contract-instances.config');

const issueVC = async (type, issuer, holder, credentialSubject, proof, iat, exp) => {
    const vc = await vcFormatter(type, issuer, iat, exp, holder, credentialSubject, proof);
    const upload = await pinata.upload.json(JSON.parse(vc));
    const newVC = await vcDao.createVC(upload.IpfsHash, issuer, holder);
    try {
        await reputationContract.addVCPoint(holder, upload.IpfsHash);
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

module.exports = {
    issueVC,
    revokeVC,
    getVCByIssuer,
    getVCBySubject
}

// async function main() {
//     const type = "ProofOfAgeCredential";
//     const issuerAddress = "0x1234567890";
//     const iat = moment().format();
//     const holderAddress = "0x2032934";
//     const exp = moment().add(1, 'year').format();
//     const degreeCredentialSubject = {
//         degree: {
//             type: "BachelorDegree",
//             name: "Bachelor of Science and Arts",
//             college: "University of Internet"
//         }
//     };
//     const licenseCredentialSubject = {
//         license: {
//             type: "DriverLicense",
//             number: "D1234567",
//             state: "California"
//         }
//     };
//     const proof = {
//         id: issuerAddress,
//         type: "EcdsaSecp256k1Signature2019",
//         proofPurpose: "assertionMethod",
//         verificationMethod: "random",
//         proofValue: {}
//     };
//     await issueVC(type, issuerAddress, holderAddress, licenseCredentialSubject, proof, iat, exp);
// }

// main();