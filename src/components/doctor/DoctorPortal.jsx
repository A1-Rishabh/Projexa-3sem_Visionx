import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Users, 
  UserCheck, 
  LogOut, 
  Bell, 
  ShieldCheck, 
  Lock, 
  MapPin, 
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Megaphone
} from 'lucide-react';
import { Logo } from '../common/Logo';

import { DoctorDashboard } from './DoctorDashboard';
import { ScheduleManager } from './ScheduleManager';
import { AppointmentManager } from './AppointmentManager';
import { PatientRecordsManager } from './PatientRecordsManager';
import { CommunicationsManager } from './CommunicationsManager';
import { DoctorProfileEditor } from './DoctorProfileEditor';
import { getAppointments, clearSession } from '../../services/mockDataStore';
import { Modal } from '../common/Modal';

export const DoctorPortal = ({ session, onLogout, showToast }) => {
  const [currentDoctor, setCurrentDoctor] = useState(session.user);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Notifications Drawer State
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Security Session Timeout Timer State (15 mins = 900 seconds)
  const [sessionSeconds, setSessionSeconds] = useState(900);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Doctor initials helper for avatar fallback
  const getInitials = (name = '') => {
    const clean = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (clean[0] || 'D').toUpperCase();
  };

  useEffect(() => {
    // Check pending appointments for notification bell
    const appts = getAppointments();
    const docPending = appts.filter(a => a.doctorId === currentDoctor.id && a.status === 'pending');
    setPendingCount(docPending.length);
  }, [activeTab, currentDoctor.id]);

  // Session timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          clearSession();
          onLogout();
          return 0;
        }
        if (prev === 120) { // 2 mins remaining -> show modal
          setShowTimeoutModal(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onLogout]);

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = () => {
    setSessionSeconds(900);
    setShowTimeoutModal(false);
    showToast('Session timer extended by 15 minutes', 'success');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Clock },
    { id: 'records', label: 'Patient Records', icon: Lock },
    { id: 'communications', label: 'Communications & Alerts', icon: Megaphone },
    { id: 'profile', label: 'Profile Settings', icon: UserCheck }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--slate-bg)' }}>
      
      {/* FIXED LEFT SIDEBAR (240px JEEVAK DEEP TEAL) */}
      <aside
        style={{
          width: '240px',
          backgroundColor: 'var(--deep-teal)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          {/* LOGO */}
          <div style={{ padding: '0 4px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <Logo size="medium" theme="light" />
          </div>

          {/* NAV ITEMS */}
          <nav style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    fontWeight: isActive ? '700' : '600',
                    fontSize: '0.875rem',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    backgroundColor: isActive ? 'rgba(232, 162, 92, 0.18)' : 'transparent',
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                    borderLeft: isActive ? '4px solid var(--warm-accent)' : '4px solid transparent',
                    cursor: 'pointer',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderBottom: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={18} color={isActive ? 'var(--warm-accent)' : 'rgba(255, 255, 255, 0.8)'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT PINNED AT BOTTOM */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '10px',
            color: '#FECACA',
            fontWeight: '700',
            fontSize: '0.875rem',
            backgroundColor: 'rgba(239, 68, 68, 0.14)',
            border: '1px solid rgba(239, 68, 68, 0.28)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.14)';
          }}
        >
          <LogOut size={18} /> Log Out Portal
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* TOP HEADER BAR */}
        <header
          style={{
            height: '72px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 90,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Left: Doctor Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {currentDoctor.avatar && !avatarError ? (
              <img
                src={currentDoctor.avatar}
                alt={currentDoctor.name}
                onError={() => setAvatarError(true)}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-teal)' }}
              />
            ) : (
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--mint)',
                  color: 'var(--deep-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  border: '2px solid var(--primary-teal)'
                }}
              >
                {getInitials(currentDoctor.name)}
              </div>
            )}
            <div>
              <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.96rem', fontFamily: 'Fraunces, serif' }}>
                {currentDoctor.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} color="var(--primary-teal)" /> {currentDoctor.room} • {currentDoctor.specialization}
              </div>
            </div>
          </div>

          {/* Right Controls: Timer & Notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* SESSION TIMEOUT TIMER BADGE */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: sessionSeconds < 120 ? '#FEF3C7' : 'var(--mint)',
                border: sessionSeconds < 120 ? '1px solid #FCD34D' : '1px solid rgba(14, 98, 83, 0.2)',
                color: sessionSeconds < 120 ? '#92400E' : 'var(--primary-teal)',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}
            >
              <Clock size={14} color={sessionSeconds < 120 ? '#D97706' : 'var(--primary-teal)'} />
              <span>Session: {formatTime(sessionSeconds)}</span>
            </div>

            {/* NOTIFICATION BELL & DRAWER */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--warm-cream)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                <Bell size={18} />
                {pendingCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '10px',
                      height: '10px',
                      backgroundColor: 'var(--warm-accent)',
                      borderRadius: '50%',
                      border: '2px solid #ffffff'
                    }}
                  />
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '300px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '16px',
                    zIndex: 200
                  }}
                >
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', marginBottom: '10px' }}>
                    Notifications
                  </h4>
                  {pendingCount > 0 ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      You have <strong>{pendingCount}</strong> new appointment request(s) awaiting review under <button onClick={() => { setActiveTab('appointments'); setShowNotifications(false); }} style={{ color: 'var(--primary-teal)', fontWeight: '700', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>Appointments</button>.
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No pending notifications.</div>
                  )}
                </div>
              )}
            </div>

          </div>
        </header>

        {/* TAB CONTENT VIEWPORT */}
        <main id="main-content" style={{ padding: '32px', flex: 1 }}>
          {activeTab === 'dashboard' && (
            <DoctorDashboard
              doctor={currentDoctor}
              onNavigate={(tab) => setActiveTab(tab)}
              showToast={showToast}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleManager
              doctor={currentDoctor}
              showToast={showToast}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentManager
              doctor={currentDoctor}
              showToast={showToast}
            />
          )}

          {activeTab === 'records' && (
            <PatientRecordsManager
              doctor={currentDoctor}
              showToast={showToast}
            />
          )}

          {activeTab === 'communications' && (
            <CommunicationsManager
              doctor={currentDoctor}
              showToast={showToast}
            />
          )}

          {activeTab === 'profile' && (
            <DoctorProfileEditor
              doctor={currentDoctor}
              onUpdateDoctor={(doc) => setCurrentDoctor(doc)}
              showToast={showToast}
            />
          )}
        </main>

      </div>

      {/* SESSION TIMEOUT WARNING MODAL */}
      <Modal
        isOpen={showTimeoutModal}
        onClose={() => {}}
        title="Restricted Session Security Warning"
        maxWidth="440px"
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <AlertTriangle size={42} color="var(--warm-accent)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', marginBottom: '8px' }}>
            Doctor Session Expiring Soon
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Due to clinical privacy regulations, your active session will auto-terminate in <strong style={{ color: 'var(--warm-accent)' }}>{formatTime(sessionSeconds)}</strong>.
          </p>

          <button
            onClick={handleExtendSession}
            className="btn btn-primary btn-block"
            style={{ minHeight: '42px', fontSize: '0.88rem' }}
          >
            <RefreshCw size={16} /> Extend Active Session (15 Mins)
          </button>
        </div>
      </Modal>

    </div>
  );
};
