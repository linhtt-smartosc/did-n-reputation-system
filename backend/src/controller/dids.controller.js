const {createDID, getDocument, updateDID, deleteDID} = require('../service/dids.service');

const createDID = async (req, res) => {
    const { address, type } = req.body;
    try {
        const did = await createDID(address);
        res.status(201).json(did);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getDocument = async (req, res) => {
    const { address } = req.params;
    try {
        const did = await getDocument(address);
        res.status(200).json(did);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


