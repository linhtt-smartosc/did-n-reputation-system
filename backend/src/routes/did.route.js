const didRouter = require('express').Router();
const { createDID, updateOwner, getUser } = require('../controller/did.controller');

didRouter.post('/', createDID);
didRouter.patch('/', updateOwner);
didRouter.get('/:address', getUser);

module.exports = didRouter;