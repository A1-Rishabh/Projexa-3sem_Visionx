import React, { useState } from 'react';
import { Pill, Check, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

export const PrescriptionRefillModal = ({ isOpen, onClose, patient, showToast }) => {
  const [selectedMed, setSelectedMed] = useState('Lisinopril 10mg');
  const [deliveryMethod, setDeliveryMethod] = useState('clinic_pickup');
  const [pharmacyNotes, setPharmacyNotes] = useState('');
  const [quantityDays, setQuantityDays] = useState('30');

  if (!isOpen) return null;

  const currentMeds = [
    { name: 'Paracetamol 500mg', dose: 'SOS (as needed for fever/headache)', doctor: 'Dr. Shuchi Shivangi' },
    { name: 'Multivitamin & Zinc', dose: '1 Tablet Daily (Morning)', doctor: 'Dr. Shuchi Shivangi' },
    { name: 'Ferrous Ascorbate + Folic Acid', dose: '1 Tab Daily After Meals', doctor: 'Dr. (Mrs.) Indu Kumari' },
    { name: 'Other Prescribed Medication', dose: 'Custom request', doctor: 'Attending Physician' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast(`Refill request for ${selectedMed} submitted to your physician for approval!`, 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Prescription Refill"
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Submit an electronic prescription refill directly to your attending physician. Approvals are typically reviewed within 24 business hours.
        </p>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Select Active Prescription</label>
          <select
            value={selectedMed}
            onChange={(e) => setSelectedMed(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.86rem', fontWeight: '700' }}
          >
            {currentMeds.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name} — {m.doctor}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Refill Duration</label>
            <select
              value={quantityDays}
              onChange={(e) => setQuantityDays(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.86rem' }}
            >
              <option value="30">30 Days Supply</option>
              <option value="60">60 Days Supply</option>
              <option value="90">90 Days (Chronic Maintenance)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Pickup / Delivery</label>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.86rem' }}
            >
              <option value="clinic_pickup">Jeevak Clinic In-House Dispensary</option>
              <option value="home_delivery">Local Home Delivery (₹50)</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Notes for Attending Physician (Optional)</label>
          <textarea
            rows={2}
            placeholder="e.g. Continuing current dosage, no side effects observed..."
            value={pharmacyNotes}
            onChange={(e) => setPharmacyNotes(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            <Pill size={14} /> Submit Refill Request
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PrescriptionRefillModal;

