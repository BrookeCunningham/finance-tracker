const { viewUser, editUser, deleteUser } = require('../controllers/userController.js');
const authenticateToken = require('../middleware/authMiddleware.js');

const userRouter = require('express').Router();

userRouter.get('/view', authenticateToken, viewUser);
userRouter.put('/edit', authenticateToken, editUser);
userRouter.delete('/delete', authenticateToken, deleteUser);

module.exports = userRouter;