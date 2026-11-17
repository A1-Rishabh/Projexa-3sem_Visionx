import React from 'react';
import { ArrowLeft, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';
import { Logo } from '../common/Logo';
import { clinic } from '../../config/clinic';

export const AuthLayout = ({ children, title, subtitle, onBackToHome }) => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--warm-cream)'
      }}
      className="auth-split-wrapper"
    >
      {/* LEFT/BRANDED PANEL (45% DESKTOP, HIDDEN OR TOP BANNER ON MOBILE) */}
      <div
        style={{
          width: '45%',
          backgroundColor: 'var(--deep-teal)',
          color: '#ffffff',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="auth-branded-panel"
      >
        {/* WARM BACKGROUND GLOW DECORATION */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232, 162, 92, 0.18) 0%, rgba(15, 79, 74, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* TOP BRAND HEADER */}
        <div>
          <div style={{ marginBottom: '32px' }}>
            <Logo size="medium" theme="light" variant="full" />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(220, 239, 230, 0.15)',
              color: 'var(--mint)',
              fontSize: '0.8rem',
              fontWeight: '700',
              marginBottom: '16px'
            }}
          >
            <ShieldCheck size={14} />
            <span>Encrypted Health Information Exchange</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.1rem',
              fontWeight: '700',
              color: '#ffffff',
              lineHeight: 1.3,
              marginBottom: '16px'
            }}
          >
            Connected clinical care designed for patient privacy.
          </h2>

          <p style={{ color: '#d1e5df', fontSize: '1rem', lineHeight: 1.6, maxWidth: '440px' }}>
            Sign into your account to book doctor consultations, review diagnostic lab reports, manage prescription refills, and review visit history.
          </p>
        </div>

        {/* MID TRUST BULLETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '32px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#ffffff' }}>
            <div className="mint-icon-box" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }}>
              <CheckCircle size={15} color="var(--primary-teal)" />
            </div>
            <span>Instant booking confirmation with room numbers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#ffffff' }}>
            <div className="mint-icon-box" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }}>
              <CheckCircle size={15} color="var(--primary-teal)" />
            </div>
            <span>Downloadable medical receipts and diagnostic PDFs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#ffffff' }}>
            <div className="mint-icon-box" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }}>
              <CheckCircle size={15} color="var(--primary-teal)" />
            </div>
            <span>Complete patient privacy and HIPAA-aligned storage</span>
          </div>
        </div>

        {/* BOTTOM METADATA */}
        <div style={{ fontSize: '0.82rem', color: '#9bb8b2', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px' }}>
          © {new Date().getFullYear()} {clinic.name}. Outpatient clinical operations.
        </div>
      </div>

      {/* RIGHT/FORM PANEL (55% DESKTOP, 100% MOBILE) */}
      <div
        style={{
          width: '55%',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflowY: 'auto'
        }}
        className="auth-form-panel"
      >
        <div style={{ width: '100%', maxWidth: '480px' }}>
          
          {/* BACK TO CLINIC LINK */}
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary-teal)',
                fontSize: '0.88rem',
                fontWeight: '600',
                marginBottom: '28px',
                padding: '6px 0'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to clinic homepage</span>
            </button>
          )}

          {/* CARD CONTAINER */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '36px 32px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {(title || subtitle) && (
              <div style={{ marginBottom: '24px' }}>
                {title && (
                  <h1
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      color: 'var(--deep-teal)',
                      marginBottom: '6px'
                    }}
                  >
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
