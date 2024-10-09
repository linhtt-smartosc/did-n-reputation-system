const formatVc = async (type, issuerAddress, iat, exp, holderAddress, credentialSubject, proof) => {
    vc = {
        "@context": "https://www.w3.org/2018/credentials/v1",
        id: "http://localhost:3000/vc/",
        type,
        issuer: `did:didify:${issuerAddress}`,
        holder: `did:didify:${holderAddress}`,
        issuanceDate: iat,
        expirationDate: exp,
        credentialSubject: {
            id: `did:didify:${holderAddress}`,
            credentialSubject
        },
        "evidence": true,
        proof: {
            type: "Ed25519Signature2020",
            created: iat,
            proofPurpose: "assertionMethod",
            verificationMethod: process.env.VERIFIER_ADDRESS,
            proof
        }
    };

    return JSON.stringify(vc);
}

module.exports = formatVc;