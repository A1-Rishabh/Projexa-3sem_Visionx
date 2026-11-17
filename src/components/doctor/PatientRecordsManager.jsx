import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Search, 
  User, 
  Activity, 
  Heart, 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  Edit3, 
  Save, 
  ShieldAlert,
  Calendar,
  Pill,
  Thermometer,
  Weight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  getPatients, 
  getMedicalRecords, 
  updatePatientRecord, 
  updatePatientVitals,
  addPatientVisit,
  logAuditEntry 
} from '../../services/mockDataStore';
import { Modal } from '../common/Modal';

export const PatientRecordsManager = ({ doctor, showToast }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('P-1001');
  const [medicalRecords, setMedicalRecords] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Editable Doctor Notes state
  const [notesPublic, setNotesPublic] = useState('');
  const [notesPrivate, setNotesPrivate] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // PDF Preview Modal State
  const [previewPdf, setPreviewPdf] = useState(null);

  // Record / Update Vitals Modal State
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [vitalsBp, setVitalsBp] = useState('');
  const [vitalsHr, setVitalsHr] = useState('');
  const [vitalsSpo2, setVitalsSpo2] = useState('');
  const [vitalsWeight, setVitalsWeight] = useState('');
  const [vitalsHeight, setVitalsHeight] = useState('');
  const [vitalsTemp, setVitalsTemp] = useState('');
  const [vitalsNotes, setVitalsNotes] = useState('Routine In-Clinic OPD Check');

  // Add Clinical Visit Modal State
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitDiagnosis, setVisitDiagnosis] = useState('');
  const [visitSummary, setVisitSummary] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [prescriptions, setPrescriptions] = useState([
    { medication: '', dosage: '', frequency: '', duration: '' }
  ]);

  useEffect(() => {
    loadData();
  }, [doctor.id]);

  const loadData = () => {
    const allPats = getPatients();
    setPatients(allPats);
    const recs = getMedicalRecords();
    setMedicalRecords(recs);

    const targetPatId = selectedPatientId || (allPats[0] ? allPats[0].id : 'P-1001');
    if (recs[targetPatId]) {
      setNotesPublic(recs[targetPatId].notesPublic || '');
      setNotesPrivate(recs[targetPatId].notesPrivate || '');
    }
  };

  const handleSelectPatient = (patId) => {
    setSelectedPatientId(patId);
    const recs = getMedicalRecords();
    const rec = recs[patId] || {};
    setNotesPublic(rec.notesPublic || '');
    setNotesPrivate(rec.notesPrivate || '');
    setIsEditingNotes(false);

    // Audit log entry when doctor accesses a record
    logAuditEntry(doctor.id, `Accessed Patient Medical File for ${patId}`);
  };

  const handleSaveNotes = () => {
    updatePatientRecord(selectedPatientId, {
      notesPublic,
      notesPrivate
    }, doctor.id, doctor.name);

    loadData();
    setIsEditingNotes(false);
    showToast('Clinical notes updated & audit log timestamp recorded', 'success');
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const selectedRecord = medicalRecords[selectedPatientId] || { visitTimeline: [], labReports: [] };
  const currentVitals = selectedRecord.vitals || selectedPatient?.vitals || null;

  // Open Vitals Modal with prefilled data if available
  const handleOpenVitalsModal = () => {
    if (currentVitals) {
      setVitalsBp(currentVitals.bloodPressure ? currentVitals.bloodPressure.replace(/\s*mmHg/i, '') : '');
      setVitalsHr(currentVitals.heartRate ? String(currentVitals.heartRate).replace(/\s*bpm/i, '') : '');
      setVitalsSpo2(currentVitals.spO2 ? String(currentVitals.spO2).replace(/\s*%/i, '') : '');
      setVitalsWeight(currentVitals.weight ? String(currentVitals.weight).replace(/\s*kg/i, '') : '');
      setVitalsHeight(currentVitals.height ? String(currentVitals.height).replace(/\s*cm/i, '') : '');
      setVitalsTemp(currentVitals.temperature ? String(currentVitals.temperature).replace(/\s*°F/i, '') : '');
      setVitalsNotes(currentVitals.lastExamType || 'Routine In-Clinic OPD Check');
    } else {
      setVitalsBp('');
      setVitalsHr('');
      setVitalsSpo2('');
      setVitalsWeight('');
      setVitalsHeight('');
      setVitalsTemp('');
      setVitalsNotes('Routine In-Clinic OPD Check');
    }
    setIsVitalsModalOpen(true);
  };

  // Save Vitals Form Submission
  const handleSaveVitalsSubmit = (e) => {
    e.preventDefault();
    let bmiCalculated = '';
    if (vitalsWeight && vitalsHeight) {
      const w = parseFloat(vitalsWeight);
      const h = parseFloat(vitalsHeight) / 100;
      if (h > 0) {
        const bmiVal = (w / (h * h)).toFixed(1);
        let status = 'Normal';
        if (bmiVal < 18.5) status = 'Underweight';
        else if (bmiVal >= 25 && bmiVal < 30) status = 'Overweight';
        else if (bmiVal >= 30) status = 'Obese';
        bmiCalculated = `${bmiVal} (${status})`;
      }
    }

    const vitalsPayload = {
      bloodPressure: vitalsBp.trim() ? `${vitalsBp.trim()} mmHg` : '',
      heartRate: vitalsHr.trim() ? `${vitalsHr.trim()} bpm` : '',
      spO2: vitalsSpo2.trim() ? `${vitalsSpo2.trim()}%` : '',
      weight: vitalsWeight.trim() ? `${vitalsWeight.trim()} kg` : '',
      height: vitalsHeight.trim() ? `${vitalsHeight.trim()} cm` : '',
      bmi: bmiCalculated || (currentVitals?.bmi || ''),
      temperature: vitalsTemp.trim() ? `${vitalsTemp.trim()} °F` : '',
      lastExamType: vitalsNotes.trim() || 'In-Clinic OPD Examination'
    };

    updatePatientVitals(selectedPatientId, vitalsPayload, doctor.id, doctor.name);
    loadData();
    setIsVitalsModalOpen(false);
    showToast(`Clinical vitals recorded for ${selectedPatient?.name || selectedPatientId}`, 'success');
  };

  // Open Clinical Visit Modal
  const handleOpenVisitModal = () => {
    setVisitDiagnosis('');
    setVisitSummary('');
    setVisitDate(new Date().toISOString().split('T')[0]);
    setPrescriptions([{ medication: '', dosage: '', frequency: '', duration: '' }]);
    setIsVisitModalOpen(true);
  };

  const handleAddPrescriptionRow = () => {
    setPrescriptions(prev => [...prev, { medication: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleRemovePrescriptionRow = (index) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (index, field, value) => {
    setPrescriptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveVisitSubmit = (e) => {
    e.preventDefault();
    if (!visitDiagnosis.trim()) {
      showToast('Please enter the clinical diagnosis or reason for visit.', 'error');
      return;
    }

    const validPrescriptions = prescriptions.filter(p => p.medication.trim());

    addPatientVisit(selectedPatientId, {
      date: visitDate,
      diagnosis: visitDiagnosis.trim(),
      summary: visitSummary.trim() || 'Clinical assessment completed.',
      prescription: validPrescriptions
    }, doctor.id, doctor.name);

    loadData();
    setIsVisitModalOpen(false);
    showToast(`Clinical visit consultation saved for ${selectedPatient?.name || selectedPatientId}`, 'success');
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* RESTRICTED ACCESS SECURITY HEADER */}
      <div 
        style={{
          backgroundColor: '#0a2540',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171' }}>
            <Lock size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
              RBAC Restricted Zone — Patient Clinical Files
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
              Protected under Jivaka Clinic Data Privacy Policy • All record accesses are immutably logged
            </p>
          </div>
        </div>

        <div className="input-with-icon" style={{ minWidth: '280px' }}>
          <Search className="input-icon" size={16} />
          <input
            type="text"
            placeholder="Search patient name, ID, blood type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* TWO COLUMN CONTENT AREA */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
        
        {/* PATIENT LIST SELECTOR SIDEBAR */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Patient Directory ({filteredPatients.length})
          </h4>

          {filteredPatients.map(p => (
            <div
              key={p.id}
              onClick={() => handleSelectPatient(p.id)}
              style={{
                padding: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedPatientId === p.id ? '#edf5ff' : '#ffffff',
                border: selectedPatientId === p.id ? '1.5px solid #0f62fe' : '1px solid #e2e8f0'
              }}
            >
              <div style={{ fontWeight: '700', color: '#0a2540', fontSize: '0.9rem' }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                <span>ID: {p.id}</span>
                <span style={{ fontWeight: '700', color: '#059669' }}>{p.bloodGroup}</span>
              </div>
            </div>
          ))}
        </div>

        {/* SELECTED PATIENT DETAIL PANEL */}
        {selectedPatient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* PATIENT DEMOGRAPHICS BAR & AUDIT LINE */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0a2540', marginBottom: '2px' }}>
                    {selectedPatient.name}
                  </h2>
                  
                  {/* ALWAYS VISIBLE AUDIT TIMESTAMP LINE */}
                  <div style={{ fontSize: '0.8rem', color: '#0353e9', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <Clock size={14} /> Last viewed by {selectedRecord.lastViewedBy || `Doctor ${doctor.id}`} at {selectedRecord.lastViewedTime || 'Just Now'}
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#475569' }}>
                    <span>Age: <strong>{selectedPatient.age} Yrs ({selectedPatient.gender})</strong></span>
                    <span>Blood Type: <strong>{selectedPatient.bloodGroup}</strong></span>
                    <span>Allergies: <strong style={{ color: '#dc2626' }}>{selectedPatient.allergies}</strong></span>
                    <span>Contact: <strong>{selectedPatient.phone}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* VITALS DASHBOARD & UPDATER */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#ef4444" />
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0a2540', margin: 0 }}>
                    Clinical Examination Vitals
                  </h3>
                  {currentVitals?.recordedDate && (
                    <span style={{ fontSize: '0.72rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                      Updated: {currentVitals.recordedDate} by {currentVitals.recordedBy || 'Doctor'}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleOpenVitalsModal}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px', fontSize: '0.78rem' }}
                >
                  <Edit3 size={13} color="#0f62fe" />
                  <span>{currentVitals?.bloodPressure ? 'Update Vitals' : 'Record Vitals'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                
                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={13} color="#ef4444" /> Blood Pressure
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: currentVitals?.bloodPressure ? '#0a2540' : '#94a3b8', marginTop: '4px' }}>
                    {currentVitals?.bloodPressure || '-- / -- mmHg'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    {currentVitals?.bloodPressure ? 'Clinical measurement' : 'Awaiting examination'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={13} color="#0f62fe" /> Heart Rate
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: currentVitals?.heartRate ? '#0a2540' : '#94a3b8', marginTop: '4px' }}>
                    {currentVitals?.heartRate ? (String(currentVitals.heartRate).includes('bpm') ? currentVitals.heartRate : `${currentVitals.heartRate} bpm`) : '-- bpm'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    {currentVitals?.heartRate ? 'Resting rate' : 'Awaiting examination'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Weight size={13} color="#059669" /> BMI / Weight
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: (currentVitals?.bmi || currentVitals?.weight) ? '#0a2540' : '#94a3b8', marginTop: '4px' }}>
                    {currentVitals?.bmi || (currentVitals?.weight ? currentVitals.weight : '--')}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    {currentVitals?.weight || currentVitals?.height ? `Wt: ${currentVitals.weight || '--'} • Ht: ${currentVitals.height || '--'}` : 'Not documented'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Thermometer size={13} color="#d97706" /> Oxygen (SpO2)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: currentVitals?.spO2 ? '#0a2540' : '#94a3b8', marginTop: '4px' }}>
                    {currentVitals?.spO2 ? (String(currentVitals.spO2).includes('%') ? currentVitals.spO2 : `${currentVitals.spO2}%`) : '--%'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    {currentVitals?.temperature ? `Temp: ${currentVitals.temperature}` : 'Pulse oximetry'}
                  </div>
                </div>

              </div>
            </div>

            {/* TWO COLUMNS: TIMELINE (LEFT) & NOTES + PDF LABS (RIGHT) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px' }}>
              
              {/* CHRONOLOGICAL VISIT TIMELINE */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0a2540', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} color="#0f62fe" /> Visit History & Consultations
                  </h3>
                  <button
                    type="button"
                    onClick={handleOpenVisitModal}
                    className="btn btn-primary btn-sm"
                    style={{ backgroundColor: '#0f62fe', fontSize: '0.78rem', gap: '6px' }}
                  >
                    <Plus size={14} /> New Consultation Entry
                  </button>
                </div>

                {selectedRecord.visitTimeline.length === 0 ? (
                  <div style={{ padding: '30px 20px', color: '#64748b', textAlign: 'center', fontSize: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                    <div>No recorded prior clinical visits on file for this patient.</div>
                    <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#94a3b8' }}>Click "+ New Consultation Entry" above to record today's examination, diagnosis, and prescription.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedRecord.visitTimeline.map((vt) => (
                      <div 
                        key={vt.id}
                        style={{
                          borderLeft: '3px solid #0f62fe',
                          paddingLeft: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0f62fe' }}>
                          {vt.date} • Attended by {vt.doctorName}
                        </div>
                        <div style={{ fontWeight: '700', color: '#0a2540', fontSize: '0.9rem' }}>
                          {vt.diagnosis}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                          {vt.summary}
                        </div>
                        {vt.prescription && vt.prescription.length > 0 && (
                          <div style={{ marginTop: '4px', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                              <Pill size={12} /> Prescribed Medications:
                            </strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {vt.prescription.map((p, i) => (
                                <div key={i} style={{ color: '#1e293b' }}>
                                  • <strong>{p.medication}</strong> {p.dosage} — {p.frequency} ({p.duration})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: LAB REPORTS & EDITABLE DOCTOR NOTES */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* LAB REPORTS & PDF PREVIEW */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0a2540', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="#059669" /> Pathology & Diagnostic Lab Reports
                  </h3>

                  {selectedRecord.labReports.length === 0 ? (
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No lab reports uploaded.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedRecord.labReports.map(lab => (
                        <div 
                          key={lab.id}
                          style={{
                            padding: '12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0a2540' }}>{lab.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lab.date} • {lab.issuedBy}</div>
                          </div>
                          <button
                            onClick={() => setPreviewPdf(lab)}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '4px' }}
                          >
                            <Eye size={14} /> View PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* EDITABLE DOCTOR CLINICAL OBSERVATION NOTES */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0a2540', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Edit3 size={18} color="#d97706" /> Doctor Clinical Notes
                    </h3>

                    {!isEditingNotes ? (
                      <button
                        onClick={() => setIsEditingNotes(true)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Edit3 size={14} /> Edit Notes
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveNotes}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: '#059669' }}
                      >
                        <Save size={14} /> Save Notes
                      </button>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>
                      PUBLIC NOTE (Patient Can View in Portal)
                    </label>
                    <textarea
                      rows={2}
                      disabled={!isEditingNotes}
                      value={notesPublic}
                      onChange={(e) => setNotesPublic(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: isEditingNotes ? '#ffffff' : '#f8fafc',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '700' }}>
                      PRIVATE CLINICAL NOTE (Doctor Only)
                    </label>
                    <textarea
                      rows={2}
                      disabled={!isEditingNotes}
                      value={notesPrivate}
                      onChange={(e) => setNotesPrivate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: isEditingNotes ? '#ffffff' : '#f8fafc',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}
      </div>

      {/* PDF LAB REPORT PREVIEW MODAL */}
      <Modal
        isOpen={!!previewPdf}
        onClose={() => setPreviewPdf(null)}
        title={`Diagnostic Document Preview — ${previewPdf?.title}`}
        maxWidth="600px"
      >
        {previewPdf && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#0a2540', color: '#ffffff', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700' }}>METROPOLITAN PATHOLOGY LAB REPORT</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '4px' }}>{previewPdf.title}</h3>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                Document ID: {previewPdf.id} • Issued: {previewPdf.date} • Format: {previewPdf.fileType} ({previewPdf.fileSize})
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0a2540', marginBottom: '8px' }}>Executive Diagnostic Findings:</h4>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
                {previewPdf.summary}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPreviewPdf(null)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => showToast(`Simulated download of ${previewPdf.title}.pdf complete!`, 'success')}
              >
                <Download size={16} /> Download PDF File
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* RECORD / UPDATE VITALS MODAL */}
      <Modal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        title={`Record Clinical Vitals — ${selectedPatient?.name}`}
        maxWidth="560px"
      >
        <form onSubmit={handleSaveVitalsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '10px 14px', borderRadius: '8px' }}>
            Documenting vitals directly for <strong>{selectedPatient?.name} (ID: {selectedPatientId})</strong>. These vitals will update the EHR and reflect immediately in the patient's records portal.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
                Blood Pressure (mmHg)
              </label>
              <input
                type="text"
                placeholder="e.g. 120/80"
                value={vitalsBp}
                onChange={(e) => setVitalsBp(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                placeholder="e.g. 72"
                value={vitalsHr}
                onChange={(e) => setVitalsHr(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
                Oxygen Saturation SpO2 (%)
              </label>
              <input
                type="number"
                placeholder="e.g. 98"
                value={vitalsSpo2}
                onChange={(e) => setVitalsSpo2(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
                Body Temp (°F)
              </label>
              <input
                type="text"
                placeholder="e.g. 98.6"
                value={vitalsTemp}
                onChange={(e) => setVitalsTemp(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 68"
                value={vitalsWeight}
                onChange={(e) => setVitalsWeight(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
                Height (cm)
              </label>
              <input
                type="number"
                placeholder="e.g. 172"
                value={vitalsHeight}
                onChange={(e) => setVitalsHeight(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          {vitalsWeight && vitalsHeight && (
            <div style={{ backgroundColor: '#DCFCE7', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#166534', fontWeight: '600' }}>
              Calculated BMI: {(parseFloat(vitalsWeight) / ((parseFloat(vitalsHeight) / 100) ** 2)).toFixed(1)}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
              Examination Setting / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Routine In-Clinic OPD Check"
              value={vitalsNotes}
              onChange={(e) => setVitalsNotes(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsVitalsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: '#059669', color: '#ffffff' }}
            >
              <Save size={15} /> Save & Record Vitals
            </button>
          </div>
        </form>
      </Modal>

      {/* NEW CLINICAL VISIT CONSULTATION & PRESCRIPTION MODAL */}
      <Modal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        title={`New Consultation & Prescription — ${selectedPatient?.name}`}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveVisitSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
                Visit Date
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
                Clinical Diagnosis / Reason for Visit *
              </label>
              <input
                type="text"
                placeholder="e.g. I10 - Essential Primary Hypertension or Acute Pharyngitis"
                value={visitDiagnosis}
                onChange={(e) => setVisitDiagnosis(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0a2540' }}>
              Clinical Summary / Examination Findings
            </label>
            <textarea
              rows={3}
              placeholder="Document physical exam results, symptoms, severity, and advice given to the patient..."
              value={visitSummary}
              onChange={(e) => setVisitSummary(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            />
          </div>

          {/* PRESCRIPTION BUILDER */}
          <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Pill size={16} /> Prescribed Medications (Optional)
              </div>
              <button
                type="button"
                onClick={handleAddPrescriptionRow}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', gap: '4px' }}
              >
                <Plus size={12} /> Add Drug
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {prescriptions.map((rx, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.8fr 1.2fr 34px', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Medication name (e.g. Lisinopril)"
                    value={rx.medication}
                    onChange={(e) => handlePrescriptionChange(idx, 'medication', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 10mg)"
                    value={rx.dosage}
                    onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g. Once daily morning)"
                    value={rx.frequency}
                    onChange={(e) => handlePrescriptionChange(idx, 'frequency', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 30 Days)"
                    value={rx.duration}
                    onChange={(e) => handlePrescriptionChange(idx, 'duration', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                  {prescriptions.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemovePrescriptionRow(idx)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Remove medication"
                    >
                      <Trash2 size={13} />
                    </button>
                  ) : <div />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsVisitModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: '#0f62fe', color: '#ffffff' }}
            >
              <Save size={15} /> Save Consultation Record
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
