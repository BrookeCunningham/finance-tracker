// import controller functions
const { getMonthlyInsights } = require('../controllers/insightsController');
// import middleware for authentication
const authenticateToken = require('../middleware/authMiddleware');

// define router object
const insightsRouter = require('express').Router(); 

// define routes and attach controller functions
insightsRouter.get('/monthly', authenticateToken, getMonthlyInsights);

// export to server.js
module.exports = insightsRouter;