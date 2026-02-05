const Record = require('../models/Record');
const mongoose = require('mongoose');

// @desc    Get dashboard data (summary, trends, category breakdown)
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const { userIds } = req.query;

        // Build match filter
        let matchStage = { user: req.user._id };

        if (userIds) {
            const users = userIds.split(',');
            // Ideally convert to ObjectIds for correct matching if stored as such, 
            // but Mongoose usually handles string to ObjectId conversion in find, 
            // for aggregation we need to be explicit if using $match.
            // But 'user' in Record is ObjectId.
            const userObjectIds = users.map(id => new mongoose.Types.ObjectId(id));
            matchStage = { user: { $in: userObjectIds } };
        }

        // 1. Calculate Summary (Total Income, Total Expense, Balance)
        const summary = await Record.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        summary.forEach(item => {
            if (item._id === 'INCOME') totalIncome = item.total;
            if (item._id === 'EXPENSE') totalExpense = item.total;
        });

        const balance = totalIncome - totalExpense;

        // 2. Category Breakdown (Expenses only)
        const categoryBreakdown = await Record.aggregate([
            { $match: { ...matchStage, type: 'EXPENSE' } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { total: -1 } }
        ]);

        // 3. Trends (Monthly Income vs Expense for last 12 months)
        // Note: This relies on the 'date' field being a Date object or string ISO.
        // Ensure data is stored correctly. If string, we might need adjustments.

        // We'll group by YYYY-MM
        const rawTrends = await Record.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        year: { $year: { $toDate: "$date" } },
                        month: { $month: { $toDate: "$date" } },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format trends for frontend (array of objects: { month: 'Jan 2024', income: 100, expense: 50 })
        const trendsMap = {};

        rawTrends.forEach(item => {
            const { year, month, type } = item._id;
            const key = `${year}-${String(month).padStart(2, '0')}`; // YYYY-MM

            if (!trendsMap[key]) {
                trendsMap[key] = { date: key, income: 0, expense: 0 };
            }

            if (type === 'INCOME') trendsMap[key].income = item.total;
            if (type === 'EXPENSE') trendsMap[key].expense = item.total;
        });

        const trends = Object.values(trendsMap).sort((a, b) => a.date.localeCompare(b.date));

        // 4. Weekly Activity (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyActivity = await Record.aggregate([
            {
                $match: {
                    ...matchStage,
                    date: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" }
                    },
                    income: {
                        $sum: { $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0] }
                    },
                    expense: {
                        $sum: { $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 5. Top 5 Highest Expenses
        const topExpenses = await Record.find({
            ...matchStage,
            type: 'EXPENSE'
        })
            .sort({ amount: -1 })
            .limit(5);

        // 7. Spender Breakdown (Expenses only)
        const spenderBreakdown = await Record.aggregate([
            { $match: { ...matchStage, type: 'EXPENSE' } },
            {
                $group: {
                    _id: '$spender',
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { total: -1 } }
        ]);

        // 6. Savings Rate
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

        res.status(200).json({
            summary: {
                totalIncome,
                totalExpense,
                balance,
                savingsRate
            },
            categoryBreakdown,
            trends,
            dailyActivity,
            topExpenses,
            spenderBreakdown
        });

    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDashboardData,
};
