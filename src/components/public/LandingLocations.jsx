import React, { useState } from 'react';
import { MapPin, Phone, Clock, Copy, Check, Navigation, ExternalLink } from 'lucide-react';
import { clinic, isPlaceholder, getMapEmbedUrl, getDirectionsUrl } from '../../config/clinic';

export const LandingLocations = ({ showToast }) => {
  const [copiedText, setCopiedText] = useState(false);

  const currentBranch = clinic.branches?.[0] || {
    label: "Main Clinic - Meethapur",
    address: "C-04, Shakti Vihar, Gali No.-6, off School Road, Meethapur, Badarpur, New Delhi-110044",
    phone: "011 45680306",
    mapQuery: "Jeevak Clinic, C-04, Shakti Vihar, Meethapur, Badarpur, New Delhi-110044",
    hours: [
      { days: "Mon - Fri", time: "11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM" },
      { days: "Saturday & Sunday", time: "Closed" }
    ]
  };

  const handleCopyAddress = () => {
    if (!currentBranch.address) return;
    navigator.clipboard.writeText(currentBranch.address);
    setCopiedText(true);
    if (showToast) showToast('Address copied to clipboard', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <section
      id="locations"
      style={{
        padding: '44px 28px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* BOTANICAL WATERMARK DECORATION (MATCHING REFERENCE IMAGE) */}
      <svg
        width="120"
        height="160"
        viewBox="0 0 120 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          left: '-15px',
          bottom: '-10px',
          pointerEvents: 'none',
          opacity: 0.5,
          zIndex: 1
        }}
      >
        <path
          d="M-10 140C20 120 40 85 35 40C20 65 10 80 -15 85Z"
          fill="#A8D5C2"
          opacity="0.65"
        />
        <path
          d="M10 160C40 140 60 100 55 55C40 80 20 95 -5 100Z"
          fill="#C4E8D7"
          opacity="0.75"
        />
      </svg>

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* SECTION HEADER */}
        <div style={{ maxWidth: '640px', marginBottom: '28px' }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: '700',
              color: 'var(--primary-teal)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px'
            }}
          >
            Location
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.95rem, 3.2vw, 2.5rem)',
              lineHeight: 1.2,
              fontWeight: 500,
              color: 'var(--deep-teal)',
              marginBottom: '8px'
            }}
          >
            Clinic location and hours.
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
            Our clinic address, contact desk, and outpatient consultation hours.
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT: MAP (LEFT) & EXTERIOR PHOTO + DETAILS CARD (RIGHT) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '28px',
            alignItems: 'stretch'
          }}
          className="location-grid-container"
        >
          {/* LEFT: INTERACTIVE GOOGLE MAP WITH RATING OVERLAY */}
          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              minHeight: '440px',
              backgroundColor: 'var(--mint-light)',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <iframe
              title={`Map of ${clinic.name}`}
              src={getMapEmbedUrl(currentBranch.mapQuery)}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '440px', display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* GOOGLE MAP FLOATING CARD OVERLAY */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '12px 14px',
                boxShadow: '0 4px 16px rgba(15, 79, 74, 0.12)',
                border: '1px solid var(--border-color)',
                maxWidth: '240px',
                fontSize: '0.78rem'
              }}
            >
              <div style={{ fontWeight: '700', color: 'var(--deep-teal)', fontSize: '0.85rem' }}>
                Jeevak Clinic
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem', margin: '2px 0 6px' }}>
                C-04, Shakti Vihar Gali No 6, Meethapur, New Delhi, 110044
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#d97706', fontWeight: '700' }}>4.7 ★★★★★ (14)</span>
                <a
                  href={getDirectionsUrl(currentBranch.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary-teal)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <span>Open in Maps</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: EXTERIOR PHOTO + CONTACT & OPERATING HOURS CARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* CLINIC EXTERIOR PHOTOGRAPH WITH BRANDED BADGE */}
            <div
              style={{
                height: '190px',
                borderRadius: '18px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--mint-light)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900"
                alt="Jeevak Clinic exterior and Meethapur consultation facility"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                loading="lazy"
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.76rem',
                  fontWeight: '700',
                  color: 'var(--deep-teal)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                Jeevak Clinic (जीवक क्लीनिक)
              </div>
            </div>

            {/* CLINIC DETAILS CARD */}
            <div
              className="card-interactive"
              style={{
                backgroundColor: 'var(--warm-cream)',
                borderRadius: '18px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)',
                flex: 1,
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--deep-teal)', margin: '0 0 14px' }}>
                  Main Clinic - Meethapur
                </h3>

                {/* ADDRESS */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <div className="mint-icon-box" style={{ width: '34px', height: '34px', borderRadius: '10px' }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.70rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Address
                    </div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: '500', lineHeight: 1.45 }}>
                      {currentBranch.address}
                    </div>
                  </div>
                </div>

                {/* PHONE */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <div className="mint-icon-box" style={{ width: '34px', height: '34px', borderRadius: '10px' }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.70rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Phone Desk
                    </div>
                    <a
                      href={`tel:${currentBranch.phone}`}
                      style={{ fontSize: '0.94rem', color: 'var(--primary-teal)', fontWeight: '700', textDecoration: 'none' }}
                    >
                      {currentBranch.phone}
                    </a>
                  </div>
                </div>

                {/* CONSULTATION HOURS */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--deep-teal)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="var(--primary-teal)" />
                    <span>Consultation Hours</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: '600' }}>Mon - Fri</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span>Saturday & Sunday</span>
                      <span style={{ fontWeight: '600', color: '#991b1b' }}>Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <a
                  href={getDirectionsUrl(currentBranch.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, textDecoration: 'none', fontWeight: '600', minWidth: '120px' }}
                >
                  <Navigation size={14} />
                  <span>Get directions</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="btn btn-secondary btn-sm"
                  style={{ fontWeight: '500' }}
                >
                  {copiedText ? <Check size={14} color="var(--primary-teal)" /> : <Copy size={14} />}
                  <span>{copiedText ? 'Copied' : 'Copy address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LandingLocations;
