const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/userHolding.controller');

router.get('/:userId', ctrl.getUserHoldings);

module.exports = router;