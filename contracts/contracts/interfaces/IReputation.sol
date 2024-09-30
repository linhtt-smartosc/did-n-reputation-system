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
        mapping(bytes32 => bool) verifiableCredentials;
    }

    event ReputationPointUpdated(
        address indexed owner,
        uint currentReputationPoint
    );

    error VCAlreadyAdded();

    error SocialAccountAdded();

    /**
     * Get the total reputation point by owner
     * @param _owner address of the owner
     */
    function getReputationByOwner(address _owner) external view returns (uint);

    /**
     * Add social reputation point to the owner
     * @param _owner address of the owner
     * @param _socialPointType social point type ranging from 0 to 3
     */
    function addSocialReputationPoint(
        address _owner,
        SocialAccountPoint _socialPointType
    ) external;

    /**
     * Add verifiable credential point to the owner
     * @param _owner sddress of the owner
     * @param vcHash the hash of the verifiable credential
     */
    function addVCPoint(address _owner, bytes32 vcHash) external;

    /**
     * Add historical transaction point to the owner
     * @param _owner address of the owner
     */
    function addHistoricalTxPoint(address _owner) external;
}
