const vcRouter = require('express').Router();
const { issueVC, revokeVC, getVCByIssuer, getVCBySubject } = require('../controller/vc.controller');

vcRouter.post('/', issueVC);
vcRouter.get('/issuer/:issuer', getVCByIssuer);
vcRouter.get('/subject/:subject', getVCBySubject);
vcRouter.patch('/:did', revokeVC);

module.exports = vcRouter;