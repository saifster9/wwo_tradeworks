const express          = require('express');
const router           = express.Router();
const marketController = require('../controllers/market.controller');

// Get the entire market schedule
router.get('/schedule', marketController.getMarketSchedule);

// Get today’s market‑open status
router.get('/market-open', marketController.isMarketOpen);

// Update the market schedule
router.put('/schedule', marketController.updateMarketSchedule);

// Holidays endpoints
router.get('/holidays',       marketController.getAllHolidays);
router.post('/holidays',      marketController.addHoliday);
router.delete('/holidays/:holiday_date', marketController.deleteHoliday);
router.delete('/holidays',     marketController.deleteAllHolidays);

module.exports = router;