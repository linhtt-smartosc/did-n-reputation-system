const vcRouter = require('express').Router();
const { issueVC, revokeVC, getVCByIssuer, getVCBySubject, grantRole, retrieveVC, requestPresent, getRequestedVCByHolder, getRequestedVCByVerifier, updateRequestedVC } = require('../controller/vc.controller');

vcRouter.post('/', issueVC);
vcRouter.get('/issuer/:issuer', getVCByIssuer);
vcRouter.get('/subject/:subject', getVCBySubject);
vcRouter.patch('/:id', revokeVC);
vcRouter.post('/grant-role', grantRole);
vcRouter.get('/:id', retrieveVC);

vcRouter.post('/requestVC', requestPresent);
vcRouter.get('/requestVC/holder/:holder', getRequestedVCByHolder);
vcRouter.get('/requestVC/verifier/:verifier', getRequestedVCByVerifier);
vcRouter.patch('/requestVC/:id', updateRequestedVC);

module.exports = vcRouter;