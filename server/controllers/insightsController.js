const prisma = require('../prismaClient');

async function getMonthlyInsights(req, res){

  try {

    // get userid from middleware
    const userId = req.user.userId;

    // new date object now
    const now = new Date();
    // get month and year from query parameters or default to current month and year
    // now.getMonth is indexed from 0, so we add 1 to get the correct month number
    const month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    // calculate the start and end dates for the current month
    // year + month + 1 so first of the month
    const currentStart = new Date(year, month - 1, 1);
    // 1st of the next month
    const currentEnd = new Date(year, month, 1);

    // same for previous month
    // might be different year
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevStart = new Date(prevYear, prevMonth - 1, 1);
    const prevEnd = new Date(prevYear, prevMonth, 1);

    // group transactions by category for the current month and previous month
    const currentData = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        createdAt: { gte: currentStart, lt: currentEnd },
      },
      // add up all amount values for each category
       _sum: { amount: true },
    });

    // same but for the previous month
    const prevData = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        createdAt: { gte: prevStart, lt: prevEnd },
      },
      _sum: { amount: true },
    });

    // for previous data object map
    const prevMap = {};
    prevData.forEach((row) => {
      prevMap[row.category] = row._sum.amount || 0;
    });

    // calculate total for current month
    const totalCurrent = currentData.reduce((sum, row) => sum + (row._sum.amount || 0), 0);

    // calculate catgeory value current and previous month
    // and calculate percent change and percent of total for current month
    const categories = currentData.map((row) => {

      // lookup not loop
      const currentValue = row._sum.amount || 0;
      const prevValue = prevMap[row.category] || 0;

      let percentChange = null;
      if (prevValue > 0) {
        percentChange = ((currentValue - prevValue) / prevValue) * 100;
      } else if (currentValue > 0) {
        percentChange = 100;
      }

      // return values 
      return {
        category: row.category,
        currentValue,
        prevValue,
        percentOfTotal: totalCurrent > 0 ? (currentValue / totalCurrent) * 100 : 0,
        percentChange,
      };
    });

    // sort categories by current value descending
    categories.sort((a, b) => b.currentValue - a.currentValue);

    // get the top category if it exists
    const topCategory = categories[0] || null;

    // return the insights data
    res.status(200).json({
      month,
      year,
      totalCurrent,
      categories,
      topCategory,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
};

// export the function to be used in the routes
module.exports = {
  getMonthlyInsights,
};