// import controller functions
const { viewBudget, addBudget, editBudget, deleteBudget } = require('../controllers/budgetController.js');
// import middleware for authentication
const authenticateToken = require('../middleware/authMiddleware.js');

// create router object to define routes on
// like a mini local express app
const budgetRouter = require('express').Router();

// define routes and attach controller functions
budgetRouter.get('/view', authenticateToken, viewBudget);
budgetRouter.post('/add', authenticateToken, addBudget);
budgetRouter.put('/edit/:id', authenticateToken, editBudget);
budgetRouter.delete('/delete/:id', authenticateToken, deleteBudget);

// export the router so server.js can import it
module.exports = budgetRouter;