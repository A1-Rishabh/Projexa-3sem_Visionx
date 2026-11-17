import React, { useState } from 'react';
import { User, Stethoscope, MapPin, IndianRupee, Clock, Save, Building2, BookOpen } from 'lucide-react';
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
  const [hours, setHours] = useState(doctor.hours || '');
  const [bio, setBio] = useState(doctor.bio || '');

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
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', maxWidth: '720px' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', marginBottom: '4px' }}>
          Doctor Public Profile Management
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Information updated here is broadcast live to the Patient Booking Portal and Clinic Directory.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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

          <div className="form-group">
            <label>Clinic Operating Hours</label>
            <div className="input-with-icon">
              <Clock className="input-icon" size={16} />
              <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} required />
            </div>
          </div>
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
