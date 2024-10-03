const { entryPointContract, simpleAccountContract, simpleAccountFactory, executeOnChainTransaction } = require('../config/contract-instances.config');
const { concat, zeroPadValue, toBeHex, getBytes, keccak256, AbiCoder, Wallet } = require('ethers');


const salt = process.env.SALT;

const packAccountGasLimits = async (verificationGasLimit, callGasLimit) => {
    return concat([zeroPadValue(toBeHex(verificationGasLimit), 16), zeroPadValue(toBeHex(callGasLimit), 16)]);
}

const composeInitCode = async (ownerAddress) => {
    const walletCreateABI = simpleAccountFactory.methods.createAccount(ownerAddress, salt).encodeABI();
    initCode = concat([await simpleAccountFactory.getAddress(), walletCreateABI]);
}

const fund = async function () {
    
}


const packUserOp = async (op) => {
    let accountGasLimits = packAccountGasLimits(op.verificationGasLimit, op.executionGasLimit + 100000);
    let gasFees = packAccountGasLimits(op.maxPriorityFeePerGas, op.maxFeePerGas);
    const packedOp = {
        sender: op.sender,
        nonce: op.nonce,
        initCode: op.initCode,
        callData: op.callData,
        accountGasLimits,
        preVerificationGas: op.preVerificationGas,
        gasFees,
        paymasterAndData: '0x',
        signature: '0x'
    }
    return new AbiCoder().encode(
        ['address', 'uint256', 'bytes32', 'bytes32', 'bytes32', 'uint256', 'bytes32', 'bytes32'],
        [
            packedOp.sender,
            packedOp.nonce,
            keccak256(packedOp.initCode),
            keccak256(packedOp.callData),
            packedOp.accountGasLimits,
            packedOp.preVerificationGas,
            packedOp.gasFees,
            keccak256(packedOp.paymasterAndData),
        ]
    );
}
const executeHandleOps = async (op, ownerAddress, callData) => {
    let walletAddress = await simpleAccountFactory.methods.getAddress(ownerAddress, salt).call();
    const nonce = await entryPointContract.getNonce(walletAddress, 0);
    const initCode = await composeInitCode(ownerAddress);
    // if (callData == "createDID")
    //     callData = await walletContract.methods.execute(WETH, 0, callData).encodeABI();

    // const op = {
    //     sender: walletAddress,
    //     nonce,
    //     initCode,
    //     callData,
    //     verificationGasLimit,
    //     callGasLimit,
    //     maxFeePerGas,
    //     maxPriorityFeePerGas,
    //     preVerificationGas: 1,
    //     paymasterAddress,
    //     paymasterVerificationGasLimit,
    //     paymasterPostOpGasLimit,
    //     signature: '0x'
    // }
    const packedOp = await packUserOp(op);

    const userOpHash = keccak256(packedOp);
    const enc = new AbiCoder().encode(['bytes32', 'address', 'uint256'], [userOpHash, entryPoint, chainId]);
    const message = getBytes(keccak256(enc));

    const signer = new ethers.Wallet(alicePrivateKey, provider);
    const sign = await signer.signMessage(message);
    op.signature = sign;
    const packedOp1 = await packUserOp(op);

    try {
        const tx = entryPointContract.handleOps([packedOp1], coordinatorPublicKey, {
            gasLimit: 3000000,
            maxFeePerGas: 0,
            from: coordinatorPublicKey
        });
        console.log("Handleops Success --> ", tx.hash);
    } catch (error) {
        console.log("Handleops Error --> ", error);
        
    }

    // const handleOpsops = {
    //     to: entryPointAddress,
    //     gas: 3000000, maxFeePerGas: 0,
    //     data: handleOpsRawData
    // };

    // const coordinator = await Wallet(coordinatorPrivateKey, provider);
    // const signedTx = await coordinator.signMessage(handleOpsops);
    // try {
    //     const tx = await provider.sendTransaction(signedTx);
    //     console.log("Handleops Success --> ", tx.hash);
    // } catch (error) {
    //     console.log("Handleops Error --> ", error);
    // }

    // const signedTx = await web3.eth.accounts.signTransaction(handleOpsops, process.env.DEFAULT_PRIVATE_KEY);
    // await web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
    //     if (!error) { console.log("Handleops Success --> ", hash); }
    //     else { console.log("Handleops Error --> ", error) }
    // });

}