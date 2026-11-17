import React, { useState } from 'react';
import { Calendar, Stethoscope, MapPin, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { clinic, isPlaceholder } from '../../config/clinic';

export const LandingHero = ({ onStartBooking, onSignIn }) => {
  const [selectedDept, setSelectedDept] = useState('General Medicine');
  const [selectedBranch, setSelectedBranch] = useState(clinic.branches[0]?.id || 'main');
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const departments = [
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Neurology',
    'Orthopedics',
    'Diagnostics'
  ];

  const handleQuickBookSubmit = (e) => {
    e.preventDefault();
    onStartBooking({ department: selectedDept, branch: selectedBranch, date: selectedDate });
  };

  const showBranchSelector = clinic.branches && clinic.branches.length > 1;

  return (
    <section
      className="landing-hero-section"
      style={{
        position: 'relative',
        padding: '56px 24px 80px',
        maxWidth: '1280px',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '48px',
          alignItems: 'center'
        }}
        className="hero-grid-container"
      >
        {/* LEFT COLUMN: HEADLINE, SUPPORT TEXT, ACTION BUTTONS, TRUST PILLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* ANNOUNCEMENT / TRUST BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--mint)',
              color: 'var(--deep-teal)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: '700',
              width: 'fit-content',
              border: '1px solid rgba(15, 107, 99, 0.15)'
            }}
          >
            <ShieldCheck size={16} color="var(--primary-teal)" />
            <span>NABH Accredited In-Clinic Care • Verified Physicians</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
              lineHeight: 1.18,
              fontWeight: '700',
              color: 'var(--deep-teal)',
              letterSpacing: 'normal'
            }}
          >
            Personalized healthcare rooted in clinical trust and compassion.
          </h1>

          {/* SUPPORT TEXT (ONE LINE / CONCISE) */}
          <p
            style={{
              fontSize: '1.12rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '560px'
            }}
          >
            Experience thoughtful, unhurried consultations with senior doctors, on-site diagnostics, and seamless digital medical records.
          </p>

          {/* TWO PRIMARY BUTTONS */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => onStartBooking({ department: selectedDept })}
              className="btn btn-primary"
              style={{
                fontSize: '1rem',
                padding: '12px 28px',
                borderRadius: '9999px',
                boxShadow: '0 4px 14px rgba(15, 107, 99, 0.35)'
              }}
            >
              <span>Book an appointment</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onSignIn}
              className="btn btn-secondary"
              style={{
                fontSize: '1rem',
                padding: '12px 26px',
                borderRadius: '9999px'
              }}
            >
              <span>Sign in</span>
            </button>
          </div>

          {/* KEY TRUST BULLETS */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600' }}>
              <CheckCircle size={16} color="var(--primary-teal)" />
              <span>Zero waiting queue with reserved slots</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600' }}>
              <Clock size={16} color="var(--primary-teal)" />
              <span>Same-day appointment availability</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HERO IMAGE + QUICK BOOKING CARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* HERO IMAGE CONTAINER */}
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              aspectRatio: '16 / 10',
              backgroundColor: 'var(--mint-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="/images/hero.webp"
              alt="Compassionate healthcare consultation at Jivaka Clinic"
              loading="eager"
              width="600"
              height="375"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                // Fallback to warm visual card if WebP placeholder is not yet replaced
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* ILLUSTRATIVE CARD OVERLAY */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(15, 79, 74, 0.85) 0%, rgba(15, 107, 99, 0.75) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '24px',
                color: '#ffffff'
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--mint)', fontWeight: '700', marginBottom: '4px' }}>
                Jivaka Center of Clinical Excellence
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '700' }}>
                Dedicated Outpatient Clinics & Diagnostics
              </div>
            </div>
          </div>

          {/* QUICK-BOOKING CARD */}
          <div
            className="card-interactive"
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div className="mint-icon-box" style={{ width: '38px', height: '38px' }}>
                <Stethoscope size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
                  Quick Appointment Booking
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Select specialty to view open consultation hours
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: showBranchSelector ? '1fr 1fr' : '1fr', gap: '12px' }}>
                
                {/* DEPARTMENT DROPDOWN */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="quick-dept-select">Department / Specialty</label>
                  <select
                    id="quick-dept-select"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* LOCATION DROPDOWN (ONLY IF >1 BRANCH) */}
                {showBranchSelector && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="quick-branch-select">Clinic Branch</label>
                    <select
                      id="quick-branch-select"
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      {clinic.branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {isPlaceholder(b.label) ? 'Main Clinic' : b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* DATE PICKER */}
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="quick-date-select">Preferred Date</label>
                <input
                  id="quick-date-select"
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                style={{ marginTop: '4px', borderRadius: '12px', fontWeight: '700' }}
              >
                <span>Find Available Doctor</span>
                <ArrowRight size={16} />
              </button>
            </form>
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
          boxShadow: '0 -4px 16px rgba(15, 79, 74, 0.1)',
          zIndex: 99,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Need to see a doctor?
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--deep-teal)' }}>
            Consultation from ₹800
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStartBooking({ department: selectedDept })}
          className="btn btn-primary"
          style={{
            padding: '10px 20px',
            borderRadius: '9999px',
            fontSize: '0.92rem',
            boxShadow: '0 2px 10px rgba(15, 107, 99, 0.3)'
          }}
        >
          <span>Book appointment</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default LandingHero;
