const User = require('../models/User');

// @desc    Add a spender to the user's list
// @route   POST /api/users/spenders
// @access  Private
const addSpender = async (req, res) => {
    try {
        const { spender } = req.body;

        if (!spender) {
            return res.status(400).json({ message: 'Please provide a spender name' });
        }

        const user = await User.findById(req.user.id);

        if (user.spenders.includes(spender)) {
            return res.status(400).json({ message: 'Spender already exists' });
        }

        user.spenders.push(spender);
        await user.save();

        res.status(200).json(user.spenders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove a spender from the user's list
// @route   DELETE /api/users/spenders/:name
// @access  Private
const removeSpender = async (req, res) => {
    try {
        const { name } = req.params;

        const user = await User.findById(req.user.id);

        if (!user.spenders.includes(name)) {
            return res.status(404).json({ message: 'Spender not found' });
        }

        user.spenders = user.spenders.filter(s => s !== name);
        await user.save();

        res.status(200).json(user.spenders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addSpender,
    removeSpender,
};
