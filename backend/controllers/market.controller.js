const Holiday = require('../models/holiday.model');
const MarketSchedule = require('../models/market_schedule.model');
const { Op } = require('sequelize');

exports.isMarketOpen = async (req, res) => {
    try {
        const now = new Date();
        // Calculate EST time (note: this method uses a fixed offset of -5 hours; consider handling daylight savings if needed)
        const estOffset = -5 * 60; // EST offset in minutes
        const estDate = new Date(now.getTime() + estOffset * 60 * 1000);
        const dayOfWeek = estDate.getDay();
        const currentHour = estDate.getHours();
        const currentMinute = estDate.getMinutes();

        // Retrieve the schedule for the current day of the week
        const schedule = await MarketSchedule.findOne({ where: { day_of_week: dayOfWeek } });

        if (schedule && schedule.isTradingDay) {
            const openTimeStr = schedule.open_time;  // e.g., "09:30:00"
            const closeTimeStr = schedule.close_time; // e.g., "16:00:00"

            if (openTimeStr && closeTimeStr) {
                // Parse the open time string into hours and minutes
                const [openHour, openMinute] = openTimeStr.split(':').map(Number);
                // Parse the close time string into hours and minutes
                const [closeHour, closeMinute] = closeTimeStr.split(':').map(Number);

                // Check if the current EST time is after the opening time
                const afterOpen = (currentHour > openHour) || (currentHour === openHour && currentMinute >= openMinute);
                // Check if the current EST time is before the closing time
                const beforeClose = (currentHour < closeHour) || (currentHour === closeHour && currentMinute <= closeMinute);

                if (afterOpen && beforeClose) {
                    // Check if today is a holiday: using the ISO date string (YYYY-MM-DD)
                    const estDateStr = estDate.toISOString().split('T')[0];
                    const isHoliday = await Holiday.findOne({
                        where: {
                            holiday_date: {
                                [Op.eq]: estDateStr
                            }
                        }
                    });
                    if (!isHoliday) {
                        return res.json({ open: true });
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