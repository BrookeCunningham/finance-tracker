//json web tokens for authentication
const jwt = require('jsonwebtoken');
// bcrypt for password hashing
const bcrypt = require('bcrypt');
// prisma client object for database access
const prisma = require('../prismaClient');
// load environment variables from .env file
require('dotenv').config();

// user logs in function
// async because it uses await
async function signIn(req, res) {

    // extract email and password from request body
    const { email, password } = req.body;

    // check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // find user in database by email
    // returns an object with user data
    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    // if user does not exist or password does not match, return error
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // if user exists
    // compare provided password with hashed password in database
    const passwordMatches = await bcrypt.compare(password, user.password);

    // incorrect password, return error
    if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign(
        {
            userId: user.userId,
            username: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h' 
        }
    );

    // on successful login, return success message and token
    res.status(200).json({
        message: "Login successful",
        token: token
    });

}

// user registers
async function register(req,res){

    const { email, firstName, surname, password } = req.body;

    if (!email || !firstName || !surname || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    //check email is valid format
    // maybe send a verification email to confirm the email is valid?
    const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }


    const user = await prisma.user.create({
        data:{
            email: email,
            firstName: firstName,
            surname: surname,
            password: await bcrypt.hash(password, 10) 
        }
    })

     // Generate JWT
    const token = jwt.sign(
        {
            userId: user.userId,
            username: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h' 
        }
    );

    res.status(200).json({
        message: "Registration successful",
        token: token
    });

}

async function logout(req, res) {

    res.status(200).json({ message: 'User logged out successfully' });
    
}

module.exports = {
    signIn,
    register,
    logout
};
