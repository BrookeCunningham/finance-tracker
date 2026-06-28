const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../prisma');
require('dotenv').config();

/// user logs in 
async function signIn(req, res) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

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
