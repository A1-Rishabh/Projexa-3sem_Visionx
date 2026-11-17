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
  Check,
  Bell,
  X,
  AlertCircle,
  ArrowRight,
  CheckCircle2
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Clinic Notifications state (including seasonal health advisory)
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      category: 'Clinic Advisory',
      title: 'Flu Vaccination & Health Packages',
      description: 'Annual preventive health packages & seasonal flu shots are now available. Walk-ins welcomed before 12:00 PM at OPD Reception.',
      time: 'Just now',
      unread: true,
      actionTab: null,
      type: 'announcement'
    },
    {
      id: 'notif-2',
      category: 'Upcoming Visit',
      title: 'Cardiology Consultation Tomorrow',
      description: 'Confirmed visit with Dr. Sarah Jenkins tomorrow at 10:00 AM (Room 204B). Please arrive 10 minutes prior.',
      time: '2h ago',
      unread: true,
      actionTab: 'appointments',
      actionLabel: 'View Details',
      type: 'appointment'
    },
    {
      id: 'notif-3',
      category: 'Lab Diagnostics',
      title: 'Diagnostic Report Uploaded',
      description: 'Fasting Lipid Profile results have been verified by pathology and uploaded to your Electronic Health Records.',
      time: '1d ago',
      unread: false,
      actionTab: 'records',
      actionLabel: 'View Records',
      type: 'records'
    }
  ]);

  const unreadNotificationCount = notifications.filter(n => n.unread).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    if (showToast) showToast('All notifications marked as read', 'info');
  };

  const handleDismissNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationAction = (item) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
    if (item.actionTab) {
      setActiveTab(item.actionTab);
      setIsNotificationsOpen(false);
    }
  };

  // Patient Name Sanitization helper (removes accidental 'Dr.' or '(Google User)' tags)
  const cleanPatientName = (name) => {
    if (!name) return 'John Doe';
    return name
      .replace(/^Dr\.\s*/i, '')
      .replace(/\s*\(Google User\)/i, '')
      .replace(/\s*\(Demo\)/i, '')
      .trim() || 'John Doe';
  };

  const displayName = cleanPatientName(currentPatient.name);

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

  // Click outside to close profile dropdown & notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProfileDropdownOpen(false);
        setIsNotificationsOpen(false);
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

        {/* RIGHT ACTIONS: CARE TEAM, NOTIFICATION BELL & USER PROFILE CHIP */}
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
              padding: '8px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              cursor: 'pointer',
              minHeight: '44px',
              fontSize: '0.84rem',
              fontWeight: '600',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
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

          {/* NOTIFICATION BELL & POPUP */}
          <div style={{ position: 'relative' }} ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileDropdownOpen(false);
              }}
              aria-expanded={isNotificationsOpen}
              aria-haspopup="true"
              aria-label={`Notifications (${unreadNotificationCount} unread)`}
              title="Clinic Notifications & Alerts"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: isNotificationsOpen ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isNotificationsOpen ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.12)';
              }}
            >
              <Bell size={18} color="#ffffff" />
              {unreadNotificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--warm-accent)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                    border: '2px solid var(--deep-teal)'
                  }}
                >
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* NOTIFICATIONS DROPDOWN MENU */}
            {isNotificationsOpen && (
              <div
                role="dialog"
                aria-label="Clinic Notifications"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: '380px',
                  maxWidth: 'calc(100vw - 32px)',
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  boxShadow: '0 16px 36px rgba(15, 79, 74, 0.18)',
                  border: '1px solid rgba(15, 107, 99, 0.16)',
                  zIndex: 250,
                  overflow: 'hidden',
                  animation: 'fadeUp 0.18s ease-out'
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: '14px 18px',
                    backgroundColor: 'var(--warm-cream)',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} color="var(--primary-teal)" />
                    <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif' }}>
                      Clinic Notifications
                    </span>
                    {unreadNotificationCount > 0 && (
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--warm-accent)',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: '800'
                        }}
                      >
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllNotificationsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-teal)',
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: '3px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications list */}
                <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '6px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={32} color="var(--primary-teal)" style={{ margin: '0 auto 8px auto', opacity: 0.7 }} />
                      <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>You're all caught up!</div>
                      <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>No pending notifications or advisories.</div>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationAction(item)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          margin: '4px 0',
                          backgroundColor: item.unread ? 'rgba(15, 107, 99, 0.05)' : 'transparent',
                          border: item.unread ? '1px solid rgba(15, 107, 99, 0.12)' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = item.unread ? 'rgba(15, 107, 99, 0.08)' : 'var(--warm-cream)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = item.unread ? 'rgba(15, 107, 99, 0.05)' : 'transparent';
                        }}
                      >
                        {/* Icon badge */}
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            backgroundColor: item.type === 'announcement' ? '#FFF7ED' : item.type === 'appointment' ? 'var(--mint)' : '#EFF6FF',
                            color: item.type === 'announcement' ? '#EA580C' : item.type === 'appointment' ? 'var(--primary-teal)' : '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}
                        >
                          {item.type === 'announcement' && <AlertCircle size={16} />}
                          {item.type === 'appointment' && <Calendar size={16} />}
                          {item.type === 'records' && <FileText size={16} />}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: item.unread ? '700' : '600', color: 'var(--text-main)' }}>
                                {item.title}
                              </span>
                              {item.unread && (
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-teal)', display: 'inline-block' }} />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => handleDismissNotification(item.id, e)}
                              aria-label="Dismiss notification"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                opacity: 0.6,
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
                              onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.6; }}
                            >
                              <X size={13} />
                            </button>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                            {item.description}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                            <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                              {item.category} • {item.time}
                            </span>
                            {item.actionLabel && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--primary-teal)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                {item.actionLabel} <ArrowRight size={12} />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* USER PROFILE CHIP & DROPDOWN */}
          <div style={{ position: 'relative' }} ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsProfileDropdownOpen(!isProfileDropdownOpen);
                setIsNotificationsOpen(false);
              }}
              aria-expanded={isProfileDropdownOpen}
              aria-haspopup="true"
              aria-label="User account menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px 6px 8px',
                borderRadius: '9999px',
                backgroundColor: isProfileDropdownOpen ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isProfileDropdownOpen ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.12)';
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
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {getInitials(displayName)}
              </div>

              {/* Name and ID */}
              <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#ffffff' }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#DCEFE6', opacity: 0.9 }}>
                  ID: {currentPatient.id || 'P-1004'}
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
                  top: 'calc(100% + 10px)',
                  width: '310px',
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  boxShadow: '0 16px 36px rgba(15, 79, 74, 0.18)',
                  border: '1px solid rgba(15, 107, 99, 0.16)',
                  zIndex: 250,
                  overflow: 'hidden',
                  animation: 'fadeUp 0.18s ease-out'
                }}
              >
                {/* Dropdown Header Card */}
                <div 
                  style={{ 
                    padding: '16px 18px', 
                    background: 'linear-gradient(135deg, #F4F9F6 0%, #FAF6EC 100%)', 
                    borderBottom: '1px solid var(--border-color)' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--mint)',
                        border: '2px solid var(--primary-teal)',
                        color: 'var(--deep-teal)',
                        fontWeight: '800',
                        fontSize: '0.94rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {getInitials(displayName)}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.96rem', fontFamily: 'Fraunces, serif' }}>
                        {displayName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {currentPatient.email || 'patient.google@example.com'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                    <span 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '5px', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: 'var(--mint)', 
                        color: 'var(--primary-teal)', 
                        fontSize: '0.72rem', 
                        fontWeight: '700' 
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-teal)' }} />
                      {currentPatient.relation || 'Primary Account'}
                    </span>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: '#F1F5F9', 
                        color: 'var(--text-secondary)', 
                        fontSize: '0.72rem', 
                        fontWeight: '700' 
                      }}
                    >
                      ID: {currentPatient.id || 'P-1004'}
                    </span>
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
                      minHeight: '42px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== 'profile') e.currentTarget.style.backgroundColor = 'var(--warm-cream)';
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== 'profile') e.currentTarget.style.backgroundColor = 'transparent';
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
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      minHeight: '42px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--warm-cream)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
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
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      minHeight: '42px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--warm-cream)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <MessageSquare size={16} color="var(--primary-teal)" />
                    <span>Care Team Messages</span>
                  </button>
                </div>

                {/* FAMILY / DEPENDENTS SECTION */}
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '10px 8px' }}>
                  <div style={{ fontSize: '0.70rem', fontWeight: '800', color: 'var(--text-secondary)', padding: '2px 8px 6px 8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Family / Dependents
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
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
                            borderRadius: '10px',
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? '700' : '500',
                            color: isSelected ? 'var(--deep-teal)' : 'var(--text-main)',
                            backgroundColor: isSelected ? 'var(--mint)' : 'transparent',
                            border: isSelected ? '1px solid rgba(15, 107, 99, 0.22)' : '1px solid transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            minHeight: '38px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--warm-cream)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: isSelected ? 'var(--primary-teal)' : '#F1F5F9',
                                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                                fontSize: '0.68rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              {getInitials(member.name)}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? '700' : '600' }}>
                                {member.name}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: isSelected ? 'var(--primary-teal)' : 'var(--text-secondary)' }}>
                                {member.relation} • {member.bloodGroup}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--primary-teal)', fontSize: '0.70rem', fontWeight: '700' }}>
                              <Check size={13} />
                              <span>Active</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ACCESSIBILITY & DISPLAY SECTION (MODERN SWITCH TOGGLES) */}
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '10px 8px' }}>
                  <div style={{ fontSize: '0.70rem', fontWeight: '800', color: 'var(--text-secondary)', padding: '2px 8px 6px 8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Display & Accessibility
                  </div>
                  
                  {/* Dark Mode Toggle */}
                  <div
                    onClick={toggleDarkMode}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDarkMode(); } }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--warm-cream)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          backgroundColor: isDarkMode ? 'rgba(232, 162, 92, 0.18)' : 'var(--mint)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isDarkMode ? 'var(--warm-accent)' : 'var(--primary-teal)'
                        }}
                      >
                        {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>
                          Dark Theme
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                          {isDarkMode ? 'Night mode enabled' : 'Clean daytime contrast'}
                        </div>
                      </div>
                    </div>

                    {/* iOS-Style Pill Switch */}
                    <div
                      style={{
                        width: '38px',
                        height: '22px',
                        borderRadius: '9999px',
                        backgroundColor: isDarkMode ? 'var(--primary-teal)' : '#CBD5E1',
                        position: 'relative',
                        transition: 'background-color 0.2s ease',
                        flexShrink: 0
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          position: 'absolute',
                          top: '3px',
                          left: isDarkMode ? '19px' : '3px',
                          transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Larger Text Toggle */}
                  <div
                    onClick={toggleLargeText}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleLargeText(); } }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      marginTop: '2px',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--warm-cream)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          backgroundColor: isLargeText ? 'rgba(15, 107, 99, 0.18)' : 'var(--mint)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary-teal)'
                        }}
                      >
                        <Type size={15} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>
                          Large Text
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                          {isLargeText ? '112% clinical legibility' : 'Standard font size'}
                        </div>
                      </div>
                    </div>

                    {/* iOS-Style Pill Switch */}
                    <div
                      style={{
                        width: '38px',
                        height: '22px',
                        borderRadius: '9999px',
                        backgroundColor: isLargeText ? 'var(--primary-teal)' : '#CBD5E1',
                        position: 'relative',
                        transition: 'background-color 0.2s ease',
                        flexShrink: 0
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          position: 'absolute',
                          top: '3px',
                          left: isLargeText ? '19px' : '3px',
                          transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '2px 0' }} />

                {/* Neutral "Log out" button */}
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
                      minHeight: '42px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEF2F2';
                      e.currentTarget.style.color = '#B91C1C';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out of Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main 
        id="main-content"
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
            patient={{ ...currentPatient, name: displayName }} 
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
            patient={{ ...currentPatient, name: displayName }} 
            showToast={showToast} 
            onBookNew={(doc) => doc ? handleStartBooking(doc) : setActiveTab('doctors')}
          />
        )}

        {activeTab === 'records' && (
          <PatientMedicalRecords patient={{ ...currentPatient, name: displayName }} showToast={showToast} />
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
              patient={{ ...currentPatient, name: displayName }}
              onUpdateProfile={(updated) => {
                setCurrentPatient(prev => ({ ...prev, ...updated }));
                if (showToast) showToast('Profile settings saved successfully', 'success');
              }}
              onLogout={onLogout}
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
