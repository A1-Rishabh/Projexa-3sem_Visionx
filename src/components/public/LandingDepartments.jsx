import React, { useState } from 'react';
import { Stethoscope, HeartPulse, Sparkles, Activity, ArrowRight, Check, Microscope } from 'lucide-react';
import { Modal } from '../common/Modal';

export const LandingDepartments = ({ onSelectDepartment }) => {
  const [selectedDeptModal, setSelectedDeptModal] = useState(null);

  const departments = [
    {
      id: 'gen-med',
      name: 'General Medicine & Family Practice',
      badge: 'Primary Care',
      icon: Activity,
      description: 'Adult health assessments, fever management, diabetes, blood pressure stabilization, and acute illness treatment.',
      services: ['Routine health checkups', 'Diabetes & BP care', 'Fever & infection care'],
      details: [
        'Comprehensive outpatient consultations led by Dr. Shuchi Shivangi (M.B.B.S. Hons S.I.U. Pune)',
        'Ongoing clinical monitoring for high blood pressure, diabetes, and lifestyle conditions',
        'Diagnosis and compassionate care for acute fevers, respiratory conditions, and seasonal infections',
        'Long-term family medical guidance and preventive wellness follow-ups'
      ]
    },
    {
      id: 'ob-gyn',
      name: 'Obstetrics & Gynecology (स्त्री रोग)',
      badge: "Women's Health",
      icon: Sparkles,
      description: 'Comprehensive women’s health, antenatal care, maternal wellness, and specialist consultations.',
      services: ['Antenatal checkups', "Women's health screenings", 'Maternal wellness counseling'],
      details: [
        'Dedicated women’s health clinic led by Dr. (Mrs.) Indu Kumari (M.B.B.S. L.N.M.U, DAR)',
        'Antenatal monitoring, prenatal guidance, and maternal health reviews',
        'Evaluation and care for menstrual irregularities, pelvic health, and infections',
        'Confidential, compassionate care in a supportive clinical environment'
      ]
    },
    {
      id: 'lap-surgery',
      name: 'General & Laparoscopic Surgery (लेप्रोस्कोपिक सर्जन)',
      badge: 'Surgical Consultations',
      icon: HeartPulse,
      description: 'Expert surgical evaluations, laparoscopic assessments, minor pre/post-operative care.',
      services: ['Surgical OPD evaluations', 'Laparoscopic guidance', 'Wound & healing checkups'],
      details: [
        'Expert consultations led by Dr. Surendra Kumar (M.B.B.S. Hons B.U., M.S. General Surgery Patna)',
        'Comprehensive assessment for laparoscopic and general surgical indications',
        'Pre-operative patient evaluation, diagnostic review, and clear procedural guidance',
        'Post-operative follow-up, dressing reviews, and recovery monitoring'
      ]
    },
    {
      id: 'diagnostics',
      name: 'Diagnostics & Health Sampling',
      badge: 'On-Site Testing',
      icon: Microscope,
      description: 'Routine clinical sampling, blood tests, urine analysis, and secure digital reports.',
      services: ['Blood cell counts (CBC)', 'Blood glucose & HbA1c', 'Routine urine analysis'],
      details: [
        'Routine laboratory sampling and rapid diagnostic tests on site',
        'Blood glucose, hemogram, and lipid profile screening',
        'Urine routine and microscopic examinations',
        'Secure digital PDF test records directly accessible via the patient portal'
      ]
    }
  ];

  return (
    <section
      id="departments"
      style={{
        padding: '72px 28px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* SECTION HEADER ROW WITH MEDICAL EQUIPMENT VISUAL */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '36px',
            alignItems: 'center',
            marginBottom: '44px'
          }}
          className="departments-header-row"
        >
          <div style={{ maxWidth: '640px' }}>
            <div
              style={{
                fontSize: '0.80rem',
                fontWeight: '700',
                color: 'var(--primary-teal)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '6px'
              }}
            >
              Clinical Departments
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                lineHeight: 1.22,
                fontWeight: 500,
                color: 'var(--deep-teal)',
                marginBottom: '10px'
              }}
            >
              Our core medical services.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Whether you need a routine checkup or specialized consultation, our departments provide coordinated care under one roof.
            </p>
          </div>

          {/* TOP ACCENT MEDICAL EQUIPMENT PHOTO */}
          <div
            style={{
              height: '140px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--mint-light)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=900"
              alt="Medical diagnostic instruments and clinical care equipment"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              loading="lazy"
            />
          </div>
        </div>

        {/* 4 DEPARTMENT CARDS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}
          className="departments-grid"
        >
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.id}
                className="card-interactive"
                style={{
                  padding: '26px 20px',
                  backgroundColor: 'var(--warm-cream)',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  {/* TOP BADGE & ICON */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div className="mint-icon-box" style={{ width: '42px', height: '42px', borderRadius: '12px' }}>
                      <Icon size={20} color="var(--primary-teal)" />
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: 'var(--primary-teal)',
                        backgroundColor: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        border: '1px solid rgba(15, 107, 99, 0.16)'
                      }}
                    >
                      {dept.badge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.18rem',
                      fontWeight: 600,
                      color: 'var(--deep-teal)',
                      marginBottom: '8px',
                      lineHeight: 1.3
                    }}
                  >
                    {dept.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                      marginBottom: '16px'
                    }}
                  >
                    {dept.description}
                  </p>

                  {/* CHECKLIST BULLETS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {dept.services.map((svc) => (
                      <div key={svc} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.80rem', color: 'var(--text-main)' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={10} color="var(--primary-teal)" strokeWidth={3} />
                        </div>
                        <span style={{ fontWeight: '500' }}>{svc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(15, 79, 74, 0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedDeptModal(dept)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--primary-teal)',
                      fontWeight: '600',
                      fontSize: '0.82rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <span>Learn more</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectDepartment(dept.name)}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: '9999px', fontSize: '0.80rem', padding: '6px 16px', fontWeight: '600' }}
                  >
                    <span>Book</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* LEARN MORE MODAL */}
      <Modal
        isOpen={!!selectedDeptModal}
        onClose={() => setSelectedDeptModal(null)}
        title={selectedDeptModal?.name || 'Department Details'}
        maxWidth="540px"
      >
        {selectedDeptModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedDeptModal.description}
            </p>

            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--deep-teal)', marginBottom: '10px' }}>
                Services & Clinical Capabilities:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0 }}>
                {selectedDeptModal.details.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    <div className="mint-icon-box" style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '2px' }}>
                      <Check size={11} color="var(--primary-teal)" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
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
                style={{ fontWeight: '600' }}
              >
                <span>Book visit</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default LandingDepartments;
