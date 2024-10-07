const { time } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { keccak256, toUtf8Bytes, SigningKey, getBytes, zeroPadValue, toBeHex, concat, encodeBytes32String } = require('ethers');

const testData = require('./testData.json');
const owner1PrivateKey = testData.owner1;
const owner2PrivateKey = testData.owner2;

let didContractInstance;

const signData = async (identity, signerAddress, privateKeyBytes, dataBytes, didRegistryAddress) => {
  const nonce = await didContractInstance.nonce(signerAddress) || 0;
  const paddedNonce = zeroPadValue(toBeHex(nonce), 32);
  const dataToSign = concat([Buffer.from('1901', 'hex'), didRegistryAddress, paddedNonce, identity, dataBytes]);
  const hash = keccak256(dataToSign);
  return new SigningKey(privateKeyBytes).sign(hash);
}

describe("DID", function () {
  let owner1;
  let owner2;
  let owner1Address;
  let owner2Address;
  describe("Register a DID", function () {
    before(async function () {
      const didContractFactory = await ethers.getContractFactory("DIDRegistry");
      didContract = await didContractFactory.deploy();
      didContractInstance = await didContract.waitForDeployment();
      [owner1, owner2] = await ethers.getSigners();
      owner1Address = await owner1.getAddress();
      owner2Address = await owner2.getAddress();
    });
    it("Should not register a DID for another person", async function () {
      const dataBytes = concat([toUtf8Bytes('changeOwner'), owner1Address]);
      const sig = await signData(owner1Address, owner1Address, getBytes(owner2PrivateKey), dataBytes, await didContractInstance.getAddress());
      await expect(didContractInstance.changeOwnerSigned(owner1Address, sig.v, sig.r, sig.s, owner1Address)).to.be.revertedWith('Bad signature');
    })

    it("Should register a DID with signed message", async function () {
      const dataBytes = concat([toUtf8Bytes('changeOwner'), owner1Address]);
      const sig = await signData(owner1Address, owner1Address, getBytes(owner1PrivateKey), dataBytes, await didContractInstance.getAddress());
      const tx = await didContractInstance.changeOwnerSigned(owner1Address, sig.v, sig.r, sig.s, owner1Address);
      const receipt = await tx.wait();
      expect(owner1Address).to.be.equal(receipt.logs[0].args[0]);
      expect(tx).to.emit(didContractInstance, 'DIDOwnerChanged').withArgs(owner1Address, owner1Address, time.latestBlock());
    });
    it("Should not change a DID owner if not from owner himself", async function () {
      const dataBytes = concat([toUtf8Bytes('changeOwner'), owner2Address]);
      const sig = await signData(owner1Address, owner2Address, getBytes(owner2PrivateKey), dataBytes, await didContractInstance.getAddress());
      await expect(didContractInstance.changeOwnerSigned(owner1Address, sig.v, sig.r, sig.s, owner2Address)).to.be.revertedWith('Bad signature');
    });
  })
  describe("Set attributes", function () {
    let previousChange;
    let block;
    before(async function () {
      const didContractFactory = await ethers.getContractFactory("DIDRegistry");
      didContract = await didContractFactory.deploy();
      didContractInstance = await didContract.waitForDeployment();
      [owner1, owner2] = await ethers.getSigners();
      owner1Address = await owner1.getAddress();
      owner2Address = await owner2.getAddress();
      previousChange = await didContractInstance.changed(owner1Address);
      const dataBytes = concat([toUtf8Bytes('changeOwner'), owner1Address]);
      const sig = await signData(owner1Address, owner1Address, getBytes(owner1PrivateKey), dataBytes, await didContractInstance.getAddress());
      await didContractInstance.changeOwnerSigned(owner1Address, sig.v, sig.r, sig.s, owner1Address);
      block = await time.latestBlock();
    })
    it("Should set attributes", async function () {
      const dataBytes = concat([
        toUtf8Bytes('setAttribute'),
        encodeBytes32String('encryptionKey'),
        toUtf8Bytes('mykey'),
        zeroPadValue(toBeHex(86400), 32),
      ])
      const sig = await signData(owner1Address, owner1Address, getBytes(owner1PrivateKey), dataBytes, await didContractInstance.getAddress());

      const tx = await didContractInstance.setAttributeSigned(owner1Address, sig.v, sig.r, sig.s, encodeBytes32String('encryptionKey'), toUtf8Bytes('mykey'), 86400);
      const receipt = await tx.wait();
      expect(owner1Address).to.be.equal(receipt.logs[0].args[0]);
      expect(encodeBytes32String('encryptionKey')).to.be.equal(receipt.logs[0].args[1]);
      expect("0x6d796b6579").
        to.be.equal(receipt.logs[0].args[2]); // hex string of 'mykey'
      expect(receipt.logs[0].args[3]).to.be.equal(86400 + (await time.latest()));
    })
  })
});