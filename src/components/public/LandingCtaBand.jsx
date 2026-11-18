import React from 'react';
import { ArrowRight, User, Calendar, Phone, Plus } from 'lucide-react';
import { clinic } from '../../config/clinic';

export const LandingCtaBand = ({ onStartBooking, onSignIn }) => {
  const branch = clinic.branches?.[0] || {};

  return (
    <section
      style={{
        padding: '52px 28px',
        backgroundColor: 'var(--deep-teal)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* BACKGROUND IMAGE OVERLAY (MODERN HEALTHCARE INTERIOR WITH TEAL GRADIENT OVERLAY) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          mixBlendMode: 'luminosity',
          pointerEvents: 'none'
        }}
      />

      {/* GLOWING MEDICAL CROSS DECORATIVE ELEMENT ON RIGHT */}
      <div
        style={{
          position: 'absolute',
          right: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.22,
          pointerEvents: 'none'
        }}
      >
        <Plus size={160} strokeWidth={4} color="var(--mint)" />
      </div>

      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        {/* PILL BADGE */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(220, 239, 230, 0.15)',
            border: '1px solid rgba(220, 239, 230, 0.3)',
            padding: '5px 18px',
            borderRadius: '9999px',
            color: 'var(--mint)',
            fontSize: '0.80rem',
            fontWeight: '700'
          }}
        >
          <span>Appointments & In-Clinic Consultations</span>
        </div>

        {/* HEADLINE */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.1rem, 3.6vw, 2.75rem)',
            lineHeight: 1.2,
            fontWeight: 500,
            color: '#ffffff',
            margin: 0
          }}
        >
          Ready to schedule your visit?
        </h2>

        {/* PARAGRAPH */}
        <p
          style={{
            fontSize: '1.02rem',
            color: '#d4e7e2',
            lineHeight: 1.6,
            maxWidth: '580px',
            margin: 0
          }}
        >
          Book an in-person consultation with our doctors, or sign in to your patient account to review your medical history and test reports.
        </p>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
          <button
            type="button"
            onClick={onStartBooking}
            className="btn btn-accent"
            style={{
              fontSize: '0.96rem',
              padding: '12px 28px',
              borderRadius: '9999px',
              fontWeight: '600',
              boxShadow: '0 4px 18px rgba(232, 162, 92, 0.45)'
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
              border: '1.5px solid rgba(255, 255, 255, 0.28)',
              fontSize: '0.96rem',
              padding: '12px 26px',
              borderRadius: '9999px',
              fontWeight: '600',
              backdropFilter: 'blur(8px)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
          >
            <User size={17} />
            <span>Sign In</span>
          </button>
        </div>

        {/* CLINIC PHONE DESK */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#cfe3de', marginTop: '4px' }}>
          <Phone size={14} color="var(--mint)" />
          <span>Questions? Call our clinic desk: </span>
          <a href={`tel:${branch.phone || '011 45680306'}`} style={{ color: '#ffffff', fontWeight: '700', textDecoration: 'none' }}>
            {branch.phone || '011 45680306'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default LandingCtaBand;
