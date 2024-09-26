//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

interface ICredentialRegistry {
    struct Signature {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct CredentialMetadata {
        address issuer; 
        address subject; 
        uint256 validFrom; // The emission timestamp (in seconds)
        uint256 validTo; // The expriation timestamp (in seconds)
        mapping(bytes => bool) signatures;
        bool status;
    }

    /**
     * Issue a new credential
     * @param issuer Address of the issuer of the credential
     * @param subject Address of the subject of the credential
     * @param credentialHash The credential hash of the credential generated off-chain
     * @param from The emission timestamp (in seconds)
     * @param exp The expriation timestamp (in seconds)
     * @param _signatureByte The signature of the credential
     * @return bool True if the credential was successfully registered
     */
    function registerCredential(address issuer, address subject, bytes32 credentialHash, uint256 from, uint256 exp, Signature memory _signatureByte) external returns (bool);

    /**
     * Revoke a credential
     * @param credentialHash The credential hash of the credential generated off-chain
     * @return bool True if the credential was successfully revoked
     */
    function revokeCredential(bytes32 credentialHash) external returns (bool);

    /**
     * Check if a credential exists
     * @param credentialHash The credential hash of the credential generated off-chain
     * @param issuer Issuer of the credential
     */
    function exist(bytes32 credentialHash, address issuer) external view returns (bool);

    /**
     * Check if a credential is valid
     * @param _credentialHash The credential hash of the credential generated off-chain
     * @param issuer Issuer of the credential
     */
    function validate(bytes32 _credentialHash, address issuer) external view returns (bool);

    event CredentialRegistered(bytes32 indexed credentialHash, address by, address id, uint iat);
    event CredentialRevoked(bytes32 indexed credentialHash, address by, uint256 date);

    error InvalidSignature();
    error CredentialExists();
    error InvalidCredential();
}