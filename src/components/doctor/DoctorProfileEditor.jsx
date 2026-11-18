import React, { useState } from 'react';
import { User, Stethoscope, MapPin, IndianRupee, Clock, Save, ShieldCheck, CheckCircle2, Phone } from 'lucide-react';
import { updateDoctorProfile } from '../../services/mockDataStore';
import { clinic } from '../../config/clinic';

export const DoctorProfileEditor = ({ doctor, onUpdateDoctor, showToast }) => {
  const [name, setName] = useState(doctor.name || '');
  const [title, setTitle] = useState(doctor.title || '');
  const [specialization, setSpecialization] = useState(doctor.specialization || '');
  const [qualifications, setQualifications] = useState(doctor.qualifications || '');
  const [experience, setExperience] = useState(doctor.experience || '');
  const [room, setRoom] = useState(doctor.room || '');
  const [fee, setFee] = useState(doctor.fee || 500);
  const [bio, setBio] = useState(doctor.bio || '');

  const fixedHours = 'Mon - Fri: 11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM';

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
      hours: fixedHours,
      bio
    };

    updateDoctorProfile(doctor.id, updated);
    onUpdateDoctor({ ...doctor, ...updated });
    showToast('Public profile updated! Changes synced to Patient Directory.', 'success');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', maxWidth: '760px' }}>
      
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
            <label>Role / Clinical Designation</label>
            <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Consultation Chamber / Room</label>
            <div className="input-with-icon">
              <MapPin className="input-icon" size={16} />
              <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>In-Clinic Consultation Fee (₹)</label>
            <div className="input-with-icon">
              <IndianRupee className="input-icon" size={16} />
              <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* FIXED CLINIC OPD SCHEDULE (READ-ONLY OFFICIAL NOTICE) */}
        <div 
          style={{ 
            backgroundColor: 'var(--warm-cream)', 
            borderRadius: '12px', 
            padding: '16px 20px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--primary-teal)" />
              <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--deep-teal)', margin: 0 }}>
                Fixed Clinic OPD Consultation Schedule
              </label>
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--primary-teal)', backgroundColor: 'var(--mint)', padding: '2px 8px', borderRadius: '6px' }}>
              Standard Fixed Hours
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                Morning Session (सुबह)
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                11:30 AM – 2:00 PM
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary-teal)', marginTop: '2px' }}>
                Monday to Friday
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                Evening Session (सायं)
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                6:30 PM – 8:30 PM
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary-teal)', marginTop: '2px' }}>
                Monday to Friday
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', paddingTop: '6px', borderTop: '1px solid rgba(15, 79, 74, 0.08)' }}>
            <span><strong>Weekend:</strong> Saturday & Sunday Closed</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={12} color="var(--primary-teal)" />
              Desk: <strong>011 45680306</strong>
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Academic Qualifications & Degrees</label>
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
          <Save size={16} /> Save Profile
        </button>

      </form>
    </div>
  );
};

export default DoctorProfileEditor;
