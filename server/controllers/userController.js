const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function viewUser(req, res) {

    const email = req.user.email; 

    const user = await prisma.user.findUnique({
        where: { email: email },
        select: { email: true, firstName: true, surname: true, userId: true }
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: user });
}

async function updateUser(req, res) {

    const email = req.user.email;
    const { firstName, surname, email: newEmail } = req.body;

    if (!firstName || !surname || !newEmail) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (newEmail !== email) {
        const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const emailTaken = await prisma.user.findUnique({ where: { email: newEmail } });
        if (emailTaken) {
            return res.status(400).json({ message: 'Email already in use' });
        }
    }

    const user = await prisma.user.update({
        where: { email: email },
        data: { email: newEmail, firstName, surname }
    });

    res.status(200).json({ user: user });
}

async function deleteUser(req, res) {

    const email = req.user.email;   

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({ where: { email: email } });

    res.status(200).json({ message: 'User deleted successfully' });
}

module.exports = {
    viewUser,
    updateUser,
    deleteUser
};