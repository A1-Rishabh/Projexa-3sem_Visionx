import React, { useState } from 'react';
import { Calendar, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LandingHero = ({ onStartBooking, onSignIn }) => {
  const [selectedDept] = useState('General Medicine');

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="landing-hero-section"
      style={{
        position: 'relative',
        padding: '36px 24px 48px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '36px',
          alignItems: 'center'
        }}
        className="hero-grid-container"
      >
        {/* LEFT COLUMN: HEADLINE, COPY, ACTIONS, CHECKMARKS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SMALL WELCOME BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--mint)',
              color: 'var(--deep-teal)',
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: '600',
              width: 'fit-content'
            }}
          >
            <span>Outpatient Medical Care</span>
          </div>

          {/* MAIN HEADLINE (Fraunces 500, lighter, smaller) */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              lineHeight: 1.2,
              fontWeight: 500,
              color: 'var(--deep-teal)',
              letterSpacing: 'normal',
              margin: 0
            }}
          >
            Personalized medical care from doctors who take the time to listen.
          </h1>

          {/* SHORT GROUNDED COPY */}
          <p
            style={{
              fontSize: '1.02rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '540px',
              margin: 0
            }}
          >
            Consult with our doctors in clinic, complete routine tests on site, and access your digital visit records anytime.
          </p>

          {/* ACTION BUTTONS ROW */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => onStartBooking({ department: selectedDept })}
              className="btn btn-primary"
              style={{
                fontSize: '0.96rem',
                padding: '11px 26px',
                borderRadius: '9999px',
                fontWeight: '600'
              }}
            >
              <Calendar size={17} />
              <span>Book an appointment</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={() => handleScrollToSection('doctors')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.96rem',
                padding: '11px 22px',
                borderRadius: '9999px',
                fontWeight: '500'
              }}
            >
              <Stethoscope size={16} color="var(--primary-teal)" />
              <span>Our doctors</span>
            </button>
          </div>

          {/* CHECKMARKS: TWO ROWS OF TWO */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))',
              gap: '10px 16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: '500' }}>
              <CheckCircle2 size={16} color="var(--primary-teal)" style={{ flexShrink: 0 }} />
              <span>In-person doctor visits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: '500' }}>
              <CheckCircle2 size={16} color="var(--primary-teal)" style={{ flexShrink: 0 }} />
              <span>Same-day appointment slots</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: '500' }}>
              <CheckCircle2 size={16} color="var(--primary-teal)" style={{ flexShrink: 0 }} />
              <span>On-site routine testing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: '500' }}>
              <CheckCircle2 size={16} color="var(--primary-teal)" style={{ flexShrink: 0 }} />
              <span>Digital prescriptions & notes</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLEAN CLINIC IMAGE (NO TEXT OVERLAY, NO DUPLICATE STATS) */}
        <div>
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              height: '340px',
              backgroundColor: 'var(--mint-light)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900"
              alt="Jeevak Clinic reception and consultation area"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              loading="eager"
            />
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
          boxShadow: '0 -4px 16px rgba(15, 79, 74, 0.12)',
          zIndex: 99,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
            Consult our doctors
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--deep-teal)' }}>
            In-clinic appointments
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartBooking({ department: selectedDept })}
          className="btn btn-primary"
          style={{
            padding: '9px 18px',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: '600'
          }}
        >
          <span>Book visit</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
};

export default LandingHero;

