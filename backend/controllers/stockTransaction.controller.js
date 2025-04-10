const sequelize = require('../config/db.config');
const Stock = require('../models/stock.model');
const StockTransaction = require('../models/stock_transaction.model');
const UserHolding = require('../models/user_holding.model');

exports.buyStock = async (req, res) => {
  const { userId, stockId, quantity } = req.body;
  console.log('BUY request:', { userId, stockId, quantity });

  const qty = parseInt(quantity, 10);
  if (!userId || !stockId || isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: 'userId, stockId and positive quantity required' });
  }

  const t = await sequelize.transaction();  // now sequelize is defined
  try {
    const stock = await Stock.findByPk(stockId, { transaction: t });
    if (!stock) throw new Error('Stock not found');
    if (stock.totalSharesAvailable < qty) {
      await t.rollback();
      return res.status(400).json({ message: 'Not enough shares available' });
    }

    // Deduct shares
    stock.totalSharesAvailable -= qty;
    await stock.save({ transaction: t });

    const pricePerShare = parseFloat(stock.initialSharePrice);

    await StockTransaction.create(
      { userId, stockId, quantity: qty, pricePerShare, transactionType: 'buy' },
      { transaction: t }
    );

    // Update or create user holding
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

exports.sellStock = async (req, res) => {
    const { userId, stockId, quantity } = req.body;
    const qty = parseInt(quantity,10);
    if (!userId||!stockId||isNaN(qty)||qty<=0)
      return res.status(400).json({ message:'userId, stockId and positive quantity required' });
    const t = await sequelize.transaction();
    try {
      // fetch user holding
      const holding = await UserHolding.findOne({ where:{ userId, stockId }, transaction:t });
      if (!holding || holding.shares < qty) {
        await t.rollback();
        return res.status(400).json({ message:'Not enough shares to sell' });
      }
      // add back to stock availability
      const stock = await Stock.findByPk(stockId,{ transaction:t });
      stock.totalSharesAvailable += qty;
      await stock.save({ transaction:t });
      // record transaction
      const pricePerShare = parseFloat(stock.initialSharePrice);
      await StockTransaction.create({ userId, stockId, quantity:qty, pricePerShare, transactionType:'sell' },{ transaction:t });
      // update holding
      holding.shares -= qty;
      if (holding.shares===0) await holding.destroy({ transaction:t });
      else await holding.save({ transaction:t });
      await t.commit();
      res.json({ message:'Stock sold' });
    } catch(err){
      await t.rollback();
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };
  

