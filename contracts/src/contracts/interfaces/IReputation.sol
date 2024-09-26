// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IReputation {

    enum SocialAccountPoint {
        GOOGLE_ACCOUNT_REGISTERED,
        FACEBOOK_ACCOUNT_REGISTERED,
        GITHUB_ACCOUNT_REGISTERED,
        DISCORD_ACCOUNT_REGISTERED
    }

    enum HistoricalPoint {
        VERIFIABLE_CREDENTIALS_ADDED,
        TRANSACTION_COMPLETED
    }

    struct ReputationPoint {
        uint256 totalReputationPoint;
        mapping(SocialAccountPoint => bool) socialAccountPointStatus;
        uint256 socialAccountPoint;
        uint256 transactionHistoryPoint;
        uint256 verifiableCredentialPoint;
        mapping (address => bytes32) verifiableCredentials;
    }

    event ReputationPointUpdated(address indexed owner, uint256 currentReputationPoint);

    error VCAlreadyAdded();

    error SocialAccountAdded();

    function getReputationByOwner(address _owner) external view returns (uint256);

    function addSocialReputationPoint(address _owner, SocialAccountPoint _socialPointType) external;

    function addVCPoint(address _owner, bytes32 vcHash) external;

    function addHistoricalTxPoint(address _owner) external;

}