// backend/routes/cashTransaction.routes.js
const express = require('express');
const router = express.Router();
const cashTransactionController = require('../controllers/cashTransaction.controller');

router.post('/deposit/:userId', cashTransactionController.deposit);
router.post('/withdraw/:userId', cashTransactionController.withdraw);
router.get('/:userId', cashTransactionController.getTransactionHistory);

module.exports = router;