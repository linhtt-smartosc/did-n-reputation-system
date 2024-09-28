import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
          viaIR: true,
        },
      },
    ],
  },
  defaultNetwork: "local",
  networks: {
    local: {
      url: process.env.LOCAL_NETWORK_RPC,
      chainId: 31337,
      accounts: {
        mnemonic:
          process.env.MNEMONIC ||
          "test test test test test test test test test test test junk",
        initialIndex: 0,
        count: 10,
        accountsBalance: "1000000000000000000000000",
      },
    },
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY!}`,
    //   accounts: [process.env.SEPOLIA_PRIVATE_KEY!],
    // },
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
