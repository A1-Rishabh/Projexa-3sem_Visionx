import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, Stethoscope } from 'lucide-react';
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
    { label: 'About', href: '#about' },
    { label: 'Departments', href: '#departments' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Location', href: '#locations' }
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
      {/* MAIN NAVIGATION BAR */}
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
            height: '70px',
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
                  fontWeight: '500',
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
              <span>Staff Login</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToAuth('patient')}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: '9999px',
                padding: '8px 22px',
                fontSize: '0.88rem',
                fontWeight: '600',
                boxShadow: '0 2px 10px rgba(15, 107, 99, 0.25)'
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
                <span>Sign In</span>
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
                <span>Staff Login</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingNavbar;

