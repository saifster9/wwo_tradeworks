// src/components/WeeklySchedule.js
import React from 'react';
import '../styles/WeeklySchedule.css';

export default function WeeklySchedule({
  schedule = [],          // corrected prop name
  onUpdate = () => {},    // optional callback
  startHour = 8,          // default 8 AM
  totalHours = 12         // default span of 12 hours
}) {
  // Helper to convert "HH:MM:SS" → minutes since midnight
  const toMinutes = t => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const START_MIN = startHour * 60;
  const TOTAL_MIN = totalHours * 60;

  return (
    <div className="weekly-calendar">
      {/* Time labels column */}
      <div className="time-column">
        {Array.from({ length: totalHours + 1 }).map((_, i) => {
          const hour = startHour + i;
          const label =
            hour < 12
              ? `${hour}:00`
              : hour === 12
              ? '12:00'
              : `${hour - 12}:00 PM`;
          return (
            <div key={i} className="time-slot">
              {label}
            </div>
          );
        })}
      </div>

      {/* Day columns */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
        (dayName, idx) => {
          const dayData = schedule.find(d => d.day_of_week === idx) || {};
          const isOpen = Boolean(dayData.isTradingDay);
          const openMin = isOpen
            ? toMinutes(dayData.open_time)
            : START_MIN;
          const closeMin = isOpen
            ? toMinutes(dayData.close_time)
            : START_MIN;
          const topPct = isOpen
            ? ((openMin - START_MIN) / TOTAL_MIN) * 100
            : 0;
          const heightPct = isOpen
            ? ((closeMin - openMin) / TOTAL_MIN) * 100
            : 0;

          return (
            <div key={idx} className="day-column">
              <div className="day-header">{dayName}</div>
              <div
                className="day-body"
                onClick={() => onUpdate(idx, dayData)}
              >
                {isOpen && (
                  <div
                    className="trading-block"
                    style={{
                      top: `${topPct}%`,
                      height: `${heightPct}%`
                    }}
                  />
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}