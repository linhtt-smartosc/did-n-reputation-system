//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IVerifier.sol";
import "./CredentialRegistry.sol";


contract Verifier is AccessControl, IVerifier {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    CredentialRegistry public credentialRegistry;

    constructor(address _credentialRegistryAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        credentialRegistry = CredentialRegistry(_credentialRegistryAddress);
    }

    function verifyCredential(VerifiableCredential memory vc, Signature memory _signaturePart) external view override returns (bool, bool, bool) {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0x19), bytes1(0), hashVerifiableCredential(vc.issuer, vc.subject, vc.data, vc.validFrom, vc.validTo)));
        address signer = ecrecover(hash, _signaturePart.v, _signaturePart.r, _signaturePart.s);
        return (credentialRegistry.exist(hash, vc.issuer), credentialRegistry.validate(hash, vc.issuer), credentialRegistry.verifyIssuer(vc.issuer, signer));
    }


    function hashVerifiableCredential(address issuer, address subject, bytes32 data, uint256 validFrom, uint256 validTo) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(issuer, subject, data, validFrom, validTo));
    }
}