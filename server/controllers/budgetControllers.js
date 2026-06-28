const prisma = require('../prisma');

async function viewBudget(req, res) {
    const userId = req.user.userId;

    const budgets = await prisma.budget.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ budgets });
}

async function addBudget(req, res) {
    const userId = req.user.userId;
    const { category, budgetValue } = req.body;

    if (!category || !budgetValue) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof budgetValue !== 'number' || budgetValue <= 0) {
        return res.status(400).json({ error: 'Budget value must be a positive number' });
    }

    const newBudget = await prisma.budget.create({
        data: { userId, category, budgetValue },
    });

    res.status(201).json({ budget: newBudget });
}

async function editBudget(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    const { category, budgetValue } = req.body;

    if (!category || !budgetValue) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const budget = await prisma.budget.findUnique({
        where: { budgetId: parseInt(id) },
    });

    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }

    if (budget.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to edit this budget' });
    }

    const updatedBudget = await prisma.budget.update({
        where: { budgetId: parseInt(id) },
        data: { category, budgetValue },
    });

    res.status(200).json({ budget: updatedBudget });
}

async function deleteBudget(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;

    const budget = await prisma.budget.findUnique({
        where: { budgetId: parseInt(id) },
    });

    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }

    if (budget.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this budget' });
    }

    await prisma.budget.delete({
        where: { budgetId: parseInt(id) },
    });

    res.status(200).json({ message: 'Budget deleted successfully' });
}

module.exports = { viewBudget, addBudget, editBudget, deleteBudget };