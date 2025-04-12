// controllers/market.controller.js
const { Holiday, MarketSchedule } = require('../models');
const { Op }                     = require('sequelize');
const { isMarketOpenInternal }   = require('../utils/marketStatus');

exports.isMarketOpen = async (req, res) => {
  try {
    const open = await isMarketOpenInternal();
    res.json({ open });
  } catch (err) {
    console.error('Error in isMarketOpen:', err);
    res.status(500).json({
      message: 'Error checking market status',
      error: err.message
    });
  }
};

exports.getMarketSchedule = async (req, res) => {
  try {
    const schedule = await MarketSchedule.findAll({
      order: [['day_of_week', 'ASC']]
    });
    res.json(schedule);
  } catch (error) {
    console.error('Error in getMarketSchedule:', error);
    res.status(500).json({ message: 'Error fetching market schedule', error: error.message });
  }
};

exports.updateMarketSchedule = async (req, res) => {
  try {
    const { day_of_week, open_time, close_time, isTradingDay } = req.body;
    await MarketSchedule.update(
      { open_time, close_time, isTradingDay },
      { where: { day_of_week } }
    );
    res.json({ message: 'Market schedule updated successfully' });
  } catch (error) {
    console.error('Error in updateMarketSchedule:', error);
    res.status(500).json({ message: 'Error updating market schedule', error: error.message });
  }
};

exports.getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.findAll();
    res.json(holidays);
  } catch (error) {
    console.error('Error in getAllHolidays:', error);
    res.status(500).json({ message: 'Error fetching holidays', error: error.message });
  }
};

exports.addHoliday = async (req, res) => {
  try {
    const { holiday_date, description } = req.body;
    const newHoliday = await Holiday.create({ holiday_date, description });
    res.status(201).json({ message: 'Holiday added successfully', holiday: newHoliday });
  } catch (error) {
    console.error('Error in addHoliday:', error);
    res.status(500).json({ message: 'Error adding holiday', error: error.message });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    const { holiday_date } = req.params;
    const deletedRowCount = await Holiday.destroy({
      where: { holiday_date }
    });
    if (deletedRowCount > 0) {
      res.json({ message: 'Holiday deleted successfully' });
    } else {
      res.status(404).json({ message: 'Holiday not found' });
    }
  } catch (error) {
    console.error('Error in deleteHoliday:', error);
    res.status(500).json({ message: 'Error deleting holiday', error: error.message });
  }
};

exports.deleteAllHolidays = async (req, res) => {
  try {
    const deletedRowCount = await Holiday.destroy({
      where: {},
      truncate: true
    });
    res.json({ message: `Deleted ${deletedRowCount} holidays` });
  } catch (error) {
    console.error('Error in deleteAllHolidays:', error);
    res.status(500).json({ message: 'Error deleting all holidays', error: error.message });
  }
};