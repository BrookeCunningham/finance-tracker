const prisma = require('../prismaClient');

async function getMonthlyInsights(req, res) {
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
    const currentStart = new Date(year, month - 1, 1);
    const currentEnd = new Date(year, month, 1);

    // same for previous month (might be different year)
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevStart = new Date(prevYear, prevMonth - 1, 1);
    const prevEnd = new Date(prevYear, prevMonth, 1);

    // group transactions by category for the current month and previous month
    const currentData = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        amount: { lt: 0 },
        createdAt: { gte: currentStart, lt: currentEnd },
      },
      _sum: { amount: true },
    });

    const prevData = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        amount: { lt: 0 },
        createdAt: { gte: prevStart, lt: prevEnd },
      },
      _sum: { amount: true },
    });

    // build a lookup for previous month by category
    const prevMap = {};
    prevData.forEach((row) => {
      prevMap[row.category] = row._sum.amount || 0;
    });

    // total spend for current month (absolute, since expenses are negative)
    const totalCurrent = Math.abs(
      currentData.reduce((sum, row) => sum + (row._sum.amount || 0), 0)
    );

    // build category insights
    const categories = currentData.map((row) => {
      const currentValue = Math.abs(row._sum.amount || 0);
      const prevValue = Math.abs(prevMap[row.category] || 0);

      let percentChange = null;
      if (prevValue > 0) {
        percentChange = ((currentValue - prevValue) / prevValue) * 100;
      } else if (currentValue > 0) {
        percentChange = 100;
      }

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

    // top expense category (already positive from the map above)
    const topCategory = categories[0] || null;

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
}

// export the function to be used in the routes
module.exports = {
  getMonthlyInsights,
};