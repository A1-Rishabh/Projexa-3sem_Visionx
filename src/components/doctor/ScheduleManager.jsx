import React, { useState } from 'react';
import { Calendar, Clock, Lock, CheckCircle2, Coffee, AlertCircle, Save, Palmtree } from 'lucide-react';
import { updateDoctorProfile } from '../../services/mockDataStore';

export const ScheduleManager = ({ doctor, showToast }) => {
  const [slotDuration, setSlotDuration] = useState('30');
  const [isHoliday, setIsHoliday] = useState(doctor.isHoliday || false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Generate time rows based on duration (15, 30, 45, 60 mins)
  const generateTimeSlots = (stepMins) => {
    const times = [];
    let startHour = 8;
    let startMin = 0;
    const endHour = 17;

    while (startHour < endHour || (startHour === endHour && startMin === 0)) {
      const hStr = startHour % 12 === 0 ? 12 : startHour % 12;
      const mStr = startMin === 0 ? '00' : startMin;
      const ampm = startHour >= 12 ? 'PM' : 'AM';
      times.push(`${hStr}:${mStr} ${ampm}`);

      startMin += parseInt(stepMins);
      if (startMin >= 60) {
        startHour += Math.floor(startMin / 60);
        startMin = startMin % 60;
      }
    }
    return times;
  };

  const timeSlots = generateTimeSlots(slotDuration);

  // Initial grid state map: day-time -> 'available' | 'blocked' | 'lunch'
  const [gridState, setGridState] = useState(() => {
    const map = {};
    daysOfWeek.forEach(day => {
      timeSlots.forEach((time, i) => {
        const key = `${day}-${time}`;
        if (day === 'Sunday') {
          map[key] = 'blocked';
        } else if (time.includes('12:00 PM') || time.includes('12:30 PM')) {
          map[key] = 'lunch';
        } else {
          map[key] = i % 2 === 0 ? 'available' : 'available';
        }
      });
    });
    return map;
  });

  // Cycle slot state on cell click
  const handleCellClick = (day, time) => {
    if (isHoliday) return;
    const key = `${day}-${time}`;
    const current = gridState[key] || 'available';
    const nextState = current === 'available' ? 'blocked' : current === 'blocked' ? 'lunch' : 'available';
    
    setGridState(prev => ({
      ...prev,
      [key]: nextState
    }));
  };

  const handleSaveSchedule = () => {
    updateDoctorProfile(doctor.id, { isHoliday });
    showToast('Weekly schedule & slot availability updated successfully!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER CONTROLS */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0a2540', marginBottom: '4px' }}>
            Interactive Weekly Schedule & Slot Manager
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Click any cell to cycle: <strong style={{ color: '#10b981' }}>Available</strong> → <strong style={{ color: '#64748b' }}>Blocked</strong> → <strong style={{ color: '#d97706' }}>Lunch Break</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* SLOT DURATION DROPDOWN */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0a2540' }}>Slot Duration:</label>
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontWeight: '600',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes</option>
            </select>
          </div>

          {/* FULL DAY HOLIDAY TOGGLE */}
          <button
            onClick={() => setIsHoliday(!isHoliday)}
            className={`btn ${isHoliday ? 'btn-danger' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Palmtree size={16} />
            {isHoliday ? 'Holiday Mode Active (All Blocked)' : 'Mark Holiday / Out of Clinic'}
          </button>

          <button
            onClick={handleSaveSchedule}
            className="btn btn-primary"
          >
            <Save size={16} /> Save Changes
          </button>

        </div>
      </div>

      {/* HOLIDAY ACTIVE BANNER */}
      {isHoliday && (
        <div 
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            padding: '14px 20px',
            borderRadius: '12px',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '600'
          }}
        >
          <AlertCircle size={20} />
          <span>Clinic Holiday status is active. All appointment booking slots for your profile are currently disabled.</span>
        </div>
      )}

      {/* 7-COLUMN WEEKLY GRID */}
      <div className="schedule-grid-container">
        
        {/* TOP HEADER ROW */}
        <div className="grid-header-cell">Time</div>
        {daysOfWeek.map(day => (
          <div key={day} className="grid-header-cell">
            {day}
          </div>
        ))}

        {/* TIME ROWS */}
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            {/* Leftmost time column */}
            <div className="grid-time-cell">{time}</div>

            {/* 7 Day Cells */}
            {daysOfWeek.map(day => {
              const key = `${day}-${time}`;
              const cellStatus = isHoliday ? 'blocked' : (gridState[key] || 'available');

              return (
                <div
                  key={key}
                  onClick={() => handleCellClick(day, time)}
                  className={`grid-slot-cell grid-slot-${cellStatus}`}
                >
                  {cellStatus === 'available' && (
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle2 size={12} /> Open
                    </span>
                  )}
                  {cellStatus === 'blocked' && (
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Lock size={12} /> Blocked
                    </span>
                  )}
                  {cellStatus === 'lunch' && (
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Coffee size={12} /> Lunch
                    </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}

      </div>

    </div>
  );
};
