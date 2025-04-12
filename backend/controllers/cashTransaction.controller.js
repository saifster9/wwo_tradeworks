// controllers/cashTransaction.controller.js
const { CashTransaction, UserBalance } = require('../models');
const sequelize = require('../config/db.config');

exports.createTransaction = async (req, res) => {
  const { userId, amount } = req.body;
  const numAmount = parseFloat(amount);   // Coerce amount to a number
  const transactionType = numAmount >= 0 ? 'deposit' : 'withdrawal';

  // Validate input
  if (!userId || isNaN(numAmount)) {
    return res.status(400).json({ message: 'userId and numeric amount required' });
  }

  // Wrap in a DB transaction to keep balance and history in sync
  const t = await sequelize.transaction();
  try {
    // 1. Fetch current balance inside transaction
    const userBalance = await UserBalance.findOne({ where: { userId }, transaction: t });
    if (!userBalance) {
      await t.rollback();
      return res.status(404).json({ message: 'User balance not found' });
    }

    const current = parseFloat(userBalance.cash_balance);

    // 2. If withdrawal, ensure sufficient funds
    if (transactionType === 'withdrawal' && Math.abs(numAmount) > current) {
      await t.rollback();
      return res.status(400).json({ message: 'Insufficient funds for withdrawal' });
    }

    // 3. Create the cash transaction record
    const tx = await CashTransaction.create(
      { userId, amount: numAmount, transactionType },
      { transaction: t }
    );

    // 4. Compute new balance
    const newBalance = transactionType === 'deposit'
      ? current + numAmount
      : current - Math.abs(numAmount);

    // 5. Update the user's balance
    await userBalance.update(
      { cash_balance: newBalance.toFixed(2) },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({ message: 'Transaction successful', transaction: tx });
  } catch (err) {
    await t.rollback();
    console.error('Error in createTransaction:', err);
    return res.status(500).json({ message: 'Error processing transaction', error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await CashTransaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(transactions);
  } catch (err) {
    console.error('Error in getTransactions:', err);
    res.status(500).json({ message: 'Error fetching transactions', error: err.message });
  }
};