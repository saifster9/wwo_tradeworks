const Holiday = require('../models/holiday.model');
const MarketSchedule = require('../models/market_schedule.model');
const { Op } = require('sequelize');

async function isMarketOpenInternal() {
  const now = new Date();
  const estOffset = -5 * 60; // EST
  const estDate = new Date(now.getTime() + estOffset * 60 * 1000);
  const dayOfWeek = estDate.getDay();
  const currentHour   = estDate.getHours();
  const currentMinute = estDate.getMinutes();

  const schedule = await MarketSchedule.findOne({ where: { day_of_week: dayOfWeek } });
  if (!schedule?.isTradingDay) return false;

  const [openH, openM]   = schedule.open_time.split(':').map(Number);
  const [closeH, closeM] = schedule.close_time.split(':').map(Number);

  const afterOpen  = (currentHour > openH) || (currentHour === openH && currentMinute >= openM);
  const beforeClose= (currentHour < closeH) || (currentHour === closeH && currentMinute <= closeM);
  if (!(afterOpen && beforeClose)) return false;

  const estDateStr = estDate.toISOString().split('T')[0];
  const holiday = await Holiday.findOne({
    where: { holiday_date: { [Op.eq]: estDateStr } }
  });
  return !holiday;
}

module.exports = { isMarketOpenInternal };