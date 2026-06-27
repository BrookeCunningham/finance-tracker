const {bankToken, connectBank, bankDetails } = require('../controllers/plaidController'); 

const plaidRouter = require('express').Router()

plaidRouter.post('/createLinkToken', bankToken);
plaidRouter.post('/exchangeToken', connectBank);
plaidRouter.post('/transactions', bankDetails);

module.exports = plaidRouter;