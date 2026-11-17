import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Navigation,
  Compass,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { clinic, isPlaceholder, getMapEmbedUrl, getDirectionsUrl } from '../../config/clinic';

export const LandingLocations = ({ showToast }) => {
  const [activeBranchId, setActiveBranchId] = useState(clinic.branches[0]?.id || 'main');
  const [copiedText, setCopiedText] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  const branches = clinic.branches || [];
  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const hasMultipleBranches = branches.length > 1;

  const isQueryPlaceholder = isPlaceholder(currentBranch?.mapQuery);
  const isAddressPlaceholder = isPlaceholder(currentBranch?.address);
  const isPhonePlaceholder = isPlaceholder(currentBranch?.phone);
  const isEmergencyPlaceholder = isPlaceholder(currentBranch?.emergency);

  const displayAddress = isAddressPlaceholder 
    ? 'Jivaka Health Tower, 4th Cross, Indiranagar, Bengaluru, Karnataka 560038' 
    : currentBranch.address;

  const displayPhone = isPhonePlaceholder 
    ? '+91 98765 43210' 
    : currentBranch.phone;

  const displayEmergency = isEmergencyPlaceholder 
    ? '1800-200-4567' 
    : currentBranch.emergency;

  const clinicAmenities = [
    'Complimentary Patient Valet & Parking',
    'Full Wheelchair Access & Stretcher Lift',
    'On-Site 24/7 Accredited Pharmacy',
    'Air-Conditioned Waiting Lounges'
  ];

  // Copy address handler
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(displayAddress);
    setCopiedText(true);
    if (showToast) showToast('Clinic address copied to clipboard', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Optional "Use my location" handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocationMessage('Locating nearest Jivaka Clinic center...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationMessage(`Showing nearest center: ${isPlaceholder(currentBranch.label) ? 'Main Healthcare Campus' : currentBranch.label}`);
        setTimeout(() => setLocationMessage(''), 4000);
      },
      (err) => {
        setLocationMessage('Location permission was denied or unavailable.');
        setTimeout(() => setLocationMessage(''), 4000);
      },
      { timeout: 8000 }
    );
  };

  return (
    <section
      id="locations"
      style={{
        padding: '88px 24px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--primary-teal)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px'
            }}
          >
            Location & Outpatient Timings
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.1rem, 3.6vw, 2.7rem)',
              lineHeight: 1.22,
              color: 'var(--deep-teal)',
              marginBottom: '14px'
            }}
          >
            Visit Our Main Healthcare Campus.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Centrally situated with direct road access, barrier-free patient drop-off, dedicated wheelchair ramps, and an in-house phlebotomy collection desk.
          </p>

          {/* AMENITIES PILLS */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
            {clinicAmenities.map((amenity) => (
              <span
                key={amenity}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--mint-light)',
                  color: 'var(--deep-teal)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  border: '1px solid rgba(15, 107, 99, 0.12)'
                }}
              >
                <CheckCircle2 size={13} color="var(--primary-teal)" />
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        </div>

        {/* BRANCH SELECTOR TABS (SHOWN AUTOMATICALLY IF >1 BRANCH) */}
        {hasMultipleBranches && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '32px',
              flexWrap: 'wrap'
            }}
          >
            {branches.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveBranchId(b.id)}
                className={`btn ${activeBranchId === b.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '9999px', padding: '8px 24px' }}
              >
                <MapPin size={16} />
                <span>{isPlaceholder(b.label) ? `Branch (${b.id})` : b.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* LOCATION DISPLAY: MAP (LEFT) & INFO CARD (RIGHT) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '32px',
            alignItems: 'stretch'
          }}
          className="location-grid-container"
        >
          {/* MAP OR VISUAL CAMPUS PANEL */}
          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              minHeight: '400px',
              backgroundColor: 'var(--mint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {!isQueryPlaceholder ? (
              /* REAL GOOGLE MAPS EMBED IFRAME */
              <iframe
                title={`Map of ${clinic.name} - ${currentBranch?.label || 'Main Campus'}`}
                src={getMapEmbedUrl(currentBranch.mapQuery)}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px', display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              /* CLEAN ARCHITECTURAL CAMPUS CARD */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 28px',
                  textAlign: 'center',
                  color: 'var(--deep-teal)',
                  width: '100%',
                  height: '100%',
                  minHeight: '400px',
                  background: 'linear-gradient(135deg, rgba(220, 239, 230, 0.5) 0%, rgba(250, 246, 236, 0.9) 100%)'
                }}
              >
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 4px 16px rgba(15, 79, 74, 0.12)'
                  }}
                >
                  <MapPin size={32} color="var(--primary-teal)" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: 'var(--deep-teal)'
                  }}
                >
                  Jivaka Main Healthcare Campus
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.6, marginBottom: '20px' }}>
                  {displayAddress}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '9999px', padding: '8px 22px', fontWeight: '700' }}
                >
                  <Navigation size={15} />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            )}
          </div>

          {/* CLINIC CONTACT & HOURS CARD */}
          <div
            className="card-interactive"
            style={{
              backgroundColor: 'var(--warm-cream)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
              boxShadow: '0 4px 16px rgba(15, 79, 74, 0.05)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* BRANCH LABEL & STATUS BADGE */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--deep-teal)', margin: 0 }}>
                  {isPlaceholder(currentBranch.label) ? 'Main Healthcare Campus' : currentBranch.label}
                </h3>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    backgroundColor: '#dcfce7',
                    color: 'var(--primary-teal)',
                    fontSize: '0.78rem',
                    fontWeight: '700'
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--primary-teal)' }} />
                  <span>OPD Open</span>
                </span>
              </div>

              {/* ADDRESS */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="mint-icon-box" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Physical Address
                  </div>
                  <div style={{ fontSize: '0.94rem', color: 'var(--text-main)', fontWeight: '600', lineHeight: 1.5 }}>
                    {displayAddress}
                  </div>
                </div>
              </div>

              {/* PHONE */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="mint-icon-box" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    OPD Appointments & Helpdesk
                  </div>
                  <a
                    href={`tel:${displayPhone}`}
                    style={{ fontSize: '0.95rem', color: 'var(--primary-teal)', fontWeight: '700', textDecoration: 'none' }}
                  >
                    {displayPhone}
                  </a>
                </div>
              </div>

              {/* EMERGENCY LINE */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="mint-icon-box" style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#dc2626' }}>
                  <AlertCircle size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase' }}>
                    24/7 Emergency Triage Line
                  </div>
                  <a
                    href={`tel:${displayEmergency}`}
                    style={{ fontSize: '0.94rem', color: '#dc2626', fontWeight: '700', textDecoration: 'none' }}
                  >
                    {displayEmergency}
                  </a>
                </div>
              </div>

              {/* OPERATING HOURS TABLE */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--deep-teal)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="var(--primary-teal)" />
                  <span>Outpatient Consultation Hours</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    <span>Monday – Saturday</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>8:00 AM – 8:00 PM</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    <span>Sunday</span>
                    <span style={{ fontWeight: '600', color: 'var(--primary-teal)' }}>Emergency Triage & In-House Lab Only</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ flex: 1, textDecoration: 'none', minWidth: '130px', fontWeight: '700' }}
              >
                <Navigation size={15} />
                <span>Get directions</span>
              </a>

              <a
                href={`tel:${displayPhone}`}
                className="btn btn-secondary btn-sm"
                style={{ textDecoration: 'none', fontWeight: '600' }}
              >
                <Phone size={15} />
                <span>Call clinic</span>
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="btn btn-secondary btn-sm"
              >
                {copiedText ? <Check size={15} color="var(--primary-teal)" /> : <Copy size={15} />}
                <span>{copiedText ? 'Copied' : 'Copy address'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LandingLocations;

