import React, { useState } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { getDoctors } from '../../services/mockDataStore';
import { Modal } from '../common/Modal';

export const LandingDoctors = ({ onBookDoctor }) => {
  const [doctors] = useState(() => getDoctors());
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);

  return (
    <section
      id="doctors"
      style={{
        padding: '64px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: '36px',
          maxWidth: '640px'
        }}
      >
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
          Our Doctors
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
          Experienced doctors dedicated to your care.
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Consult with our medical practitioners for routine checkups, specialized consultations, and ongoing family healthcare.
        </p>
      </div>

      {/* DOCTORS CAROUSEL / GRID */}
      <div
        className="doctors-carousel"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px'
        }}
      >
        {doctors.map((doc, idx) => {
          return (
            <div
              key={doc.id || idx}
              className="card-interactive doctor-card-snap"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '22px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                {/* ONE CONSISTENT DOCTOR AVATAR STYLE (INITIALS AVATAR UNTIL REAL PHOTOS EXIST) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--mint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--primary-teal)',
                      fontWeight: '700',
                      fontSize: '1.05rem',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    DR
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.15rem',
                        fontWeight: 500,
                        color: 'var(--text-main)',
                        margin: 0,
                        lineHeight: 1.3
                      }}
                    >
                      [Doctor name]
                    </h3>

                    <div style={{ fontSize: '0.84rem', fontWeight: '500', color: 'var(--primary-teal)', marginTop: '2px' }}>
                      [Specialty]
                    </div>
                  </div>
                </div>

                {/* TWO-LINE BIO CLAMP WITH VIEW PROFILE */}
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {doc.bio || 'General outpatient consultation, diagnosis, and treatment planning.'}
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedDoctorModal(doc)}
                  style={{
                    fontSize: '0.80rem',
                    color: 'var(--primary-teal)',
                    fontWeight: '600',
                    padding: 0,
                    marginBottom: '16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  View profile
                </button>
              </div>

              {/* FOOTER: BOOK BUTTON */}
              <div
                style={{
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <button
                  type="button"
                  onClick={() => onBookDoctor(doc)}
                  className="btn btn-primary btn-sm btn-block"
                  style={{ borderRadius: '9999px', padding: '7px 16px', fontWeight: '600', fontSize: '0.84rem' }}
                >
                  <span>Book appointment</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DOCTOR PROFILE MODAL */}
      <Modal
        isOpen={!!selectedDoctorModal}
        onClose={() => setSelectedDoctorModal(null)}
        title="Doctor Profile"
        maxWidth="480px"
      >
        {selectedDoctorModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--mint)',
                  color: 'var(--primary-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                DR
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 500, margin: 0, color: 'var(--deep-teal)' }}>
                  [Doctor name]
                </h3>
                <div style={{ fontSize: '0.84rem', color: 'var(--primary-teal)', fontWeight: '500' }}>
                  [Specialty]
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {selectedDoctorModal.bio || 'Consulting outpatient physician at Jivaka Clinic.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setSelectedDoctorModal(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = selectedDoctorModal;
                  setSelectedDoctorModal(null);
                  onBookDoctor(d);
                }}
                className="btn btn-primary btn-sm"
                style={{ fontWeight: '600' }}
              >
                <span>Book appointment</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default LandingDoctors;

