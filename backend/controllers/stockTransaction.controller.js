const sequelize        = require('../config/db.config');
const Stock            = require('../models/stock.model');
const StockTransaction = require('../models/stock_transaction.model');
const UserHolding      = require('../models/user_holding.model');
const UserBalance      = require('../models/user_balance.model');

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

    userBal.cash_balance = parseFloat(userBal.cash_balance) - totalCost;
    await userBal.save({ transaction: t });

    stock.totalSharesAvailable -= qty;
    await stock.save({ transaction: t });

    await StockTransaction.create({
      userId, stockId, quantity: qty, pricePerShare, transactionType: 'buy'
    }, { transaction: t });

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

    const userBal = await UserBalance.findOne({ where: { userId }, transaction: t });
    userBal.cash_balance = parseFloat(userBal.cash_balance) + proceeds;
    await userBal.save({ transaction: t });

    stock.totalSharesAvailable += qty;
    await stock.save({ transaction: t });

    await StockTransaction.create({
      userId, stockId, quantity: qty, pricePerShare, transactionType: 'sell'
    }, { transaction: t });

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
        attributes: ['stockTicker', 'companyName']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (err) {
    console.error('Error fetching stock history:', err);
    res.status(500).json({ message: err.message });
  }
};