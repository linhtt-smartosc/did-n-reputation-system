import { writeDeployData } from "../utils/addressManager";
import { ethers } from "hardhat";
import smartAccountArtifact from "@account-abstraction/contracts/artifacts/SimpleAccountFactory.json";

const privateKey = process.env.LOCAL_PRIVATE_KEY;

async function smartAccountDeploy() {
  const chainID = Number((await ethers.provider.getNetwork()).chainId);

  if (!privateKey) {
    throw new Error("No private key provided");
  }
  const signer = new ethers.Wallet(privateKey, ethers.provider);
  const SmartAccountFactory = new ethers.ContractFactory(
    smartAccountArtifact.abi,
    smartAccountArtifact.bytecode,
    signer
  );
  const smartAccount = await SmartAccountFactory.deploy();
  await smartAccount.waitForDeployment();
  console.log(`SmartAccount deployed to: ${await smartAccount.getAddress()}`);

  await writeDeployData(
    chainID,
    JSON.stringify({ SmartAccount: await smartAccount.getAddress() })
  );
}

smartAccountDeploy()