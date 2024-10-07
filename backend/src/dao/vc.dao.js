const VC = require('../model/vc.model');

const createVC = async (vcHash, issuer, subject, proof, type, iat, exp) => {
    const newVC = new VC({
        _id: vcHash,
        issuer,
        subject,
        proof,
        type,
        iat,
        exp
    });
    return await newVC.save();
}

const revokeVC = async (id, status) => {
    return await VC.findByIdAndUpdate(id, { $set: { status } }, { new: true });
}

const getVCByIssuer = async (issuer) => {
    return await VC.find({ issuer });
}

const getVCBySubject = async (subject) => {
    return await VC.find({ subject });
}


module.exports = {
    createVC,
    revokeVC,
    getVCByIssuer,
    getVCBySubject
}