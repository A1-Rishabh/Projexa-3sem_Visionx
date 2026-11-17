import React from 'react';
import { ArrowRight, User, ShieldCheck } from 'lucide-react';

export const LandingCtaBand = ({ onStartBooking, onSignIn }) => {
  return (
    <section
      style={{
        padding: '80px 24px',
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
          width: '450px',
          height: '450px',
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
            backgroundColor: 'rgba(220, 239, 230, 0.15)',
            border: '1px solid rgba(220, 239, 230, 0.25)',
            padding: '6px 16px',
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
            lineHeight: 1.2,
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}
        >
          Ready to experience medical care built around your schedule?
        </h2>

        <p
          style={{
            fontSize: '1.15rem',
            color: '#d1e5df',
            lineHeight: 1.6,
            maxWidth: '620px',
            margin: 0
          }}
        >
          Book an in-person appointment with our senior specialists today, or log into the Patient Portal to view your diagnostic reports and medication history.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
          <button
            type="button"
            onClick={onStartBooking}
            className="btn btn-accent"
            style={{
              fontSize: '1rem',
              padding: '14px 32px',
              borderRadius: '9999px',
              fontWeight: '700',
              boxShadow: '0 4px 20px rgba(232, 162, 92, 0.45)'
            }}
          >
            <span>Book an appointment</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={onSignIn}
            className="btn"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              fontSize: '1rem',
              padding: '14px 28px',
              borderRadius: '9999px',
              fontWeight: '600',
              backdropFilter: 'blur(8px)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
          >
            <User size={18} />
            <span>Patient Portal / Sign In</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingCtaBand;
