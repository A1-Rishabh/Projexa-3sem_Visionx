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
  addPatientLabReport,
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

  // Add Diagnostic Lab Report Modal State
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [labTitle, setLabTitle] = useState('');
  const [labDate, setLabDate] = useState(new Date().toISOString().split('T')[0]);
  const [labSummary, setLabSummary] = useState('');
  const [labCategory, setLabCategory] = useState('Complete Blood Count (CBC)');

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

  // Open Lab Report Modal
  const handleOpenLabModal = () => {
    setLabTitle('Complete Blood Count (CBC) with Platelets');
    setLabDate(new Date().toISOString().split('T')[0]);
    setLabSummary('Hemoglobin, WBC count, and platelet parameters reviewed. Values within physiological baseline.');
    setLabCategory('Complete Blood Count (CBC)');
    setIsLabModalOpen(true);
  };

  // Save Lab Report Submission
  const handleSaveLabSubmit = (e) => {
    e.preventDefault();
    if (!labTitle.trim()) {
      showToast('Please enter the report title.', 'error');
      return;
    }

    addPatientLabReport(selectedPatientId, {
      title: labTitle.trim(),
      date: labDate,
      summary: labSummary.trim() || 'Laboratory diagnostic evaluation recorded.',
      fileType: 'PDF',
      fileSize: '1.2 MB'
    }, doctor.id, doctor.name);

    loadData();
    setIsLabModalOpen(false);
    showToast(`Diagnostic lab report recorded for ${selectedPatient?.name || selectedPatientId}`, 'success');
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
          backgroundColor: 'var(--deep-teal)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171' }}>
            <Lock size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', fontFamily: 'Fraunces, serif', margin: 0, color: '#ffffff' }}>
              RBAC Restricted Zone — Patient Clinical Files
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
              Protected under Jeevak Clinic Data Privacy Policy • All record accesses are immutably logged
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
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                transition: 'all 0.15s ease',
                backgroundColor: selectedPatientId === p.id ? 'var(--mint)' : '#ffffff',
                border: selectedPatientId === p.id ? '1.5px solid var(--primary-teal)' : '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'Fraunces, serif' }}>{p.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                <span>ID: {p.id}</span>
                <span style={{ fontWeight: '700', color: 'var(--primary-teal)' }}>{p.bloodGroup}</span>
              </div>
            </div>
          ))}
        </div>

        {/* SELECTED PATIENT DETAIL PANEL */}
        {selectedPatient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* PATIENT DEMOGRAPHICS BAR & AUDIT LINE */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', marginBottom: '2px' }}>
                    {selectedPatient.name}
                  </h2>
                  
                  {/* ALWAYS VISIBLE AUDIT TIMESTAMP LINE */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <Clock size={14} /> Last viewed by {selectedRecord.lastViewedBy || `Doctor ${doctor.id}`} at {selectedRecord.lastViewedTime || 'Just Now'}
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    <span>Age: <strong style={{ color: 'var(--text-main)' }}>{selectedPatient.age} Yrs ({selectedPatient.gender})</strong></span>
                    <span>Blood Type: <strong style={{ color: 'var(--text-main)' }}>{selectedPatient.bloodGroup}</strong></span>
                    <span>Allergies: <strong style={{ color: '#dc2626' }}>{selectedPatient.allergies}</strong></span>
                    <span>Contact: <strong style={{ color: 'var(--text-main)' }}>{selectedPatient.phone}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* VITALS DASHBOARD & UPDATER */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--primary-teal)" />
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', margin: 0 }}>
                    Clinical Examination Vitals
                  </h3>
                  {currentVitals?.recordedDate && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', backgroundColor: 'var(--warm-cream)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '4px' }}>
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
                  <Edit3 size={13} color="var(--primary-teal)" />
                  <span>{currentVitals?.bloodPressure ? 'Update Vitals' : 'Record Vitals'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                
                <div style={{ backgroundColor: 'var(--warm-cream)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={13} color="var(--primary-teal)" /> Blood Pressure
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: currentVitals?.bloodPressure ? 'var(--text-main)' : '#94a3b8', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
                    {currentVitals?.bloodPressure || '-- / -- mmHg'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentVitals?.bloodPressure ? 'Clinical measurement' : 'Awaiting examination'}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--warm-cream)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={13} color="var(--primary-teal)" /> Heart Rate
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: currentVitals?.heartRate ? 'var(--text-main)' : '#94a3b8', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
                    {currentVitals?.heartRate ? (String(currentVitals.heartRate).includes('bpm') ? currentVitals.heartRate : `${currentVitals.heartRate} bpm`) : '-- bpm'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentVitals?.heartRate ? 'Resting rate' : 'Awaiting examination'}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--warm-cream)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Weight size={13} color="#16A34A" /> BMI / Weight
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: (currentVitals?.bmi || currentVitals?.weight) ? 'var(--text-main)' : '#94a3b8', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
                    {currentVitals?.bmi || (currentVitals?.weight ? currentVitals.weight : '--')}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentVitals?.weight || currentVitals?.height ? `Wt: ${currentVitals.weight || '--'} • Ht: ${currentVitals.height || '--'}` : 'Not documented'}
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--warm-cream)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Thermometer size={13} color="#D97706" /> Oxygen (SpO2)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: currentVitals?.spO2 ? 'var(--text-main)' : '#94a3b8', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>
                    {currentVitals?.spO2 ? (String(currentVitals.spO2).includes('%') ? currentVitals.spO2 : `${currentVitals.spO2}%`) : '--%'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentVitals?.temperature ? `Temp: ${currentVitals.temperature}` : 'Pulse oximetry'}
                  </div>
                </div>

              </div>
            </div>

            {/* TWO COLUMNS: TIMELINE (LEFT) & NOTES + PDF LABS (RIGHT) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px' }}>
              
              {/* CHRONOLOGICAL VISIT TIMELINE */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} color="var(--primary-teal)" /> Visit History & Consultations
                  </h3>
                  <button
                    type="button"
                    onClick={handleOpenVisitModal}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.78rem', gap: '6px' }}
                  >
                    <Plus size={14} /> New Consultation Entry
                  </button>
                </div>

                {selectedRecord.visitTimeline.length === 0 ? (
                  <div style={{ padding: '30px 20px', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.85rem', backgroundColor: 'var(--warm-cream)', borderRadius: '10px', border: '1px dashed var(--border-color)' }}>
                    <div>No recorded prior clinical visits on file for this patient.</div>
                    <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Click "+ New Consultation Entry" above to record today's examination, diagnosis, and prescription.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedRecord.visitTimeline.map((vt) => (
                      <div 
                        key={vt.id}
                        style={{
                          borderLeft: '3px solid var(--primary-teal)',
                          paddingLeft: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-teal)' }}>
                          {vt.date} • Attended by {vt.doctorName}
                        </div>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'Fraunces, serif' }}>
                          {vt.diagnosis}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {vt.summary}
                        </div>
                        {vt.prescription && vt.prescription.length > 0 && (
                          <div style={{ marginTop: '4px', padding: '8px 12px', backgroundColor: 'var(--warm-cream)', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                            <strong style={{ color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                              <Pill size={12} /> Prescribed Medications:
                            </strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {vt.prescription.map((p, i) => (
                                <div key={i} style={{ color: 'var(--text-main)' }}>
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
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <FileText size={18} color="var(--primary-teal)" /> Pathology & Diagnostic Lab Reports
                    </h3>
                    <button
                      type="button"
                      onClick={handleOpenLabModal}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '6px', fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      <Plus size={13} /> Add Report
                    </button>
                  </div>

                  {selectedRecord.labReports.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No lab reports uploaded.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedRecord.labReports.map(lab => (
                        <div 
                          key={lab.id}
                          style={{
                            padding: '12px',
                            backgroundColor: 'var(--warm-cream)',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>{lab.title}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{lab.date} • {lab.issuedBy}</div>
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
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <Edit3 size={18} color="var(--warm-accent)" /> Doctor Clinical Notes
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
                      >
                        <Save size={14} /> Save Notes
                      </button>
                    )}
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.74rem', color: 'var(--primary-teal)', fontWeight: '700' }}>
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
                        border: '1px solid var(--border-color)',
                        backgroundColor: isEditingNotes ? '#ffffff' : 'var(--warm-cream)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.74rem', color: '#DC2626', fontWeight: '700' }}>
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
                        border: '1px solid var(--border-color)',
                        backgroundColor: isEditingNotes ? '#ffffff' : 'var(--warm-cream)',
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
            <div style={{ backgroundColor: 'var(--deep-teal)', color: '#ffffff', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--warm-accent)', fontWeight: '700' }}>JEEVAK CLINIC DIAGNOSTIC REPORT</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'Fraunces, serif', marginTop: '4px' }}>{previewPdf.title}</h3>
              <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '4px' }}>
                Document ID: {previewPdf.id} • Issued: {previewPdf.date} • Format: {previewPdf.fileType} ({previewPdf.fileSize})
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--warm-cream)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', marginBottom: '8px' }}>Executive Diagnostic Findings:</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
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
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'var(--warm-cream)', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px' }}>
            Documenting vitals directly for <strong>{selectedPatient?.name} (ID: {selectedPatientId})</strong>. These vitals will update the EHR and reflect immediately in the patient's records portal.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Blood Pressure (mmHg)
              </label>
              <input
                type="text"
                placeholder="e.g. 120/80"
                value={vitalsBp}
                onChange={(e) => setVitalsBp(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                placeholder="e.g. 72"
                value={vitalsHr}
                onChange={(e) => setVitalsHr(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Oxygen Saturation SpO2 (%)
              </label>
              <input
                type="number"
                placeholder="e.g. 98"
                value={vitalsSpo2}
                onChange={(e) => setVitalsSpo2(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Body Temp (°F)
              </label>
              <input
                type="text"
                placeholder="e.g. 98.6"
                value={vitalsTemp}
                onChange={(e) => setVitalsTemp(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 68"
                value={vitalsWeight}
                onChange={(e) => setVitalsWeight(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Height (cm)
              </label>
              <input
                type="number"
                placeholder="e.g. 172"
                value={vitalsHeight}
                onChange={(e) => setVitalsHeight(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          {vitalsWeight && vitalsHeight && (
            <div style={{ backgroundColor: 'var(--mint)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--primary-teal)', fontWeight: '700', border: '1px solid rgba(14, 98, 83, 0.2)' }}>
              Calculated BMI: {(parseFloat(vitalsWeight) / ((parseFloat(vitalsHeight) / 100) ** 2)).toFixed(1)}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Examination Setting / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Routine In-Clinic OPD Check"
              value={vitalsNotes}
              onChange={(e) => setVitalsNotes(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
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
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Visit Date
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Clinical Diagnosis / Reason for Visit *
              </label>
              <input
                type="text"
                placeholder="e.g. I10 - Essential Primary Hypertension or Acute Pharyngitis"
                value={visitDiagnosis}
                onChange={(e) => setVisitDiagnosis(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Clinical Summary / Examination Findings
            </label>
            <textarea
              rows={3}
              placeholder="Document physical exam results, symptoms, severity, and advice given to the patient..."
              value={visitSummary}
              onChange={(e) => setVisitSummary(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
            />
          </div>

          {/* PRESCRIPTION BUILDER */}
          <div style={{ backgroundColor: 'var(--warm-cream)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 10mg)"
                    value={rx.dosage}
                    onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g. Once daily morning)"
                    value={rx.frequency}
                    onChange={(e) => handlePrescriptionChange(idx, 'frequency', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 30 Days)"
                    value={rx.duration}
                    onChange={(e) => handlePrescriptionChange(idx, 'duration', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                  />
                  {prescriptions.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemovePrescriptionRow(idx)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #FECACA', backgroundColor: '#FEE2E2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
            >
              <Save size={15} /> Save Consultation Record
            </button>
          </div>
        </form>
      </Modal>

      {/* RECORD DIAGNOSTIC LAB REPORT MODAL */}
      <Modal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        title="Issue Pathology & Diagnostic Lab Report"
        maxWidth="540px"
      >
        <form onSubmit={handleSaveLabSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'var(--warm-cream)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
            Documenting diagnostic lab report for <strong>{selectedPatient?.name} (ID: {selectedPatientId})</strong> by {doctor.name}.
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
              Test / Investigation Title *
            </label>
            <input
              type="text"
              required
              value={labTitle}
              onChange={(e) => setLabTitle(e.target.value)}
              placeholder="e.g. Complete Blood Count (CBC) with Platelets"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                Test Category
              </label>
              <select
                value={labCategory}
                onChange={(e) => {
                  setLabCategory(e.target.value);
                  setLabTitle(e.target.value);
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              >
                <option value="Complete Blood Count (CBC) with Platelets">Complete Blood Count (CBC)</option>
                <option value="Blood Glucose (Fasting & PP) + HbA1c">Blood Glucose & HbA1c</option>
                <option value="Lipid Profile & Serum Cholesterol">Lipid Profile</option>
                <option value="Routine Urine Analysis & Microscopy">Routine Urine Examination</option>
                <option value="Liver Function Test (LFT)">Liver Function Test (LFT)</option>
                <option value="Kidney Function Test (KFT / Serum Creatinine)">Kidney Function Test (KFT)</option>
                <option value="Thyroid Profile (T3, T4, TSH)">Thyroid Profile (TSH)</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                Report Issue Date
              </label>
              <input
                type="date"
                required
                value={labDate}
                onChange={(e) => setLabDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '6px', display: 'block' }}>
              Clinical Findings & Interpretation Summary *
            </label>
            <textarea
              rows={3}
              required
              value={labSummary}
              onChange={(e) => setLabSummary(e.target.value)}
              placeholder="Summary of parameters, reference values, and medical interpretation..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsLabModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save size={15} /> Save & Issue Report
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
