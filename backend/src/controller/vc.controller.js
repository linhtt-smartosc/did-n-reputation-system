const VCService = require('../service/vc.service');

const issueVC = async (req, res) => {
    const { type, issuer, holder, credentialSubject, proof, iat, exp } = req.body;
    try {
        const vc = await VCService.issueVC(type, issuer, holder, credentialSubject, proof, iat, exp);
        res.status(201).json(vc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getVCByIssuer = async (req, res) => {
    const { issuer } = req.params;
    try {
        const vc = await VCService.getVCByIssuer(issuer);
        res.status(200).json(vc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getVCBySubject = async (req, res) => {
    const { subject } = req.params;
    try {
        const vc = await VCService.getVCBySubject(subject);
        res.status(200).json(vc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const grantRole = async (req, res) => {
    const { issuer } = req.body;
    try {
        const result = await VCService.grantRole(issuer);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const revokeVC = async (req, res) => {
    const { id } = req.params;
    try {
        const vc = await VCService.revokeVC(id);
        res.status(200).json(vc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const retrieveVC = async (req, res) => {
    const { id } = req.params;
    try {
        const vc = await VCService.retrieveVC(id);
        res.status(200).json(vc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const requestPresent = async (req, res) => {
    const { id, holder, verifier } = req.body;
    try {
        const result = await VCService.requestPresent(id, holder, verifier);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getRequestedVCByHolder = async (req, res) => {
    const { holder } = req.params;
    try {
        const vc = await VCService.getRequestedVCByHolder(holder);
        res.status(200).json(vc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getRequestedVCByVerifier = async (req, res) => {
    const { verifier } = req.params;
    try {
        const vc = await VCService.getRequestedVCByVerifier(verifier);
        res.status(200).json(vc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updateRequestedVC = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const vc = await VCService.updateRequestedVC(id, status);
        res.status(200).json(vc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    issueVC,
    revokeVC,
    getVCByIssuer,
    getVCBySubject,
    grantRole,
    retrieveVC,
    requestPresent,
    getRequestedVCByHolder,
    getRequestedVCByVerifier,
    updateRequestedVC
}