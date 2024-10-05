//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/ICredentialRegistry.sol";

contract CredentialRegistry is ICredentialRegistry, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    mapping(bytes32 => mapping(address => CredentialMetadata))
        public credentials;

    mapping(address => uint) public nonces;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function getCredential(
        bytes32 _credentialHash,
        address _issuer
    ) external view returns (CredentialMetadataView memory) {
        CredentialMetadata storage credential = credentials[_credentialHash][
            _issuer
        ];
        return
            CredentialMetadataView(
                credential.issuer,
                credential.subject,
                credential.validFrom,
                credential.validTo,
                credential.status
            );
    }

    function registerCredential(
        address _issuer,
        address _subject,
        bytes32 _credentialHash,
        uint _from,
        uint _exp,
        Signature memory _signaturePart
    ) external {
        CredentialMetadata storage credential = credentials[_credentialHash][
            _issuer
        ];
        (bool isValid, address signer) = checkSignature(
            _signaturePart,
            _credentialHash,
            _issuer
        );
        if (!hasRole(ISSUER_ROLE, signer)) {
            revert NotIssuer();
        }
        if (!isValid) {
            revert InvalidSignature();
        }
        if (
            exist(_credentialHash, _issuer) &&
            validate(_credentialHash, _issuer)
        ) {
            revert CredentialExists();
        }
        credential.issuer = _issuer;
        credential.subject = _subject;
        credential.validFrom = _from;
        credential.validTo = _exp;
        credential.status = true;
        bytes memory _signature = abi.encodePacked(
            _signaturePart.r,
            _signaturePart.s,
            _signaturePart.v
        );
        credential.signatures[_signature] = true;

        emit CredentialRegistered(
            _credentialHash,
            _issuer,
            _subject,
            _from,
            _signature,
            nonces[_issuer] - 1
        );
    }

    function revokeCredential(
        bytes32 _credentialHash,
        Signature memory _signaturePart,
        bytes32 _domainSeparator,
        address _issuer
    ) external override {
        CredentialMetadata storage credential = credentials[_credentialHash][
            _issuer
        ];
        if (!validate(_credentialHash, _issuer)) {
            revert InvalidCredential();
        }
        require(exist(_credentialHash, _issuer), "Credential doesn't exist");

        bytes32 credentialHash = keccak256(
            abi.encode(_issuer, _credentialHash)
        );
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0x00),
                _domainSeparator,
                credentialHash,
                nonces[_issuer]
            )
        );
        (bool isValid, ) = checkSignature(
            _signaturePart,
            hash,
            _issuer
        );
        if (!isValid) {
            revert InvalidSignature();
        }

        credential.status = false;

        emit CredentialRevoked(_credentialHash, msg.sender, block.timestamp);
    }

    function validate(
        bytes32 _credentialHash,
        address issuer
    ) public view override returns (bool) {
        CredentialMetadata storage credential = credentials[_credentialHash][
            issuer
        ];
        return (credential.validFrom <= block.timestamp &&
            credential.validTo >= block.timestamp &&
            credential.status);
    }

    function exist(
        bytes32 _credentialHash,
        address issuer
    ) public view override returns (bool) {
        CredentialMetadata storage credential = credentials[_credentialHash][
            issuer
        ];
        return (credential.subject != address(0));
    }

    function hashVerifiableCredential(
        bytes32 _vcTypeHash,
        address _issuer,
        address _subject,
        bytes32 _credentialSubjectHex,
        uint _validFrom,
        uint _validTo
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _vcTypeHash,
                    _issuer,
                    _subject,
                    _credentialSubjectHex,
                    _validFrom,
                    _validTo
                )
            );
    }

    function verifyIssuer(
        address issuer,
        address signer
    ) external pure returns (bool) {
        return (issuer == signer);
    }

    function getIssuer(
        bytes32 digest,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external pure returns (address issuer) {
        return ecrecover(digest, v, r, s);
    }

    function checkSignature(
        Signature memory _signaturePart,
        bytes32 hash,
        address _issuer
    ) internal returns (bool, address) {
        address signer = ecrecover(
            hash,
            _signaturePart.v,
            _signaturePart.r,
            _signaturePart.s
        );
        bool isValid = signer == _issuer;
        if(isValid) {
            nonces[signer]++;
        }
        return (isValid, signer);
    }
}
