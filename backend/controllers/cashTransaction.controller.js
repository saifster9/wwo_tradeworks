const CashTransaction = require('../models/cash_transaction.model');
const UserBalance = require('../models/user_balance.model');
const sequelize = require('../config/db.config');

exports.createTransaction = async (req, res) => {
  const { userId, amount } = req.body;

  // Coerce amount to a number
  const numAmount = parseFloat(amount);
  if (!userId || isNaN(numAmount)) {
    return res.status(400).json({ message: 'userId and numeric amount required' });
  }

  const transactionType = numAmount >= 0 ? 'deposit' : 'withdrawal';

  // Wrap in a DB transaction to keep balance and history in sync
  const t = await sequelize.transaction();
  try {
    // 1. Create the cash transaction record
    const tx = await CashTransaction.create(
      { userId, amount: numAmount, transactionType },
      { transaction: t }
    );

    // 2. Update the user's balance manually
    const userBalance = await UserBalance.findOne({ where: { userId }, transaction: t });
    const current = parseFloat(userBalance.cash_balance);
    const newBalance =
      transactionType === 'deposit'
        ? current + numAmount
        : current - Math.abs(numAmount);

    await userBalance.update(
      { cash_balance: newBalance.toFixed(2) },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: 'Transaction successful', transaction: tx });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error processing transaction', error: err.message });
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
    console.error(err);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};