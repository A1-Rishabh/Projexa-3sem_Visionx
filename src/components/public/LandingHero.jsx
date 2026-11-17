import React, { useState } from 'react';
import { Calendar, Stethoscope, MapPin, ArrowRight, ShieldCheck, Clock, CheckCircle2, Award, FileText } from 'lucide-react';
import { clinic, isPlaceholder } from '../../config/clinic';

export const LandingHero = ({ onStartBooking, onSignIn }) => {
  const [selectedDept, setSelectedDept] = useState('General Medicine');

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
        padding: '64px 24px 88px',
        maxWidth: '1280px',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.18fr 0.82fr',
          gap: '48px',
          alignItems: 'center'
        }}
        className="hero-grid-container"
      >
        {/* LEFT COLUMN: HEADLINE, ACCREDITATION, ACTIONS, TRUST HIGHLIGHTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* INSTITUTIONAL ACCREDITATION BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--mint)',
              color: 'var(--deep-teal)',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: '700',
              width: 'fit-content',
              border: '1px solid rgba(15, 107, 99, 0.18)',
              boxShadow: '0 1px 4px rgba(15, 79, 74, 0.04)'
            }}
          >
            <ShieldCheck size={16} color="var(--primary-teal)" />
            <span>NABH Accredited In-Clinic Care • Verified Senior Faculty</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 4.6vw, 3.4rem)',
              lineHeight: 1.16,
              fontWeight: '700',
              color: 'var(--deep-teal)',
              letterSpacing: 'normal'
            }}
          >
            Excellence in Clinical Medicine, Guided by Integrity & Compassion.
          </h1>

          {/* SUPPORT TEXT */}
          <p
            style={{
              fontSize: '1.12rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '580px'
            }}
          >
            Consult with distinguished senior physicians from premier institutes (AIIMS, PGIMER, CMC Vellore). Experience unhurried 25+ minute appointments, zero waiting queues, and comprehensive on-site diagnostics.
          </p>

          {/* ACTION BUTTONS ROW */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => onStartBooking({ department: selectedDept })}
              className="btn btn-primary"
              style={{
                fontSize: '1rem',
                padding: '13px 30px',
                borderRadius: '9999px',
                boxShadow: '0 4px 16px rgba(15, 107, 99, 0.35)',
                fontWeight: '700'
              }}
            >
              <Calendar size={18} />
              <span>Book a Consultation</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => handleScrollToSection('doctors')}
              className="btn btn-secondary"
              style={{
                fontSize: '1rem',
                padding: '13px 26px',
                borderRadius: '9999px',
                fontWeight: '600'
              }}
            >
              <Stethoscope size={17} color="var(--primary-teal)" />
              <span>Explore Specialists</span>
            </button>
          </div>

          {/* KEY CLINICAL TRUST BULLETS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600' }}>
              <CheckCircle2 size={17} color="var(--primary-teal)" />
              <span>Confirmed In-Clinic OPD Slots</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600' }}>
              <Clock size={17} color="var(--primary-teal)" />
              <span>25+ Min Dedicated Doctor Time</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600' }}>
              <Award size={17} color="var(--primary-teal)" />
              <span>AIIMS & Premier Faculty Pedigree</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600' }}>
              <FileText size={17} color="var(--primary-teal)" />
              <span>Instant Digital Diagnostic Reports</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREMIER CLINICAL SHOWCASE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* HERO IMAGE CONTAINER WITH ACCREDITED OVERLAY */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(15, 79, 74, 0.15)',
              minHeight: '380px',
              backgroundColor: 'var(--deep-teal)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              backgroundImage: 'url(https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* GRADIENT OVERLAY */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15, 79, 74, 0.2) 0%, rgba(15, 79, 74, 0.92) 100%)'
              }}
            />

            {/* TOP RIGHT ACTIVE ON-SITE STATUS BADGE */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                fontSize: '0.78rem',
                fontWeight: '700',
                color: 'var(--deep-teal)'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a'
                }}
              />
              <span>Faculty Active On-Site</span>
            </div>

            {/* BOTTOM SHOWCASE CONTENT */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                padding: '28px',
                color: '#ffffff'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: '#ffffff'
                }}
              >
                <ShieldCheck size={14} color="#DCEFE6" />
                NABH Level-3 Compliant Clinic
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: '700', margin: '0 0 6px 0', color: '#ffffff' }}>
                Center for Advanced Outpatient Practice
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#DCEFE6', margin: 0, lineHeight: 1.5, maxWidth: '440px' }}>
                State-of-the-art sterile consultation suites, digitized health records, and computerized pathology testing.
              </p>
            </div>
          </div>

          {/* CLINICAL VALUE CARDS ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
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
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--primary-teal)', fontFamily: 'Fraunces, serif' }}>
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
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--primary-teal)', fontFamily: 'Fraunces, serif' }}>
                &lt; 4 hrs
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '2px' }}>
                Digital Lab Reports
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
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--primary-teal)', fontFamily: 'Fraunces, serif' }}>
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
          boxShadow: '0 -4px 16px rgba(15, 79, 74, 0.12)',
          zIndex: 99,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Need an In-Clinic Specialist?
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--deep-teal)' }}>
            Confirmed Same-Day Slots
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartBooking({ department: selectedDept })}
          className="btn btn-primary"
          style={{
            padding: '10px 20px',
            borderRadius: '9999px',
            fontSize: '0.90rem',
            boxShadow: '0 2px 10px rgba(15, 107, 99, 0.3)',
            fontWeight: '700'
          }}
        >
          <span>Book Visit</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default LandingHero;

