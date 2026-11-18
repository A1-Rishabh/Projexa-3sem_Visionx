import React from 'react';
import { Calendar, Stethoscope, ArrowRight, UserCheck, TestTube2, FileText, CheckCircle2 } from 'lucide-react';

export const LandingHero = ({ onStartBooking, onSignIn }) => {
  const handleScrollToDoctors = () => {
    const el = document.getElementById('doctors');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="landing-hero-section"
      style={{
        position: 'relative',
        padding: '36px 28px 48px',
        maxWidth: '1280px',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '48px',
          alignItems: 'center'
        }}
        className="hero-grid-container"
      >
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', zIndex: 2 }}>
          
          {/* MINT BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--mint)',
              color: 'var(--deep-teal)',
              padding: '5px 14px',
              borderRadius: '9999px',
              fontSize: '0.80rem',
              fontWeight: '700',
              width: 'fit-content',
              letterSpacing: '0.02em'
            }}
          >
            <span>Outpatient Medical Care</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.1rem, 3.8vw, 3rem)',
              lineHeight: 1.18,
              fontWeight: 500,
              color: 'var(--deep-teal)',
              letterSpacing: '-0.01em',
              margin: 0
            }}
          >
            Personalized medical care from doctors who take the time to listen.
          </h1>

          {/* EDITORIAL SUBTITLE */}
          <p
            style={{
              fontSize: '1.02rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '520px',
              margin: 0
            }}
          >
            Consult with our doctors in clinic, complete routine tests on site, and access your digital visit records anytime.
          </p>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={() => onStartBooking()}
              className="btn btn-primary"
              style={{
                fontSize: '0.94rem',
                padding: '12px 28px',
                borderRadius: '9999px',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(15, 79, 74, 0.25)'
              }}
            >
              <span>Book an appointment</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={handleScrollToDoctors}
              className="btn btn-secondary"
              style={{
                fontSize: '0.94rem',
                padding: '12px 24px',
                borderRadius: '9999px',
                fontWeight: '600',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Stethoscope size={16} color="var(--primary-teal)" />
              <span>Our doctors</span>
            </button>
          </div>

          {/* 4 FEATURE HIGHLIGHTS ROW */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(15, 79, 74, 0.10)',
              marginTop: '4px'
            }}
            className="hero-highlights-row"
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div className="mint-icon-box" style={{ width: '32px', height: '32px', borderRadius: '8px', minWidth: '32px' }}>
                <UserCheck size={16} color="var(--primary-teal)" />
              </div>
              <span style={{ fontSize: '0.80rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: 1.35 }}>
                In-person doctor visits
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div className="mint-icon-box" style={{ width: '32px', height: '32px', borderRadius: '8px', minWidth: '32px' }}>
                <TestTube2 size={16} color="var(--primary-teal)" />
              </div>
              <span style={{ fontSize: '0.80rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: 1.35 }}>
                On-site routine testing
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div className="mint-icon-box" style={{ width: '32px', height: '32px', borderRadius: '8px', minWidth: '32px' }}>
                <Calendar size={16} color="var(--primary-teal)" />
              </div>
              <span style={{ fontSize: '0.80rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: 1.35 }}>
                Same-day appointment slots
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div className="mint-icon-box" style={{ width: '32px', height: '32px', borderRadius: '8px', minWidth: '32px' }}>
                <FileText size={16} color="var(--primary-teal)" />
              </div>
              <span style={{ fontSize: '0.80rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: 1.35 }}>
                Digital prescriptions & notes
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ARCHED CLINIC RECEPTION IMAGE WITH STETHOSCOPE ACCENT */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          
          {/* TOP-RIGHT STETHOSCOPE DECORATIVE BADGE */}
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              right: '-12px',
              zIndex: 3,
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 24px rgba(15, 79, 74, 0.12)',
              border: '1.5px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--deep-teal)'
            }}
          >
            <Stethoscope size={38} strokeWidth={1.7} color="var(--deep-teal)" />
          </div>

          {/* MAIN ARCHED IMAGE CONTAINER */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '420px',
              borderRadius: '240px 24px 24px 24px',
              overflow: 'hidden',
              boxShadow: '0 20px 48px rgba(15, 79, 74, 0.14)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              backgroundColor: 'var(--mint-light)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200"
              alt="Jeevak Clinic modern reception and consultation suite"
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

      {/* MOBILE STICKY CTA */}
      <div
        className="mobile-sticky-cta-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          padding: '12px 18px',
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
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
            In-Clinic OPD
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--deep-teal)' }}>
            Schedule Doctor Visit
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartBooking()}
          className="btn btn-primary"
          style={{
            padding: '9px 20px',
            borderRadius: '9999px',
            fontSize: '0.86rem',
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
