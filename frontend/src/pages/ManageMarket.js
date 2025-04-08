import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/new_styles.css'; // Import CSS file

function ManageMarket() {
    const [marketSchedule, setMarketSchedule] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [newHolidayDate, setNewHolidayDate] = useState('');
    const [newHolidayDescription, setNewHolidayDescription] = useState('');

    useEffect(() => {
        fetchMarketSchedule();
        fetchHolidays();
    }, []);

    const fetchMarketSchedule = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/market/schedule');
            setMarketSchedule(response.data);
        } catch (error) {
            console.error('Error fetching market schedule:', error);
            alert('Error fetching market schedule.');
        }
    };

    const fetchHolidays = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/market/holidays');
            setHolidays(response.data);
        } catch (error) {
            console.error('Error fetching holidays:', error);
            alert('Error fetching holidays.');
        }
    };

    const handleScheduleChange = async (e, dayOfWeek) => {
        e.preventDefault();
        const openTime = document.getElementById(`market-open-${dayOfWeek}`).value;
        const closeTime = document.getElementById(`market-close-${dayOfWeek}`).value;
        const isTradingDay = document.getElementById(`is-trading-day-${dayOfWeek}`).checked;
        try {
            await axios.put('http://localhost:5000/api/market/schedule', {
                day_of_week: dayOfWeek,
                open_time: openTime,
                close_time: closeTime,
                isTradingDay: isTradingDay
            });
            alert(`Schedule for ${getDayName(dayOfWeek)} updated successfully!`);
            fetchMarketSchedule();
        } catch (error) {
            console.error('Error updating schedule:', error);
            alert(`Error updating schedule for ${getDayName(dayOfWeek)}.`);
        }
    };

    const handleAddHoliday = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/market/holidays', {
                holiday_date: newHolidayDate,
                description: newHolidayDescription,
            });
            alert('Holiday added successfully!');
            setNewHolidayDate('');
            setNewHolidayDescription('');
            setHolidays([]); // Clear holidays to force re-fetch
            fetchHolidays();
        } catch (error) {
            console.error('Error adding holiday:', error);
            alert('Error adding holiday.');
        }
    };

    const handleDeleteHoliday = async (holidayDate) => {
        try {
            await axios.delete(`http://localhost:5000/api/market/holidays/${holidayDate}`);
            alert('Holiday deleted successfully!');
            fetchHolidays();
        } catch (error) {
            console.error('Error deleting holiday:', error);
            alert('Error deleting holiday.');
        }
    };

    const handleDeleteAllHolidays = async () => {  // New function
        try {
          await axios.delete('http://localhost:5000/api/market/holidays');
          alert('All holidays deleted successfully!');
          setHolidays([]);  // Clear holidays in state
          fetchHolidays();  // Re-fetch to update display
        } catch (error) {
          console.error('Error deleting all holidays:', error);
          alert('Error deleting all holidays.');
        }
      };

    const getDayName = (dayOfWeek) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayOfWeek];
    };

    return (
        <div className="dashboard-container">
            <h2>Manage Market Schedule</h2>

            {/* Market Hours Section */}
            <div className="admin-section">
                <h3>Market Hours</h3>
                <p>Set the opening and closing times for each trading day.</p>
                <form className="market-schedule-form">
                    <table className="market-schedule-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Trading Day</th>
                                <th>Opening Time</th>
                                <th>Closing Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketSchedule.map(day => (
                                <tr key={day.day_of_week}>
                                    <td>{getDayName(day.day_of_week)}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            id={`is-trading-day-${day.day_of_week}`}
                                            name="is_trading_day"
                                            checked={day.isTradingDay}
                                            onChange={(e) => handleScheduleChange(e, day.day_of_week)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="time"
                                            id={`market-open-${day.day_of_week}`}
                                            name="open_time"
                                            value={day.open_time ? day.open_time.substring(0, 5) : '08:00'}
                                            onChange={(e) => handleScheduleChange(e, day.day_of_week)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="time"
                                            id={`market-close-${day.day_of_week}`}
                                            name="close_time"
                                            value={day.close_time ? day.close_time.substring(0, 5) : '17:00'}
                                            onChange={(e) => handleScheduleChange(e, day.day_of_week)}
                                        />
                                    </td>
                                    <td>
                                        <button className="market-schedule-button" onClick={(e) => handleScheduleChange(e, day.day_of_week)}>
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
            </div>

            {/* Holiday Management Section */}
            <div className="holiday-section">
                <h3>Manage Holidays</h3>
                <form onSubmit={handleAddHoliday}>
                    <label htmlFor="holiday-date">Add a Holiday:</label>
                    <input
                        type="date"
                        id="holiday-date"
                        name="holiday-date"
                        value={newHolidayDate}
                        onChange={(e) => setNewHolidayDate(e.target.value)}
                    />
                    <label htmlFor="holiday-description">Holiday Description:</label>
                    <input
                        type="text"
                        id="holiday-description"
                        name="holiday-description"
                        placeholder="Enter holiday description"
                        value={newHolidayDescription}
                        onChange={(e) => setNewHolidayDescription(e.target.value)}
                    />
                    <button type="submit" className="stock-section button">
                        Add Holiday
                    </button>
                </form>

                {holidays.length > 0 && (
                    <div>
                        <h4>Holidays:</h4>
                        <table className="stock-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holidays.map(holiday => (
                                    <tr key={holiday.id}>
                                        <td>{holiday.holiday_date.split('T')[0]}</td>
                                        <td>{holiday.description}</td>
                                        <td>
                                            <button className="delete-button" onClick={() => handleDeleteHoliday(holiday.holiday_date.split('T')[0])}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="delete-button" onClick={handleDeleteAllHolidays}>
                            Delete All Holidays
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageMarket;