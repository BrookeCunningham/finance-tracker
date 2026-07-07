// import controller functions
const { viewUser, editUser, deleteUser } = require('../controllers/userController.js');
// import middleware for authentication
const authenticateToken = require('../middleware/authMiddleware.js');

// create router object to define routes on
const userRouter = require('express').Router();

// define routes and attach controller functions
userRouter.get('/view', authenticateToken, viewUser);
userRouter.put('/edit', authenticateToken, editUser);
userRouter.delete('/delete', authenticateToken, deleteUser);

// export the router so server.js can import it
module.exports = userRouter;