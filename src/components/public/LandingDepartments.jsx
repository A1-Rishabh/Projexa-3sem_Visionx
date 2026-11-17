import React, { useState } from 'react';
import { Stethoscope, HeartPulse, Sparkles, Activity, ArrowRight, Check } from 'lucide-react';
import { Modal } from '../common/Modal';

export const LandingDepartments = ({ onSelectDepartment }) => {
  const [selectedDeptModal, setSelectedDeptModal] = useState(null);

  const departments = [
    {
      id: 'gen-med',
      name: 'General Medicine',
      icon: Activity,
      description: 'Comprehensive adult health assessments, acute illness management, and long-term metabolic care.',
      details: [
        'Preventative wellness checks and bi-annual executive health profiles',
        'Hypertension, lipid disorder, and type-2 diabetes therapeutic plans',
        'Infectious disease recovery, fever workups, and seasonal immunization',
        'Coordination with specialist consultants for multi-system conditions'
      ]
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      icon: Sparkles,
      description: 'Gentle, compassionate wellness care from infant milestones through adolescent health.',
      details: [
        'Newborn screening, growth chart tracking, and pediatric developmental assessments',
        'Complete childhood immunization schedule aligned with national guidelines',
        'Acute childhood infections, asthma nebulization, and seasonal allergies',
        'Nutritional guidance and adolescent preventive health counseling'
      ]
    },
    {
      id: 'cardiology',
      name: 'Cardiology',
      icon: HeartPulse,
      description: 'Non-invasive cardiac evaluations, digital ECG monitoring, and preventive cardiovascular wellness.',
      details: [
        '12-lead digital electrocardiogram (ECG) and baseline arrhythmia detection',
        'Post-infarction outpatient follow-up and chronic hypertension stabilization',
        'Cardiovascular risk stratification and lifestyle modification plans',
        'Lipid profiling and preventive dietary protocols'
      ]
    },
    {
      id: 'diagnostics',
      name: 'Diagnostics',
      icon: Stethoscope,
      description: 'Accredited clinical pathology, rapid hematology panels, and secure digitized laboratory reports.',
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
        padding: '80px 24px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* SECTION HEADER */}
        <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
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
            Clinical Disciplines
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              lineHeight: 1.25,
              color: 'var(--deep-teal)',
              marginBottom: '12px'
            }}
          >
            Specialized departments built for comprehensive patient care.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Our integrated departments ensure that whether you are visiting for routine health maintenance or specialized disease management, you receive coordinated, thorough clinical attention.
          </p>
        </div>

        {/* DEPARTMENTS 4-CARD GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
                  padding: '32px 24px',
                  backgroundColor: 'var(--warm-cream)',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div className="mint-icon-box" style={{ width: '48px', height: '48px', marginBottom: '20px' }}>
                    <Icon size={24} />
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      fontWeight: '700',
                      color: 'var(--deep-teal)',
                      marginBottom: '10px'
                    }}
                  >
                    {dept.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '24px'
                    }}
                  >
                    {dept.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(15, 79, 74, 0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedDeptModal(dept)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--primary-teal)',
                      fontWeight: '700',
                      fontSize: '0.88rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Learn more</span>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectDepartment(dept.name)}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: '9999px', fontSize: '0.8rem' }}
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
        maxWidth="560px"
      >
        {selectedDeptModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedDeptModal.description}
            </p>

            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--deep-teal)', marginBottom: '12px' }}>
                Clinical Scope & Services:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                {selectedDeptModal.details.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <div className="mint-icon-box" style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, marginTop: '2px' }}>
                      <Check size={13} color="var(--primary-teal)" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setSelectedDeptModal(null)}
                className="btn btn-secondary"
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
                className="btn btn-primary"
              >
                <span>Book in {selectedDeptModal.name}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default LandingDepartments;
