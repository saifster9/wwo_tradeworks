const express = require('express');
const router = express.Router();
const cashTxCtrl = require('../controllers/cashTransaction.controller');

router.post('/', cashTxCtrl.createTransaction);
router.get('/:userId', cashTxCtrl.getTransactions);

module.exports = router;