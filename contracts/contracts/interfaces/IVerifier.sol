//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface IVerifier {
    struct VerifiableCredential {
        address issuer;
        address subject;
        bytes32 credentialSubject;
        uint validFrom;
        uint validTo;
    }

    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    /**
     * Check if a credential is valid
     * @param vc Verifiable credential data structure
     * @param _signature Signature in bytes
     * @return bool True if the param credential issuer is equal to the signer of the credential
     */
    function verifyCredential(
        VerifiableCredential memory vc,
        bytes memory _signature
    ) external returns (bool);

    /**
     * Verify if a credential exists
     * @param _credentialHash The credential hash of the credential generated off-chain
     * @param _issuer The issuer of the credential
     */
    function exist(
        bytes32 _credentialHash,
        address _issuer
    ) external view returns (bool);

    /**
     * Verify if a credential is valid in terms of time and status
     * @param _credentialHash The credential hash of the credential generated off-chain
     * @param _issuer The issuer of the credential
     */
    function validate(
        bytes32 _credentialHash,
        address _issuer
    ) external view returns (bool);
}
