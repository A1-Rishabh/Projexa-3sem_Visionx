import React, { useState, useEffect, useMemo } from 'react';
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
  Printer,
  Receipt,
  CreditCard,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  FileCheck2
} from 'lucide-react';
import { getMedicalRecords, getAppointments } from '../../services/mockDataStore';
import { Modal } from '../common/Modal';
import { ReceiptModal } from './ReceiptModal';
import { formatINR, clinic } from '../../config/clinic';

export const PatientMedicalRecords = ({ patient, showToast }) => {
  const [record, setRecord] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'visits' | 'prescriptions' | 'labs' | 'billing'
  const [previewPdf, setPreviewPdf] = useState(null);
  const [printPrescription, setPrintPrescription] = useState(null);
  const [selectedReceiptApt, setSelectedReceiptApt] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  
  // Collapsible year state for visit history
  const [expandedYears, setExpandedYears] = useState({ '2026': true });

  useEffect(() => {
    const recs = getMedicalRecords();
    setRecord(recs[patient.id] || { visitTimeline: [], labReports: [], notesPublic: '' });
    const apts = getAppointments();
    setPatientAppointments(apts.filter(a => a.patientId === patient.id));
  }, [patient.id]);

  // Group visits by Year
  const visitsByYear = useMemo(() => {
    if (!record?.visitTimeline) return {};
    const grouped = {};
    record.visitTimeline.forEach(v => {
      const year = v.date ? v.date.split('-')[0] : '2026';
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(v);
    });
    return grouped;
  }, [record]);

  const toggleYearCollapse = (year) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  if (!record) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER BANNER WITH ENCRYPTED BADGE & ALLERGIES ALERT CHIP */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-teal)', fontSize: '0.78rem', fontWeight: '800', marginBottom: '6px' }}>
            <Lock size={14} /> Confidential Encrypted Electronic Health Record (EHR)
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', fontFamily: 'Fraunces, serif' }}>
            Medical Records & Diagnostics
          </h1>
          
          {/* Patient Details & Allergy Alert Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.84rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Patient: <strong style={{ color: 'var(--text-main)' }}>{patient.name}</strong>
            </span>
            <span style={{ color: 'var(--border-color)' }}>•</span>
            
            {/* Blood Group */}
            <span style={{ backgroundColor: 'var(--mint)', color: 'var(--deep-teal)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '0.76rem' }}>
              Blood Group: {patient.bloodGroup || 'A+'}
            </span>

            {/* VISIBLE ALLERGIES ALERT CHIP (NEAR TOP) */}
            <span 
              style={{ 
                backgroundColor: '#FEE2E2', 
                border: '1px solid #FECACA', 
                color: '#DC2626', 
                padding: '2px 10px', 
                borderRadius: '6px', 
                fontWeight: '700', 
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <AlertTriangle size={13} color="#DC2626" />
              Allergies: {patient.allergies || 'Penicillin'}
            </span>
          </div>
        </div>

        {/* Short Privacy Note */}
        <div 
          style={{ 
            backgroundColor: 'var(--warm-cream)', 
            border: '1px solid var(--border-color)', 
            padding: '8px 12px', 
            borderRadius: '10px', 
            fontSize: '0.74rem', 
            color: 'var(--text-secondary)',
            maxWidth: '300px',
            lineHeight: 1.4
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: 'var(--deep-teal)', marginBottom: '2px' }}>
            <ShieldCheck size={14} color="var(--primary-teal)" /> Privacy & Compliance
          </div>
          Encrypted at rest. Visible exclusively to you and your authorized attending doctors under clinical confidentiality standards.
        </div>
      </div>

      {/* FILTER TABS (All, Visits, Prescriptions, Labs, Billing) */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          backgroundColor: '#ffffff',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {[
          { id: 'all', label: 'All Records' },
          { id: 'visits', label: 'Clinical Visits' },
          { id: 'prescriptions', label: 'Prescriptions' },
          { id: 'labs', label: 'Diagnostic Labs' },
          { id: 'billing', label: 'Billing & Receipts' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontWeight: isActive ? '700' : '600',
                fontSize: '0.84rem',
                backgroundColor: isActive ? 'var(--primary-teal)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* VITALS SUMMARY CARDS WITH MEASUREMENT DATE & TREND ARROWS */}
      {(activeTab === 'all' || activeTab === 'visits') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          
          {/* Blood Pressure */}
          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={16} color="#DC2626" /> Blood Pressure
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                Stable →
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px', fontFamily: 'Fraunces, serif' }}>
              {patient.vitals?.bloodPressure || '120/80 mmHg'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Updated: 16 Sep 2026 • Routine OPD
            </div>
          </div>

          {/* Heart Rate */}
          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={16} color="var(--primary-teal)" /> Heart Rate
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                Optimal →
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px', fontFamily: 'Fraunces, serif' }}>
              {patient.vitals?.heartRate || '72 bpm'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Updated: 16 Sep 2026 • Resting ECG
            </div>
          </div>

          {/* BMI */}
          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Weight size={16} color="#059669" /> BMI Index
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                Normal →
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px', fontFamily: 'Fraunces, serif' }}>
              {patient.vitals?.bmi || '23.4 (Normal)'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Weight: 68 kg • Height: 172 cm
            </div>
          </div>

          {/* SpO2 */}
          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Thermometer size={16} color="#D97706" /> Oxygen Saturation
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                Room air →
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px', fontFamily: 'Fraunces, serif' }}>
              {patient.vitals?.spO2 || '99%'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Updated: 16 Sep 2026 • Pulse Oximetry
            </div>
          </div>

        </div>
      )}

      {/* TWO COLUMN GRID: VISITS (GROUPED BY YEAR) & LABS/RECOMMENDATIONS */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: (activeTab === 'all' || activeTab === 'visits' || activeTab === 'prescriptions') ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr', 
          gap: '20px' 
        }}
      >
        
        {/* VISIT TIMELINE & PRESCRIPTIONS (GROUPED BY YEAR, COLLAPSIBLE) */}
        {(activeTab === 'all' || activeTab === 'visits' || activeTab === 'prescriptions') && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Fraunces, serif' }}>
                <Calendar size={18} color="var(--primary-teal)" /> Clinical Visit Timeline
              </h2>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Grouped by Year
              </span>
            </div>

            {Object.keys(visitsByYear).length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px', fontSize: '0.85rem' }}>
                No past clinical consultation records found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(visitsByYear).map(([year, visits]) => {
                  const isExpanded = expandedYears[year] !== false; // default true

                  return (
                    <div key={year} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                      {/* Year Accordion Header */}
                      <button
                        type="button"
                        onClick={() => toggleYearCollapse(year)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          backgroundColor: 'var(--warm-cream)',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '0.86rem',
                          color: 'var(--deep-teal)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>Year {year}</span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                            ({visits.length} {visits.length === 1 ? 'consultation' : 'consultations'})
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {/* Collapsible Visits List */}
                      {isExpanded && (
                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#ffffff' }}>
                          {visits.map((vt) => (
                            <div 
                              key={vt.id}
                              style={{
                                backgroundColor: '#F8FAFC',
                                borderRadius: '10px',
                                padding: '14px',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary-teal)' }}>
                                <span>{vt.date}</span>
                                <span>Attended by {vt.doctorName}</span>
                              </div>

                              <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.92rem' }}>
                                Diagnosis: {vt.diagnosis}
                              </div>

                              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                                {vt.summary}
                              </p>

                              {/* Prescriptions */}
                              {vt.prescription && vt.prescription.length > 0 && (
                                <div style={{ marginTop: '4px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <Pill size={12} /> RX PRESCRIPTION
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setPrintPrescription(vt)}
                                      style={{ fontSize: '0.74rem', color: 'var(--primary-teal)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                      <Printer size={12} /> Print Slip
                                    </button>
                                  </div>

                                  {vt.prescription.map((p, idx) => (
                                    <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: '600', marginBottom: '2px' }}>
                                      • {p.medication} ({p.dosage}) — {p.frequency} ({p.duration})
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* RIGHT COLUMN: LAB REPORTS & PHYSICIAN RECOMMENDATIONS */}
        {(activeTab === 'all' || activeTab === 'labs') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* LAB REPORTS */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Fraunces, serif' }}>
                  <FileText size={18} color="var(--primary-teal)" /> Pathology & Diagnostics
                </h2>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Verified lab PDFs
                </span>
              </div>

              {record.labReports.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No lab reports uploaded.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {record.labReports.map(lab => (
                    <div
                      key={lab.id}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)' }}>{lab.title}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Issued: {lab.date} • {lab.issuedBy}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary-teal)', fontWeight: '600', marginTop: '2px' }}>{lab.fileSize} • Verified Digital Result</div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewPdf(lab)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', minHeight: '32px', fontSize: '0.76rem' }}
                        >
                          <Eye size={13} /> View PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (showToast) showToast(`Downloaded ${lab.title}.pdf`, 'success');
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', minHeight: '32px', fontSize: '0.76rem' }}
                          title="Download PDF report"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RENAMED: ATTENDING PHYSICIAN HEALTHCARE GUIDANCE & RECOMMENDATIONS */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={18} color="var(--primary-teal)" />
                <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
                  Attending Physician Clinical Guidance
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#F0FDF4', borderLeft: '3px solid #16A34A', fontSize: '0.82rem', color: '#166534', lineHeight: 1.45 }}>
                  <strong>Cardiovascular Care:</strong> Maintain prescribed low-sodium diet (&lt; 2g sodium/day). Monitor morning blood pressure once weekly.
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--warm-cream)', borderLeft: '3px solid var(--primary-teal)', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  <strong>Physical Activity:</strong> 30 minutes of brisk aerobic walking 5 days per week. Avoid heavy weight straining until next review.
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#EFF6FF', borderLeft: '3px solid #2563EB', fontSize: '0.82rem', color: '#1E40AF', lineHeight: 1.45 }}>
                  <strong>Follow-Up Protocol:</strong> Fasting lipid profile re-check recommended in 6 months with Dr. Sarah Jenkins.
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* BILLING & PAYMENT HISTORY SECTION */}
      {(activeTab === 'all' || activeTab === 'billing') && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Fraunces, serif' }}>
              <CreditCard size={18} color="var(--primary-teal)" /> Consultation Billing & Payment History
            </h2>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              Official GST-compliant medical invoices
            </span>
          </div>

          {patientAppointments.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px', fontSize: '0.85rem' }}>
              No consultation billing records found.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 8px' }}>Date</th>
                    <th style={{ padding: '10px 8px' }}>Physician / Chamber</th>
                    <th style={{ padding: '10px 8px' }}>Fee Amount</th>
                    <th style={{ padding: '10px 8px' }}>Payment Method</th>
                    <th style={{ padding: '10px 8px' }}>Status</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right' }}>Tax Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {patientAppointments.map((apt) => {
                    const isPaid = apt.paymentStatus === 'Paid';
                    const fee = apt.fee || 1200;
                    return (
                      <tr key={apt.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 8px', fontWeight: '600', color: 'var(--text-main)' }}>
                          {apt.date}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{apt.doctorName}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{apt.room}</div>
                        </td>
                        <td style={{ padding: '12px 8px', fontWeight: '700', color: 'var(--primary-teal)' }}>
                          {formatINR(fee)}
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                          {apt.paymentMethod || 'Pay at clinic'}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: isPaid ? '#DCFCE7' : '#FEF3C7',
                              color: isPaid ? '#15803D' : '#92400E'
                            }}
                          >
                            {isPaid ? 'PAID' : 'PAY AT CLINIC'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptApt(apt)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.76rem', minHeight: '32px' }}
                          >
                            <Receipt size={13} color="var(--primary-teal)" />
                            <span>View Receipt</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RECEIPT MODAL */}
      {selectedReceiptApt && (
        <ReceiptModal
          isOpen={!!selectedReceiptApt}
          onClose={() => setSelectedReceiptApt(null)}
          appointment={selectedReceiptApt}
          patient={patient}
          showToast={showToast}
        />
      )}

      {/* LAB REPORT PDF PREVIEW MODAL */}
      <Modal
        isOpen={!!previewPdf}
        onClose={() => setPreviewPdf(null)}
        title={`Pathology Document — ${previewPdf?.title}`}
        maxWidth="580px"
      >
        {previewPdf && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: 'var(--deep-teal)', color: '#ffffff', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--mint)', fontWeight: '700' }}>METROPOLITAN PATHOLOGY LAB REPORT</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '4px', fontFamily: 'Fraunces, serif' }}>{previewPdf.title}</h3>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
                Document ID: {previewPdf.id} • Date: {previewPdf.date} • {previewPdf.fileType} ({previewPdf.fileSize})
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--warm-cream)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>Test Result Summary:</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {previewPdf.summary}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setPreviewPdf(null)}
              >
                Close
              </button>
              <button 
                type="button"
                className="btn btn-primary" 
                onClick={() => showToast(`Downloaded copy of ${previewPdf.title}.pdf`, 'success')}
              >
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '2px solid var(--primary-teal)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary-teal)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--deep-teal)', fontFamily: 'Fraunces, serif', margin: '0 0 2px 0' }}>Jivaka Clinic</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{clinic.branches[0]?.address} • Tel: {clinic.branches[0]?.phone}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                <strong>Rx Slip #{printPrescription.id}</strong>
                <div>Date: {printPrescription.date}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>Patient: <strong>{patient.name}</strong> ({patient.bloodGroup})</div>
              <div>Attending Physician: <strong>{printPrescription.doctorName}</strong></div>
              <div style={{ gridColumn: 'span 2' }}>Diagnosis: <strong>{printPrescription.diagnosis}</strong></div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#16A34A', marginBottom: '8px' }}>
                Rx Prescribed Medications:
              </h4>
              {printPrescription.prescription.map((p, idx) => (
                <div key={idx} style={{ fontSize: '0.84rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                  <strong>{idx + 1}. {p.medication}</strong> ({p.dosage}) — Take {p.frequency} for {p.duration}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => setPrintPrescription(null)}
              >
                Close
              </button>
              <button 
                type="button"
                className="btn btn-primary" 
                onClick={() => window.print()}
              >
                <Printer size={16} /> Print Prescription Slip
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default PatientMedicalRecords;
