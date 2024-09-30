import { writeDeployData } from "../utils/addressManager";
import { ethers } from "hardhat";
import ReputationContractArtifact from "../artifacts/contracts/Reputation.sol/Reputation.json";

const privateKey = process.env.LOCAL_PRIVATE_KEY;

async function reputationContractDeploy() {
  const chainID = Number((await ethers.provider.getNetwork()).chainId);

  if (!privateKey) {
    throw new Error("No private key provided");
  }
  const signer = new ethers.Wallet(privateKey, ethers.provider);
  const ReputationContract = new ethers.ContractFactory(
    ReputationContractArtifact.abi,
    ReputationContractArtifact.bytecode,
    signer
  );
  const reputationContract = await ReputationContract.deploy();
  await reputationContract.waitForDeployment();
  console.log(`ReputationContract deployed to: ${await reputationContract.getAddress()}`);

  await writeDeployData(
    chainID,
    JSON.stringify({ ReputationContract: await reputationContract.getAddress() })
  );
}

reputationContractDeploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
