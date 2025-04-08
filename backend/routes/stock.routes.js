const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

router.post('/', stockController.createStock); // Create Stock
router.get('/', stockController.getAllStocks); // GET all stocks
router.get('/:id', stockController.getStock); // GET a single stock by ID
router.put('/:id', stockController.updateStock); // Update a single stock by ID
router.delete('/:id', stockController.deleteStock); // Delete a single stock by ID

module.exports = router;