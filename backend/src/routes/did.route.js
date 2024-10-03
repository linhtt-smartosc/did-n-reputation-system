const didRouter = require('express').Router();
const { createDID, updateOwner, getUser } = require('../controller/did.controller');

didRouter.post('/', createDID);
didRouter.patch('/:did', updateOwner);
didRouter.get('/:did', getUser);

module.exports = didRouter;