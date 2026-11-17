import React from 'react';
import { ArrowRight, User, ShieldCheck, PhoneCall, Calendar } from 'lucide-react';
import { clinic, isPlaceholder } from '../../config/clinic';

export const LandingCtaBand = ({ onStartBooking, onSignIn }) => {
  const branch = clinic.branches?.[0] || {};
  const emergencyPhone = !isPlaceholder(branch.emergency) ? branch.emergency : '1800-200-4567';

  return (
    <section
      style={{
        padding: '88px 24px',
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
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 162, 92, 0.22) 0%, rgba(15, 79, 74, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '840px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(220, 239, 230, 0.16)',
            border: '1px solid rgba(220, 239, 230, 0.28)',
            padding: '6px 18px',
            borderRadius: '9999px',
            color: 'var(--mint)',
            fontSize: '0.85rem',
            fontWeight: '700'
          }}
        >
          <ShieldCheck size={16} />
          <span>Compassionate Care • Immediate In-Clinic Confirmation</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
            lineHeight: 1.18,
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}
        >
          Experience Healthcare Built Around Your Schedule & Well-Being.
        </h2>

        <p
          style={{
            fontSize: '1.12rem',
            color: '#d1e5df',
            lineHeight: 1.65,
            maxWidth: '640px',
            margin: 0
          }}
        >
          Book an in-person appointment with our senior specialists today, or sign in to access your verified diagnostic reports, medications, and appointment history.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
          <button
            type="button"
            onClick={onStartBooking}
            className="btn btn-accent"
            style={{
              fontSize: '1rem',
              padding: '14px 34px',
              borderRadius: '9999px',
              fontWeight: '700',
              boxShadow: '0 4px 22px rgba(232, 162, 92, 0.45)'
            }}
          >
            <Calendar size={18} />
            <span>Book an appointment</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={onSignIn}
            className="btn"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.28)',
              fontSize: '1rem',
              padding: '14px 30px',
              borderRadius: '9999px',
              fontWeight: '600',
              backdropFilter: 'blur(8px)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.24)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)')}
          >
            <User size={18} />
            <span>Sign In</span>
          </button>
        </div>

        {/* EMERGENCY CALLOUT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#bcd0cb', marginTop: '8px' }}>
          <PhoneCall size={15} color="#fca5a5" />
          <span>Need immediate assistance? 24/7 Helpline: </span>
          <a href={`tel:${emergencyPhone}`} style={{ color: '#ffffff', fontWeight: '700', textDecoration: 'none' }}>
            {emergencyPhone}
          </a>
        </div>
      </div>
    </section>
  );
};

export default LandingCtaBand;

