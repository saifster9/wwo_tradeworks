// controllers/userBalance.controller.js
const { UserBalance } = require('../models');

exports.createUserCashBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const existingBalance = await UserBalance.findOne({ where: { userId } });
    if (existingBalance) {
      return res.status(409).json({ message: 'User balance already exists' });
    }

    const newBalance = await UserBalance.create({
      userId,
      cash_balance: 0.00
    });

    res.status(201).json({
      message: 'User balance created successfully',
      newBalance
    });
  } catch (error) {
    console.error('Error in createUserCashBalance:', error);
    res.status(500).json({
      message: 'Error creating user balance',
      error: error.message
    });
  }
};

exports.getUserBalance = async (req, res) => {
  const { userId } = req.params;
  try {
    const userBalance = await UserBalance.findOne({ where: { userId } });
    if (userBalance) {
      res.json({ cash_balance: userBalance.cash_balance });
    } else {
      res.status(404).json({ message: 'User balance not found' });
    }
  } catch (error) {
    console.error('Error in getUserBalance:', error);
    res.status(500).json({
      message: 'Error fetching user balance',
      error: error.message
    });
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
      res.json({
        message: 'User balance updated successfully',
        cash_balance: updatedBalance.cash_balance
      });
    } else {
      res.status(404).json({ message: 'User balance not found' });
    }
  } catch (error) {
    console.error('Error in updateUserBalance:', error);
    res.status(500).json({
      message: 'Error updating user balance',
      error: error.message
    });
  }
};