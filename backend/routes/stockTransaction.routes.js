const express = require('express');
const router = express.Router();
const stockTxCtrl = require('../controllers/stockTransaction.controller');
console.log('stockTxCtrl:', stockTxCtrl);

router.post('/buy',  stockTxCtrl.buyStock);
router.post('/sell', stockTxCtrl.sellStock);

module.exports = router;