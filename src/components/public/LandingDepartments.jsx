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
      services: ['Routine health checkups', 'Diabetes & blood pressure care', 'Fever & infection care', 'Preventive health advice'],
      details: [
        'Comprehensive outpatient consultations led by Dr. Shuchi Shivangi (MBBS Hons, DMC Reg. 125003)',
        'Ongoing clinical monitoring for high blood pressure, diabetes, and lifestyle conditions',
        'Diagnosis and compassionate care for acute fevers, respiratory conditions, and infections',
        'Long-term family medical guidance and wellness follow-ups'
      ]
    },
    {
      id: 'ob-gyn',
      name: 'Obstetrics & Gynecology (स्त्री रोग)',
      badge: "Women's Health",
      icon: Sparkles,
      description: 'Comprehensive women’s health, antenatal care, maternal wellness, and specialist gynecological consultations.',
      services: ['Antenatal checkups', "Women's health screenings", 'Maternal wellness counseling', 'Gynecological care'],
      details: [
        'Dedicated women’s health clinic led by Dr. (Mrs.) Indu Kumari (MBBS L.N.M.U, DAR)',
        'Antenatal monitoring, prenatal guidance, and maternal health reviews',
        'Evaluation and treatment of menstrual irregularities, pelvic health, and infections',
        'Confidential, compassionate care in a supportive clinical environment'
      ]
    },
    {
      id: 'lap-surgery',
      name: 'General & Laparoscopic Surgery (लेप्रोस्कोपिक सर्जन)',
      badge: 'Surgical Consultations',
      icon: HeartPulse,
      description: 'Expert outpatient surgical evaluations, laparoscopic assessments, minor procedural care, and pre/post-operative reviews.',
      services: ['Surgical OPD evaluations', 'Laparoscopic guidance', 'Pre/post-op counseling', 'Wound & healing checkups'],
      details: [
        'Expert consultations led by Dr. Surendra Kumar (MBBS Hons B.U., M.S. General Surgery Patna)',
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
      description: 'Routine clinical laboratory sampling, blood tests, urine analysis, and secure digital reports.',
      services: ['Blood cell counts (CBC)', 'Blood glucose & HbA1c', 'Routine urine analysis', 'Digital reports'],
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
        padding: '64px 24px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* SECTION HEADER */}
        <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: '600',
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
              fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)',
              lineHeight: 1.25,
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

        {/* DEPARTMENTS 4-CARD GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}
        >
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.id}
                className="card-interactive"
                style={{
                  padding: '28px 22px',
                  backgroundColor: 'var(--warm-cream)',
                  borderRadius: '16px',
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
                    <div className="mint-icon-box" style={{ width: '44px', height: '44px', borderRadius: '12px' }}>
                      <Icon size={22} />
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        color: 'var(--primary-teal)',
                        backgroundColor: '#ffffff',
                        padding: '3px 10px',
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
                      fontSize: '1.2rem',
                      fontWeight: 500,
                      color: 'var(--deep-teal)',
                      marginBottom: '8px'
                    }}
                  >
                    {dept.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                      marginBottom: '16px'
                    }}
                  >
                    {dept.description}
                  </p>

                  {/* CLINICAL SERVICE PILLS */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {dept.services.map((svc) => (
                      <span
                        key={svc}
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '500',
                          color: 'var(--text-main)',
                          backgroundColor: '#ffffff',
                          padding: '3px 8px',
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
                      fontSize: '0.84rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Learn more</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectDepartment(dept.name)}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: '9999px', fontSize: '0.80rem', padding: '5px 14px', fontWeight: '600' }}
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
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--deep-teal)', marginBottom: '10px' }}>
                Services & Capabilities:
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

