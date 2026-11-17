import React, { useState } from 'react';
import { Stethoscope, HeartPulse, Sparkles, Activity, ArrowRight, Check, ShieldCheck, Microscope } from 'lucide-react';
import { Modal } from '../common/Modal';

export const LandingDepartments = ({ onSelectDepartment }) => {
  const [selectedDeptModal, setSelectedDeptModal] = useState(null);

  const departments = [
    {
      id: 'gen-med',
      name: 'General & Internal Medicine',
      badge: 'Primary Care & Prevention',
      icon: Activity,
      lead: 'Dr. Ananya Sharma (MD AIIMS)',
      description: 'Comprehensive adult health assessments, acute illness management, and long-term metabolic care.',
      services: ['Executive Health Checks', 'Diabetes & Hypertension', 'Fever & Infection Triage', 'Geriatric Health'],
      details: [
        'Preventative wellness checks and bi-annual executive health profiles',
        'Hypertension, lipid disorder, and type-2 diabetes therapeutic plans',
        'Infectious disease recovery, fever workups, and seasonal immunization',
        'Coordination with specialist consultants for multi-system conditions'
      ]
    },
    {
      id: 'cardiology',
      name: 'Cardiology & Preventive Heart Care',
      badge: 'Cardiovascular Diagnostics',
      icon: HeartPulse,
      lead: 'Dr. Rohan Mehta (DM PGIMER)',
      description: 'Non-invasive cardiac evaluations, digital 12-lead ECG monitoring, and preventive cardiovascular wellness.',
      services: ['12-Lead Digital ECG', 'Hypertension Profiling', 'Lipid Management', 'Arrhythmia Screening'],
      details: [
        '12-lead digital electrocardiogram (ECG) and baseline arrhythmia detection',
        'Post-infarction outpatient follow-up and chronic hypertension stabilization',
        'Cardiovascular risk stratification and lifestyle modification plans',
        'Lipid profiling and preventive dietary protocols'
      ]
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics & Adolescent Care',
      badge: 'Infant to Young Adult',
      icon: Sparkles,
      lead: 'Dr. Meera Krishnan (MD CMC Vellore)',
      description: 'Gentle, compassionate wellness care from infant milestones through adolescent developmental health.',
      services: ['Newborn Assessments', 'National Immunization', 'Pediatric Asthma Care', 'Growth Milestone Tracking'],
      details: [
        'Newborn screening, growth chart tracking, and pediatric developmental assessments',
        'Complete childhood immunization schedule aligned with national guidelines',
        'Acute childhood infections, asthma nebulization, and seasonal allergies',
        'Nutritional guidance and adolescent preventive health counseling'
      ]
    },
    {
      id: 'diagnostics',
      name: 'Pathology & Diagnostic Laboratory',
      badge: 'NABL Certified Diagnostics',
      icon: Microscope,
      lead: 'Automated In-House Desk',
      description: 'Accredited clinical pathology, rapid hematology panels, and secure digitized laboratory reports.',
      services: ['Complete Hemogram (CBC)', 'Renal & Liver Panels', 'Thyroid & Lipids', 'Same-Day Digital PDFs'],
      details: [
        'Complete Blood Count (CBC), biochemistry, renal & hepatic panels',
        'Rapid point-of-care capillary glucose, urinalysis, and infection markers',
        'Digitally encrypted PDF reports delivered directly to your Patient Portal',
        'Direct synchronization with doctor consultation records'
      ]
    }
  ];

  return (
    <section
      id="departments"
      style={{
        padding: '88px 24px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* SECTION HEADER */}
        <div style={{ maxWidth: '680px', marginBottom: '48px' }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--primary-teal)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px'
            }}
          >
            Clinical Disciplines & Centers of Excellence
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.1rem, 3.6vw, 2.7rem)',
              lineHeight: 1.22,
              color: 'var(--deep-teal)',
              marginBottom: '14px'
            }}
          >
            Specialized departments built for comprehensive, unhurried care.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Our integrated outpatient departments ensure you receive cohesive clinical attention—from routine preventative screenings to complex multisystem condition management.
          </p>
        </div>

        {/* DEPARTMENTS 4-CARD GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.id}
                className="card-interactive"
                style={{
                  padding: '32px 26px',
                  backgroundColor: 'var(--warm-cream)',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  {/* TOP BADGE & ICON */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div className="mint-icon-box" style={{ width: '48px', height: '48px', borderRadius: '14px' }}>
                      <Icon size={24} />
                    </div>

                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        color: 'var(--primary-teal)',
                        backgroundColor: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(15, 107, 99, 0.15)'
                      }}
                    >
                      {dept.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.30rem',
                      fontWeight: '700',
                      color: 'var(--deep-teal)',
                      marginBottom: '8px'
                    }}
                  >
                    {dept.name}
                  </h3>

                  <div style={{ fontSize: '0.80rem', fontWeight: '700', color: 'var(--primary-teal)', marginBottom: '12px' }}>
                    Lead: {dept.lead}
                  </div>

                  <p
                    style={{
                      fontSize: '0.90rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '20px'
                    }}
                  >
                    {dept.description}
                  </p>

                  {/* CLINICAL SERVICE PILLS */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                    {dept.services.map((svc) => (
                      <span
                        key={svc}
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: '600',
                          color: 'var(--text-main)',
                          backgroundColor: '#ffffff',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid rgba(15, 79, 74, 0.1)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedDeptModal(dept)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: 'var(--primary-teal)',
                      fontWeight: '700',
                      fontSize: '0.86rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Clinical scope</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectDepartment(dept.name)}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: '9999px', fontSize: '0.82rem', padding: '6px 16px', fontWeight: '700' }}
                  >
                    <span>Book visit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* CLINICAL SCOPE MODAL */}
      <Modal
        isOpen={!!selectedDeptModal}
        onClose={() => setSelectedDeptModal(null)}
        title={selectedDeptModal?.name || 'Department Clinical Scope'}
        maxWidth="560px"
      >
        {selectedDeptModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="mint-icon-box" style={{ width: '38px', height: '38px' }}>
                <ShieldCheck size={20} color="var(--primary-teal)" />
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                  Supervising Consultant
                </div>
                <div style={{ fontSize: '0.94rem', fontWeight: '700', color: 'var(--deep-teal)' }}>
                  {selectedDeptModal.lead}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedDeptModal.description}
            </p>

            <div>
              <div style={{ fontSize: '0.90rem', fontWeight: '700', color: 'var(--deep-teal)', marginBottom: '12px' }}>
                Clinical Scope & Diagnostic Capabilities:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                {selectedDeptModal.details.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    <div className="mint-icon-box" style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px' }}>
                      <Check size={12} color="var(--primary-teal)" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setSelectedDeptModal(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const dept = selectedDeptModal.name;
                  setSelectedDeptModal(null);
                  onSelectDepartment(dept);
                }}
                className="btn btn-primary btn-sm"
                style={{ fontWeight: '700' }}
              >
                <span>Book consultation in {selectedDeptModal.name.split('&')[0]}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default LandingDepartments;

