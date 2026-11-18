import React, { useState } from 'react';
import { ShieldCheck, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { updateProfile } from '../../services/supabase';

export const ClinicalIntakeModal = ({ isOpen, onClose, patient, onComplete, showToast }) => {
  const [phone, setPhone] = useState(patient?.phone || '');
  const [dob, setDob] = useState(patient?.date_of_birth || '');
  const [gender, setGender] = useState(patient?.gender || 'Prefer not to say');
  const [bloodGroup, setBloodGroup] = useState(patient?.blood_group || 'O+');
  const [allergies, setAllergies] = useState(patient?.allergies || 'None');
  const [emergencyName, setEmergencyName] = useState(patient?.emergency_contact_name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(patient?.emergency_contact_phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !dob) {
      if (showToast) showToast('Please enter your contact phone number and date of birth', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const updates = {
        phone,
        date_of_birth: dob,
        gender,
        blood_group: bloodGroup,
        allergies,
        emergency_contact_name: emergencyName,
        emergency_contact_phone: emergencyPhone
      };

      if (patient?.id) {
        await updateProfile(patient.id, updates);
      }

      if (showToast) {
        showToast('Clinical profile successfully registered! Welcome to Jeevak Clinic.', 'success');
      }

      if (onComplete) {
        onComplete({ ...patient, ...updates });
      }
      onClose();
    } catch (err) {
      console.error('Error updating clinical profile:', err);
      if (showToast) showToast('Could not save profile to database. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Your Patient Medical Profile"
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div 
          style={{ 
            backgroundColor: 'var(--mint)', 
            padding: '14px 16px', 
            borderRadius: '12px', 
            display: 'flex', 
            gap: '12px',
            alignItems: 'center'
          }}
        >
          <ShieldCheck size={28} color="var(--primary-teal)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.84rem', color: 'var(--deep-teal)', lineHeight: 1.45 }}>
            Welcome to <strong>Jeevak Clinic</strong>! Please verify your basic clinical details below. 
            This information is encrypted under electronic medical confidentiality standards and shared only with your attending physicians.
          </div>
        </div>

        {/* Name and Email (Read only from Google Auth) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Full Legal Name</label>
            <input
              type="text"
              value={patient?.full_name || patient?.name || 'Patient'}
              disabled
              style={{ width: '100%', backgroundColor: 'var(--warm-cream)', opacity: 0.85 }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Google Account Email</label>
            <input
              type="email"
              value={patient?.email || ''}
              disabled
              style={{ width: '100%', backgroundColor: 'var(--warm-cream)', opacity: 0.85 }}
            />
          </div>
        </div>

        {/* Contact Phone & Date of Birth */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Contact Phone *</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Date of Birth *</label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Blood Group & Gender */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="A+">A+ (A Positive)</option>
              <option value="A-">A- (A Negative)</option>
              <option value="B+">B+ (B Positive)</option>
              <option value="B-">B- (B Negative)</option>
              <option value="AB+">AB+ (AB Positive)</option>
              <option value="AB-">AB- (AB Negative)</option>
              <option value="O+">O+ (O Positive)</option>
              <option value="O-">O- (O Negative)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Biological Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Allergies & Drug Reactions */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Known Drug / Food Allergies</label>
          <input
            type="text"
            placeholder="e.g. Penicillin, Sulfa drugs, Peanuts (or write 'None')"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Emergency Contact */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Emergency Contact Name</label>
            <input
              type="text"
              placeholder="e.g. Spouse / Parent name"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Emergency Contact Phone</label>
            <input
              type="tel"
              placeholder="+91 98765 00000"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ minHeight: '44px', padding: '10px 24px' }}
          >
            {isSubmitting ? 'Saving Profile...' : 'Confirm & Open Portal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClinicalIntakeModal;

