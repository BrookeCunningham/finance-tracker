// get functions from budget controller
const {viewBudget, addBudget, editBudget, deleteBudget} = require('../controllers/budgetController.js');

const budgetRouter = require('express').Router()

budgetRouter.get('/view', viewBudget);
budgetRouter.post('/add', addBudget);
budgetRouter.put('/edit/:id', editBudget);
budgetRouter.delete('/delete/:id', deleteBudget);

// so server.js can import the router and use it
module.exports = budgetRouter;