// import controller functions
const {viewTransaction, addTransaction, editTransaction, deleteTransaction} = require('../controllers/transactionController.js');
// import middleware for authentication
const authenticateToken = require('../middleware/authMiddleware.js');

// create router object to define routes on
const transactionRouter = require('express').Router();

// define routes and attach controller functions
transactionRouter.get('/view', authenticateToken, viewTransaction);
transactionRouter.post('/add', authenticateToken, addTransaction);
transactionRouter.put('/edit/:id', authenticateToken, editTransaction);
transactionRouter.delete('/delete/:id', authenticateToken, deleteTransaction);

// so server.js can import the router and use it
module.exports = transactionRouter;