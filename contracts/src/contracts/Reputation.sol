// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./interfaces/IReputation.sol";

contract Reputation is IReputation {
    mapping(address => ReputationPoint) public reputation;

    function setReputation(address _owner, uint256 _reputation) internal {
        reputation[_owner].totalReputationPoint = _reputation;
    }

    function getReputationByOwner(
        address _owner
    ) public view returns (uint256) {
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
        uint256 currentReputationPoint = reputation[_owner]
            .totalReputationPoint + 10;
        setReputation(_owner, currentReputationPoint);

        emit ReputationPointUpdated(_owner, currentReputationPoint);
    }

    function addVCPoint(address _owner, bytes32 vcHash) external override {
        uint256 currentReputationPoint;

        if (reputation[_owner].verifiableCredentials[msg.sender].length > 0) {
            revert VCAlreadyAdded();
        }
        reputation[_owner].verifiableCredentials[msg.sender] = vcHash;
        reputation[_owner].verifiableCredentialPoint += 20;
        currentReputationPoint = reputation[_owner].totalReputationPoint + 20;

        setReputation(_owner, currentReputationPoint);

        emit ReputationPointUpdated(_owner, currentReputationPoint);
    }

    function addHistoricalTxPoint(address _owner) external override {
        reputation[_owner].transactionHistoryPoint += 1;
        uint256 currentReputationPoint = reputation[_owner]
            .totalReputationPoint + 1;
        setReputation(_owner, currentReputationPoint);

        emit ReputationPointUpdated(_owner, currentReputationPoint);
    }
}
