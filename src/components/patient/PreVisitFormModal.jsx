import React, { useState } from 'react';
import { ClipboardList, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';

export const PreVisitFormModal = ({ isOpen, onClose, appointment, showToast }) => {
  const [symptomSeverity, setSymptomSeverity] = useState('3');
  const [symptomDuration, setSymptomDuration] = useState('1-2 weeks');
  const [covidSymptoms, setCovidSymptoms] = useState(false);
  const [feverCheck, setFeverCheck] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast(`Pre-visit clinical intake submitted for appointment with ${appointment.doctorName}!`, 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pre-Visit Clinical Intake Questionnaire"
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--warm-cream)', padding: '12px 14px', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Visiting <strong>{appointment.doctorName}</strong> on <strong>{appointment.date} at {appointment.time}</strong> ({appointment.room}).
          Filling this questionnaire ahead of time streamlines your in-clinic consultation.
        </div>

        {/* Symptom Severity Rating (1 to 10) */}
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
            Current Symptom Discomfort Level: <strong style={{ color: 'var(--primary-teal)' }}>{symptomSeverity} / 10</strong>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={symptomSeverity}
            onChange={(e) => setSymptomSeverity(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--primary-teal)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            <span>1 (Mild / Routine)</span>
            <span>5 (Moderate)</span>
            <span>10 (Severe)</span>
          </div>
        </div>

        {/* Duration */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>How long have you experienced these symptoms?</label>
          <select
            value={symptomDuration}
            onChange={(e) => setSymptomDuration(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.86rem' }}
          >
            <option value="Just today">Started today</option>
            <option value="Past 2-3 days">Past 2-3 days</option>
            <option value="1-2 weeks">1-2 weeks</option>
            <option value="Over a month">Over a month (Chronic)</option>
          </select>
        </div>

        {/* Screening Checkboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Safety & Infection Triage:</div>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={feverCheck}
              onChange={(e) => setFeverCheck(e.target.checked)}
              style={{ accentColor: 'var(--primary-teal)', width: '16px', height: '16px' }}
            />
            <span>Have you had a fever or chills in the last 48 hours?</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={covidSymptoms}
              onChange={(e) => setCovidSymptoms(e.target.checked)}
              style={{ accentColor: 'var(--primary-teal)', width: '16px', height: '16px' }}
            />
            <span>Any recent cough, sore throat, or respiratory shortness of breath?</span>
          </label>
        </div>

        {/* Notes */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Specific Questions or Goals for the Doctor</label>
          <textarea
            rows={2}
            placeholder="e.g. Would like to discuss blood pressure medication side effects..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            <CheckCircle2 size={14} /> Submit Intake Form
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PreVisitFormModal;

