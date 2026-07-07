// import controller functions
const {bankToken, connectBank, bankDetails } = require('../controllers/plaidController.js');
// import middleware for authentication
const authenticateToken = require('../middleware/authMiddleware.js');
// create router object
const plaidRouter = require('express').Router();

// define routes and attach controller functions
// express does functions in order
plaidRouter.post('/createLinkToken', authenticateToken, bankToken);
plaidRouter.post('/exchangeToken', authenticateToken, connectBank);
plaidRouter.post('/transactions', authenticateToken, bankDetails);

// export to server.js
module.exports = plaidRouter;