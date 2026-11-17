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
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', marginBottom: '4px' }}>
            Weekly Schedule & OPD Slot Manager
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Click any cell to toggle: <strong style={{ color: '#16A34A' }}>Open</strong> → <strong style={{ color: 'var(--text-secondary)' }}>Blocked</strong> → <strong style={{ color: '#D97706' }}>Lunch Break</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          
          {/* SLOT DURATION DROPDOWN */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)' }}>Slot Duration:</label>
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontWeight: '600',
                fontSize: '0.84rem',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes (Standard)</option>
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes</option>
            </select>
          </div>

          {/* FULL DAY HOLIDAY TOGGLE */}
          <button
            onClick={() => setIsHoliday(!isHoliday)}
            className={`btn ${isHoliday ? 'btn-danger' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', minHeight: '38px', fontSize: '0.82rem' }}
          >
            <Palmtree size={15} />
            {isHoliday ? 'Holiday Active (Slots Blocked)' : 'Mark Holiday / Leave'}
          </button>

          <button
            onClick={handleSaveSchedule}
            className="btn btn-primary"
            style={{ minHeight: '38px', fontSize: '0.84rem' }}
          >
            <Save size={15} /> Save Changes
          </button>

        </div>
      </div>

      {/* HOLIDAY ACTIVE BANNER */}
      {isHoliday && (
        <div 
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FECACA',
            padding: '14px 20px',
            borderRadius: '12px',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '600',
            fontSize: '0.86rem'
          }}
        >
          <AlertCircle size={20} color="#DC2626" />
          <span>Clinic Holiday status is active. All appointment booking slots for your profile are currently disabled.</span>
        </div>
      )}

      {/* 8-COLUMN WEEKLY GRID (Time + 7 Days) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '90px repeat(7, minmax(100px, 1fr))',
          gap: '6px',
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          overflowX: 'auto'
        }}
      >
        {/* TOP HEADER ROW */}
        <div style={{ backgroundColor: 'var(--deep-teal)', color: '#ffffff', padding: '10px 8px', borderRadius: '8px', fontWeight: '700', textAlign: 'center', fontSize: '0.78rem' }}>
          Time
        </div>
        {daysOfWeek.map(day => (
          <div key={day} style={{ backgroundColor: 'var(--deep-teal)', color: '#ffffff', padding: '10px 8px', borderRadius: '8px', fontWeight: '700', textAlign: 'center', fontSize: '0.78rem' }}>
            {day}
          </div>
        ))}

        {/* TIME ROWS */}
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            {/* Leftmost time column */}
            <div style={{ backgroundColor: 'var(--warm-cream)', color: 'var(--text-secondary)', padding: '8px 4px', borderRadius: '8px', fontWeight: '700', textAlign: 'center', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {time}
            </div>

            {/* 7 Day Cells */}
            {daysOfWeek.map(day => {
              const key = `${day}-${time}`;
              const cellStatus = isHoliday ? 'blocked' : (gridState[key] || 'available');

              const getCellStyles = () => {
                if (cellStatus === 'available') {
                  return {
                    backgroundColor: 'var(--mint)',
                    border: '1px solid rgba(14, 98, 83, 0.22)',
                    color: 'var(--primary-teal)'
                  };
                }
                if (cellStatus === 'lunch') {
                  return {
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    color: '#92400E'
                  };
                }
                return {
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#94A3B8'
                };
              };

              const currentStyles = getCellStyles();

              return (
                <div
                  key={key}
                  onClick={() => handleCellClick(day, time)}
                  style={{
                    ...currentStyles,
                    borderRadius: '8px',
                    padding: '8px 4px',
                    cursor: isHoliday ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '36px',
                    userSelect: 'none'
                  }}
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
