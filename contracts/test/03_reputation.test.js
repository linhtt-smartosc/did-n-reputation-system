const { expect } = require('chai');
const { ethers } = require('hardhat');
const { keccak256, toUtf8Bytes } = require('ethers');

describe("Reputation", function () {
    let reputationContractInstance;
    let owner1;
    before(async function () {
        const reputationFactory = await ethers.getContractFactory("Reputation");
        reputation = await reputationFactory.deploy();
        reputationContractInstance = await reputation.waitForDeployment();
        [owner1] = await ethers.getSigners();
        owner1Address = await owner1.getAddress();
    }) 
    describe("Social point", async function () {
        it("Should add reputation", async function () {
            /* 
            GOOGLE_ACCOUNT_REGISTERED, 0
            FACEBOOK_ACCOUNT_REGISTERED, 1
            GITHUB_ACCOUNT_REGISTERED, 2
            DISCORD_ACCOUNT_REGISTERED, 3
            */
            const previousReputationPoint = await reputationContractInstance.reputation(owner1Address);
            const tx = await reputationContractInstance.addSocialReputationPoint(owner1Address, 0);
            await expect(tx).to.emit(reputationContractInstance, "ReputationPointUpdated").withArgs(owner1Address, previousReputationPoint[0] + 10n);
            const currentReputationPoint = await reputationContractInstance.reputation(owner1Address);
            expect(currentReputationPoint[0]).to.be.equal(previousReputationPoint[0] + 10n);
            expect(currentReputationPoint[1]).to.be.equal(previousReputationPoint[1] + 10n);
        })
        it("Should not add social reputation if already added", async function () {
            await expect(reputationContractInstance.addSocialReputationPoint(owner1Address, 0)).to.be.revertedWithCustomError(reputationContractInstance, "SocialAccountAdded")
        })
    })
    describe("Transaction history point", async function () {
        it("Should add transaction history point", async function () {
            const previousReputationPoint = await reputationContractInstance.reputation(owner1Address);
            const tx = await reputationContractInstance.addHistoricalTxPoint(owner1Address);
            await expect(tx).to.emit(reputationContractInstance, "ReputationPointUpdated").withArgs(owner1Address, previousReputationPoint[0] + 1n);
            const currentReputationPoint = await reputationContractInstance.reputation(owner1Address);
            expect(currentReputationPoint[0]).to.be.equal(previousReputationPoint[0] + 1n);
            expect(currentReputationPoint[2]).to.be.equal(previousReputationPoint[2] + 1n);
        })
    })
    describe("Verifiable Credential point", async function () {
        it("Should add VC point", async function () {
            const previousReputationPoint = await reputationContractInstance.reputation(owner1Address);
            const credentialHash = keccak256(toUtf8Bytes("credential"));
            const tx = await reputationContractInstance.addVCPoint(owner1Address, credentialHash);
            await expect(tx).to.emit(reputationContractInstance, "ReputationPointUpdated").withArgs(owner1Address, previousReputationPoint[0] + 20n);
            const currentReputationPoint = await reputationContractInstance.reputation(owner1Address);
            expect(currentReputationPoint[0]).to.be.equal(previousReputationPoint[0] + 20n);
            expect(currentReputationPoint[3]).to.be.equal(previousReputationPoint[3] + 20n);
        })
        it("Should not add VC point if already added", async function () {
            const credentialHash = keccak256(toUtf8Bytes("credential"));
            await expect(reputationContractInstance.addVCPoint(owner1Address, credentialHash)).to.be.revertedWithCustomError(reputationContractInstance, "VCAlreadyAdded");
        })
    })
    
})