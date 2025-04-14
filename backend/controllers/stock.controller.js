// controllers/stock.controller.js
const { Stock } = require('../models');

exports.createStock = async (req, res) => {
  try {
    const { companyName, stockTicker, totalSharesAvailable, initialSharePrice } = req.body;
    const newStock = await Stock.create({
      companyName,
      stockTicker,
      totalSharesAvailable,
      initialSharePrice
    });

    res.status(201).json({ message: 'Stock created successfully', stock: newStock });
  } catch (error) {
    console.error('Error in createStock:', error);
    res.status(500).json({
      message: 'Error creating stock',
      error: error.message
    });
  }
};

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    console.error('Error in getAllStocks:', error);
    res.status(500).json({
      message: 'Error fetching stocks',
      error: error.message
    });
  }
};

exports.getStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await Stock.findByPk(id);
    if (stock) {
      res.json(stock);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error in getStock:', error);
    res.status(500).json({
      message: 'Error fetching stock',
      error: error.message
    });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, stockTicker, totalSharesAvailable, initialSharePrice } = req.body;
    const [affectedRows] = await Stock.update(
      { companyName, stockTicker, totalSharesAvailable, initialSharePrice },
      { where: { id } }
    );

    if (affectedRows > 0) {
      res.json({ message: 'Stock updated successfully', affectedRows });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error in updateStock:', error);
    res.status(500).json({
      message: 'Error updating stock',
      error: error.message
    });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowCount = await Stock.destroy({ where: { id } });

    if (deletedRowCount > 0) {
      res.json({ message: 'Stock deleted successfully', affectedRows: deletedRowCount });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    console.error('Error in deleteStock:', error);
    res.status(500).json({
      message: 'Error deleting stock',
      error: error.message
    });
  }
};