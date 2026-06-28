// import controller routes
const {viewTransaction, addTransaction, editTransaction, deleteTransaction} = require('../controllers/transactionController.js');
const transactionRouter = require('express').Router();
const authenticateToken = require('../middleware/authMiddleware.js');

transactionRouter.get('/view', authenticateToken, viewTransaction);
transactionRouter.post('/add', authenticateToken, addTransaction);
transactionRouter.put('/edit/:id', authenticateToken, editTransaction);
transactionRouter.delete('/delete/:id', authenticateToken, deleteTransaction);

// so server.js can import the router and use it
module.exports = transactionRouter;