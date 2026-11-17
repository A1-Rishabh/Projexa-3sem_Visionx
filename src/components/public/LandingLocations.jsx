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
  Compass 
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
  const isEmailPlaceholder = isPlaceholder(currentBranch?.email);
  const isEmergencyPlaceholder = isPlaceholder(currentBranch?.emergency);

  // Copy address handler
  const handleCopyAddress = () => {
    if (isAddressPlaceholder || !currentBranch?.address) return;
    navigator.clipboard.writeText(currentBranch.address);
    setCopiedText(true);
    if (showToast) showToast('Address copied to clipboard', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Optional "Use my location" handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocationMessage('Locating nearest clinic...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // We do NOT store coordinates per spec
        setLocationMessage(`Showing nearest branch: ${isPlaceholder(currentBranch.label) ? 'Main Clinic' : currentBranch.label}`);
        setTimeout(() => setLocationMessage(''), 4000);
      },
      (err) => {
        // Fails gracefully
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
        padding: '80px 24px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
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
            Find Us
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              lineHeight: 1.25,
              color: 'var(--deep-teal)',
              marginBottom: '12px'
            }}
          >
            Clinic Location & Visiting Hours
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Centrally located with convenient parking, accessible ramps, and on-site diagnostic collection.
          </p>

          {/* OPTIONAL USE MY LOCATION BUTTON */}
          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '9999px', gap: '6px' }}
            >
              <Compass size={15} color="var(--primary-teal)" />
              <span>Use my location</span>
            </button>
            {locationMessage && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                {locationMessage}
              </div>
            )}
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
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '32px',
            alignItems: 'stretch'
          }}
          className="location-grid-container"
        >
          {/* MAP OR PLACEHOLDER MINT PANEL */}
          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              minHeight: '380px',
              backgroundColor: 'var(--mint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {isQueryPlaceholder ? (
              /* CLEAN MINT PANEL WHEN QUERY IS STILL [BRACKETED] */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 24px',
                  textAlign: 'center',
                  color: 'var(--deep-teal)'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 4px 14px rgba(15, 79, 74, 0.1)'
                  }}
                >
                  <MapPin size={30} color="var(--primary-teal)" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.35rem',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}
                >
                  Clinic location coming soon
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
                  Branch details and map coordinates are being finalized by clinic administration.
                </p>
              </div>
            ) : (
              /* REAL GOOGLE MAPS EMBED IFRAME */
              <iframe
                title={`Map of ${clinic.name} - ${currentBranch?.label || 'Main Branch'}`}
                src={getMapEmbedUrl(currentBranch.mapQuery)}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px', display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>

          {/* INFO CARD */}
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
              gap: '24px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* BRANCH LABEL & STATUS BADGE */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--deep-teal)', margin: 0 }}>
                  {isPlaceholder(currentBranch.label) ? clinic.name : currentBranch.label}
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
                  <span>Open Now</span>
                </span>
              </div>

              {/* ADDRESS */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="mint-icon-box" style={{ width: '38px', height: '38px' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Address
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '600', lineHeight: 1.5 }}>
                    {currentBranch.address}
                  </div>
                </div>
              </div>

              {/* PHONE */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="mint-icon-box" style={{ width: '38px', height: '38px' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Phone Consultation Desk
                  </div>
                  {isPhonePlaceholder ? (
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '600' }}>
                      {currentBranch.phone}
                    </div>
                  ) : (
                    <a
                      href={`tel:${currentBranch.phone}`}
                      style={{ fontSize: '0.95rem', color: 'var(--primary-teal)', fontWeight: '700', textDecoration: 'none' }}
                    >
                      {currentBranch.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* EMERGENCY NUMBER */}
              {currentBranch.emergency && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="mint-icon-box" style={{ width: '38px', height: '38px', backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase' }}>
                      Emergency Triage Line
                    </div>
                    {isEmergencyPlaceholder ? (
                      <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: '600' }}>
                        {currentBranch.emergency}
                      </div>
                    ) : (
                      <a
                        href={`tel:${currentBranch.emergency}`}
                        style={{ fontSize: '0.92rem', color: '#dc2626', fontWeight: '700', textDecoration: 'none' }}
                      >
                        {currentBranch.emergency}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* OPERATING HOURS TABLE */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--deep-teal)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="var(--primary-teal)" />
                  <span>Consultation Hours</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentBranch.hours?.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>{h.days}</span>
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ACTION BUTTONS (ONLY VISIBLE WHEN VALUES ARE NOT BRACKETED) */}
            {!isAddressPlaceholder && !isQueryPlaceholder && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <a
                  href={getDirectionsUrl(currentBranch.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, textDecoration: 'none', minWidth: '130px' }}
                >
                  <Navigation size={15} />
                  <span>Get directions</span>
                </a>

                {!isPhonePlaceholder && (
                  <a
                    href={`tel:${currentBranch.phone}`}
                    className="btn btn-secondary btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    <Phone size={15} />
                    <span>Call now</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="btn btn-secondary btn-sm"
                >
                  {copiedText ? <Check size={15} color="var(--primary-teal)" /> : <Copy size={15} />}
                  <span>{copiedText ? 'Copied' : 'Copy address'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default LandingLocations;

