import React, { useState } from 'react';
import { Calendar, Stethoscope, MapPin, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { clinic, isPlaceholder } from '../../config/clinic';

export const LandingHero = ({ onStartBooking, onSignIn }) => {
  const [selectedDept, setSelectedDept] = useState('General Medicine');
  const [selectedBranch, setSelectedBranch] = useState(clinic.branches[0]?.id || 'main');
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const departments = [
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Neurology',
    'Orthopedics',
    'Diagnostics'
  ];

  const handleQuickBookSubmit = (e) => {
    e.preventDefault();
    onStartBooking({ department: selectedDept, branch: selectedBranch, date: selectedDate });
  };

  const showBranchSelector = clinic.branches && clinic.branches.length > 1;

  return (
    <section
      className="landing-hero-section"
      style={{
        position: 'relative',
        padding: '56px 24px 80px',
        maxWidth: '1280px',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '48px',
          alignItems: 'center'
        }}
        className="hero-grid-container"
      >
        {/* LEFT COLUMN: HEADLINE, SUPPORT TEXT, ACTION BUTTONS, TRUST PILLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* ANNOUNCEMENT / TRUST BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--mint)',
              color: 'var(--deep-teal)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: '700',
              width: 'fit-content',
              border: '1px solid rgba(15, 107, 99, 0.15)'
            }}
          >
            <ShieldCheck size={16} color="var(--primary-teal)" />
            <span>NABH Accredited In-Clinic Care • Verified Physicians</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
              lineHeight: 1.18,
              fontWeight: '700',
              color: 'var(--deep-teal)',
              letterSpacing: 'normal'
            }}
          >
            Personalized healthcare rooted in clinical trust and compassion.
          </h1>

          {/* SUPPORT TEXT (ONE LINE / CONCISE) */}
          <p
            style={{
              fontSize: '1.12rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '560px'
            }}
          >
            Experience thoughtful, unhurried consultations with senior doctors, on-site diagnostics, and seamless digital medical records.
          </p>

          {/* TWO PRIMARY BUTTONS */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => onStartBooking({ department: selectedDept })}
              className="btn btn-primary"
              style={{
                fontSize: '1rem',
                padding: '12px 28px',
                borderRadius: '9999px',
                boxShadow: '0 4px 14px rgba(15, 107, 99, 0.35)'
              }}
            >
              <span>Book an appointment</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onSignIn}
              className="btn btn-secondary"
              style={{
                fontSize: '1rem',
                padding: '12px 26px',
                borderRadius: '9999px'
              }}
            >
              <span>Sign in</span>
            </button>
          </div>

          {/* KEY TRUST BULLETS */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600' }}>
              <CheckCircle size={16} color="var(--primary-teal)" />
              <span>Zero waiting queue with reserved slots</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600' }}>
              <Clock size={16} color="var(--primary-teal)" />
              <span>Same-day appointment availability</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HERO CLINICAL SHOWCASE WITH VALUE PILLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* HERO IMAGE CONTAINER WITH CLINICAL OVERLAY */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              minHeight: '340px',
              backgroundColor: 'var(--mint-light)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backgroundImage: 'url(https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=900)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* GRADIENT OVERLAY */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15, 79, 74, 0.25) 0%, rgba(15, 79, 74, 0.88) 100%)'
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 2,
                padding: '28px',
                color: '#ffffff'
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', fontSize: '0.78rem', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
                <ShieldCheck size={14} color="#DCEFE6" />
                NABH Accredited Healthcare Center
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: '700', margin: '0 0 6px 0', color: '#ffffff' }}>
                Jivaka Center for Advanced Clinical Practice
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#DCEFE6', margin: 0, lineHeight: 1.5, maxWidth: '480px' }}>
                Compassionate outpatient care, multispecialty consultations, and certified diagnostic pathology under one roof.
              </p>
            </div>
          </div>

          {/* CLINICAL VALUE CARDS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '16px 14px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-teal)', fontFamily: 'Fraunces, serif' }}>
                18+
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '2px' }}>
                Senior Specialists
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '16px 14px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-teal)', fontFamily: 'Fraunces, serif' }}>
                Same-Day
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '2px' }}>
                Lab Diagnostics
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '16px 14px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-teal)', fontFamily: 'Fraunces, serif' }}>
                99.4%
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '2px' }}>
                Patient Trust
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STICKY BOOK APPOINTMENT BAR */}
      <div
        className="mobile-sticky-cta-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          padding: '12px 16px',
          borderTop: '1px solid var(--border-color)',
          boxShadow: '0 -4px 16px rgba(15, 79, 74, 0.1)',
          zIndex: 99,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Need to see a doctor?
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--deep-teal)' }}>
            Consultation from ₹800
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartBooking({ department: selectedDept })}
          className="btn btn-primary"
          style={{
            padding: '10px 20px',
            borderRadius: '9999px',
            fontSize: '0.92rem',
            boxShadow: '0 2px 10px rgba(15, 107, 99, 0.3)'
          }}
        >
          <span>Book appointment</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default LandingHero;

