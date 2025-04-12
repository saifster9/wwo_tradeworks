// src/pages/ManageMarket.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeeklySchedule from '../components/WeeklySchedule';
import ScheduleModal from '../components/ScheduleModal';
import '../styles/ManageMarket.css';
import '../styles/new_styles.css';

export default function ManageMarket() {
  const [schedule, setSchedule] = useState([]);
  const [editing, setEditing]   = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/market/schedule')
      .then(resp => setSchedule(resp.data))
      .catch(console.error);
  }, []);

  const handleUpdateClick = (dayOfWeek, dayData) => {
    setEditing({
      dayOfWeek,
      open_time:    dayData.open_time    || '09:30:00',
      close_time:   dayData.close_time   || '16:00:00',
      isTradingDay: dayData.isTradingDay || false
    });
  };

  const handleSave = async updated => {
    await axios.put('http://localhost:5000/api/market/schedule', updated);
    const resp = await axios.get('http://localhost:5000/api/market/schedule');
    setSchedule(resp.data);
    setEditing(null);
  };

  // Helper to get day name
  const getDayName = idx => ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][idx];

  // Filter only trading days
  const tradingDays = schedule.filter(d => d.isTradingDay);

  return (

    <div className="dashboard-container">
        <div className="manage-market-container">
          <div className="dashboard-style">
            <h2>Manage Market Schedule</h2>
            <p>Click on a day to edit its trading hours.</p>
            {/* Calendar view */}
            <WeeklySchedule
              schedule={schedule}
              onUpdate={handleUpdateClick}
              startHour={8}
              totalHours={12}
            />
          </div>
          <div className="dashboard-style">
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