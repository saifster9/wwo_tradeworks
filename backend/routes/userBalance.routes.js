const express = require('express');
const router = express.Router();
const userBalanceController = require('../controllers/userBalance.controller');

router.get('/:userId', userBalanceController.getUserBalance);
router.put('/:userId', userBalanceController.updateUserBalance);

module.exports = router;