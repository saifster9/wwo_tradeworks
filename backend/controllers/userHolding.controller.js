// controllers/userHolding.controller.js
const { UserHolding, Stock } = require('../models');

exports.getUserHoldings = async (req, res) => {
  const { userId } = req.params;
  try {
    const holdings = await UserHolding.findAll({
      where: { userId },
      include: [{
        model: Stock,
        as: 'stock',
        attributes: ['id', 'stockTicker', 'companyName']
      }]
    });
    res.json(holdings);
  } catch (err) {
    console.error('Error in getUserHoldings:', err);
    res.status(500).json({
      message: 'Error fetching holdings',
      error: err.message
    });
  }
};