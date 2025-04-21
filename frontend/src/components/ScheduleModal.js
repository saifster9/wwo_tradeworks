// src/components/ScheduleModal.js
import React, { useState } from 'react';
import '../styles/ScheduleModal.css';

export default function ScheduleModal({ initial, onCancel, onSave }) {
  const [isTradingDay, setIsTradingDay] = useState(initial.isTradingDay);
  const [openTime, setOpenTime]         = useState(initial.open_time);
  const [closeTime, setCloseTime]       = useState(initial.close_time);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      day_of_week: initial.dayOfWeek,
      isTradingDay,
      open_time: openTime,
      close_time: closeTime
    });
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h3>Edit {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][initial.dayOfWeek]}</h3>
        <label>
        Trading Day: 
          <input
            type="checkbox"
            checked={isTradingDay}
            onChange={e => setIsTradingDay(e.target.checked)}
          />
          
        </label>

        <label>
          Open Time:
          <input
            type="time"
            value={openTime}
            onChange={e => setOpenTime(e.target.value + ':00')}
            disabled={!isTradingDay}
            required
          />
        </label>

        <label>
          Close Time:
          <input
            type="time"
            value={closeTime}
            onChange={e => setCloseTime(e.target.value + ':00')}
            disabled={!isTradingDay}
            required
          />
        </label>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}