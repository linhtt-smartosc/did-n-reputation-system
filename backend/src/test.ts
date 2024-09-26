const { EthrDID } = require("ethr-did");

const keypair = EthrDID.createKeyPair();
console.log(keypair);

const ethrDid = new EthrDID({ ...keypair });
console.log(ethrDid);
