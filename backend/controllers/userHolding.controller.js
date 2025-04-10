const UserHolding = require('../models/user_holding.model');
const Stock       = require('../models/stock.model');

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
    console.error('Error fetching holdings:', err);
    res.status(500).json({ message: 'Error fetching holdings' });
  }
};