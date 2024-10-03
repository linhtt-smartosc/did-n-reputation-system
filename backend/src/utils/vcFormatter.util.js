const formatVc = async (type, issuerAddress, iat, exp, holderAddress, credentialSubject, proof) => {
    vc = {
        "@context": "https://www.w3.org/2018/credentials/v1",
        id: "",
        type: ["VerifiableCredential", type],
        issuer: `did:didify:${issuerAddress}`,
        issuanceDate: iat,
        expirationDate: exp,
        credentialSubject: {
            id: `did:didify:${holderAddress}`,
            credentialSubject
        },
        "evidence": true,
        proof: [proof]
    };
    return JSON.stringify(vc);
}

module.exports = formatVc;

// async function main() {
//     const type = "ProofOfAgeCredential";
//     const issuerAddress = "0x1234567890";
//     const iat = "2021-08-31";
//     const holderAddress = "0x2032934";
//     const exp = "2012-12-12";
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
//     const vcF = await formatVc(type, issuerAddress, iat, exp, holderAddress, licenseCredentialSubject, proof);
    
//     console.log(JSON.stringify(vcF, null, 2));
