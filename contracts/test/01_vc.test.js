const { time, mine } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const moment = require('moment');
const { AbiCoder, keccak256, toUtf8Bytes, SigningKey, getBytes, solidityPacked, concat, zeroPadValue, toBeHex } = require('ethers');
const testData = require('./testData.json');

const abiCoder = new AbiCoder();
const VERIFIABLE_CREDENTIAL_TYPEHASH = keccak256(
    toUtf8Bytes("VerifiableCredential(address issuer,address subject,bytes32 credentialSubject,uint validFrom,uint validTo)")
);

const EIP712_DOMAIN_TYPEHASH = keccak256(
    toUtf8Bytes("EIP712Domain(string name,string version,uint chainId,address verifyingContract)")
);


describe("Verifiable Credential", function () {
    let credentialRegistryInstance;
    let verifierInstance;
    let issuer;
    let badGuy1;
    let badGuy;
    let holder;
    let vc;
    let validFrom;
    let validTo;

    async function getCredentialHash(vc, issuer) {
        const credentialSubjectHex = keccak256(toUtf8Bytes(JSON.stringify(vc.credentialSubject)));
        const subjectAddress = vc.credentialSubject.id.split(':').slice(-1)[0];
        const encodeHashCredential = abiCoder.encode(
            ['bytes32', 'address', 'address', 'bytes32', 'uint256', 'uint256'],
            [VERIFIABLE_CREDENTIAL_TYPEHASH, issuer, subjectAddress, credentialSubjectHex, validFrom, validTo]
        );
        return keccak256(encodeHashCredential);
    }
    async function getDomainSeparator(verifierContractAddress) {
        const encodeEIP712Domain = abiCoder.encode(
            ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
            [EIP712_DOMAIN_TYPEHASH, keccak256(toUtf8Bytes("EIP712Domain")), keccak256(toUtf8Bytes("1")), 31337, verifierContractAddress]
        );
        return keccak256(encodeEIP712Domain);
    }

    async function getEthSignedMessageHash(message, verifierContractAddress) {
        const hashEIP712Domain = keccak256(abiCoder.encode(
            ['bytes32', 'bytes32', 'bytes32', 'uint', 'address'],
            [EIP712_DOMAIN_TYPEHASH, keccak256(toUtf8Bytes("EIP712Domain")), keccak256(toUtf8Bytes("1")), 31337, verifierContractAddress]
        ))
        return keccak256(concat([toUtf8Bytes('\x19\x01'), getBytes(hashEIP712Domain), getBytes(message)]));
    }

    async function signMessage(message, privateKey) {
        const signingKey = new SigningKey(getBytes(privateKey));
        return signingKey.sign(message);
    }




    before(async function () {
        [issuer, holder, badGuy1, badGuy] = await ethers.getSigners();
        vc = {
            "@context": "https://www.w3.org/2018/credentials/v1",
            id: "",
            type: ["VerifiableCredential"],
            issuer: `did:didify:${issuer.address}`,
            issuanceDate: moment().toISOString(),
            expirationDate: moment().add(1, 'years').toISOString(),
            credentialSubject: {
                id: `did:didify:${holder.address}`,
                degree: {
                    type: "BachelorDegree",
                    name: "Bachelor of Science and Arts",
                    college: "University of Internet"
                }
            },
            "evidence": true,
            proof: []
        };
        validFrom = Math.round(moment(vc.issuanceDate).valueOf() / 1000);
        validTo = Math.round(moment(vc.expirationDate).valueOf() / 1000);

        const CredentialRegistry = await ethers.getContractFactory("CredentialRegistry");
        credentialRegistryDeployment = await CredentialRegistry.deploy();
        credentialRegistryInstance = await credentialRegistryDeployment.waitForDeployment();
        const Verifier = await ethers.getContractFactory("Verifier");
        verifierDeployment = await Verifier.deploy("EIP712Domain", "1", 31337, await credentialRegistryInstance.getAddress());
        verifierInstance = await verifierDeployment.waitForDeployment();

        console.log("CredentialRegistry deployed to:", await credentialRegistryInstance.getAddress());
        console.log("Verifier deployed to:", await verifierInstance.getAddress());
        await credentialRegistryInstance.grantRole(await credentialRegistryInstance.ISSUER_ROLE(), issuer.address);
        await credentialRegistryInstance.grantRole(await credentialRegistryInstance.ISSUER_ROLE(), badGuy.address);
    })

    it("Should grant issuer role correctly", async function () {
        expect(await credentialRegistryInstance.hasRole(await credentialRegistryInstance.ISSUER_ROLE(), issuer.address)).to.be.true;
        expect(await credentialRegistryInstance.hasRole(await credentialRegistryInstance.ISSUER_ROLE(), badGuy.address)).to.be.true;
    })
    describe("Issue Credential", async function () {
        it("Should register a new credential", async function () {
            const credentialHash = await getCredentialHash(vc, issuer.address);
            const credentialMessage = await getEthSignedMessageHash(credentialHash, await verifierInstance.getAddress());
            const sig = await signMessage(credentialMessage, testData.issuerPrivateKey);
            const tx = await credentialRegistryInstance.registerCredential(
                issuer.address,
                holder.address,
                credentialMessage,
                validFrom,
                validTo,
                [sig.v, sig.r, sig.s]
            );
            const result = await credentialRegistryInstance.getCredential(credentialMessage, issuer.address);
            vc.proof.push({
                id: vc.issuer,
                type: "EcdsaSecp256k1Signature2019",
                proofPurpose: "assertionMethod",
                verificationMethod: await verifierInstance.getAddress(),
                proofValue: {
                    v: sig.v,
                    r: sig.r,
                    s: sig.s
                }
            });
            const signatureBytes = abiCoder.encode(['bytes32', 'bytes32', 'uint8'], [sig.r, sig.s, sig.v]);
            expect(result[0]).to.equal(issuer.address);
            expect(result[1]).to.equal(holder.address);
            expect(result[2]).to.equal(validFrom);
            expect(result[3]).to.equal(validTo);
            expect(result[4]).to.equal(true);
            expect(tx).to.emit(credentialRegistryInstance, "CredentialRegistered").withArgs(credentialMessage, issuer.address, holder.address, validFrom, signatureBytes);
        })
        it("Should not register a credential if not issuer", async function () {
            const credentialHash = await getCredentialHash(vc, badGuy1.address);
            const credentialMessage = await getEthSignedMessageHash(credentialHash, await verifierInstance.getAddress());
            const sig = await signMessage(credentialMessage, testData.badGuy1);
            await expect(credentialRegistryInstance.registerCredential(
                issuer.address,
                holder.address,
                credentialMessage,
                Math.round(moment(vc.issuanceDate).valueOf() / 1000),
                Math.round(moment(vc.expirationDate).valueOf() / 1000),
                [sig.v, sig.r, sig.s]
            )).to.be.revertedWithCustomError(credentialRegistryInstance, "NotIssuer");
        })
        it("Should not register a credential with invalid signature", async function () {
            const credentialHash = await getCredentialHash(vc, issuer.address);
            const credentialMessage = await getEthSignedMessageHash(credentialHash, await verifierInstance.getAddress());
            const sig = await signMessage(credentialMessage, testData.badGuy);
            await expect(credentialRegistryInstance.registerCredential(
                issuer.address,
                holder.address,
                credentialMessage,
                Math.round(moment(vc.issuanceDate).valueOf() / 1000),
                Math.round(moment(vc.expirationDate).valueOf() / 1000),
                [sig.v, sig.r, sig.s]
            )).to.be.revertedWithCustomError(credentialRegistryInstance, "InvalidSignature");
        })
        it("Should not register a credential that already exists", async function () {
            const credentialHash = await getCredentialHash(vc, issuer.address);
            const credentialMessage = await getEthSignedMessageHash(credentialHash, await verifierInstance.getAddress());
            const sig = await signMessage(credentialMessage, testData.issuerPrivateKey);
            await expect(credentialRegistryInstance.registerCredential(
                issuer.address,
                holder.address,
                credentialMessage,
                Math.round(moment(vc.issuanceDate).valueOf() / 1000),
                Math.round(moment(vc.expirationDate).valueOf() / 1000),
                [sig.v, sig.r, sig.s]
            )).to.revertedWithCustomError(credentialRegistryInstance, "CredentialExists");
        });
        it("Should not be able to revoke a credential if not issuer", async function () {
            const hashEIP712Domain = getDomainSeparator(await verifierInstance.getAddress());
            const credentialHash = await getCredentialHash(vc, issuer.address);
            const credentialMessage = await getEthSignedMessageHash(credentialHash, await verifierInstance.getAddress());
            const sig = await signMessage(credentialMessage, testData.badGuy);
            await expect(credentialRegistryInstance.revokeCredential(credentialMessage, [sig.v, sig.r, sig.s], hashEIP712Domain, issuer.address)).to.be.revertedWithCustomError(credentialRegistryInstance, "InvalidSignature");
        })
        it("Should be able to revoke a credential", async function () {
            /*
            Error Signatures:
                '0x8baa579f': 'InvalidSignature',
                '0xaa3ea2ac': 'CredentialExists',
                '0xcaa03ea5': 'InvalidCredential'
            */
            await mine(1);
            const encodeEIP712Domain = getDomainSeparator(await verifierInstance.getAddress());
            const credentialHash = await getCredentialHash(vc, issuer.address);
            const credentialMessage = await getEthSignedMessageHash(credentialHash, await verifierInstance.getAddress());
            const msgHash = keccak256(abiCoder.encode(['address', 'bytes32'], [issuer.address, credentialMessage]));
            const credentialMessageToRevoke = await getEthSignedMessageHash(msgHash, await verifierInstance.getAddress());
            const sig = await signMessage(credentialMessageToRevoke, testData.issuerPrivateKey);
            const tx = await credentialRegistryInstance.revokeCredential(credentialMessage, [sig.v, sig.r, sig.s], encodeEIP712Domain, issuer.address);
            const result = await credentialRegistryInstance.getCredential(credentialMessage, issuer.address);
            expect(result[4]).to.be.false;
            expect(tx).to.emit(credentialRegistryInstance, "CredentialRevoked").withArgs(credentialHash, issuer.address, time.latest);
        })

    })
    describe("Verify Credential", async function () {
        let sigBytes;
        it("Should verify a valid credential", async function () {
            const credentialHash = await getCredentialHash(vc, issuer.address);
            const credentialMessage = await getEthSignedMessageHash(credentialHash, await verifierInstance.getAddress());
            const sig = await signMessage(credentialMessage, testData.issuerPrivateKey);
            await credentialRegistryInstance.registerCredential(
                issuer.address,
                holder.address,
                credentialMessage,
                validFrom,
                validTo,
                [sig.v, sig.r, sig.s]
            );
            sigBytes = solidityPacked(['bytes32', 'bytes32', 'uint8'], [sig.r, sig.s, sig.v]);

            const credentialSubjectHex = keccak256(toUtf8Bytes(JSON.stringify(vc.credentialSubject)));
            const verifyTx = await verifierInstance.verifyCredential([issuer.address, holder.address, credentialSubjectHex, validFrom, validTo], sigBytes);
            expect(verifyTx).to.be.true;
        })
        it("Should return first false if the credential does not exist", async function () {
            const credentialHash = await getCredentialHash(vc, holder.address, await verifierInstance.getAddress());
            const credentialMessage = await getEthSignedMessageHash(credentialHash, await verifierInstance.getAddress());
            const verifyTx = await verifierInstance.exist(credentialMessage, issuer.address);
            console.log(verifyTx);
            expect(verifyTx).to.be.false;
        })
        it("Should return second false if the credential is revoked or expired", async function () {
            const hashEIP712Domain = getDomainSeparator(await verifierInstance.getAddress());
            const credentialHash = await getCredentialHash(vc, issuer.address);
            const credentialMessage = await getEthSignedMessageHash(credentialHash, await verifierInstance.getAddress());
            const msgHash = keccak256(abiCoder.encode(['address', 'bytes32'], [issuer.address, credentialMessage]));
            const credentialMessageToRevoke = await getEthSignedMessageHash(msgHash, await verifierInstance.getAddress());
            const sig = await signMessage(credentialMessageToRevoke, testData.issuerPrivateKey);
            await credentialRegistryInstance.revokeCredential(credentialMessage, [sig.v, sig.r, sig.s], hashEIP712Domain, issuer.address);
            const verifyTx = await verifierInstance.validate(credentialMessage, issuer.address);
            expect(verifyTx).to.be.false;
        })
    })
})