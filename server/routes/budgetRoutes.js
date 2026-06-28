const { viewBudget, addBudget, editBudget, deleteBudget } = require('../controllers/budgetController.js');
const authenticateToken = require('../middleware/authMiddleware.js');

const budgetRouter = require('express').Router();

budgetRouter.get('/view', authenticateToken, viewBudget);
budgetRouter.post('/add', authenticateToken, addBudget);
budgetRouter.put('/edit/:id', authenticateToken, editBudget);
budgetRouter.delete('/delete/:id', authenticateToken, deleteBudget);

module.exports = budgetRouter;