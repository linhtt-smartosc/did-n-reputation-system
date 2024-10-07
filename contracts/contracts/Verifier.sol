//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IVerifier.sol";
import "./interfaces/ICredentialRegistry.sol";

contract Verifier is AccessControl, IVerifier {
    struct EIP712Domain {
        string name;
        string version;
        uint chainId;
        address verifyingContract;
    }

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    ICredentialRegistry public credentialRegistry;

    bytes32 constant EIP712DOMAIN_TYPEHASH =
        keccak256(
            abi.encodePacked("EIP712Domain(string name,string version,uint chainId,address verifyingContract)")
        );

    bytes32 DOMAIN_SEPARATOR;

    bytes32 internal constant VERIFIABLE_CREDENTIAL_TYPEHASH =
        keccak256(
            abi.encodePacked("VerifiableCredential(address issuer,address subject,bytes32 credentialSubject,uint validFrom,uint validTo)")
        );
    
    constructor(
        string memory name,
        string memory version,
        uint256 chainId,
        address credentialRegistryAddress
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        DOMAIN_SEPARATOR = hashEIP712Domain(
            EIP712Domain({
                name: name,
                version: version,
                chainId: chainId,
                verifyingContract: address(this)
            })
        );

        credentialRegistry = ICredentialRegistry(credentialRegistryAddress);
    }

    function hashEIP712Domain(
        EIP712Domain memory eip712Domain
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    EIP712DOMAIN_TYPEHASH,
                    keccak256(bytes(eip712Domain.name)),
                    keccak256(bytes(eip712Domain.version)),
                    eip712Domain.chainId,
                    eip712Domain.verifyingContract
                )
            );
    }

    function verifyCredential(
        VerifiableCredential memory _vc,
        bytes memory _signature
    ) external view override returns (bool) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                credentialRegistry.hashVerifiableCredential(
                    VERIFIABLE_CREDENTIAL_TYPEHASH,
                    _vc.issuer,
                    _vc.subject,
                    _vc.credentialSubject,
                    _vc.validFrom,
                    _vc.validTo
                )
            )
        );
    
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        address signer = credentialRegistry.getIssuer(hash, v, r, s);

        return (
            credentialRegistry.verifyIssuer(_vc.issuer, signer)
        );
    }

    function exist(
        bytes32 _credentialHash,
        address _issuer
    ) external view override returns (bool) {
        return credentialRegistry.exist(_credentialHash, _issuer);
    }

    function validate(
        bytes32 _credentialHash,
        address _issuer
    ) external view override returns (bool) {
        return credentialRegistry.validate(_credentialHash, _issuer);
    }

    function splitSignature(
        bytes memory _signature
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(_signature.length == 65, "Invalid signature length");
        /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
    }
}
