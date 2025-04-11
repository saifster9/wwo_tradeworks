const express          = require('express');
const router           = express.Router();
const marketController = require('../controllers/market.controller');

// 1. Get the entire market schedule
router.get('/schedule', marketController.getMarketSchedule);

// 2. Get today’s market‑open status
router.get('/market-open', marketController.isMarketOpen);

// 3. Holidays endpoints
router.get('/holidays',       marketController.getAllHolidays);
router.post('/holidays',      marketController.addHoliday);
router.delete('/holidays/:holiday_date', marketController.deleteHoliday);
router.delete('/holidays',     marketController.deleteAllHolidays);

module.exports = router;