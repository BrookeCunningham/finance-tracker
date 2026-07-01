const prisma = require('../prismaClient');

const getMonthlyInsights = async (req, res) => {
  try {
    const userId = req.user.userId;

    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    const currentStart = new Date(year, month - 1, 1);
    const currentEnd = new Date(year, month, 1);

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevStart = new Date(prevYear, prevMonth - 1, 1);
    const prevEnd = new Date(prevYear, prevMonth, 1);

    const currentData = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        createdAt: { gte: currentStart, lt: currentEnd },
      },
      _sum: { amount: true },
    });

    const prevData = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId,
        createdAt: { gte: prevStart, lt: prevEnd },
      },
      _sum: { amount: true },
    });

    const prevMap = {};
    prevData.forEach((row) => {
      prevMap[row.category] = row._sum.amount || 0;
    });

    const totalCurrent = currentData.reduce((sum, row) => sum + (row._sum.amount || 0), 0);

    const categories = currentData.map((row) => {
      const currentValue = row._sum.amount || 0;
      const prevValue = prevMap[row.category] || 0;

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

    categories.sort((a, b) => b.currentValue - a.currentValue);

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
};

module.exports = {
  getMonthlyInsights,
};