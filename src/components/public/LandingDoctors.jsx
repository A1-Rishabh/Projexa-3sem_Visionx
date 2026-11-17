import React, { useState } from 'react';
import { Star, MapPin, Clock, ArrowRight, ShieldCheck, CheckCircle2, GraduationCap } from 'lucide-react';
import { getDoctors } from '../../services/mockDataStore';

export const LandingDoctors = ({ onBookDoctor }) => {
  const [doctors] = useState(() => getDoctors());
  const [brokenImages, setBrokenImages] = useState({});

  const handleImageError = (docId) => {
    setBrokenImages((prev) => ({ ...prev, [docId]: true }));
  };

  const getInitials = (name) => {
    if (!name) return 'DR';
    return name
      .replace(/^Dr\.\s*/i, '')
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <section
      id="doctors"
      style={{
        padding: '88px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '44px',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
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
            Senior Medical Faculty
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.1rem, 3.6vw, 2.7rem)',
              lineHeight: 1.22,
              color: 'var(--deep-teal)',
              marginBottom: '12px'
            }}
          >
            Meet our board-certified clinical specialists.
          </h2>
          <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Each physician brings extensive tertiary hospital experience, evidence-based practices, and an unhurried, attentive approach to outpatient consultations.
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--mint)',
            color: 'var(--deep-teal)',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: '0.86rem',
            border: '1px solid rgba(15, 107, 99, 0.18)'
          }}
        >
          <ShieldCheck size={18} color="var(--primary-teal)" />
          <span>Active Senior Physicians On-Site</span>
        </div>
      </div>

      {/* DOCTORS CAROUSEL / GRID */}
      <div
        className="doctors-carousel"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}
      >
        {doctors.map((doc) => {
          const isBroken = brokenImages[doc.id];
          const nextSlot = doc.availableSlots?.[0] || '10:00 AM';

          return (
            <div
              key={doc.id}
              className="card-interactive doctor-card-snap"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '26px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(15, 79, 74, 0.05)'
              }}
            >
              <div>
                {/* DOCTOR PHOTO / INITIALS AVATAR */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--mint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 10px rgba(15, 79, 74, 0.12)'
                    }}
                  >
                    {!isBroken && doc.avatar ? (
                      <img
                        src={doc.avatar}
                        alt={`Portrait of ${doc.name}`}
                        loading="lazy"
                        width="70"
                        height="70"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => handleImageError(doc.id)}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: '1.30rem',
                          fontWeight: '800',
                          fontFamily: 'var(--font-heading)',
                          color: 'var(--primary-teal)'
                        }}
                      >
                        {getInitials(doc.name)}
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 9px',
                        borderRadius: '9999px',
                        backgroundColor: '#dcfce7',
                        color: 'var(--primary-teal)',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        marginBottom: '4px'
                      }}
                    >
                      <CheckCircle2 size={11} />
                      <span>Available today</span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.20rem',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        margin: 0,
                        lineHeight: 1.25
                      }}
                    >
                      {doc.name}
                    </h3>

                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--primary-teal)' }}>
                      {doc.specialization}
                    </div>
                  </div>
                </div>

                {/* QUALIFICATIONS & EXPERIENCE */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.45 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: 'var(--deep-teal)' }}>
                    <GraduationCap size={15} color="var(--primary-teal)" />
                    <span>{doc.title}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                    {doc.experience} of Tertiary Clinical Experience
                  </div>
                </div>

                {/* ROOM & RATING */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--warm-cream)',
                    fontSize: '0.78rem',
                    color: 'var(--text-main)',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <MapPin size={13} color="var(--primary-teal)" />
                    <span>{doc.room}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                    <Star size={13} fill="#E8A25C" color="#E8A25C" />
                    <span>{doc.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({doc.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* BIO */}
                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '18px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {doc.bio}
                </p>
              </div>

              {/* FOOTER: CLINICAL OPD & BOOK BUTTON (NO FEES DISPLAYED) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  gap: '8px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Consultation
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--deep-teal)' }}>
                    In-Clinic OPD
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onBookDoctor(doc)}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '9999px', padding: '8px 20px', fontWeight: '700', fontSize: '0.84rem' }}
                >
                  <span>Book visit</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingDoctors;

