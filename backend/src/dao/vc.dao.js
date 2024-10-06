const VC = require('../model/vc.model');

const createVC = async (vcHash, issuer, subject, proof) => {
    const newVC = new VC({
        _id: vcHash,
        issuer,
        subject,
        proof
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