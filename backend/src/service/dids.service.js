const { EthrDID } = require('ethr-did')
const { Resolver } = require('did-resolver')
const { getResolver } = require('ethr-did-resolver');
const { providerConfig } = require('../config/provider.config')

const chainId = process.env.CHAIN_ID;

const createDID = async (address) => {
    let did;

    if (address && provider) {
        did = new EthrDID({identifier: address, provider, chainId });
    }

    return did;
}

const getDocument = async (did, network) => {
    const didResolver = new Resolver(getResolver(providerConfig));
    const didDocument = await didResolver.resolve(`did:ethr:${network}:${did}`);
    return didDocument;
}

const updateOwner = async (owner) => {
    
}


module.exports = {
    createDID,
    getDocument
}