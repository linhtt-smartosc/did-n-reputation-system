const DIDService = require('../service/did.service');

const createDID = async (req, res) => {

    const { address, email, encryptedKey, role, signInType } = req.body;
    try {
        const did = await DIDService.createDID(address, email, encryptedKey, role, signInType);
        res.status(201).json(did);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updateOwner = async (req, res) => {
    const { sig, newOwner } = req.body;
    try {
        const updatedOwner = await DIDService.updateOwner(sig, newOwner);
        res.status(200).json(updatedOwner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updateAttribute = async (req, res) => {
    const { sig, attribute, validity } = req.body;
    try {
        const updatedAttribute = await DIDService.updateAttribute(sig, attribute, validity);
        res.status(200).json(updatedAttribute);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getUser = async (req, res) => {
    const { address } = req.params;
    try {
        const user = await DIDService.getUser(address);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createDID,
    updateOwner,
    updateAttribute,
    getUser
}




