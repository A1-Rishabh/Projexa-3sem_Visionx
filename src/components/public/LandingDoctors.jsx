import React, { useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { getDoctors } from '../../services/mockDataStore';
import { formatINR } from '../../config/clinic';
import { Modal } from '../common/Modal';

export const LandingDoctors = ({ onBookDoctor }) => {
  const [doctors] = useState(() => getDoctors());
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);

  const getInitials = (name = '') => {
    const clean = name.replace(/^Dr\.\s*(\(Mrs\.\)\s*)?/i, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (parts[0]?.[0] || 'DR').toUpperCase();
  };

  return (
    <section
      id="doctors"
      style={{
        padding: '72px 28px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}
    >
      {/* HEADER ROW WITH SUBTLE MEDICAL PHOTO ACCENT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '36px',
          alignItems: 'center',
          marginBottom: '44px'
        }}
        className="doctors-header-row"
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
            Our Doctors
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
            Experienced doctors dedicated to your care.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Consult with our verified clinical specialists for routine OPD assessments, maternity care, and surgical guidance.
          </p>
        </div>

        {/* ACCENT STETHOSCOPE HEADER PHOTO */}
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
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=900"
            alt="Clinical healthcare stethoscope and diagnostic equipment"
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

      {/* 3 DOCTORS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}
        className="doctors-grid"
      >
        {doctors.map((doc, idx) => {
          const initials = getInitials(doc.name);
          return (
            <div
              key={doc.id || idx}
              className="card-interactive"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                {/* DOCTOR AVATAR & CREDENTIALS */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--mint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--primary-teal)',
                      fontWeight: '700',
                      fontSize: '1.12rem',
                      fontFamily: 'var(--font-heading)',
                      border: '1px solid rgba(15, 107, 99, 0.18)'
                    }}
                  >
                    {initials}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.16rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          margin: 0,
                          lineHeight: 1.3
                        }}
                      >
                        {doc.name}
                      </h3>
                    </div>

                    {doc.hindiName && (
                      <div style={{ fontSize: '0.80rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                        ({doc.hindiName})
                      </div>
                    )}

                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--primary-teal)', marginTop: '4px' }}>
                      {doc.subSpecialty || doc.specialization}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {doc.qualifications}
                    </div>
                  </div>
                </div>

                {/* OPD TIMINGS & FEE PILL BOX */}
                <div
                  style={{
                    backgroundColor: 'var(--warm-cream)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginBottom: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: 'var(--deep-teal)',
                    border: '1px solid rgba(15, 79, 74, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="var(--primary-teal)" />
                    <span>OPD: <strong>11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM</strong></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Mon - Fri (Sat & Sun Closed)</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary-teal)', fontSize: '0.84rem' }}>
                      Fee: {formatINR(doc.fee)}
                    </span>
                  </div>
                </div>

                {/* TWO-LINE BIO CLAMP */}
                <p
                  style={{
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {doc.bio}
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedDoctorModal(doc)}
                  style={{
                    fontSize: '0.80rem',
                    color: 'var(--primary-teal)',
                    fontWeight: '600',
                    padding: 0,
                    marginBottom: '18px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  View clinical credentials
                </button>
              </div>

              {/* FOOTER: CHAMBER & BOOK BUTTON */}
              <div
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  {doc.room}
                </div>

                <button
                  type="button"
                  onClick={() => onBookDoctor(doc)}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '9999px', padding: '7px 18px', fontWeight: '600', fontSize: '0.82rem' }}
                >
                  <span>Book appointment</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DOCTOR CREDENTIALS MODAL */}
      <Modal
        isOpen={!!selectedDoctorModal}
        onClose={() => setSelectedDoctorModal(null)}
        title="Doctor Profile & Credentials"
        maxWidth="500px"
      >
        {selectedDoctorModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--mint)',
                  color: 'var(--primary-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1.15rem',
                  fontFamily: 'var(--font-heading)',
                  flexShrink: 0
                }}
              >
                {getInitials(selectedDoctorModal.name)}
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600, margin: 0, color: 'var(--deep-teal)' }}>
                  {selectedDoctorModal.name} {selectedDoctorModal.hindiName && `(${selectedDoctorModal.hindiName})`}
                </h3>
                <div style={{ fontSize: '0.88rem', color: 'var(--primary-teal)', fontWeight: '600', marginTop: '2px' }}>
                  {selectedDoctorModal.subSpecialty || selectedDoctorModal.specialization}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {selectedDoctorModal.qualifications}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--warm-cream)', padding: '14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Consultation Chamber:</span>
                <strong style={{ color: 'var(--text-main)' }}>{selectedDoctorModal.room}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Consultation Fee:</span>
                <strong style={{ color: 'var(--primary-teal)' }}>{formatINR(selectedDoctorModal.fee)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>OPD Schedule:</span>
                <strong style={{ color: 'var(--deep-teal)' }}>{selectedDoctorModal.hours}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary-teal)', marginTop: '2px' }}>
                * Monday to Friday: 11:30 AM – 2:00 PM & 6:30 PM – 8:30 PM. Saturday & Sunday Closed.
              </div>
            </div>

            <p style={{ fontSize: '0.90rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {selectedDoctorModal.bio}
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
