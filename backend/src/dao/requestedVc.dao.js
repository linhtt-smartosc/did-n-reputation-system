const RequestedVC = require('../model/requestedVC.model');

const createRequestedVC = async (id, holder, verifier) => {

    const newRequestedVC = new RequestedVC({
        _id: id,
        holder,
        verifier,
    });
    return await newRequestedVC.save();
}

const updateRequestedVC = async (_id, status) => {
    return await RequestedVC.findByIdAndUpdate(_id, { $set: { status } }, { new: true });
}

const getRequestedVCByHolder = async (holder) => {
    return await RequestedVC.find({ holder }).populate('_id');
}

const getRequestedVCByVerifier = async (verifier) => {
    return await RequestedVC.find({ verifier }).populate('_id');
}



module.exports = {
    createRequestedVC,
    updateRequestedVC,
    getRequestedVCByHolder,
    getRequestedVCByVerifier,
}