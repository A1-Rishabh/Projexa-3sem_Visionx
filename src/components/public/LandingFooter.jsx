import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, ArrowUp, Navigation } from 'lucide-react';
import { Logo } from '../common/Logo';
import { clinic, getDirectionsUrl } from '../../config/clinic';

export const LandingFooter = ({ onNavigateToAuth }) => {
  const branch = clinic.branches?.[0] || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#0a3632',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '48px',
        paddingBottom: '24px'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px' }}>
        
        {/* MAIN 4-COLUMN FOOTER CONTENT */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1.1fr 1.2fr',
            gap: '40px',
            marginBottom: '48px'
          }}
          className="footer-grid-container"
        >
          {/* COL 1: LOGO, TAGLINE, PANEL BADGE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Logo size="medium" theme="light" variant="full" />
            
            <p style={{ color: '#bcd0cb', fontSize: '0.90rem', lineHeight: 1.6, maxWidth: '320px', margin: 0 }}>
              {clinic.tagline || 'Quality Healthcare & In-Clinic Specialists Since 2003'}
            </p>

            {/* OFFICIAL PANEL BADGE */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(220, 239, 230, 0.12)',
                border: '1px solid rgba(220, 239, 230, 0.22)',
                color: 'var(--mint)',
                width: 'fit-content'
              }}
            >
              <ShieldCheck size={18} color="var(--mint)" />
              <div>
                <div style={{ fontSize: '0.70rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.06em' }}>
                  Official Empanelment
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff' }}>
                  LIC & Cabinet Secretariat
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: NAVIGATION */}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
              <a href="#about" style={{ color: '#bcd0cb', textDecoration: 'none' }}>About</a>
              <a href="#departments" style={{ color: '#bcd0cb', textDecoration: 'none' }}>Departments</a>
              <a href="#doctors" style={{ color: '#bcd0cb', textDecoration: 'none' }}>Doctors</a>
              <a href="#locations" style={{ color: '#bcd0cb', textDecoration: 'none' }}>Location</a>
              <button
                type="button"
                onClick={() => onNavigateToAuth('doctor')}
                style={{ textAlign: 'left', color: '#bcd0cb', fontSize: '0.86rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Staff Login
              </button>
              <button
                type="button"
                onClick={() => onNavigateToAuth('patient')}
                style={{ textAlign: 'left', color: 'var(--mint)', fontWeight: '600', fontSize: '0.86rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* COL 3: CONSULTATION HOURS */}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: '#bcd0cb' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#ffffff' }}>Mon - Fri</div>
                <div>11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM</div>
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#ffffff' }}>Saturday & Sunday</div>
                <div style={{ color: '#fca5a5' }}>Closed</div>
              </div>
            </div>
          </div>

          {/* COL 4: CLINIC ADDRESS */}
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

            <div style={{ display: 'flex', gap: '10px', fontSize: '0.86rem', color: '#bcd0cb', lineHeight: 1.5 }}>
              <MapPin size={17} color="var(--mint)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{branch.address || "C-04, Shakti Vihar, Gali No.-6, off School Road, Meethapur, Badarpur, New Delhi-110044"}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', fontSize: '0.86rem', color: '#bcd0cb' }}>
              <Phone size={17} color="var(--mint)" style={{ flexShrink: 0 }} />
              <a href={`tel:${branch.phone || '011 45680306'}`} style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
                {branch.phone || '011 45680306'}
              </a>
            </div>

            {branch.email && (
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.86rem', color: '#bcd0cb' }}>
                <Mail size={17} color="var(--mint)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${branch.email}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                  {branch.email}
                </a>
              </div>
            )}

            {/* GET DIRECTIONS LINK */}
            <a
              href={getDirectionsUrl(branch.mapQuery || "Jeevak Clinic Meethapur Badarpur New Delhi")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-teal btn-sm"
              style={{
                color: '#ffffff !important',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                marginTop: '6px',
                width: 'fit-content'
              }}
            >
              <Navigation size={14} />
              <span>Get directions</span>
            </a>
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
            fontSize: '0.80rem',
            color: '#8da6a1',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            © {new Date().getFullYear()} {clinic.name} (जीवक क्लीनिक, Estd. 2003). On Panel: LIC & Cabinet Secretariat.
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
              fontSize: '0.80rem',
              fontWeight: '600',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
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
