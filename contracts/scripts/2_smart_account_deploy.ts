import { writeDeployData } from "../utils/addressManager";
import { ethers } from "hardhat";
import smartAccountFactoryArtifact from "@account-abstraction/contracts/artifacts/SimpleAccountFactory.json";
import deploymentData from "./deployments/hardhat/address.json"

const privateKey = process.env.LOCAL_PRIVATE_KEY;

async function smartAccountFactoryDeploy() {
  const chainID = Number((await ethers.provider.getNetwork()).chainId);

  if (!privateKey) {
    throw new Error("No private key provided");
  }
  const signer = new ethers.Wallet(privateKey, ethers.provider);
  const SmartAccountFactory = new ethers.ContractFactory(
    smartAccountFactoryArtifact.abi,
    smartAccountFactoryArtifact.bytecode,
    signer
  );
  const smartAccount = await SmartAccountFactory.deploy(deploymentData.EntryPoint);
  await smartAccount.waitForDeployment();
  console.log(`SmartAccount deployed to: ${await smartAccount.getAddress()}`);

  await writeDeployData(
    chainID,
    JSON.stringify({ SmartAccount: await smartAccount.getAddress() })
  );
}

smartAccountFactoryDeploy()