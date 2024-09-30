import fs from "fs";
import path from "path";

const networkName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return "mainnet";
    case 11155111:
      return "sepolia";
    case 31337:
      return "hardhat";
  }
  return "";
};

const getAddress = async (chainId: number) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.join(
        __dirname,
        `../scripts/deployments/${networkName(chainId)}/address.json`
      ),
      "utf8",
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data.toString()));
        }
      }
    );
  });
};

const writeDeployData = async (chainId: number, addresses: string) => {
  const prevAddresses = await getAddress(chainId);
  const newAddresses = {
    ...(prevAddresses || {}),
    ...(JSON.parse(addresses) || {}),
  };
  
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.join(
        __dirname,
        `../scripts/deployments/${networkName(chainId)}/address.json`
      ),
      JSON.stringify(newAddresses),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(newAddresses);
        }
      }
    );
  });
};

export { getAddress, writeDeployData };
