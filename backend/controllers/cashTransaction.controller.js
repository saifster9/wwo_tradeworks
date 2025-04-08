// backend/controllers/cashTransaction.controller.js
const CashTransaction = require('../models/cash_transaction.model');
const UserBalance = require('../models/user_balance.model');
const { sequelize } = require('../config/db.config'); // Import the Sequelize instance for transactions

exports.deposit = async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    console.log("Sequelize instance:", sequelize); // Add this line

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: 'Invalid deposit amount.' });
    }

    const transaction = await sequelize.transaction(); // Start a database transaction
    try {
        const userBalance = await UserBalance.findOne({ where: { userId }, transaction });
        if (!userBalance) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User balance not found.' });
        }

        // Update the user's balance
        const newBalance = await userBalance.updateBalance('deposit', parseFloat(amount), transaction);

        // Record the cash transaction
        const newTransaction = await CashTransaction.create({
            transaction_type: 'deposit',
            amount: parseFloat(amount),
            userId: parseInt(userId),
        }, { transaction });

        await transaction.commit(); // Commit the transaction
        res.status(201).json({ message: 'Deposit successful.', balance: newBalance, transaction: newTransaction });

    } catch (error) {
        await transaction.rollback(); // Rollback the transaction on error
        console.error('Error processing deposit:', error);
        res.status(500).json({ message: 'Error processing deposit.', error: error.message });
    }
};

exports.withdraw = async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount.' });
    }

    const transaction = await sequelize.transaction(); // Start a database transaction
    try {
        const userBalance = await UserBalance.findOne({ where: { userId }, transaction });
        if (!userBalance) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User balance not found.' });
        }

        // Check for sufficient funds and update balance
        const newBalance = await userBalance.updateBalance('withdrawal', parseFloat(amount), transaction);

        // Record the cash transaction
        const newTransaction = await CashTransaction.create({
            transaction_type: 'withdrawal',
            amount: parseFloat(amount),
            userId: parseInt(userId),
        }, { transaction });

        await transaction.commit(); // Commit the transaction
        res.status(201).json({ message: 'Withdrawal successful.', balance: newBalance, transaction: newTransaction });

    } catch (error) {
        await transaction.rollback(); // Rollback the transaction on error
        console.error('Error processing withdrawal:', error);
        res.status(400).json({ message: 'Error processing withdrawal.', error: error.message });
    }
};

exports.getTransactionHistory = async (req, res) => {
    const { userId } = req.params;
    try {
        const transactions = await CashTransaction.findAll({
            where: { userId },
            order: [['transaction_date', 'DESC']],
        });
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ message: 'Error fetching transaction history.', error: error.message });
    }
};