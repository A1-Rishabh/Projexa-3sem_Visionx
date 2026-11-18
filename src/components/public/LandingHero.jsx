import React from 'react';
import { Calendar, Stethoscope, ArrowRight, UserCheck, TestTube2, FileText } from 'lucide-react';

export const LandingHero = ({ onStartBooking }) => {
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
        padding: '24px 28px 28px',
        maxWidth: '1280px',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      {/* BOTANICAL WATERMARK DECORATIONS (MATCHING REFERENCE IMAGE) */}
      <svg
        className="botanical-leaf-left"
        width="110"
        height="180"
        viewBox="0 0 110 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          left: '-10px',
          top: '40px',
          pointerEvents: 'none',
          opacity: 0.55,
          zIndex: 1
        }}
      >
        <path
          d="M-20 20C20 40 45 80 40 130C25 105 10 90 -20 85Z"
          fill="#A8D5C2"
          opacity="0.7"
        />
        <path
          d="M0 60C35 75 60 110 55 160C40 135 20 120 -5 115Z"
          fill="#C4E8D7"
          opacity="0.8"
        />
        <path
          d="M-10 100C25 110 50 140 45 180C30 160 10 150 -15 145Z"
          fill="#8CC5AF"
          opacity="0.5"
        />
      </svg>

      {/* TOP TWO-COLUMN GRID: CONTENT (LEFT) + ARCHED CLINIC IMAGE (RIGHT) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.12fr 0.88fr',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '28px',
          position: 'relative',
          zIndex: 2
        }}
        className="hero-grid-container"
      >
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* MINT BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--mint)',
              color: 'var(--deep-teal)',
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: '700',
              width: 'fit-content',
              letterSpacing: '0.02em',
              border: '1px solid rgba(15, 107, 99, 0.15)'
            }}
          >
            <span>Outpatient Medical Care</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.1rem, 3.6vw, 2.85rem)',
              lineHeight: 1.16,
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
              fontSize: '0.98rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              maxWidth: '510px',
              margin: 0
            }}
          >
            Consult with our doctors in clinic, complete routine tests on site, and access your digital visit records anytime.
          </p>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={() => onStartBooking()}
              className="btn btn-primary"
              style={{
                fontSize: '0.92rem',
                padding: '11px 26px',
                borderRadius: '9999px',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(15, 79, 74, 0.22)'
              }}
            >
              <span>Book an appointment</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={handleScrollToDoctors}
              className="btn btn-secondary"
              style={{
                fontSize: '0.92rem',
                padding: '11px 22px',
                borderRadius: '9999px',
                fontWeight: '600',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Stethoscope size={15} color="var(--primary-teal)" />
              <span>Our doctors</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ARCHED CLINIC RECEPTION IMAGE WITH STETHOSCOPE BADGE */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          
          {/* TOP-RIGHT STETHOSCOPE DECORATIVE BADGE */}
          <div
            style={{
              position: 'absolute',
              top: '-14px',
              right: '-10px',
              zIndex: 4,
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 6px 20px rgba(15, 79, 74, 0.14)',
              border: '1.5px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--deep-teal)'
            }}
          >
            <Stethoscope size={32} strokeWidth={1.8} color="var(--deep-teal)" />
          </div>

          {/* MAIN ARCHED IMAGE CONTAINER */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '350px',
              borderRadius: '220px 20px 20px 20px',
              overflow: 'hidden',
              boxShadow: '0 16px 36px rgba(15, 79, 74, 0.12)',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              backgroundColor: 'var(--mint-light)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200"
              alt="Jeevak Clinic reception and modern consultation facility"
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

      {/* FULL-WIDTH BOTTOM ROW: 4 HIGHLIGHT PILL CARDS WITH CRISP BORDERS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          position: 'relative',
          zIndex: 2
        }}
        className="hero-highlights-row"
      >
        <div
          className="card-interactive"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1.5px solid var(--border-color)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="mint-icon-box" style={{ width: '34px', height: '34px', borderRadius: '10px', minWidth: '34px' }}>
            <UserCheck size={17} color="var(--primary-teal)" />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: 1.35 }}>
            In-person doctor visits
          </span>
        </div>

        <div
          className="card-interactive"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1.5px solid var(--border-color)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="mint-icon-box" style={{ width: '34px', height: '34px', borderRadius: '10px', minWidth: '34px' }}>
            <TestTube2 size={17} color="var(--primary-teal)" />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: 1.35 }}>
            On-site routine testing
          </span>
        </div>

        <div
          className="card-interactive"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1.5px solid var(--border-color)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="mint-icon-box" style={{ width: '34px', height: '34px', borderRadius: '10px', minWidth: '34px' }}>
            <Calendar size={17} color="var(--primary-teal)" />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: 1.35 }}>
            Same-day appointment slots
          </span>
        </div>

        <div
          className="card-interactive"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1.5px solid var(--border-color)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="mint-icon-box" style={{ width: '34px', height: '34px', borderRadius: '10px', minWidth: '34px' }}>
            <FileText size={17} color="var(--primary-teal)" />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: 1.35 }}>
            Digital prescriptions & notes
          </span>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
