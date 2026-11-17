import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Activity, 
  Heart, 
  Thermometer, 
  Weight, 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Pill, 
  CheckCircle2,
  Printer
} from 'lucide-react';
import { getMedicalRecords } from '../../services/mockDataStore';
import { Modal } from '../common/Modal';

export const PatientMedicalRecords = ({ patient, showToast }) => {
  const [record, setRecord] = useState(null);
  const [previewPdf, setPreviewPdf] = useState(null);
  const [printPrescription, setPrintPrescription] = useState(null);

  useEffect(() => {
    const recs = getMedicalRecords();
    setRecord(recs[patient.id] || { visitTimeline: [], labReports: [], notesPublic: '' });
  }, [patient.id]);

  if (!record) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* HEADER BANNER */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.8rem', fontWeight: '800', marginBottom: '4px' }}>
            <Lock size={14} /> Personal Encrypted Health Record
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0a2540' }}>
            Medical History & Diagnostic Reports
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Patient: <strong>{patient.name}</strong> • Blood Type: <strong>{patient.bloodGroup}</strong> • Allergies: <strong style={{ color: '#dc2626' }}>{patient.allergies}</strong>
          </p>
        </div>
      </div>

      {/* VITALS SUMMARY CARDS */}
      {patient.vitals && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={16} color="#ef4444" /> Blood Pressure
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0a2540', marginTop: '6px' }}>
              {patient.vitals.bloodPressure}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Heart size={16} color="#0f62fe" /> Heart Rate
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0a2540', marginTop: '6px' }}>
              {patient.vitals.heartRate}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Weight size={16} color="#059669" /> BMI Index
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0a2540', marginTop: '6px' }}>
              {patient.vitals.bmi}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Thermometer size={16} color="#d97706" /> Oxygen (SpO2)
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0a2540', marginTop: '6px' }}>
              {patient.vitals.spO2}
            </div>
          </div>

        </div>
      )}

      {/* TWO COLUMNS: VISIT TIMELINE (LEFT) & LAB REPORTS + PUBLISHED NOTES (RIGHT) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* VISIT TIMELINE & PRESCRIPTION CARDS */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0a2540', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#0f62fe" /> Clinical Visit History
          </h3>

          {record.visitTimeline.length === 0 ? (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '24px', fontSize: '0.85rem' }}>
              No past clinical consultation records found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {record.visitTimeline.map((vt) => (
                <div 
                  key={vt.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: '#0f62fe' }}>
                    <span>{vt.date}</span>
                    <span>Attended by {vt.doctorName}</span>
                  </div>

                  <div style={{ fontWeight: '800', color: '#0a2540', fontSize: '0.95rem' }}>
                    Diagnosis: {vt.diagnosis}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                    {vt.summary}
                  </p>

                  {vt.prescription && vt.prescription.length > 0 && (
                    <div style={{ marginTop: '6px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Pill size={12} /> PRESCRIPTION SLIP
                        </span>
                        <button
                          onClick={() => setPrintPrescription(vt)}
                          style={{ fontSize: '0.75rem', color: '#0f62fe', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Printer size={12} /> Print Slip
                        </button>
                      </div>

                      {vt.prescription.map((p, idx) => (
                        <div key={idx} style={{ fontSize: '0.8rem', color: '#16191f', fontWeight: '600' }}>
                          • {p.medication} ({p.dosage}) — {p.frequency} for {p.duration}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LAB REPORTS & PUBLISHED DOCTOR NOTES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* LAB REPORTS */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0a2540', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#059669" /> Downloadable Lab & Pathology Reports
            </h3>

            {record.labReports.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No lab reports uploaded.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {record.labReports.map(lab => (
                  <div
                    key={lab.id}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0a2540' }}>{lab.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Issued: {lab.date} • {lab.issuedBy}</div>
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

          {/* PUBLISHED DOCTOR NOTES */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0a2540', marginBottom: '12px' }}>
              Doctor Healthcare Recommendations
            </h3>

            {record.notesPublic ? (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '12px', fontSize: '0.875rem', color: '#166534', lineHeight: 1.6 }}>
                {record.notesPublic}
              </div>
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                No public healthcare notes currently published by your attending doctor.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* LAB REPORT PDF PREVIEW MODAL */}
      <Modal
        isOpen={!!previewPdf}
        onClose={() => setPreviewPdf(null)}
        title={`Pathology Document — ${previewPdf?.title}`}
        maxWidth="580px"
      >
        {previewPdf && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#0a2540', color: '#ffffff', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700' }}>METROPOLITAN PATHOLOGY LAB REPORT</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '4px' }}>{previewPdf.title}</h3>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                Document ID: {previewPdf.id} • Date: {previewPdf.date} • {previewPdf.fileType} ({previewPdf.fileSize})
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0a2540', marginBottom: '6px' }}>Test Result Summary:</h4>
              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>
                {previewPdf.summary}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setPreviewPdf(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => showToast(`Simulated download of ${previewPdf.title}.pdf complete!`, 'success')}>
                <Download size={16} /> Download Copy
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* PRINTABLE PRESCRIPTION SLIP MODAL */}
      <Modal
        isOpen={!!printPrescription}
        onClose={() => setPrintPrescription(null)}
        title="Official Jivaka Clinic Prescription Slip"
        maxWidth="520px"
      >
        {printPrescription && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '2px solid #0F4F4A', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0F4F4A', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F4F4A', fontFamily: 'var(--font-heading)' }}>Jivaka Clinic</h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>450 Health Sciences Pkwy • Tel: (555) 924-4370</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                <strong>Rx Slip # {printPrescription.id}</strong>
                <div>Date: {printPrescription.date}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#0a2540' }}>
              <div>Patient: <strong>{patient.name}</strong> ({patient.age} yrs / {patient.gender})</div>
              <div>Attending Physician: <strong>{printPrescription.doctorName}</strong></div>
              <div>Diagnosis: <strong>{printPrescription.diagnosis}</strong></div>
            </div>

            <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#059669', marginBottom: '8px' }}>
                Rx Prescribed Medications:
              </h4>
              {printPrescription.prescription.map((p, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
                  <strong>{idx + 1}. {p.medication}</strong> ({p.dosage}) — Take {p.frequency} for {p.duration}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setPrintPrescription(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={16} /> Print Prescription Slip
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
