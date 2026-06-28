const prisma = require('../prisma');

async function addTransaction(req, res) {

    const { amount, description, date, category, plaidId } = req.body;
    const userId = req.user.userId;

    if (!userId || !amount || !description || !date || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

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

    res.status(201).json({ transaction: newTransaction });
}

async function viewTransaction(req, res) {
    const userId = req.user.userId;

    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ transactions });
}

async function editTransaction(req, res) {
    const { id } = req.params;
    const { amount, description, date, category } = req.body;
    const userId = req.user.userId;

    if (!amount || !description || !date || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await prisma.transaction.findUnique({
        where: { transactionId: parseInt(id) },
    });

    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to edit this transaction' });
    }

    const updatedTransaction = await prisma.transaction.update({
        where: { transactionId: parseInt(id) },
        data: {
            amount,
            description,
            createdAt: new Date(date),
            category
        },
    });

    res.status(200).json({ transaction: updatedTransaction });
}

async function deleteTransaction(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;

    const transaction = await prisma.transaction.findUnique({
        where: { transactionId: parseInt(id) },
    });

    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this transaction' });
    }

    await prisma.transaction.delete({
        where: { transactionId: parseInt(id) },
    });

    res.status(200).json({ message: 'Transaction deleted successfully' });
}

module.exports = {
    addTransaction,
    viewTransaction,
    editTransaction,
    deleteTransaction
};