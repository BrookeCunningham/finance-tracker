// import the prisma client object for database access
const prisma = require('../prismaClient');

// view all budgets function
async function viewBudget(req, res) {

    // extract userId from the authenticated request object
    // middleware sends a user object
    const userId = req.user.userId;

    // find all budgets for the user
    const budgets = await prisma.budget.findMany({
        where: { userId },
        // most recent budgets first
        orderBy: { createdAt: 'desc' },
    });

    // return valid if no problems
    res.status(200).json({ budgets });
}

// function to add a new budget
async function addBudget(req, res) {

    // get userId
    const userId = req.user.userId;
    // extract category and budgetValue from request body
    // req returns user and body object
    const { category, budgetValue } = req.body;

    // validate required fields
    if (!category || !budgetValue) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof budgetValue !== 'number' || budgetValue <= 0) {
        return res.status(400).json({ error: 'Budget value must be a positive number' });
    }

    // create a new budget in the database
    const newBudget = await prisma.budget.create({
        data: { userId, category, budgetValue },
    });

    // 201 means succesful creation of a resource
    res.status(201).json({ budget: newBudget });
}

// edit an existing budget
async function editBudget(req, res) {
    // gets budget id from url
    const { id } = req.params;
    // get userid of request
    const userId = req.user.userId;
    // extract category and budgetValue from request body
    const { category, budgetValue } = req.body;

    // validate required fields
    if (!category || !budgetValue) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // validate budgetValue
    const budget = await prisma.budget.findUnique({
        // parses id from string to integer
        where: { budgetId: parseInt(id) },
    });

    // check if budget exists and belongs to the user
    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }

    if (budget.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to edit this budget' });
    }

    // update the budget in the database
    const updatedBudget = await prisma.budget.update({
        where: { budgetId: parseInt(id) },
        data: { category, budgetValue },
    });

    // return the updated budget
    res.status(200).json({ budget: updatedBudget });
}

// delete a budget
async function deleteBudget(req, res) {
    // gets budget id from url
    const { id } = req.params;
    // get userid of request
    const userId = req.user.userId;

    // check if the budget exists and belongs to the user
    const budget = await prisma.budget.findUnique({
        where: { budgetId: parseInt(id) },
    });

    if (!budget) {
        return res.status(404).json({ error: 'Budget not found' });
    }

    if (budget.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this budget' });
    }

    // delete the budget from the database
    await prisma.budget.delete({
        where: { budgetId: parseInt(id) },
    });

    // return a success message
    res.status(200).json({ message: 'Budget deleted successfully' });
}

// export three functions to be used in the routes
module.exports = { viewBudget, addBudget, editBudget, deleteBudget };