// frontend/src/components/WeeklySchedule.js
import React from 'react';
import '../styles/WeeklySchedule.css'; // Make sure to import the updated CSS

export default function WeeklySchedule({
  schedule = [],
  onUpdate = () => {},
  startHour = 0, // Default to midnight if showing full day
  totalHours = 24 // Default to 24 hours (adjust if needed)
}) {
  // Helper to convert "HH:MM:SS" -> minutes since midnight
  const toMinutes = t => {
    if (!t || typeof t !== 'string') return 0;
    const parts = t.split(':');
    if (parts.length < 2) return 0;
    const [h, m] = parts.map(Number);
    if (isNaN(h) || isNaN(m)) return 0; // Handle potential NaN
    return h * 60 + m;
  };

  const START_MIN = startHour * 60;
  const TOTAL_MIN = totalHours * 60;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="weekly-calendar">

      {/* === Row 1: Top-Left Cell + Day Headers === */}
      {/* Top-left empty cell (Grid cell 1,1) */}
      <div className="calendar-top-left"></div>
      {/* Render Day Headers in the first row (Grid row 1, columns 2-8) */}
      {dayNames.map((dayName, idx) => (
        <div
          key={`header-${idx}`}
          className="day-header"
          style={{ gridColumn: `${idx + 2} / span 1` }}
        >
          {dayName}
        </div>
      ))}

      {/* === NEW Row 2: Empty Separator Cells === */}
      {/* Empty cell below top-left (Grid cell 2,1) */}
      <div
        className="calendar-separator-cell"
        style={{ gridColumn: '1 / span 1' }} // Column 1
      ></div>
      {/* Empty cells below day headers (Grid cells 2,2 to 2,8) */}
      {dayNames.map((_, idx) => (
         <div
            key={`separator-${idx}`}
            className="calendar-separator-cell"
            style={{ gridColumn: `${idx + 2} / span 1` }} // Columns 2-8
         ></div>
      ))}
      {/* === END NEW Row 2 === */}


      {/* === Row 3 onwards: Time Column + Day Content Columns === */}
      {/* Render Time Column (Grid column 1, rows 3+) */}
      <div className="time-column">
        {/* Generate time slots based on startHour and totalHours */}
        {Array.from({ length: totalHours }).map((_, i) => {
          const hour = startHour + i;
          let label = '';
          // Format time labels (adjust formatting as desired)
          if (hour === 0) label = '12 AM'; // Midnight
          else if (hour < 12) label = `${hour} AM`;
          else if (hour === 12) label = '12 PM'; // Noon
          else label = `${hour - 12} PM`;

          return (
            <div key={`time-${i}`} className="time-slot">
              {label}
            </div>
          );
        })}
      </div>

      {/* Render Day Content Columns (Grid columns 2-8, rows 3+) */}
      {dayNames.map((_, dayIndex) => {
        const dayData = schedule.find(d => d.day_of_week === dayIndex) || {};
        const isOpen = Boolean(dayData.isTradingDay);

        let topPct = 0;
        let heightPct = 0;

        // Calculate block position only if it's a trading day with valid times
        if (isOpen && dayData.open_time && dayData.close_time && TOTAL_MIN > 0) {
            const openMin = toMinutes(dayData.open_time);
            const closeMin = toMinutes(dayData.close_time);

            // Ensure times are within the displayed range for calculation
            const effectiveOpenMin = Math.max(START_MIN, openMin);
            const effectiveCloseMin = Math.min(START_MIN + TOTAL_MIN, closeMin);

            // Calculate position relative to the START_MIN and TOTAL_MIN of the visible grid
            const relativeOpenMin = effectiveOpenMin - START_MIN;
            const relativeCloseMin = effectiveCloseMin - START_MIN;

            topPct = (relativeOpenMin / TOTAL_MIN) * 100;
            heightPct = ((relativeCloseMin - relativeOpenMin) / TOTAL_MIN) * 100;

            // Ensure height isn't negative if times are outside range or invalid
            heightPct = Math.max(0, heightPct);
        }

        return (
          // This outer div represents the grid cell for the day's content area
          <div
            key={`daycol-${dayIndex}`}
            className="day-column"
            // Place day columns 2 through 8
            style={{ gridColumn: `${dayIndex + 2} / span 1` }}
            onClick={() => onUpdate(dayIndex, dayData)} // Attach click handler here
          >
             {/* This inner div is where the trading block is positioned relative to */}
             <div className="day-content-area">
                {/* Render trading block only if open and height is positive */}
                {isOpen && heightPct > 0 && (
                  <div
                    className="trading-block"
                    style={{
                      top: `${topPct}%`,
                      height: `${heightPct}%`,
                    }}
                  />
                )}
             </div>
          </div>
        );
      })}
    </div>
  );
}