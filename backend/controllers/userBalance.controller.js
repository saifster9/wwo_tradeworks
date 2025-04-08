// backend/controllers/userBalance.controller.js
const UserBalance = require('../models/user_balance.model');

exports.getUserBalance = async (req, res) => {
    const { userId } = req.params;
    try {
        const userBalance = await UserBalance.findOne({
            where: { userId },
        });
        if (userBalance) {
            res.json({ cash_balance: userBalance.cash_balance });
        } else {
            res.status(404).json({ message: 'User balance not found' });
        }
    } catch (error) {
        console.error('Error fetching user balance:', error);
        res.status(500).json({ message: 'Error fetching user balance', error });
    }
};

exports.updateUserBalance = async (req, res) => {
    const { userId } = req.params;
    const { cash_balance } = req.body;
    try {
        const [updatedRowCount] = await UserBalance.update(
            { cash_balance },
            { where: { userId } }
        );
        if (updatedRowCount > 0) {
            const updatedBalance = await UserBalance.findOne({ where: { userId } });
            res.json({ message: 'User balance updated successfully', cash_balance: updatedBalance.cash_balance });
        } else {
            res.status(404).json({ message: 'User balance not found' });
        }
    } catch (error) {
        console.error('Error updating user balance:', error);
        res.status(500).json({ message: 'Error updating user balance', error });
    }
};