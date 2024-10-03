const VC = require('../model/vc.model');

const createVC = async (vcHash, issuer, subject) => {
    const newVC = new VC({
        _id: vcHash,
        issuer,
        subject
    });
    return await newVC.save();
}

const revokeVC = async (vcHash, status) => {
    return await VC.findByIdAndUpdate(vcHash, { status });
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