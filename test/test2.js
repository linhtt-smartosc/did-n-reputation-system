const { ethers, verifyMessage, zeroPadValue, toBeHex, concat, keccak256, SigningKey, getBytes, toUtf8Bytes } = require('ethers');

const signData = async (
    identity,
    signerAddress,
    privateKeyBytes,
    dataBytes
) => {
    const _nonce = 0;
    const paddedNonce = zeroPadValue(toBeHex(_nonce), 32);
    const didRegistryAddress = '0x966b2F2475d05507EDAa735f09D9505c1653E3ff';
    const dataToSign = concat(['0x1900', didRegistryAddress, paddedNonce, identity, dataBytes]);
    const hash = keccak256(dataToSign); 
    return new SigningKey(privateKeyBytes).sign(hash);
}

const main = async () => {
    // Step 1: Generate a wallet (key pair)
    // const wallet = ethers.Wallet.createRandom();
    // const privateKey = wallet.privateKey;
    // const publicKey = wallet.address; // The public key in Ethereum is derived from the wallet

    // console.log("Private Key:", privateKey);
    // console.log("Public Key (Address):", publicKey);

    // // Step 2: Sign the message
    // const message = JSON.stringify({ msg: "Hello World!" });
    // const signature = await wallet.signMessage(message);

    // console.log("Message:", message);
    // console.log("Signature:", signature);

    // // Step 3: Verify the signature
    // const recoveredAddress = verifyMessage(message, signature);

    // console.log("Recovered Address:", recoveredAddress);
    // console.log("Is the signature valid?", recoveredAddress.toLowerCase() === publicKey.toLowerCase());

    const prvKey = '0x28a29400b17e9dd29c54ce4814c1fc2ab63c62f13c7ec2029c7ea808534fc5ce';
    const identity = '0xE00c45638F8d30bA76F6eFbfAC3cE1652D86A088';
    const signerAddress = '0xE00c45638F8d30bA76F6eFbfAC3cE1652D86A088';
    const privateKeyBytes = getBytes(prvKey);
    const newOwner = '0xF44CBF3E835fF0197Bb5F8C7b5444C2Fe5aEd12D'
    const dataBytes = concat([toUtf8Bytes('changeOwner'), newOwner]);

    const sig = await signData(identity, signerAddress, privateKeyBytes, dataBytes);
    console.log("v: ", sig.v);
    console.log("r: ", sig.r);
    console.log("s: ", sig.s);
    
}

main();

