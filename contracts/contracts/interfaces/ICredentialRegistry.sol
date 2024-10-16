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
        uint validFrom; // The emission timestamp (in seconds)
        uint validTo; // The expriation timestamp (in seconds)
        mapping(bytes => bool) signatures;
        bool status;
    }

    struct CredentialMetadataView {
        address issuer;
        address subject;
        uint validFrom;
        uint validTo;
        bool status;
    }

    /**
     * Issue a new credential
     * @param _issuer Address of the issuer of the credential
     * @param _subject Address of the subject of the credential
     * @param _credentialHash The credential hash of the credential generated off-chain
     * @param _from The emission timestamp (in seconds)
     * @param _exp The expriation timestamp (in seconds)
     * @param _signature The signature parts including v, r, s
     */
    function registerCredential(
        address _issuer,
        address _subject,
        bytes32 _credentialHash,
        uint _from,
        uint _exp,
        Signature memory _signature
    ) external;

    /**
     * Revoke a credential
     * @param _credentialHash The credential hash of the credential generated off-chain
     * @param _signature The signature parts including v, r, s
     * @param _domainSeparator The domain separator of the contract
     * @param _issuer The issuer of the credential
     */
    function revokeCredential(
        bytes32 _credentialHash,
        Signature memory _signature,
        bytes32 _domainSeparator,
        address _issuer
    ) external;

    /**
     * Check if a credential exists
     * @param _credentialHash The credential hash of the credential generated off-chain
     * @param _issuer Issuer of the credential
     */
    function exist(
        bytes32 _credentialHash,
        address _issuer
    ) external view returns (bool);

    /**
     * Check if a credential is valid
     * @param _credentialHash The credential hash of the credential generated off-chain
     * @param _issuer Issuer of the credential
     */
    function validate(
        bytes32 _credentialHash,
        address _issuer
    ) external view returns (bool);

    /**
     * Hash a verifiable credential
     * @param _vcTypeHash the type hash of the verifiable credential following EIP-712 
     * @param _issuer address of the issuer
     * @param _subject address of the subject
     * @param _credentialSubjectHex hex string of the credential subject
     * @param _validFrom the emission timestamp (in seconds)
     * @param _validTo the expiration timestamp (in seconds)
     */
    function hashVerifiableCredential(
        bytes32 _vcTypeHash,
        address _issuer,
        address _subject,
        bytes32 _credentialSubjectHex,
        uint _validFrom,
        uint _validTo
    ) external pure returns (bytes32);

    event CredentialRegistered(
        bytes32 indexed credentialHash,
        address by,
        address to,
        uint iat,
        uint nonce
    );

    event CredentialRevoked(
        bytes32 indexed credentialHash,
        address by,
        uint date
    );

    error InvalidSignature();
    error CredentialExists();
    error InvalidCredential();
    error NotIssuer();
}
