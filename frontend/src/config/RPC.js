
import { ethers } from "ethers";


const getChainId = async (provider) => {
    try {
        console.log("Provider received:", provider);
        const ethersProvider = new ethers.BrowserProvider(provider);
        console.log("Ethers provider:", ethersProvider);
        
        const networkDetails = await ethersProvider.getNetwork();
        
        console.log("Network details:", networkDetails);
        return networkDetails.chainId.toString();
    } catch (error) {
        console.error("Error in getChainId:", error);
        return error;
    }
};

const getAccounts = async (provider) => {
    try {
        console.log("provider", provider);
        
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        // Get user's Ethereum public address
        const address = signer.getAddress();

        return await address;
    } catch (error) {
        return error;
    }
}

const getBalance = async (provider) => {
    try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        // Get user's Ethereum public address
        const address = signer.getAddress();

        // Get user's balance in ether
        const balance = ethers.formatEther(
            await ethersProvider.getBalance(address) // Balance is in wei
        );

        return balance;
    } catch (error) {
        return error;
    }
}

const sendTransaction = async (provider) => {
    try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

        const amount = ethers.parseEther("0.001");
        const fees = await ethersProvider.getFeeData()

        // Submit transaction to the blockchain
        const tx = await signer.sendTransaction({
            to: destination,
            value: amount,
            maxPriorityFeePerGas: fees.maxPriorityFeePerGas, // Max priority fee per gas
            maxFeePerGas: fees.maxFeePerGas, // Max fee per gas
        });

        // Wait for transaction to be mined
        const receipt = await tx.wait();

        return receipt;
    } catch (error) {
        return error;
    }
}

const signMessage = async (provider) => {
    try {
        // For ethers v5
        // const ethersProvider = new ethers.providers.Web3Provider(provider);
        const ethersProvider = new ethers.BrowserProvider(provider);

        // For ethers v5
        // const signer = ethersProvider.getSigner();
        const signer = await ethersProvider.getSigner();
        const originalMessage = "YOUR_MESSAGE";

        // Sign the message
        const signedMessage = await signer.signMessage(originalMessage);

        return signedMessage;
    } catch (error) {
        return error;
    }
}

const getPrivateKey = async (provider) => {
    try {
        const privateKey = await provider?.request({
            method: "eth_private_key",
        });

        return privateKey;
    } catch (error) {
        return error;
    }
};

const rpcMethods = { getChainId, getAccounts, getBalance, getPrivateKey, sendTransaction, signMessage };
export default rpcMethods;