//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IVerifier.sol";
import "./interfaces/ICredentialRegistry.sol";

contract Verifier is AccessControl, IVerifier {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    ICredentialRegistry public credentialRegistry;

    constructor(address _credentialRegistryAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        credentialRegistry = ICredentialRegistry(_credentialRegistryAddress);
    }

    function verifyCredential(
        VerifiableCredential memory _vc,
        bytes memory _signature,
        uint _nonce
    ) external view override returns (bool, bool, bool) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0x00),
                credentialRegistry.hashVerifiableCredential(
                    _vc.issuer,
                    _vc.subject,
                    _vc.data,
                    _vc.validFrom,
                    _vc.validTo
                ),
                _nonce
            )
        );
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        address signer = credentialRegistry.getIssuer(hash, v, r, s);
        return (
            credentialRegistry.exist(hash, _vc.issuer),
            credentialRegistry.validate(hash, _vc.issuer),
            credentialRegistry.verifyIssuer(_vc.issuer, signer)
        );
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
