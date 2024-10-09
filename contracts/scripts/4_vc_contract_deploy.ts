import { writeDeployData } from "../utils/addressManager";
import { ethers } from "hardhat";
import CredentialRegistryArtifact from "../artifacts/contracts/CredentialRegistry.sol/CredentialRegistry.json";
import VerifierContractArtifact from "../artifacts/contracts/Verifier.sol/Verifier.json";
import deployedData from "./deployments/hardhat/address.json";

const privateKey = process.env.LOCAL_PRIVATE_KEY;

async function credentialRegistryDeploy() {
  const chainID = Number((await ethers.provider.getNetwork()).chainId);

  if (!privateKey) {
    throw new Error("No private key provided");
  }
  const signer = new ethers.Wallet(privateKey, ethers.provider);
  const CredentialRegistry = new ethers.ContractFactory(
    CredentialRegistryArtifact.abi,
    CredentialRegistryArtifact.bytecode,
    signer
  );
  const credentialRegistry = await CredentialRegistry.deploy();
  await credentialRegistry.waitForDeployment();
  const credentialRegistryAddress = await credentialRegistry.getAddress();
  console.log(`CredentialRegistry deployed to: ${credentialRegistryAddress}`);
  const VerifierContract = new ethers.ContractFactory(
    VerifierContractArtifact.abi,
    VerifierContractArtifact.bytecode,
    signer
  );
  const verifierContract = await VerifierContract.deploy(
    "Didify",
    "1",
    31337,
    credentialRegistryAddress,
    deployedData.DIDRegistry
  );
  await verifierContract.waitForDeployment();
  console.log(
    `VerifierContract deployed to: ${await verifierContract.getAddress()}`
  );

  await writeDeployData(
    chainID,
    JSON.stringify({ 
      CredentialRegistry: await credentialRegistry.getAddress(),
      VerifierContract: await verifierContract.getAddress()
    })
  );
}


credentialRegistryDeploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });