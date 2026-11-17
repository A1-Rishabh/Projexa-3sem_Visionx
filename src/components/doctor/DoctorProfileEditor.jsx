import React, { useState } from 'react';
import { User, Stethoscope, MapPin, DollarSign, Clock, Save, Building2, BookOpen } from 'lucide-react';
import { updateDoctorProfile } from '../../services/mockDataStore';

export const DoctorProfileEditor = ({ doctor, onUpdateDoctor, showToast }) => {
  const [name, setName] = useState(doctor.name || '');
  const [title, setTitle] = useState(doctor.title || '');
  const [specialization, setSpecialization] = useState(doctor.specialization || '');
  const [qualifications, setQualifications] = useState(doctor.qualifications || '');
  const [experience, setExperience] = useState(doctor.experience || '');
  const [room, setRoom] = useState(doctor.room || '');
  const [fee, setFee] = useState(doctor.fee || 120);
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
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', maxWidth: '720px' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0a2540', marginBottom: '4px' }}>
          Doctor Public Profile Management
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
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
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>

          <div className="form-group">
            <label>Years of Clinical Experience</label>
            <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
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
            <label>Consultation Fee ($ USD)</label>
            <div className="input-with-icon">
              <DollarSign className="input-icon" size={16} />
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
          <input type="text" value={qualifications} onChange={(e) => setQualifications(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>

        <div className="form-group">
          <label>Public Professional Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
          <Save size={16} /> Save & Broadcast Profile
        </button>

      </form>
    </div>
  );
};
