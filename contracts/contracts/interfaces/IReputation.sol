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
        uint totalReputationPoint;
        mapping(SocialAccountPoint => bool) socialAccountPointStatus;
        uint socialAccountPoint;
        uint transactionHistoryPoint;
        uint verifiableCredentialPoint;
        mapping(address => bytes32) verifiableCredentials;
    }

    event ReputationPointUpdated(
        address indexed owner,
        uint currentReputationPoint
    );

    error VCAlreadyAdded();

    error SocialAccountAdded();

    function getReputationByOwner(address _owner) external view returns (uint);

    function addSocialReputationPoint(
        address _owner,
        SocialAccountPoint _socialPointType
    ) external;

    function addVCPoint(address _owner, bytes32 vcHash) external;

    function addHistoricalTxPoint(address _owner) external;
}
