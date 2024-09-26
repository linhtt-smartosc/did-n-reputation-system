//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

interface IDIDRegistry {
    event DIDOwnerChanged(
        address indexed identity,
        address owner,
        uint previousChange
    );

    event DIDAttributeChanged(
        address indexed identity,
        bytes32 name,
        bytes value,
        uint validTo,
        uint previousChange
    );
    function identityOwner(address identity) external view returns (address);
    function changeOwner(address identity, address newOwner) external;
    function changeOwnerSigned(
        address identity,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        address newOwner
    ) external;
    function setAttribute(
        address identity,
        bytes32 name,
        bytes memory value,
        uint validity
    ) external;
    function setAttributeSigned(
        address identity,
        uint8 sigV,
        bytes32 sigR,
        bytes32 sigS,
        bytes32 name,
        bytes memory value,
        uint validity
    ) external;
    function getAttribute(
        address identity,
        bytes32 name
    ) external view returns (bytes memory);
}
