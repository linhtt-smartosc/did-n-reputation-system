import { writeDeployData } from "../utils/addressManager";
import { ethers } from "hardhat";
import didRegistryArtifact from "../artifacts/contracts/DIDRegistry.sol/DIDRegistry.json";

const privateKey = process.env.LOCAL_PRIVATE_KEY;

async function didRegistryDeploy() {
  const chainID = Number((await ethers.provider.getNetwork()).chainId);

  if (!privateKey) {
    throw new Error("No private key provided");
  }
  const signer = new ethers.Wallet(privateKey, ethers.provider);
  const DIDRegistry = new ethers.ContractFactory(
    didRegistryArtifact.abi,
    didRegistryArtifact.bytecode,
    signer
  );
  const didRegistry = await DIDRegistry.deploy();
  await didRegistry.waitForDeployment();
  console.log(`DIDRegistry deployed to: ${await didRegistry.getAddress()}`);

  await writeDeployData(
    chainID,
    JSON.stringify({ DIDRegistry: await didRegistry.getAddress() })
  );
}

didRegistryDeploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
