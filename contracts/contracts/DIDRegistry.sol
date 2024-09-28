// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./interfaces/IDIDRegistry.sol";

contract DIDRegistry is IDIDRegistry {
    mapping(address => address) public owners;
    mapping(address => uint) public changed;
    mapping(address => uint) public nonce;

    modifier onlyOwner(address identity, address sender) {
        require(sender == identityOwner(identity), "Not Owner");
        _;
    }

    function identityOwner(address identity) public view returns (address) {
        address owner = owners[identity];
        if (owner != address(0x00)) {
            return owner;
        }
        return identity;
    }

    function checkSignature(
        address identity,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        bytes32 hash
    ) internal returns (address) {
        address signer = ecrecover(hash, sigV, sigR, sigS);
        require(signer == identityOwner(identity), "Bad signature");
        nonce[signer]++;
        return signer;
    }

    function changeOwner(
        address identity,
        address actor,
        address newOwner
    ) internal onlyOwner(identity, actor) {
        owners[identity] = newOwner;
        emit DIDOwnerChanged(identity, newOwner, changed[identity]);
        changed[identity] = block.number;
    }

    function changeOwner(address identity, address newOwner) public {
        changeOwner(identity, msg.sender, newOwner);
    }

    function changeOwnerSigned(
        address identity,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        address newOwner
    ) public {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0),
                this,
                nonce[identityOwner(identity)],
                identity,
                "changeOwner",
                newOwner
            )
        );
        changeOwner(
            identity,
            checkSignature(identity, sigV, sigR, sigS, hash),
            newOwner
        );
    }

    function setAttribute(
        address identity,
        address actor,
        bytes32 name,
        bytes memory value,
        uint validity
    ) internal onlyOwner(identity, actor) {
        emit DIDAttributeChanged(
            identity,
            name,
            value,
            block.timestamp + validity,
            changed[identity]
        );
        changed[identity] = block.number;
    }

    function setAttribute(
        address identity,
        bytes32 name,
        bytes memory value,
        uint validity
    ) public {
        setAttribute(identity, msg.sender, name, value, validity);
    }

    function setAttributeSigned(
        address identity,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        bytes32 name,
        bytes memory value,
        uint validity
    ) public {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0x19),
                bytes1(0),
                this,
                nonce[identityOwner(identity)],
                identity,
                "setAttribute",
                name,
                value,
                validity
            )
        );
        setAttribute(
            identity,
            checkSignature(identity, sigV, sigR, sigS, hash),
            name,
            value,
            validity
        );
    }

    function getAttribute(
        address identity,
        bytes32 name
    ) external view override returns (bytes memory) {}
}
