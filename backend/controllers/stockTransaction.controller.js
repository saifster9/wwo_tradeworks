// controllers/stockTransaction.controller.js
const { Stock, StockTransaction, UserHolding, UserBalance } = require('../models');
const sequelize = require('../config/db.config');

// Buy stock
exports.buyStock = async (req, res) => {
  const { userId, stockId, quantity } = req.body;
  const qty = parseInt(quantity, 10);
  if (!userId || !stockId || isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: 'userId, stockId and positive quantity required' });
  }

  const t = await sequelize.transaction();
  try {
    const stock = await Stock.findByPk(stockId, { transaction: t });
    if (!stock) throw new Error('Stock not found');
    if (stock.totalSharesAvailable < qty) {
      await t.rollback();
      return res.status(400).json({ message: 'Not enough shares available' });
    }

    const pricePerShare = parseFloat(stock.initialSharePrice);
    const totalCost     = pricePerShare * qty;

    const userBal = await UserBalance.findOne({ where: { userId }, transaction: t });
    if (parseFloat(userBal.cash_balance) < totalCost) {
      await t.rollback();
      return res.status(400).json({ message: 'Insufficient cash balance for purchase' });
    }

    // Deduct cash
    userBal.cash_balance = parseFloat(userBal.cash_balance) - totalCost;
    await userBal.save({ transaction: t });

    // Reduce available shares
    stock.totalSharesAvailable -= qty;
    await stock.save({ transaction: t });

    // Record transaction
    await StockTransaction.create({
      userId,
      stockId,
      quantity: qty,
      pricePerShare,
      transactionType: 'buy'
    }, { transaction: t });

    // Update or create holding
    const [holding, created] = await UserHolding.findOrCreate({
      where: { userId, stockId },
      defaults: { shares: qty },
      transaction: t
    });
    if (!created) {
      holding.shares += qty;
      await holding.save({ transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Stock purchased' });
  } catch (err) {
    await t.rollback();
    console.error('Error in buyStock:', err);
    res.status(500).json({ message: err.message });
  }
};

// Sell stock
exports.sellStock = async (req, res) => {
  const { userId, stockId, quantity } = req.body;
  const qty = parseInt(quantity, 10);
  if (!userId || !stockId || isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: 'userId, stockId and positive quantity required' });
  }

  const t = await sequelize.transaction();
  try {
    const holding = await UserHolding.findOne({ where: { userId, stockId }, transaction: t });
    if (!holding || holding.shares < qty) {
      await t.rollback();
      return res.status(400).json({ message: 'Not enough shares to sell' });
    }

    const stock = await Stock.findByPk(stockId, { transaction: t });
    if (!stock) throw new Error('Stock not found');
    const pricePerShare = parseFloat(stock.initialSharePrice);
    const proceeds      = pricePerShare * qty;

    // Credit cash
    const userBal = await UserBalance.findOne({ where: { userId }, transaction: t });
    userBal.cash_balance = parseFloat(userBal.cash_balance) + proceeds;
    await userBal.save({ transaction: t });

    // Increase available shares
    stock.totalSharesAvailable += qty;
    await stock.save({ transaction: t });

    // Record transaction
    await StockTransaction.create({
      userId,
      stockId,
      quantity: qty,
      pricePerShare,
      transactionType: 'sell'
    }, { transaction: t });

    // Update holding
    holding.shares -= qty;
    if (holding.shares === 0) {
      await holding.destroy({ transaction: t });
    } else {
      await holding.save({ transaction: t });
    }

    await t.commit();
    res.json({ message: 'Stock sold' });
  } catch (err) {
    await t.rollback();
    console.error('Error in sellStock:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get stock history
exports.getUserStockHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const history = await StockTransaction.findAll({
      where: { userId },
      include: [{
        model: Stock,
        as: 'stock',
        attributes: ['stockTicker', 'companyName']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (err) {
    console.error('Error in getUserStockHistory:', err);
    res.status(500).json({ message: err.message });
  }
};