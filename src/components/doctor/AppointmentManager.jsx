import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Check, 
  X, 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Search,
  Building2
} from 'lucide-react';
import { 
  getAppointments, 
  updateAppointmentStatus, 
  getMedicalRecords, 
  updatePatientRecord, 
  logAuditEntry 
} from '../../services/mockDataStore';
import { Modal } from '../common/Modal';

export const AppointmentManager = ({ doctor, showToast }) => {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Consultation Modal state
  const [selectedApt, setSelectedApt] = useState(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [diagnosisCode, setDiagnosisCode] = useState('I10 - Essential Primary Hypertension');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [prescriptions, setPrescriptions] = useState([
    { medication: '', dosage: '', frequency: '', duration: '30 Days' }
  ]);
  const [isPatientVisible, setIsPatientVisible] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, [doctor.id]);

  const loadAppointments = () => {
    const all = getAppointments();
    setAppointments(all.filter(a => a.doctorId === doctor.id));
  };

  const handleStatusChange = (aptId, newStatus) => {
    updateAppointmentStatus(aptId, newStatus);
    logAuditEntry(doctor.id, `Updated appointment ${aptId} status to ${newStatus}`);
    loadAppointments();
    showToast(`Appointment status updated to ${newStatus}`, 'success');
  };

  // Open Consultation Completion Modal
  const openConsultationModal = (apt) => {
    setSelectedApt(apt);
    setClinicalSummary(`Patient presented for ${apt.visitReason}. Vitals stable.`);
    setPrescriptions([
      { medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily after breakfast', duration: '30 Days' }
    ]);
    setShowConsultModal(true);
  };

  // Duplicate previous prescription button
  const handleDuplicatePreviousPrescription = () => {
    if (!selectedApt) return;
    const records = getMedicalRecords();
    const pRecord = records[selectedApt.patientId];

    if (pRecord && pRecord.visitTimeline && pRecord.visitTimeline.length > 0) {
      const lastVisit = pRecord.visitTimeline[0];
      if (lastVisit.prescription && lastVisit.prescription.length > 0) {
        setPrescriptions(lastVisit.prescription);
        showToast('Duplicated previous prescription as template', 'info');
        return;
      }
    }
    showToast('No previous prescription found for this patient', 'warning');
  };

  // Add medication row
  const addPrescriptionRow = () => {
    setPrescriptions([
      ...prescriptions,
      { medication: '', dosage: '', frequency: '', duration: '30 Days' }
    ]);
  };

  const removePrescriptionRow = (idx) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const updatePrescriptionField = (idx, field, val) => {
    const updated = [...prescriptions];
    updated[idx][field] = val;
    setPrescriptions(updated);
  };

  // Save Consultation & Complete Appointment
  const handleSaveConsultation = () => {
    if (!selectedApt) return;

    // 1. Update Medical Record timeline
    const records = getMedicalRecords();
    const existing = records[selectedApt.patientId] || { visitTimeline: [] };
    
    const newVisitEntry = {
      id: `VT-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      doctorName: doctor.name,
      diagnosis: diagnosisCode,
      summary: clinicalSummary,
      prescription: prescriptions.filter(p => p.medication.trim() !== '')
    };

    const updatedTimeline = [newVisitEntry, ...(existing.visitTimeline || [])];

    updatePatientRecord(selectedApt.patientId, {
      visitTimeline: updatedTimeline,
      notesPublic: isPatientVisible ? clinicalSummary : existing.notesPublic,
      notesPrivate: !isPatientVisible ? clinicalSummary : existing.notesPrivate
    }, doctor.id);

    // 2. Update Appointment status to 'completed'
    updateAppointmentStatus(selectedApt.id, 'completed', { notes: clinicalSummary });

    // 3. Log Audit Entry
    logAuditEntry(doctor.id, `Completed consultation and issued prescription for Patient ${selectedApt.patientName} (${selectedApt.patientId})`);

    setShowConsultModal(false);
    loadAppointments();
    showToast('Consultation saved! Medical record and prescription updated.', 'success');
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.patientPhone.includes(searchTerm) ||
                          apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* FILTER & SEARCH HEADER */}
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
        {/* Status Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontWeight: '700',
                fontSize: '0.8rem',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
                backgroundColor: filterStatus === st ? '#0a2540' : '#f1f5f9',
                color: filterStatus === st ? '#ffffff' : '#64748b'
              }}
            >
              {st} {st !== 'all' && `(${appointments.filter(a => a.status === st).length})`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="input-with-icon" style={{ minWidth: '260px' }}>
          <Search className="input-icon" size={16} />
          <input
            type="text"
            placeholder="Search by patient name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* APPOINTMENTS TABLE */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#0a2540', fontWeight: '700' }}>
              <th style={{ padding: '14px' }}>Date & Time</th>
              <th style={{ padding: '14px' }}>Patient Details</th>
              <th style={{ padding: '14px' }}>Room</th>
              <th style={{ padding: '14px' }}>Visit Reason</th>
              <th style={{ padding: '14px' }}>Status</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                  No appointments match the selected filter.
                </td>
              </tr>
            ) : (
              filteredAppointments.map(apt => (
                <tr key={apt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  
                  <td style={{ padding: '14px', fontWeight: '700', color: '#0a2540' }}>
                    <div>{apt.date}</div>
                    <div style={{ fontSize: '0.75rem', color: '#0f62fe', fontWeight: '600' }}>{apt.time}</div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: '700', color: '#16191f' }}>{apt.patientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {apt.patientId} • {apt.patientPhone}</div>
                  </td>

                  <td style={{ padding: '14px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>
                    {apt.room || doctor.room}
                  </td>

                  <td style={{ padding: '14px', color: '#475569', maxWidth: '240px' }}>
                    {apt.visitReason}
                  </td>

                  {/* Accessibility Badge with Icon + Text */}
                  <td style={{ padding: '14px' }}>
                    <span className={`badge badge-${apt.status}`}>
                      {apt.status === 'pending' && <Clock size={12} />}
                      {apt.status === 'confirmed' && <CheckCircle2 size={12} />}
                      {apt.status === 'completed' && <Check size={12} />}
                      {apt.status === 'cancelled' && <X size={12} />}
                      {apt.status.toUpperCase()}
                    </span>
                  </td>

                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {apt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(apt.id, 'confirmed')}
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: '#059669' }}
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(apt.id, 'cancelled')}
                            className="btn btn-danger btn-sm"
                          >
                            <X size={14} /> Reject
                          </button>
                        </>
                      )}

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => openConsultationModal(apt)}
                          className="btn btn-primary btn-sm"
                        >
                          <FileText size={14} /> Complete Consultation
                        </button>
                      )}

                      {apt.status === 'completed' && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                          Record Finalized
                        </span>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CONSULTATION COMPLETION & PRESCRIPTION MODAL */}
      <Modal
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
        title={`Clinical Consultation — ${selectedApt?.patientName} (${selectedApt?.patientId})`}
        maxWidth="680px"
      >
        {selectedApt && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ backgroundColor: '#edf5ff', padding: '12px 16px', borderRadius: '10px', fontSize: '0.85rem', color: '#0353e9' }}>
              <strong>Appointment Details:</strong> {selectedApt.date} at {selectedApt.time} • {selectedApt.visitReason}
            </div>

            {/* ICD-10 Diagnosis Field */}
            <div className="form-group">
              <label>Clinical Diagnosis (ICD-10 Code & Condition)</label>
              <input
                type="text"
                value={diagnosisCode}
                onChange={(e) => setDiagnosisCode(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* Clinical Notes Summary */}
            <div className="form-group">
              <label>Doctor Examination Notes & Summary</label>
              <textarea
                rows={3}
                value={clinicalSummary}
                onChange={(e) => setClinicalSummary(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>

            {/* Prescription Builder */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0a2540' }}>
                  Prescription Writer
                </h4>

                <button
                  type="button"
                  onClick={handleDuplicatePreviousPrescription}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', color: '#0f62fe' }}
                >
                  <Copy size={12} /> Duplicate Previous Prescription
                </button>
              </div>

              {/* Repeatable Medication Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {prescriptions.map((p, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 40px', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Medication Name"
                      value={p.medication}
                      onChange={(e) => updatePrescriptionField(idx, 'medication', e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g. 10mg)"
                      value={p.dosage}
                      onChange={(e) => updatePrescriptionField(idx, 'dosage', e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g. 2x Daily)"
                      value={p.frequency}
                      onChange={(e) => updatePrescriptionField(idx, 'frequency', e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      value={p.duration}
                      onChange={(e) => updatePrescriptionField(idx, 'duration', e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => removePrescriptionRow(idx)}
                      style={{ color: '#ef4444', padding: '4px', cursor: 'pointer', textAlign: 'center' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPrescriptionRow}
                  style={{
                    alignSelf: 'flex-start',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: '#0f62fe',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px'
                  }}
                >
                  <Plus size={14} /> Add Another Medication
                </button>
              </div>
            </div>

            {/* Note Visibility Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              <input
                type="checkbox"
                id="visibleToggle"
                checked={isPatientVisible}
                onChange={(e) => setIsPatientVisible(e.target.checked)}
              />
              <label htmlFor="visibleToggle" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                Make notes & prescription visible to patient in their Medical Records portal
              </label>
            </div>

            {/* Save & Audit Button */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConsultModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveConsultation}
              >
                Finalize Consultation & Log Audit
              </button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};
