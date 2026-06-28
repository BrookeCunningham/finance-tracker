const prisma = require('../prisma');

async function viewUser(req, res) {

    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
        where: { userId },
        select: { email: true, firstName: true, surname: true, userId: true }
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
}

async function editUser(req, res) {

    const userId = req.user.userId;
    const { firstName, surname, email: newEmail } = req.body;

    if (!firstName || !surname || !newEmail) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const currentUser = await prisma.user.findUnique({ where: { userId } });

    if (newEmail !== currentUser.email) {
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
        where: { userId },
        data: { email: newEmail, firstName, surname }
    });

    res.status(200).json({ user });
}

async function deleteUser(req, res) {

    const userId = req.user.userId;

    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({ where: { userId } });

    res.status(200).json({ message: 'User deleted successfully' });
}

module.exports = {
    viewUser,
    editUser,
    deleteUser
};