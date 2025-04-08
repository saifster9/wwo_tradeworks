const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market.controller');

router.get('/market-open', marketController.isMarketOpen);
router.get('/schedule', marketController.getMarketSchedule);
router.put('/schedule', marketController.updateMarketSchedule);
router.get('/holidays', marketController.getAllHolidays);
router.post('/holidays', marketController.addHoliday);
router.delete('/holidays/:holiday_date', marketController.deleteHoliday);
router.delete('/holidays', marketController.deleteAllHolidays);

module.exports = router;