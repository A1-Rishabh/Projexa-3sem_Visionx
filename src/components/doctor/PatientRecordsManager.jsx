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
  Weight
} from 'lucide-react';
import { 
  getPatients, 
  getMedicalRecords, 
  updatePatientRecord, 
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

  useEffect(() => {
    loadData();
  }, [doctor.id]);

  const loadData = () => {
    const allPats = getPatients();
    setPatients(allPats);
    const recs = getMedicalRecords();
    setMedicalRecords(recs);

    if (recs['P-1001']) {
      setNotesPublic(recs['P-1001'].notesPublic || '');
      setNotesPrivate(recs['P-1001'].notesPrivate || '');
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
    const updated = updatePatientRecord(selectedPatientId, {
      notesPublic,
      notesPrivate
    }, doctor.id);

    setMedicalRecords(getMedicalRecords());
    setIsEditingNotes(false);
    showToast('Clinical notes updated & audit log timestamp recorded', 'success');
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const selectedRecord = medicalRecords[selectedPatientId] || { visitTimeline: [], labReports: [] };

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

            {/* VITALS DASHBOARD GRID */}
            {selectedPatient.vitals && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                
                <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={14} color="#ef4444" /> Blood Pressure
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0a2540', marginTop: '4px' }}>
                    {selectedPatient.vitals.bloodPressure}
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={14} color="#0f62fe" /> Heart Rate
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0a2540', marginTop: '4px' }}>
                    {selectedPatient.vitals.heartRate}
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Weight size={14} color="#059669" /> BMI Index
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0a2540', marginTop: '4px' }}>
                    {selectedPatient.vitals.bmi}
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Thermometer size={14} color="#d97706" /> Oxygen (SpO2)
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0a2540', marginTop: '4px' }}>
                    {selectedPatient.vitals.spO2}
                  </div>
                </div>

              </div>
            )}

            {/* TWO COLUMNS: TIMELINE (LEFT) & NOTES + PDF LABS (RIGHT) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* CHRONOLOGICAL VISIT TIMELINE */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0a2540', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="#0f62fe" /> Visit History & Diagnoses
                </h3>

                {selectedRecord.visitTimeline.length === 0 ? (
                  <div style={{ padding: '20px', color: '#64748b', textAlign: 'center', fontSize: '0.85rem' }}>
                    No recorded prior clinical visits.
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
                        {vt.prescription && (
                          <div style={{ marginTop: '4px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.75rem' }}>
                            <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}><Pill size={12} /> Prescribed:</strong>
                            {vt.prescription.map((p, i) => (
                              <div key={i}>{p.medication} {p.dosage} - {p.frequency} ({p.duration})</div>
                            ))}
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

    </div>
  );
};
