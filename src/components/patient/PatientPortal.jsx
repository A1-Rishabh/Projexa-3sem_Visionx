import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Search, 
  Calendar, 
  FileText, 
  User, 
  LogOut, 
  ShieldCheck, 
  Heart,
  ChevronDown,
  ArrowLeft,
  Users,
  MessageSquare,
  Moon,
  Sun,
  Type,
  Check
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { BottomTabBar } from '../common/BottomTabBar';
import { getDoctors } from '../../services/mockDataStore';

import { InfoHub } from './InfoHub';
import { DoctorDirectory } from './DoctorDirectory';
import { BookingWizardModal } from './BookingWizardModal';
import { PatientAppointments } from './PatientAppointments';
import { PatientMedicalRecords } from './PatientMedicalRecords';
import { PatientProfile } from './PatientProfile';
import { CareTeamMessagingModal } from './CareTeamMessagingModal';

export const PatientPortal = ({ session, onLogout, showToast, initialBookingPref }) => {
  const [currentPatient, setCurrentPatient] = useState(session?.user || {});
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Booking Wizard Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Theme & Accessibility Mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return typeof document !== 'undefined' && (
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      localStorage.getItem('jivaka_theme') === 'dark'
    );
  });

  const [isLargeText, setIsLargeText] = useState(() => {
    return typeof document !== 'undefined' && (
      document.documentElement.getAttribute('data-text-size') === 'large' ||
      localStorage.getItem('jivaka_text_size') === 'large'
    );
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isLargeText) {
      document.documentElement.setAttribute('data-text-size', 'large');
    } else {
      document.documentElement.removeAttribute('data-text-size');
    }
  }, [isLargeText]);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('jivaka_theme', next ? 'dark' : 'light');
    if (showToast) showToast(next ? 'Dark mode enabled' : 'Light mode restored', 'info');
  };

  const toggleLargeText = () => {
    const next = !isLargeText;
    setIsLargeText(next);
    localStorage.setItem('jivaka_text_size', next ? 'large' : 'default');
    if (showToast) showToast(next ? 'Large text enabled' : 'Standard text size restored', 'info');
  };

  // Family Dependents
  const familyMembers = [
    { id: 'P-1001', name: 'John Doe', relation: 'Self', bloodGroup: 'A+', allergies: 'Penicillin' },
    { id: 'P-1002', name: 'Jane Doe', relation: 'Spouse', bloodGroup: 'B+', allergies: 'Sulfa Drugs' },
    { id: 'P-1003', name: 'Leo Doe', relation: 'Child', bloodGroup: 'O+', allergies: 'None' }
  ];

  const switchDependent = (member) => {
    setCurrentPatient(prev => ({
      ...prev,
      ...member,
      email: prev.email || 'patient@jivakaclinic.in'
    }));
    setIsProfileDropdownOpen(false);
    if (showToast) {
      showToast(`Switched active profile to ${member.name} (${member.relation})`, 'success');
    }
  };

  useEffect(() => {
    if (initialBookingPref?.doctorId) {
      const doctors = getDoctors();
      const targetDoc = doctors.find((d) => d.id === initialBookingPref.doctorId);
      if (targetDoc) {
        setBookingDoctor(targetDoc);
        setIsBookingOpen(true);
      }
    } else if (initialBookingPref?.department) {
      setActiveTab('doctors');
    }
  }, [initialBookingPref]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleStartBooking = (doctor) => {
    setBookingDoctor(doctor);
    setIsBookingOpen(true);
  };

  // Exactly 4 items for the main navbar as specified
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'doctors', label: 'Find a Doctor', icon: Search },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'records', label: 'Records', icon: FileText }
  ];

  // User initials helper
  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] || 'P').toUpperCase();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--warm-cream)' }}>
      
      {/* TOP FROSTED NAVIGATION BAR */}
      <header
        className="frosted-navbar-dark portal-header-content"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: '70px',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* LOGO */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          role="button"
          tabIndex={0}
          aria-label="Jivaka Clinic Dashboard Home"
          onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('home'); }}
        >
          <Logo size="medium" theme="light" />
        </div>

        {/* DESKTOP NAV LINKS (4 ITEMS) */}
        <nav 
          className="portal-desktop-nav"
          aria-label="Primary Navigation"
          style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '9999px',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.88rem',
                  transition: 'all 0.18s ease',
                  backgroundColor: isActive ? 'var(--primary-teal)' : 'transparent',
                  color: isActive ? '#ffffff' : '#DCEFE6',
                  boxShadow: isActive ? '0 2px 8px rgba(15, 107, 99, 0.35)' : 'none',
                  minHeight: '44px'
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS: MESSAGING & USER PROFILE CHIP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* CARE TEAM MESSAGES BUTTON */}
          <button
            type="button"
            onClick={() => setIsMessagingOpen(true)}
            aria-label="Care Team Messages"
            title="Care Team Messages & Consultations"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              cursor: 'pointer',
              minHeight: '44px',
              fontSize: '0.82rem',
              fontWeight: '600',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MessageSquare size={16} color="#DCEFE6" />
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-4px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--warm-accent)'
                }}
              />
            </div>
            <span className="hidden-mobile">Care Team</span>
          </button>

          {/* USER PROFILE CHIP & DROPDOWN */}
          <div style={{ position: 'relative' }} ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              aria-expanded={isProfileDropdownOpen}
              aria-haspopup="true"
              aria-label="User account menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px 6px 8px',
                borderRadius: '9999px',
                backgroundColor: isProfileDropdownOpen ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '44px'
              }}
            >
              {/* Initials Avatar */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--mint)',
                  color: 'var(--deep-teal)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {getInitials(currentPatient.name)}
              </div>

              {/* Name and ID */}
              <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff' }}>
                  {currentPatient.name || 'Patient'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#DCEFE6', opacity: 0.9 }}>
                  ID: {currentPatient.id || 'P-1001'}
                </div>
              </div>

              <ChevronDown 
                size={16} 
                color="#DCEFE6"
                style={{ 
                  transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  marginLeft: '2px'
                }} 
              />
            </button>

            {/* PROFILE DROPDOWN MENU */}
            {isProfileDropdownOpen && (
              <div
                role="menu"
                aria-orientation="vertical"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '280px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-color)',
                  zIndex: 250,
                  overflow: 'hidden',
                  animation: 'fadeUp 0.18s ease-out'
                }}
              >
                {/* Dropdown Header */}
                <div style={{ padding: '14px 16px', backgroundColor: 'var(--warm-cream)', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {currentPatient.name || 'Patient'}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentPatient.email || 'patient@jivakaclinic.in'}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: '6px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--mint)', color: 'var(--primary-teal)', fontSize: '0.72rem', fontWeight: '700' }}>
                    Active: {currentPatient.relation || 'Primary Account'} • ID: {currentPatient.id || 'P-1001'}
                  </div>
                </div>

                {/* Main Account Links */}
                <div style={{ padding: '6px' }}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setActiveTab('profile');
                      setIsProfileDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.86rem',
                      fontWeight: '600',
                      color: activeTab === 'profile' ? 'var(--primary-teal)' : 'var(--text-main)',
                      backgroundColor: activeTab === 'profile' ? 'var(--mint)' : 'transparent',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      minHeight: '44px'
                    }}
                  >
                    <User size={16} color="var(--primary-teal)" />
                    <span>Profile Settings</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setActiveTab('profile');
                      setIsProfileDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.86rem',
                      fontWeight: '600',
                      color: 'var(--text-main)',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      minHeight: '44px'
                    }}
                  >
                    <ShieldCheck size={16} color="var(--primary-teal)" />
                    <span>Emergency Card</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMessagingOpen(true);
                      setIsProfileDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.86rem',
                      fontWeight: '600',
                      color: 'var(--text-main)',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      minHeight: '44px'
                    }}
                  >
                    <MessageSquare size={16} color="var(--primary-teal)" />
                    <span>Care Team Messages</span>
                  </button>
                </div>

                {/* FAMILY / DEPENDENTS SECTION */}
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '8px 6px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-secondary)', padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Family / Dependents
                  </div>
                  {familyMembers.map((member) => {
                    const isSelected = (currentPatient.id === member.id) || (!currentPatient.id && member.id === 'P-1001');
                    return (
                      <button
                        key={member.id}
                        type="button"
                        role="menuitem"
                        onClick={() => switchDependent(member)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? '700' : '500',
                          color: isSelected ? 'var(--deep-teal)' : 'var(--text-main)',
                          backgroundColor: isSelected ? 'var(--mint)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          minHeight: '40px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Users size={14} color={isSelected ? 'var(--primary-teal)' : 'var(--text-secondary)'} />
                          <span>{member.name} ({member.relation})</span>
                        </div>
                        {isSelected && <Check size={14} color="var(--primary-teal)" />}
                      </button>
                    );
                  })}
                </div>

                {/* ACCESSIBILITY & DISPLAY SECTION */}
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '8px 6px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-secondary)', padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Display & Accessibility
                  </div>
                  
                  {/* Dark Mode Toggle */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={toggleDarkMode}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      color: 'var(--text-main)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      minHeight: '40px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isDarkMode ? <Sun size={15} color="var(--warm-accent)" /> : <Moon size={15} color="var(--primary-teal)" />}
                      <span>Theme: {isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: isDarkMode ? 'var(--warm-accent)' : 'var(--primary-teal)', fontWeight: '700' }}>
                      {isDarkMode ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Larger Text Toggle */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={toggleLargeText}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      color: 'var(--text-main)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      minHeight: '40px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Type size={15} color="var(--primary-teal)" />
                      <span>Text Size: {isLargeText ? 'Large (112%)' : 'Standard'}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: isLargeText ? 'var(--primary-teal)' : 'var(--text-secondary)', fontWeight: '700' }}>
                      {isLargeText ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '2px 0' }} />

                {/* Neutral "Log out" button (NOT RED) */}
                <div style={{ padding: '6px' }}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onLogout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.86rem',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      minHeight: '44px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--warm-cream)';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <LogOut size={16} color="var(--text-secondary)" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main 
        className="portal-main-container"
        style={{ 
          padding: '24px 20px', 
          flex: 1, 
          maxWidth: '1200px', 
          margin: '0 auto', 
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {activeTab === 'home' && (
          <InfoHub 
            patient={currentPatient} 
            onNavigateToDoctors={() => setActiveTab('doctors')} 
            onNavigateToAppointments={() => setActiveTab('appointments')}
            onNavigateToRecords={() => setActiveTab('records')}
            onNavigateToProfile={() => setActiveTab('profile')}
            showToast={showToast}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorDirectory onSelectDoctorToBook={handleStartBooking} />
        )}

        {activeTab === 'appointments' && (
          <PatientAppointments 
            patient={currentPatient} 
            showToast={showToast} 
            onBookNew={(doc) => doc ? handleStartBooking(doc) : setActiveTab('doctors')}
          />
        )}

        {activeTab === 'records' && (
          <PatientMedicalRecords patient={currentPatient} showToast={showToast} />
        )}

        {activeTab === 'profile' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>
            </div>
            <PatientProfile
              patient={currentPatient}
              onUpdatePatient={(p) => setCurrentPatient(p)}
              showToast={showToast}
            />
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3-STEP BOOKING WIZARD MODAL */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedDoctor={bookingDoctor}
        patient={currentPatient}
        onBookingConfirmed={() => setActiveTab('appointments')}
        showToast={showToast}
      />

      {/* CARE TEAM MESSAGING MODAL */}
      <CareTeamMessagingModal
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        patient={currentPatient}
        showToast={showToast}
      />

    </div>
  );
};

export default PatientPortal;
