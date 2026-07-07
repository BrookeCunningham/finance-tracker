// import controller functions
const { register, signIn, logout} = require('../controllers/authController.js');

// create router object to define routes on
// like a mini local express app 
const authRouter = require('express').Router();

// define routes and attach controller functions to them
authRouter.post('/register', register);
authRouter.post('/signIn', signIn);
authRouter.post('/logout', logout);

// so server.js can import the router and use it
module.exports = authRouter;