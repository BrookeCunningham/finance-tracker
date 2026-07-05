const prisma = require('../prismaClient');

// return all users
async function viewUser(req, res) {

    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
        where: { userId },
        // chosen fields to return
        select: { email: true, firstName: true, surname: true, userId: true }
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // return user details
    res.status(200).json({ user });
}

// edit an existing user
async function editUser(req, res) {

    const userId = req.user.userId;
    // extract fields from request body
    // set current email as newEmail
    const { firstName, surname, email: newEmail } = req.body;

    if (!firstName || !surname || !newEmail) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // find user 
    const currentUser = await prisma.user.findUnique({ where: { userId } });

    // if they would like to change email
    // check its still valid
    if (newEmail !== currentUser.email) {
        const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        // search for existing user with this email
        const emailTaken = await prisma.user.findUnique({ where: { email: newEmail } });
        if (emailTaken) {
            return res.status(400).json({ message: 'Email already in use' });
        }
    }

    // update user details
    const user = await prisma.user.update({
        where: { userId },
        data: { email: newEmail, firstName, surname }
    });

    // return updated user details
    res.status(200).json({ user });
}

// delete user
async function deleteUser(req, res) {

    // extract userId from request object
    const userId = req.user.userId;

    // find the user in the database
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // delete the user from the database
    await prisma.user.delete({ where: { userId } });

    // return success message
    res.status(200).json({ message: 'User deleted successfully' });
}

// export functions to route level
module.exports = {
    viewUser,
    editUser,
    deleteUser
};