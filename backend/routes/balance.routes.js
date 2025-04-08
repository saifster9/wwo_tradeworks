const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balance.controller');

router.get('/users/:userId/cash-balance', balanceController.getUserCashBalance);
router.put('/users/:userId/cash-balance', balanceController.updateUserCashBalance);

module.exports = router;