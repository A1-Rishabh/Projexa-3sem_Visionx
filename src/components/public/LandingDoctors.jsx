import React, { useState } from 'react';
import { Star, MapPin, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getDoctors } from '../../services/mockDataStore';
import { formatINR } from '../../config/clinic';

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
        padding: '80px 24px',
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
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '600px' }}>
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
            Medical Faculty
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              lineHeight: 1.25,
              color: 'var(--deep-teal)',
              marginBottom: '10px'
            }}
          >
            Meet our board-certified clinical specialists.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Each physician brings extensive tertiary hospital experience, evidence-based practices, and compassionate bedside care.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-teal)', fontWeight: '700', fontSize: '0.9rem' }}>
          <ShieldCheck size={18} />
          <span>All physicians actively practicing on-site</span>
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
                borderRadius: '18px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* DOCTOR PHOTO / INITIALS AVATAR */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--mint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(15, 79, 74, 0.1)'
                    }}
                  >
                    {!isBroken && doc.avatar ? (
                      <img
                        src={doc.avatar}
                        alt={`Portrait of ${doc.name}`}
                        loading="lazy"
                        width="68"
                        height="68"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => handleImageError(doc.id)}
                      />
                    ) : (
                      <div
                        style={{
                          fontSize: '1.25rem',
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
                        padding: '2px 8px',
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
                        fontSize: '1.18rem',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        margin: 0,
                        lineHeight: 1.3
                      }}
                    >
                      {doc.name}
                    </h3>

                    <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--primary-teal)' }}>
                      {doc.specialization}
                    </div>
                  </div>
                </div>

                {/* QUALIFICATIONS & EXPERIENCE */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                  <div>{doc.title}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{doc.experience} Clinical Experience</div>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="var(--primary-teal)" />
                    <span>{doc.room}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                    <Star size={13} fill="#E8A25C" color="#E8A25C" />
                    <span>{doc.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({doc.reviewsCount})</span>
                  </div>
                </div>

                {/* BIO CLAMPED TO 2 LINES */}
                <p
                  style={{
                    fontSize: '0.85rem',
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

              {/* FOOTER: CLINICAL OPD & BOOK BUTTON */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
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
                  style={{ borderRadius: '9999px', padding: '8px 18px', fontWeight: '700' }}
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

