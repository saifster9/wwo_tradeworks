const Stock = require('../models/stock.model');

exports.createStock = async (req, res) => {
    console.log('createStock called with:', req.body);
    try {
        const { companyName, stockTicker, totalSharesAvailable, initialSharePrice } = req.body;
        console.log('Data to create:', { companyName, stockTicker, totalSharesAvailable, initialSharePrice });
        const newStock = await Stock.create({
            companyName,
            stockTicker,
            totalSharesAvailable,
            initialSharePrice
        });
        console.log('Stock created:', newStock);
        res.status(201).json({ message: 'Stock created successfully', stock: newStock });
    } catch (error) {
        console.error('Error in createStock:', error);
        console.error('Error message:', error.message);
        res.status(500).json({ message: 'Error creating stock', error });
    }
};


exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.findAll();
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stocks', error });
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
        console.error(error);
        res.status(500).json({ message: 'Error fetching stock', error });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, stockTicker, totalSharesAvailable, initialSharePrice } = req.body;
        const updatedStock = await Stock.update(
            { companyName, stockTicker, totalSharesAvailable, initialSharePrice },
            { where: { id } }
        );
        if (updatedStock[0] > 0) {
            res.json({ message: 'Stock updated successfully', affectedRows: updatedStock[0] });
        } else {
            res.status(404).json({ message: 'Stock not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating stock', error });
    }
};

exports.deleteStock = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRowCount = await Stock.destroy({
            where: { id }
        });
        if (deletedRowCount > 0) {
            res.json({ message: 'Stock deleted successfully', affectedRows: deletedRowCount });
        } else {
            res.status(404).json({ message: 'Stock not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting stock', error });
    }
};