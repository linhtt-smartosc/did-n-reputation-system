const { ethers } = require("ethers");

// Define the ABI with the custom error
const abi = [
    "error NotIssuer()",
    "error InvalidSignature()",
    "error CredentialExists()"
];

// Create an interface
const iface = new ethers.Interface(abi);

// The return data from the error
const returnData = "0xcaa03ea5";

try {
    // Decode the error data
    const decodedError = iface.parseError(returnData);
    console.log(decodedError);
} catch (err) {
    console.error("Error decoding return data:", err);
}