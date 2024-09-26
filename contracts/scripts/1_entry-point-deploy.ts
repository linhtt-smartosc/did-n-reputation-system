import { writeDeployData } from "../utils/addressManager";
import { ethers } from "hardhat";
import entryPointArtifact from "@account-abstraction/contracts/artifacts/EntryPoint.json";

const privateKey = process.env.LOCAL_PRIVATE_KEY;

async function entryPointDeploy() {
  const chainID = Number((await ethers.provider.getNetwork()).chainId);

  if (!privateKey) {
    throw new Error("No private key provided");
  }
  const signer = new ethers.Wallet(privateKey, ethers.provider);
  const EntryPointFactory = new ethers.ContractFactory(
    entryPointArtifact.abi,
    entryPointArtifact.bytecode,
    signer
  );
  const entryPoint = await EntryPointFactory.deploy();
  await entryPoint.waitForDeployment();
  console.log(`EntryPoint deployed to: ${await entryPoint.getAddress()}`);

  await writeDeployData(
    chainID,
    JSON.stringify({ EntryPoint: await entryPoint.getAddress() })
  );
}

entryPointDeploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
