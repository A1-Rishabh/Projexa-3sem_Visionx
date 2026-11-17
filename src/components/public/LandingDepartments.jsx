import React, { useState } from 'react';
import { Stethoscope, HeartPulse, Sparkles, Activity, ArrowRight, Check, Microscope } from 'lucide-react';
import { Modal } from '../common/Modal';

export const LandingDepartments = ({ onSelectDepartment }) => {
  const [selectedDeptModal, setSelectedDeptModal] = useState(null);

  const departments = [
    {
      id: 'gen-med',
      name: 'General Medicine',
      badge: 'Primary Care',
      icon: Activity,
      description: 'Adult health assessments, acute illness treatment, and management of chronic conditions.',
      services: ['Routine health checkups', 'Diabetes & blood pressure care', 'Fever & infection care', 'Preventive health advice'],
      details: [
        'Routine adult checkups and preventative health reviews',
        'Ongoing care for high blood pressure and diabetes',
        'Treatment for acute viral, respiratory, and bacterial infections',
        'Referral coordination when specialist care is needed'
      ]
    },
    {
      id: 'cardiology',
      name: 'Cardiology',
      badge: 'Heart Health',
      icon: HeartPulse,
      description: 'Outpatient heart evaluations, digital 12-lead ECG monitoring, and cardiovascular risk assessments.',
      services: ['Digital 12-lead ECG', 'Blood pressure monitoring', 'Cholesterol management', 'Heart health checkups'],
      details: [
        'Digital 12-lead electrocardiogram (ECG) on site',
        'Blood pressure monitoring and stabilization',
        'Cholesterol and lipid profile assessments',
        'Dietary and lifestyle counseling for heart health'
      ]
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      badge: 'Child Care',
      icon: Sparkles,
      description: 'Gentle, friendly care for infants, children, and adolescents.',
      services: ['Childhood wellness exams', 'Vaccination schedules', 'Cough & cold care', 'Growth & milestone tracking'],
      details: [
        'Newborn checkups and routine childhood developmental assessments',
        'National childhood immunization schedules',
        'Treatment for childhood coughs, colds, and fevers',
        'Pediatric nutritional guidance'
      ]
    },
    {
      id: 'diagnostics',
      name: 'Diagnostics & Lab',
      badge: 'On-Site Testing',
      icon: Microscope,
      description: 'Routine blood tests, diagnostic sampling, and secure digital lab reports.',
      services: ['Blood cell counts (CBC)', 'Sugar & diabetes tests', 'Kidney & liver panels', 'Digital PDF reports'],
      details: [
        'Complete blood counts and basic hematology',
        'Fasting glucose and HbA1c tests',
        'Liver and kidney function panels',
        'Digital PDF reports sent directly to your patient portal'
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

