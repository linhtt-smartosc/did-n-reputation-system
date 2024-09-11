const didRouter = require('express').Router();
const { createDID, getDIDDocument, updateDID, deleteDID } = require('../controllers/dids');

didRouter.post('/', createDID);
didRouter.get('/:did', getDIDDocument);
didRouter.patch('/:did', updateDID);
didRouter.delete('/:did', deleteDID);

module.exports = didRouter;