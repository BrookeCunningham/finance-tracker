// import controller functions
const { register, signIn, logout} = require ('../controllers/authController.js');

const authRouter = require('express').Router()

authRouter.post('/register', register);
authRouter.post('/login', signIn);
authRouter.post('/logout', logout);

// so server.js can import the router and use it
module.exports = authRouter;