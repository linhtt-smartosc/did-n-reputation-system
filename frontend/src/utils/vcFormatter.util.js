
const formatVc = async (type, issuerAddress, iat, exp, holderAddress, credentialSubject, proof) => {
    let vc = {
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

export default formatVc;
