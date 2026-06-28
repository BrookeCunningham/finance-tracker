const {bankToken, connectBank, bankDetails } = require('../controllers/plaidController.js');
const authenticateToken = require('../middleware/authMiddleware.js');
const plaidRouter = require('express').Router();

plaidRouter.post('/createLinkToken', authenticateToken, bankToken);
plaidRouter.post('/exchangeToken', authenticateToken, connectBank);
plaidRouter.post('/transactions', authenticateToken, bankDetails);

module.exports = plaidRouter;