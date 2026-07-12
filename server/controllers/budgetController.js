// import the prisma client object for database access
const prisma = require('../prismaClient');

// view all budgets with current month's spending calculated
async function viewBudget(req, res) {
    const userId = req.user.userId;

    // get all budgets for the user
    const budgets = await prisma.budget.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    // calculate start of this month and start of next month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // for each budget, sum this month's transactions in that category
    const budgetsWithSpent = await Promise.all(
        budgets.map(async (budget) => {
            const spentResult = await prisma.transaction.aggregate({
                where: {
                    userId,
                    category: budget.category,
                    createdAt: {
                        gte: startOfMonth,
                        lt: startOfNextMonth,
                    },
                },
                _sum: {
                    amount: true,
                },
            });

            const spent = Math.abs(spentResult._sum.amount || 0);
            const remaining = budget.budgetValue - spent;

            return {
                ...budget,
                spent,
                remaining,
            };
        })
    );

    res.status(200).json({ budgets: budgetsWithSpent });
}

// function to add a new budget
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

// edit an existing budget
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

// delete a budget
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