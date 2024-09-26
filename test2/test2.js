const { hexConcat, zeroPad, SigningKey, toUtf8Bytes, keccak256, arrayify, concat, hexlify } = require('ethers/lib/utils');

const signData = async (
    identity,
    signerAddress,
    privateKeyBytes,
    dataBytes
) => {
    const _nonce = 0;
    const paddedNonce = zeroPad(hexlify(_nonce), 32);
    const didRegistryAddress = '0x966b2F2475d05507EDAa735f09D9505c1653E3ff';
    const dataToSign = hexConcat(['0x1900', didRegistryAddress, paddedNonce, identity, dataBytes]);
    const hash = keccak256(dataToSign);

    return new SigningKey(privateKeyBytes).signDigest(hash);
}

const main = async () => {

    const privateKeyBytes = arrayify('0x28a29400b17e9dd29c54ce4814c1fc2ab63c62f13c7ec2029c7ea808534fc5ce');
    const identity = '0xE00c45638F8d30bA76F6eFbfAC3cE1652D86A088';
    const signerAddress = '0xE00c45638F8d30bA76F6eFbfAC3cE1652D86A088';
   
    const newOwner = '0xF44CBF3E835fF0197Bb5F8C7b5444C2Fe5aEd12D'
    const dataBytes = concat([toUtf8Bytes('changeOwner'), newOwner]);

    const sig = await signData(identity, signerAddress, privateKeyBytes, dataBytes);
    console.log("v: ", sig.v);
    console.log("r: ", sig.r);
    console.log("s: ", sig.s);

}

main();

