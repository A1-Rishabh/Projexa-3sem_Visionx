import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, Stethoscope, Phone, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Logo } from '../common/Logo';
import { clinic, isPlaceholder } from '../../config/clinic';

export const LandingNavbar = ({ onNavigateToAuth, onNavigateToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About Clinic', href: '#about' },
    { label: 'Specialties', href: '#departments' },
    { label: 'Specialists', href: '#doctors' },
    { label: 'Why Jivaka', href: '#why-us' },
    { label: 'Location & Hours', href: '#locations' }
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateToSection) {
      onNavigateToSection(href.replace('#', ''));
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const branch = clinic.branches?.[0] || {};
  const emergencyPhone = !isPlaceholder(branch.emergency) ? branch.emergency : '1800-200-4567';
  const generalPhone = !isPlaceholder(branch.phone) ? branch.phone : '+91 98765 43210';

  return (
    <header
      className={`landing-navbar-wrapper ${isScrolled ? 'is-scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease'
      }}
    >
      {/* 1. TOP INSTITUTIONAL UTILITY BAR */}
      <div
        className="institutional-top-bar"
        style={{
          backgroundColor: 'var(--deep-teal)',
          color: '#ffffff',
          fontSize: '0.80rem',
          padding: '6px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* LEFT: EMERGENCY & HOURS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fca5a5', fontWeight: '700' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 8px #ef4444'
                }}
              />
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>24/7 Emergency Triage:</span>
              <a
                href={`tel:${emergencyPhone}`}
                style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}
              >
                {emergencyPhone}
              </a>
            </div>

            <div className="top-bar-hours" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#bcd0cb' }}>
              <Clock size={13} color="var(--mint)" />
              <span>OPD Hours: Mon – Sat: 8:00 AM – 8:00 PM</span>
            </div>
          </div>

          {/* RIGHT: ACCREDITATION & DESK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: 'var(--mint)',
                fontWeight: '600',
                fontSize: '0.78rem'
              }}
            >
              <ShieldCheck size={14} />
              <span>NABH Accredited Healthcare Center</span>
            </div>

            <div className="top-bar-helpdesk" style={{ color: '#bcd0cb' }}>
              <span>Desk: </span>
              <a
                href={`tel:${generalPhone}`}
                style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '600' }}
              >
                {generalPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div
        className={`landing-navbar ${isScrolled ? 'frosted-navbar' : ''}`}
        style={{
          backgroundColor: isScrolled ? 'rgba(250, 246, 236, 0.94)' : 'var(--warm-cream)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? '1px solid rgba(15, 79, 74, 0.12)' : '1px solid rgba(15, 79, 74, 0.05)',
          boxShadow: isScrolled ? '0 4px 20px rgba(15, 79, 74, 0.06)' : 'none',
          transition: 'all 0.25s ease'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '74px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          {/* LOGO */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            aria-label="Jivaka Clinic Homepage"
          >
            <Logo size="medium" theme="dark" variant="full" />
          </a>

          {/* DESKTOP NAV LINKS */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px'
            }}
            className="desktop-nav-links"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  fontWeight: '600',
                  transition: 'color 0.2s ease',
                  padding: '8px 4px',
                  position: 'relative'
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-teal)')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* DESKTOP AUTH BUTTONS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            className="desktop-auth-actions"
          >
            <button
              type="button"
              onClick={() => onNavigateToAuth('doctor')}
              className="btn btn-outline-teal btn-sm"
              style={{
                borderRadius: '9999px',
                padding: '8px 18px',
                fontSize: '0.86rem',
                fontWeight: '600'
              }}
            >
              <Stethoscope size={15} />
              <span>Doctor Portal</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToAuth('patient')}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: '9999px',
                padding: '8px 24px',
                fontSize: '0.88rem',
                fontWeight: '700',
                boxShadow: '0 2px 10px rgba(15, 107, 99, 0.3)'
              }}
            >
              <User size={15} />
              <span>Sign In</span>
            </button>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="mobile-hamburger-btn"
            style={{
              display: 'none',
              padding: '8px',
              color: 'var(--deep-teal)',
              borderRadius: '8px',
              minWidth: '44px',
              minHeight: '44px',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--mint)'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu-drawer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '20px 24px 28px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {/* MOBILE QUICK HELPLINE */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#dc2626',
                fontSize: '0.85rem',
                fontWeight: '700'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>Emergency:</span>
              </div>
              <a href={`tel:${emergencyPhone}`} style={{ color: '#dc2626', textDecoration: 'none' }}>
                {emergencyPhone}
              </a>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                {link.label}
              </a>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToAuth('patient');
                }}
                className="btn btn-primary btn-block"
              >
                <User size={16} />
                <span>Sign In (Patient Portal)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToAuth('doctor');
                }}
                className="btn btn-outline-teal btn-block"
              >
                <Stethoscope size={16} />
                <span>Doctor / Staff Login</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingNavbar;

