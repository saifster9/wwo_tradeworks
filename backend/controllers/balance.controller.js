const User = require('../models/user.model');
const UserBalance = require('../models/user_balance.model');

exports.getUserCashBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const userBalance = await UserBalance.findByPk(userId);
        if (!userBalance) {
            return res.status(404).json({ message: 'User balance not found' });
        }
        res.json({ cashBalance: userBalance.cash_balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching cash balance', error });
    }
};

exports.updateUserCashBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body; // Amount to deposit (positive) or withdraw (negative)

        const userBalance = await UserBalance.findByPk(userId);
        if (!userBalance) {
            return res.status(404).json({ message: 'User balance not found' });
        }

        // Update cashBalance (ensure it doesn't go below zero if withdrawing)
        userBalance.cash_balance = Math.max(0, userBalance.cash_balance + amount);
        await userBalance.save();

        res.json({ message: 'Cash balance updated successfully', newBalance: userBalance.cash_balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating cash balance', error });
    }
};