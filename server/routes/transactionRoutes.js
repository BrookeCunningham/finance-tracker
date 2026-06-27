// import controller routes
const {viewTransaction, addTransaction, editTransaction, deleteTransaction} = require('../controllers/transactionController.js');

const transactionRouter = require('express').Router()

transactionRouter.get('/view', viewTransaction);
transactionRouter.post('/add', addTransaction);
transactionRouter.put('/edit/:id', editTransaction);
transactionRouter.delete('/delete/:id', deleteTransaction);

// so server.js can import the router and use it
module.exports = transactionRouter;