import React from 'react';
import { MapPin, Phone, Mail, Clock, AlertCircle, ArrowUp, Navigation } from 'lucide-react';
import { Logo } from '../common/Logo';
import { clinic, isPlaceholder, getDirectionsUrl } from '../../config/clinic';

export const LandingFooter = ({ onNavigateToAuth }) => {
  const branch = clinic.branches?.[0] || {};
  const isAddressPlaceholder = isPlaceholder(branch.address);
  const isPhonePlaceholder = isPlaceholder(branch.phone);
  const isEmergencyPlaceholder = isPlaceholder(branch.emergency);
  const isQueryPlaceholder = isPlaceholder(branch.mapQuery);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#0a3632',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '64px',
        paddingBottom: '32px'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* MAIN 4-COLUMN FOOTER CONTENT */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr',
            gap: '40px',
            marginBottom: '48px'
          }}
          className="footer-grid-container"
        >
          {/* COL 1: LOGO, TAGLINE, EMERGENCY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Logo size="medium" theme="light" variant="full" />
            
            <p style={{ color: '#bcd0cb', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '340px' }}>
              {clinic.tagline || 'Compassionate clinical consultations, verified specialists, and modern on-site diagnostics.'}
            </p>

            {/* EMERGENCY NUMBER CALLOUT */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                width: 'fit-content'
              }}
            >
              <AlertCircle size={18} color="#ef4444" />
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  24/7 Emergency Triage
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>
                  {isEmergencyPlaceholder ? branch.emergency : (
                    <a href={`tel:${branch.emergency}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                      {branch.emergency}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: QUICK LINKS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                color: '#ffffff',
                fontWeight: 500,
                letterSpacing: 'normal'
              }}
            >
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <a href="#about" style={{ color: '#bcd0cb', textDecoration: 'none' }}>About</a>
              <a href="#departments" style={{ color: '#bcd0cb', textDecoration: 'none' }}>Departments</a>
              <a href="#doctors" style={{ color: '#bcd0cb', textDecoration: 'none' }}>Doctors</a>
              <a href="#locations" style={{ color: '#bcd0cb', textDecoration: 'none' }}>Location</a>
              <button
                type="button"
                onClick={() => onNavigateToAuth('doctor')}
                style={{ textAlign: 'left', color: '#bcd0cb', fontSize: '0.88rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Staff Login
              </button>
              <button
                type="button"
                onClick={() => onNavigateToAuth('patient')}
                style={{ textAlign: 'left', color: 'var(--mint)', fontWeight: '600', fontSize: '0.88rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* COL 3: OPERATING HOURS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                color: '#ffffff',
                fontWeight: 500
              }}
            >
              Consultation Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#bcd0cb' }}>
              {branch.hours?.map((h, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '500', color: '#ffffff' }}>{h.days}</span>
                  <span>{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COL 4: CONTACT & GET DIRECTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                color: '#ffffff',
                fontWeight: 500
              }}
            >
              Clinic Address
            </h4>

            <div style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#bcd0cb', lineHeight: 1.5 }}>
              <MapPin size={18} color="var(--mint)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{branch.address}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#bcd0cb' }}>
              <Phone size={18} color="var(--mint)" style={{ flexShrink: 0 }} />
              {isPhonePlaceholder ? (
                <span>{branch.phone}</span>
              ) : (
                <a href={`tel:${branch.phone}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                  {branch.phone}
                </a>
              )}
            </div>

            {/* GET DIRECTIONS LINK (ONLY ACTIVE WHEN NOT BRACKETED) */}
            {!isQueryPlaceholder && (
              <a
                href={getDirectionsUrl(branch.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-teal btn-sm"
                style={{
                  color: '#ffffff !important',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  marginTop: '8px',
                  width: 'fit-content'
                }}
              >
                <Navigation size={14} />
                <span>Get directions</span>
              </a>
            )}
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#8da6a1',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            © {new Date().getFullYear()} {clinic.name}. All rights reserved. Medical emergency services operate 24/7.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#bcd0cb',
              fontSize: '0.82rem',
              fontWeight: '600'
            }}
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;

