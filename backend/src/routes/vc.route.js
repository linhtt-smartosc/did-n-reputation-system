const vcRouter = require('express').Router();
const { issueVC, revokeVC, getVCByIssuer, getVCBySubject, grantRole, retrieveVC } = require('../controller/vc.controller');

vcRouter.post('/', issueVC);
vcRouter.get('/issuer/:issuer', getVCByIssuer);
vcRouter.get('/subject/:subject', getVCBySubject);
vcRouter.patch('/:id', revokeVC);
vcRouter.post('/grant-role', grantRole);
vcRouter.get('/:id', retrieveVC);

module.exports = vcRouter;