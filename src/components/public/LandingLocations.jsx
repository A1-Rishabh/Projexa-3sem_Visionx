import React, { useState } from 'react';
import { MapPin, Phone, Clock, AlertCircle, Copy, Check, Navigation } from 'lucide-react';
import { clinic, isPlaceholder, getMapEmbedUrl, getDirectionsUrl } from '../../config/clinic';

export const LandingLocations = ({ showToast }) => {
  const [activeBranchId, setActiveBranchId] = useState(clinic.branches[0]?.id || 'main');
  const [copiedText, setCopiedText] = useState(false);

  const branches = clinic.branches || [];
  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0] || {};
  const hasMultipleBranches = branches.length > 1;

  const isQueryPlaceholder = isPlaceholder(currentBranch?.mapQuery);
  const isAddressPlaceholder = isPlaceholder(currentBranch?.address);
  const isPhonePlaceholder = isPlaceholder(currentBranch?.phone);
  const isEmergencyPlaceholder = isPlaceholder(currentBranch?.emergency);

  // Copy address handler
  const handleCopyAddress = () => {
    if (isAddressPlaceholder || !currentBranch?.address) return;
    navigator.clipboard.writeText(currentBranch.address);
    setCopiedText(true);
    if (showToast) showToast('Address copied to clipboard', 'success');
    setTimeout(() => setCopiedText(false), 2000);
  };

  const hasRealMap = !isAddressPlaceholder && !isQueryPlaceholder;

  return (
    <section
      id="locations"
      style={{
        padding: '64px 24px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* SECTION HEADER */}
        <div style={{ maxWidth: '640px', marginBottom: '36px' }}>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: '600',
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
              fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)',
              lineHeight: 1.25,
              fontWeight: 500,
              color: 'var(--deep-teal)',
              marginBottom: '10px'
            }}
          >
            Clinic location and hours.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Our clinic address, contact desk, and outpatient consultation hours.
          </p>
        </div>

        {/* BRANCH SELECTOR TABS (SHOWN AUTOMATICALLY IF >1 BRANCH) */}
        {hasMultipleBranches && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '24px',
              flexWrap: 'wrap'
            }}
          >
            {branches.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveBranchId(b.id)}
                className={`btn ${activeBranchId === b.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ borderRadius: '9999px', padding: '6px 18px' }}
              >
                <MapPin size={14} />
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* LOCATION DISPLAY: MAP OR LOCATION COMING SOON (LEFT) & INFO CARD (RIGHT) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '28px',
            alignItems: 'stretch'
          }}
          className="location-grid-container"
        >
          {/* MAP OR "LOCATION COMING SOON" PANEL */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              minHeight: '340px',
              backgroundColor: 'var(--mint-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {hasRealMap ? (
              /* REAL GOOGLE MAPS EMBED IFRAME */
              <iframe
                title={`Map of ${clinic.name} - ${currentBranch?.label || 'Clinic'}`}
                src={getMapEmbedUrl(currentBranch.mapQuery)}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '340px', display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              /* CLEAN "LOCATION COMING SOON" PANEL */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '36px 24px',
                  textAlign: 'center',
                  color: 'var(--deep-teal)',
                  width: '100%',
                  height: '100%'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <MapPin size={26} color="var(--primary-teal)" />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    marginBottom: '6px',
                    color: 'var(--deep-teal)'
                  }}
                >
                  Location coming soon
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: 1.5, margin: 0 }}>
                  Clinic address and map location will be updated once finalized.
                </p>
              </div>
            )}
          </div>

          {/* CLINIC CONTACT & HOURS CARD */}
          <div
            className="card-interactive"
            style={{
              backgroundColor: 'var(--warm-cream)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* BRANCH LABEL */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 500, color: 'var(--deep-teal)', margin: 0 }}>
                  {currentBranch.label || clinic.name}
                </h3>
              </div>

              {/* ADDRESS */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="mint-icon-box" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                  <MapPin size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Address
                  </div>
                  <div style={{ fontSize: '0.90rem', color: 'var(--text-main)', fontWeight: '500', lineHeight: 1.45 }}>
                    {currentBranch.address}
                  </div>
                </div>
              </div>

              {/* PHONE */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="mint-icon-box" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                  <Phone size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Phone
                  </div>
                  {!isPhonePlaceholder ? (
                    <a
                      href={`tel:${currentBranch.phone}`}
                      style={{ fontSize: '0.90rem', color: 'var(--primary-teal)', fontWeight: '600', textDecoration: 'none' }}
                    >
                      {currentBranch.phone}
                    </a>
                  ) : (
                    <div style={{ fontSize: '0.90rem', color: 'var(--text-main)', fontWeight: '500' }}>
                      {currentBranch.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* EMERGENCY LINE (IF CONFIGURED) */}
              {currentBranch.emergency && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="mint-icon-box" style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#dc2626', textTransform: 'uppercase' }}>
                      Emergency
                    </div>
                    {!isEmergencyPlaceholder ? (
                      <a
                        href={`tel:${currentBranch.emergency}`}
                        style={{ fontSize: '0.90rem', color: '#dc2626', fontWeight: '600', textDecoration: 'none' }}
                      >
                        {currentBranch.emergency}
                      </a>
                    ) : (
                      <div style={{ fontSize: '0.90rem', color: 'var(--text-main)', fontWeight: '500' }}>
                        {currentBranch.emergency}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* OPERATING HOURS */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <div style={{ fontSize: '0.80rem', fontWeight: '600', color: 'var(--deep-teal)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="var(--primary-teal)" />
                  <span>Consultation Hours</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {currentBranch.hours?.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      <span>{h.days}</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              {hasRealMap && (
                <a
                  href={getDirectionsUrl(currentBranch.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, textDecoration: 'none', minWidth: '120px', fontWeight: '600' }}
                >
                  <Navigation size={14} />
                  <span>Get directions</span>
                </a>
              )}

              {!isAddressPlaceholder && (
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="btn btn-secondary btn-sm"
                  style={{ fontWeight: '500' }}
                >
                  {copiedText ? <Check size={14} color="var(--primary-teal)" /> : <Copy size={14} />}
                  <span>{copiedText ? 'Copied' : 'Copy address'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LandingLocations;

