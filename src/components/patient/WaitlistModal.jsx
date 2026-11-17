import React, { useState } from 'react';
import { Bell, Clock, Check } from 'lucide-react';
import { Modal } from '../common/Modal';

export const WaitlistModal = ({ isOpen, onClose, appointment, showToast }) => {
  const [preferredWindow, setPreferredWindow] = useState('anytime');
  const [notifyMethod, setNotifyMethod] = useState('both');

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast(`Added to priority waitlist for ${appointment.doctorName}. We will alert you immediately if an earlier slot opens!`, 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Priority Waitlist Notification"
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--warm-cream)', padding: '12px 14px', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Currently scheduled with <strong>{appointment.doctorName}</strong> on <strong>{appointment.date} at {appointment.time}</strong>.
          If another patient reschedules or an earlier slot opens up, we will instantly notify you.
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Preferred Earlier Time Window</label>
          <select
            value={preferredWindow}
            onChange={(e) => setPreferredWindow(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.86rem' }}
          >
            <option value="anytime">Any earlier available time slot</option>
            <option value="morning">Morning only (09:00 AM – 12:00 PM)</option>
            <option value="afternoon">Afternoon only (01:30 PM – 05:00 PM)</option>
            <option value="today">Same-day urgent cancellation only</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Notification Channel</label>
          <select
            value={notifyMethod}
            onChange={(e) => setNotifyMethod(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.86rem' }}
          >
            <option value="both">SMS & Email Alert (Recommended)</option>
            <option value="sms">SMS Text Alert Only</option>
            <option value="email">Email Notification Only</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            <Bell size={14} /> Join Earlier Slot Waitlist
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WaitlistModal;

