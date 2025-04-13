// src/pages/ManageMarket.js
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import WeeklySchedule from '../components/WeeklySchedule';
import ScheduleModal from '../components/ScheduleModal';
import '../styles/ManageMarket.css';
import '../styles/new_styles.css';

export default function ManageMarket() {
  // Market schedule state
  const [schedule, setSchedule] = useState([]);
  const [editing, setEditing]   = useState(null);

  // Holidays state
  const [holidays, setHolidays]           = useState([]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayDesc, setNewHolidayDesc] = useState('');

  // Fetch schedule on mount
  useEffect(() => {
    apiClient.get('/api/market/schedule')
      .then(resp => setSchedule(resp.data))
      .catch(console.error);
  }, []);

  // Fetch holidays on mount
  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const resp = await apiClient.get('/api/market/holidays');
      setHolidays(resp.data);
    } catch (err) {
      console.error('Error fetching holidays:', err);
    }
  };

  // Schedule edit handlers
  const handleUpdateClick = (dayOfWeek, dayData) => {
    setEditing({
      dayOfWeek,
      open_time:    dayData.open_time    || '09:30:00',
      close_time:   dayData.close_time   || '16:00:00',
      isTradingDay: dayData.isTradingDay || false
    });
  };

  const handleSave = async updated => {
    try {
      await apiClient.put('/api/market/schedule', updated);
      const resp = await apiClient.get('/api/market/schedule');
      setSchedule(resp.data);
    } catch (err) {
      console.error('Error saving schedule:', err);
      alert('Failed to save schedule');
    } finally {
      setEditing(null);
    }
  };

  // Holiday handlers
  const addHoliday = async e => {
    e.preventDefault();
    try {
      await apiClient.post('/api/market/holidays', {
        holiday_date: newHolidayDate,
        description: newHolidayDesc
      });
      setNewHolidayDate('');
      setNewHolidayDesc('');
      fetchHolidays();
    } catch (err) {
      console.error('Error adding holiday:', err);
      alert('Failed to add holiday');
    }
  };

  const deleteHoliday = async date => {
    if (!window.confirm(`Delete holiday on ${date}?`)) return;
    try {
      await apiClient.delete(`/api/market/holidays/${date}`);
      fetchHolidays();
    } catch (err) {
      console.error('Error deleting holiday:', err);
      alert('Failed to delete holiday');
    }
  };

  const clearHolidays = async () => {
    if (!window.confirm('Delete ALL holidays?')) return;
    try {
      await apiClient.delete('/api/market/holidays');
      fetchHolidays();
    } catch (err) {
      console.error('Error clearing holidays:', err);
      alert('Failed to clear holidays');
    }
  };

  // Helpers
  const getDayName = idx =>
    ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][idx];

  const tradingDays = schedule.filter(d => d.isTradingDay);

  return (
    <div className="dashboard-container">
      <div className="manage-market-container">
        <h2>Manage Market Schedule</h2>
        <p>Click on a day to edit its trading hours.</p>

        {/* Calendar view */}
        <WeeklySchedule
          schedule={schedule}
          onUpdate={handleUpdateClick}
          startHour={8}
          totalHours={12}
        />

        {/* Fallback text view */}
        <div className="trading-days-list">
          <h3>Current Trading Days and Hours</h3>
          {tradingDays.length > 0 ? (
            <ul>
              {tradingDays.map(day => (
                <li key={day.day_of_week}>
                  {getDayName(day.day_of_week)}:{' '}
                  {day.open_time.substring(0,5)} –{' '}
                  {day.close_time.substring(0,5)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No trading days enabled. Click a day above to configure.</p>
          )}
        </div>

        {/* Holidays management */}
        <div className="holidays-section">
          <h3>Market Holidays</h3>

          {/* Add Holiday Form */}
          <form className="holiday-form" onSubmit={addHoliday}>
            <label>
              Date:
              <input
                type="date"
                value={newHolidayDate}
                onChange={e => setNewHolidayDate(e.target.value)}
                required
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                placeholder="e.g. Christmas Day"
                value={newHolidayDesc}
                onChange={e => setNewHolidayDesc(e.target.value)}
                required
              />
            </label>
            <button type="submit">Add Holiday</button>
          </form>

          {/* List existing holidays */}
          {holidays.length > 0 ? (
            <ul className="holiday-list">
              {holidays.map(h => (
                <li key={h.holiday_date}>
                  <strong>{h.holiday_date}</strong>: {h.description}
                  <button
                    className="delete-button"
                    onClick={() => deleteHoliday(h.holiday_date)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No holidays set.</p>
          )}

          {/* Clear all holidays */}
          {holidays.length > 0 && (
            <button className="clear-all" onClick={clearHolidays}>
              Clear All Holidays
            </button>
          )}
        </div>

        {/* Edit modal */}
        {editing && (
          <ScheduleModal
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}