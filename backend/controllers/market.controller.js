const Holiday = require('../models/holiday.model');
const MarketSchedule = require('../models/market_schedule.model');
const { Op } = require('sequelize');

exports.isMarketOpen = async (req, res) => {
    try {
        const now = new Date();
        const estOffset = -5 * 60; // EST offset in minutes
        const estDate = new Date(now.getTime() + estOffset * 60 * 1000);
        const dayOfWeek = estDate.getDay();
        const hour = estDate.getHours();
        const minute = estDate.getMinutes();

        const schedule = await MarketSchedule.findOne({ where: { day_of_week: dayOfWeek } });

        if (schedule && schedule.isTradingDay) {
            const openTime = schedule.open_time;
            const closeTime = schedule.close_time;

            if (openTime && closeTime) {
                const openHour = openTime.getHours();
                const openMinute = openTime.getMinutes();
                const closeHour = closeTime.getHours();
                const closeMinute = closeTime.getMinutes();

                if (hour > openHour || (hour === openHour && minute >= openMinute)) {
                    if (hour < closeHour || (hour === closeHour && minute <= closeMinute)) {
                        const isHoliday = await Holiday.findOne({
                            where: {
                                holiday_date: {
                                    [Op.eq]: estDate.toISOString().split('T')[0]
                                }
                            }
                        });
                        if (!isHoliday) {
                            return res.json({ open: true });
                        }
                    }
                }
            }
        }

        return res.json({ open: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking market status' });
    }
};

exports.getMarketSchedule = async (req, res) => {
    try {
        const schedule = await MarketSchedule.findAll({
            order: [['day_of_week', 'ASC']]
        });
        res.json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching market schedule' });
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
        console.error(error);
        res.status(500).json({ message: 'Error updating market schedule' });
    }
};

exports.getAllHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.findAll();
        res.json(holidays);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching holidays' });
    }
};

exports.addHoliday = async (req, res) => {
    try {
        const { holiday_date, description } = req.body;
        const newHoliday = await Holiday.create({ holiday_date, description });
        res.status(201).json({ message: 'Holiday added successfully', holiday: newHoliday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding holiday', error });
    }
};

exports.deleteHoliday = async (req, res) => {
    try {
        const { holiday_date } = req.params;
        const deletedRowCount = await Holiday.destroy({
            where: {
                holiday_date: holiday_date
            }
        });
        if (deletedRowCount > 0) {
            res.json({ message: 'Holiday deleted successfully' });
        } else {
            res.status(404).json({ message: 'Holiday not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting holiday', error });
    }
};

exports.deleteAllHolidays = async (req, res) => {  // New function
    try {
        const deletedRowCount = await Holiday.destroy({
            where: {}, // Empty where clause deletes all records
            truncate: true // Reset auto-increment ID
        });
        res.json({ message: `Deleted ${deletedRowCount} holidays` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting all holidays', error });
    }
};