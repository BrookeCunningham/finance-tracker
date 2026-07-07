// import prisma instance
const prisma = require('../prismaClient');

// add transaction
async function addTransaction(req, res) {

    // extract from request body
    const { amount, description, date, category, plaidId } = req.body;
    // extract from request user object middleware
    const userId = req.user.userId;

    if (!userId || !description || !date || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof amount !== 'number' || amount === 0)  {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // add to database
    const newTransaction = await prisma.transaction.create({
        data: {
            userId,
            amount,
            description,
            createdAt: new Date(date),
            category,
            plaidId
        },
    });

    // returns 201
    res.status(201).json({ transaction: newTransaction });
}

// view all transactions for user
async function viewTransaction(req, res) {

    const userId = req.user.userId;

    const transactions = await prisma.transaction.findMany({
        where: { userId },
        // most recent first
        orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ transactions });
}

// edit transaction
async function editTransaction(req, res) {
    // extract from request params/url :id
    const { id } = req.params;
    const { amount, description, date, category } = req.body;
    // from middleware user object
    const userId = req.user.userId;

    if (!amount || !description || !date || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // gather all transactions with this id
    const transaction = await prisma.transaction.findUnique({
        where: { transactionId: parseInt(id) },
    });

    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    // needs to belong to the correct user
    if (transaction.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to edit this transaction' });
    }

    // use instance to update
    const updatedTransaction = await prisma.transaction.update({
        where: { transactionId: parseInt(id) },
        data: {
            amount,
            description,
            createdAt: new Date(date),
            category
        },
    });

    // return the updated transaction
    res.status(200).json({ transaction: updatedTransaction });
}

// delete transaction
async function deleteTransaction(req, res) {
    // extract from request params/url :id
    const { id } = req.params;
    const userId = req.user.userId;

    // find the transaction in the database using id
    const transaction = await prisma.transaction.findUnique({
        where: { transactionId: parseInt(id) },
    });

    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this transaction' });
    }

    // delete the transaction from the database
    await prisma.transaction.delete({
        where: { transactionId: parseInt(id) },
    });

    // return success message
    res.status(200).json({ message: 'Transaction deleted successfully' });
}

// export functions to route level
module.exports = {
    addTransaction,
    viewTransaction,
    editTransaction,
    deleteTransaction
};