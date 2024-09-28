//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface IVerifier {
    struct VerifiableCredential {
        address issuer;
        address subject;
        bytes32 data;
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
     * @param _signature signature in bytes
     * @return bool True if the credential exists
     * @return bool True if the credential is valid
     * @return bool True if the param credential issuer is equal to the signer of the credential
     */
    function verifyCredential(
        VerifiableCredential memory vc,
        bytes memory _signature,
        uint _nonce
    ) external returns (bool, bool, bool);
}
