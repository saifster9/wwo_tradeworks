import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeeklySchedule from '../components/WeeklySchedule';
import ScheduleModal from '../components/ScheduleModal'; // we’ll define

export default function ManageMarket() {
  const [schedule, setSchedule] = useState([]);
  const [editing, setEditing]   = useState(null);
  // { dayOfWeek, open_time, close_time, isTradingDay }

  useEffect(() => {
    axios.get('http://localhost:5000/api/market/schedule')
      .then(resp => setSchedule(resp.data))
      .catch(console.error);
  }, []);

  const handleUpdateClick = (dayOfWeek, dayData) => {
    setEditing({
      dayOfWeek,
      open_time: dayData.open_time || '09:30:00',
      close_time: dayData.close_time || '16:00:00',
      isTradingDay: dayData.isTradingDay || false
    });
  };

  const handleSave = async updated => {
    try {
      await axios.put('http://localhost:5000/api/market/schedule', updated);
      // Refresh schedule
      const resp = await axios.get('http://localhost:5000/api/market/schedule');
      setSchedule(resp.data);
      setEditing(null);
    } catch (err) {
      console.error('Error saving schedule:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Manage Market Schedule</h2>
      <WeeklySchedule
        schedule={schedule}
        onUpdate={handleUpdateClick}
      />

      {editing && (
        <ScheduleModal
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}