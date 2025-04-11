const express = require('express');
const router = express.Router();
const stockTxCtrl = require('../controllers/stockTransaction.controller');

router.post('/buy',  stockTxCtrl.buyStock);
router.post('/sell', stockTxCtrl.sellStock);
router.get('/history/:userId', stockTxCtrl.getUserStockHistory);

module.exports = router;