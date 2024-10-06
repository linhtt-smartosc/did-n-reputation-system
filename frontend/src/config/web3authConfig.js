import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "31337", 
    rpcTarget: "http://127.0.0.1:8545/",
};
const privateKeyProvider = new CommonPrivateKeyProvider({
    config: { chainConfig },
});
const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID;

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider
});

export default web3auth;