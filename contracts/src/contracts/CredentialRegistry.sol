//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/ICredentialRegistry.sol";

contract CredentialRegistry is ICredentialRegistry, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    mapping(bytes32 => mapping(address => CredentialMetadata)) public credentials;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function registerCredential(address issuer, address _subject, bytes32 _credentialHash, uint256 _from, uint256 _exp, Signature memory _signaturePart) external returns (bool) {
        CredentialMetadata storage credential = credentials[_credentialHash][issuer];
        if (exist(_credentialHash, issuer)) {
            revert CredentialExists();
        }
        if (!checkSignature(_signaturePart, hashVerifiableCredential(issuer, _subject, _credentialHash, _from, _exp), issuer)) {
            revert InvalidSignature();
        }
        credential.issuer = issuer;
        credential.subject = _subject;
        credential.validFrom = _from;
        credential.validTo = _exp;
        credential.status = true;
        bytes memory _signature = abi.encodePacked(_signaturePart.v, _signaturePart.r, _signaturePart.s);
        credential.signatures[_signature] = true;

        emit CredentialRegistered(_credentialHash, issuer, _subject, credential.validFrom);
        return true;
    }

    function revokeCredential(bytes32 _credentialHash) external override onlyIssuer returns (bool) {
        CredentialMetadata storage credential = credentials[_credentialHash][msg.sender];
        if (!validate(_credentialHash, msg.sender)) {
            revert InvalidCredential();
        }
        require(exist(_credentialHash, msg.sender), "Credential doesn't exist");

        credential.status = false;

        emit CredentialRevoked(_credentialHash, msg.sender, block.timestamp);
        return true;
    }

    function validate(bytes32 _credentialHash, address issuer) override public view returns (bool){
        CredentialMetadata storage credential = credentials[_credentialHash][issuer];
        return (credential.validFrom <= block.timestamp && credential.validTo >= block.timestamp && credential.status);
    }   

    function exist(bytes32 _credentialHash, address issuer) override public view returns (bool){
        CredentialMetadata storage credential = credentials[_credentialHash][issuer];
        return (credential.subject != address(0));
    }

    function verifyIssuer(address issuer, address signer) external pure returns (bool isValid){
        return (issuer == signer);
    }

    function getIssuer(bytes32 digest, uint8 v, bytes32 r, bytes32 s) external pure returns (address issuer){
        return ecrecover(digest, v, r, s);
    }

    function checkSignature(Signature memory _signaturePart, bytes32 hash, address issuer) internal pure returns (bool) {
        address signer = ecrecover(hash, _signaturePart.v, _signaturePart.r, _signaturePart.s);
        return (signer == issuer);
    }

    function hashVerifiableCredential(address issuer, address _subject, bytes32 _credentialHash, uint256 _from, uint256 _exp) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(issuer, _subject, _credentialHash, _from, _exp));
    }

    modifier onlyIssuer() {
        require(hasRole(ISSUER_ROLE, msg.sender), "Caller is not a issuer 2");
        _;
    }
}