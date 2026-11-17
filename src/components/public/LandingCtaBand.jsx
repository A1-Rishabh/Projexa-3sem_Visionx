import React from 'react';
import { ArrowRight, User, Calendar, Phone } from 'lucide-react';
import { clinic, isPlaceholder } from '../../config/clinic';

export const LandingCtaBand = ({ onStartBooking, onSignIn }) => {
  const branch = clinic.branches?.[0] || {};
  const hasRealPhone = !isPlaceholder(branch.phone);

  return (
    <section
      style={{
        padding: '64px 24px',
        backgroundColor: 'var(--deep-teal)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* WARM ACCENT GLOW ELEMENT */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 162, 92, 0.22) 0%, rgba(15, 79, 74, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(220, 239, 230, 0.16)',
            border: '1px solid rgba(220, 239, 230, 0.25)',
            padding: '5px 16px',
            borderRadius: '9999px',
            color: 'var(--mint)',
            fontSize: '0.82rem',
            fontWeight: '600'
          }}
        >
          <span>Appointments & In-Clinic Consultations</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.9rem, 3.4vw, 2.5rem)',
            lineHeight: 1.25,
            fontWeight: 500,
            color: '#ffffff',
            margin: 0
          }}
        >
          Ready to schedule your visit?
        </h2>

        <p
          style={{
            fontSize: '1rem',
            color: '#d1e5df',
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: 0
          }}
        >
          Book an in-person consultation with our doctors, or sign in to your patient account to review your medical history and test reports.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
          {/* ORANGE ACCENT BUTTON ON FINAL CTA */}
          <button
            type="button"
            onClick={onStartBooking}
            className="btn btn-accent"
            style={{
              fontSize: '0.96rem',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontWeight: '600',
              boxShadow: '0 4px 18px rgba(232, 162, 92, 0.4)'
            }}
          >
            <Calendar size={17} />
            <span>Book an appointment</span>
            <ArrowRight size={17} />
          </button>

          <button
            type="button"
            onClick={onSignIn}
            className="btn"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              fontSize: '0.96rem',
              padding: '12px 24px',
              borderRadius: '9999px',
              fontWeight: '500',
              backdropFilter: 'blur(8px)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
          >
            <User size={17} />
            <span>Sign In</span>
          </button>
        </div>

        {/* PHONE DESK FROM CLINIC.JS */}
        {hasRealPhone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: '#bcd0cb', marginTop: '6px' }}>
            <Phone size={14} color="var(--mint)" />
            <span>Questions? Call our clinic desk: </span>
            <a href={`tel:${branch.phone}`} style={{ color: '#ffffff', fontWeight: '600', textDecoration: 'none' }}>
              {branch.phone}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default LandingCtaBand;

