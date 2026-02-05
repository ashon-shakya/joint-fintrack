const mongoose = require('mongoose');

const recordSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        amount: {
            type: Number,
            required: [true, 'Please add an amount'],
        },
        type: {
            type: String,
            enum: ['INCOME', 'EXPENSE'],
            required: [true, 'Please specify type (INCOME or EXPENSE)'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        description: {
            type: String,
        },
        spender: {
            type: String,
            default: 'Joint',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Record', recordSchema);
