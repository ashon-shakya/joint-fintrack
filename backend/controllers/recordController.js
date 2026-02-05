const Record = require('../models/Record');

// @desc    Get user records
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res) => {
    try {
        const { type, category, startDate, endDate, page = 1, limit = 20, userIds, sortBy = 'date', order = 'desc' } = req.query;

        let query = {};

        // Handle user filtering (My Records vs Joint Records)
        if (userIds) {
            const users = userIds.split(',');
            // Security check: Ensure requested users are actually partners or self
            // For now, trust the frontend but ideally we should validate against req.user.partners
            query.user = { $in: users };
        } else {
            query.user = req.user.id;
        }

        if (type) query.type = type;
        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const sortOptions = {};
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;

        const count = await Record.countDocuments(query);
        const records = await Record.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('user', 'name');

        res.status(200).json({
            records,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalRecords: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a record
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res) => {
    try {
        const { amount, type, category, description, date, spender } = req.body;

        if (!amount || !type || !category) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const record = await Record.create({
            user: req.user.id,
            amount,
            type,
            category,
            description,
            date: date || Date.now(),
            spender: spender || 'Joint',
        });

        res.status(201).json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a record
// @route   DELETE /api/records/:id
// @access  Private
const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Check for user
        if (record.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await record.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Import multiple records
// @route   POST /api/records/import
// @access  Private
const importRecords = async (req, res) => {
    try {
        const records = req.body;

        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ message: 'Invalid payload: Expected array of records' });
        }

        // Map records to include user ID
        const recordsWithUser = records.map((record) => ({
            ...record,
            user: req.user.id,
        }));

        const createdRecords = await Record.insertMany(recordsWithUser);

        res.status(201).json(createdRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete multiple records
// @route   POST /api/records/delete-multiple
// @access  Private
const deleteMultipleRecords = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of record IDs' });
        }

        // Delete records where _id is in ids AND user is the current user
        const result = await Record.deleteMany({
            _id: { $in: ids },
            user: req.user.id
        });

        res.status(200).json({ message: 'Records deleted', count: result.deletedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getRecords,
    createRecord,
    deleteRecord,
    importRecords,
    deleteMultipleRecords,
};
