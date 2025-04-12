// utils/marketStatus.js

const { MarketSchedule, Holiday } = require('../models');
const { Op } = require('sequelize');

async function isMarketOpenInternal() {
  const now       = new Date();
  const dayOfWeek = now.getDay();

  // 1) Fetch today's schedule
  const schedule = await MarketSchedule.findOne({
    where: { day_of_week: dayOfWeek }
  });
  if (!schedule || !schedule.isTradingDay) {
    return false;
  }

  // 2) Check current time vs. open/close
  const [openH, openM]   = schedule.open_time.split(':').map(Number);
  const [closeH, closeM] = schedule.close_time.split(':').map(Number);
  const currentH = now.getHours();
  const currentM = now.getMinutes();

  const afterOpen   = currentH > openH   || (currentH === openH   && currentM >= openM);
  const beforeClose = currentH < closeH || (currentH === closeH && currentM <= closeM);
  if (!(afterOpen && beforeClose)) {
    return false;
  }

  // 3) Holiday check
  const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const isHoliday = await Holiday.findOne({
    where: { holiday_date: { [Op.eq]: todayStr } }
  });
  if (isHoliday) {
    return false;
  }

  // Market is open
  return true;
}

module.exports = { isMarketOpenInternal };