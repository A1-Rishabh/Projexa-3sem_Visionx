import React, { useState } from 'react';
import { User, Stethoscope, MapPin, IndianRupee, Clock, Save, Building2, BookOpen, CheckCircle2, Calendar } from 'lucide-react';
import { updateDoctorProfile } from '../../services/mockDataStore';
import { formatINR } from '../../config/clinic';

export const DoctorProfileEditor = ({ doctor, onUpdateDoctor, showToast }) => {
  const [name, setName] = useState(doctor.name || '');
  const [title, setTitle] = useState(doctor.title || '');
  const [specialization, setSpecialization] = useState(doctor.specialization || '');
  const [qualifications, setQualifications] = useState(doctor.qualifications || '');
  const [experience, setExperience] = useState(doctor.experience || '');
  const [room, setRoom] = useState(doctor.room || '');
  const [fee, setFee] = useState(doctor.fee || 800);
  const [bio, setBio] = useState(doctor.bio || '');

  // Parse initial doctor hours string e.g. "Mon - Fri: 8:30 AM - 4:30 PM"
  const parseInitialHours = (str = '') => {
    const trimmed = (str || '').trim();
    const match = trimmed.match(/^(.*?):\s*(.*?)\s*-\s*(.*?)$/i);
    if (match) {
      return {
        days: match[1].trim(),
        start: match[2].trim(),
        end: match[3].trim(),
        isCustom: false
      };
    }
    return {
      days: 'Mon - Fri',
      start: '8:30 AM',
      end: '4:30 PM',
      isCustom: trimmed.length > 0 && !trimmed.includes(':')
    };
  };

  const initialParsed = parseInitialHours(doctor.hours || 'Mon - Fri: 8:30 AM - 4:30 PM');
  const [selectedDays, setSelectedDays] = useState(initialParsed.days);
  const [startTime, setStartTime] = useState(initialParsed.start);
  const [endTime, setEndTime] = useState(initialParsed.end);
  const [isCustomMode, setIsCustomMode] = useState(initialParsed.isCustom);
  const [hours, setHours] = useState(doctor.hours || 'Mon - Fri: 8:30 AM - 4:30 PM');

  const DAY_PRESETS = [
    'Mon - Fri',
    'Mon - Sat',
    'Tue - Fri',
    'Tue - Sat',
    'Mon - Thu',
    'All Days'
  ];

  const START_TIMES = [
    '7:00 AM',
    '7:30 AM',
    '8:00 AM',
    '8:30 AM',
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM'
  ];

  const END_TIMES = [
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '8:00 PM'
  ];

  const handleDayChange = (newDay) => {
    setSelectedDays(newDay);
    const updated = `${newDay}: ${startTime} - ${endTime}`;
    setHours(updated);
  };

  const handleStartTimeChange = (newStart) => {
    setStartTime(newStart);
    const updated = `${selectedDays}: ${newStart} - ${endTime}`;
    setHours(updated);
  };

  const handleEndTimeChange = (newEnd) => {
    setEndTime(newEnd);
    const updated = `${selectedDays}: ${startTime} - ${newEnd}`;
    setHours(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      name,
      title,
      specialization,
      qualifications,
      experience,
      room,
      fee: Number(fee),
      hours,
      bio
    };

    updateDoctorProfile(doctor.id, updated);
    onUpdateDoctor({ ...doctor, ...updated });
    showToast('Public profile updated! Changes synced to Patient Directory.', 'success');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', maxWidth: '740px' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', marginBottom: '4px' }}>
          Doctor Public Profile Management
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Information updated here is broadcast live to the Patient Booking Portal and Clinic Directory.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Full Doctor Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={16} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Specialization Department</label>
            <div className="input-with-icon">
              <Stethoscope className="input-icon" size={16} />
              <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Professional Title & Credentials</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
          </div>

          <div className="form-group">
            <label>Years of Clinical Experience</label>
            <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
          </div>
        </div>

        {/* ROOM & CONSULTATION FEE (CLEAN 2-COLUMN LAYOUT) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Assigned Consultation Room</label>
            <div className="input-with-icon">
              <MapPin className="input-icon" size={16} />
              <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Consultation Fee (₹ INR)</label>
            <div className="input-with-icon">
              <IndianRupee className="input-icon" size={16} />
              <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* CLINIC OPERATING HOURS (DEDICATED FULL-WIDTH CLINICAL PICKER) */}
        <div 
          style={{ 
            backgroundColor: 'var(--warm-cream)', 
            borderRadius: '12px', 
            padding: '16px 18px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--primary-teal)" />
              <label style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                Clinic Operating & Consultation Hours
              </label>
            </div>

            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-teal)',
                fontSize: '0.76rem',
                fontWeight: '700',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              {isCustomMode ? '← Use Structured Time Picker' : 'Switch to Custom Freeform Text'}
            </button>
          </div>

          {!isCustomMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Day Presets Chips */}
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Select Days of OPD Practice
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {DAY_PRESETS.map((day) => {
                    const isSelected = selectedDays === day;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayChange(day)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? '700' : '600',
                          backgroundColor: isSelected ? 'var(--primary-teal)' : '#ffffff',
                          color: isSelected ? '#ffffff' : 'var(--text-main)',
                          border: isSelected ? '1px solid var(--primary-teal)' : '1px solid var(--border-color)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Range Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    Start Time
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#ffffff',
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      color: 'var(--text-main)'
                    }}
                  >
                    {START_TIMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    {!START_TIMES.includes(startTime) && (
                      <option value={startTime}>{startTime}</option>
                    )}
                  </select>
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '16px' }}>
                  to
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    End Time
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#ffffff',
                      fontSize: '0.84rem',
                      fontWeight: '600',
                      color: 'var(--text-main)'
                    }}
                  >
                    {END_TIMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    {!END_TIMES.includes(endTime) && (
                      <option value={endTime}>{endTime}</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Real-time Preview Pill */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.8rem', 
                  color: 'var(--primary-teal)', 
                  backgroundColor: 'var(--mint)', 
                  padding: '7px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(14, 98, 83, 0.2)' 
                }}
              >
                <CheckCircle2 size={14} color="var(--primary-teal)" />
                <span>
                  <strong>Patient Directory Display:</strong> {hours}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="input-with-icon">
                <Clock className="input-icon" size={16} />
                <input
                  type="text"
                  placeholder="e.g. Mon - Fri: 8:30 AM - 4:30 PM"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Full-width custom text for atypical split rotations or specialized clinics.
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Academic Qualifications & Fellowships</label>
          <input type="text" value={qualifications} onChange={(e) => setQualifications(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
        </div>

        <div className="form-group">
          <label>Public Professional Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px', minHeight: '42px', fontSize: '0.88rem' }}>
          <Save size={16} /> Save & Broadcast Profile
        </button>

      </form>
    </div>
  );
};
