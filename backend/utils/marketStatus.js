const Holiday = require('../models/holiday.model');
const MarketSchedule = require('../models/market_schedule.model');
const { Op } = require('sequelize');

async function isMarketOpenInternal() {
  const now = new Date();
  console.log('Market check at local time:', now.toString());

  const dayOfWeek     = now.getDay();
  console.log('Day of week:', dayOfWeek);

  const schedule = await MarketSchedule.findOne({ where: { day_of_week: dayOfWeek } });
  if (!schedule) {
    console.log('No schedule record for today.');
    return false;
  }
  console.log('Schedule for today:', schedule.toJSON());

  if (!schedule.isTradingDay) {
    console.log('Today is not marked as trading day.');
    return false;
  }

  const currentHour   = now.getHours();
  const currentMinute = now.getMinutes();
  const [openH, openM]   = schedule.open_time.split(':').map(Number);
  const [closeH, closeM] = schedule.close_time.split(':').map(Number);
  console.log(`Current time ${currentHour}:${currentMinute}, open at ${openH}:${openM}, close at ${closeH}:${closeM}`);

  const afterOpen   = currentHour > openH || (currentHour === openH && currentMinute >= openM);
  const beforeClose = currentHour < closeH || (currentHour === closeH && currentMinute <= closeM);
  console.log('After open?', afterOpen, 'Before close?', beforeClose);
  if (!(afterOpen && beforeClose)) {
    console.log('Outside trading hours.');
    return false;
  }

  // Holiday check
  const year  = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day   = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  console.log('Checking holiday for date:', todayStr);

  const holiday = await Holiday.findOne({
    where: { holiday_date: { [Op.eq]: todayStr } }
  });
  if (holiday) {
    console.log('Today is a holiday:', holiday.toJSON());
    return false;
  }

  console.log('Market is OPEN');
  return true;
}

module.exports = { isMarketOpenInternal };