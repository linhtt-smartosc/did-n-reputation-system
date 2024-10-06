const DID = require('../model/did.model');
const User = require('../model/user.model');

async function createDID(address, chainId) {
    const newDID = new DID({
        _id: address,
        owner: address,
        chainId,
    });
    return await newDID.save();
}

async function createUser(address, email, role, encryptedKey, reputation) {
    if(!email && !encryptedKey) {
        throw new Error("Email or encrypted key are required");
    }
    let newUser;
    if (role === 'issuer') {
        newUser = new User({
            email,
            _id: address,
            encryptedKey,
            role: 'issuer',
            reputation
        });
        return await newUser.save();
    }
    newUser = new User({
        email,
        _id: address,
        encryptedKey,
        reputation
    });
    return await newUser.save();
}

async function updateOwner(identity, owner) {
    return await DID.findByIdAndUpdate(identity, { owner });
}

async function updateReputation(address, reputation) {
    return await User.findByIdAndUpdate(address, { reputation });
}

async function getUser(address) {
    return await User.findById(address);
}

module.exports = {
    createDID,
    getUser,
    createUser,
    updateOwner,
    updateReputation
}
