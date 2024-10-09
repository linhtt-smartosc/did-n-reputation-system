// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./interfaces/IReputation.sol";

contract Reputation is IReputation {
    mapping(address => ReputationPoint) public reputation;

    function setReputation(address _owner, uint _reputation) internal {
        reputation[_owner].totalReputationPoint = _reputation;
    }

    function getReputationByOwner(address _owner) public returns (uint) {
        return reputation[_owner].totalReputationPoint;
    }

    function addSocialReputationPoint(
        address _owner,
        SocialAccountPoint _socialPointType
    ) external override {
        if (reputation[_owner].socialAccountPointStatus[_socialPointType]) {
            revert SocialAccountAdded();
        }
        reputation[_owner].socialAccountPointStatus[_socialPointType] = true;
        reputation[_owner].socialAccountPoint += 10;
        uint currentReputationPoint = reputation[_owner].totalReputationPoint +
            10;
        setReputation(_owner, currentReputationPoint);

        emit ReputationPointUpdated(_owner, currentReputationPoint);
    }

    function addVCPoint(address _owner, bytes32 vcHash) external override {
        uint currentReputationPoint;

        if (reputation[_owner].verifiableCredentials[vcHash]) {
            revert VCAlreadyAdded();
        }
        reputation[_owner].verifiableCredentials[vcHash] = true;
        reputation[_owner].verifiableCredentialPoint += 20;
        currentReputationPoint = reputation[_owner].totalReputationPoint + 20;

        setReputation(_owner, currentReputationPoint);

        emit ReputationPointUpdated(_owner, currentReputationPoint);
    }

    function addHistoricalTxPoint(address _owner) external override {
        reputation[_owner].transactionHistoryPoint += 1;
        uint currentReputationPoint = reputation[_owner].totalReputationPoint +
            1;
        setReputation(_owner, currentReputationPoint);

        emit ReputationPointUpdated(_owner, currentReputationPoint);
    }
}
