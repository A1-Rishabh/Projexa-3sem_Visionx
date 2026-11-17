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
  CheckCircle2
} from 'lucide-react';
import { Logo } from '../common/Logo';

import { DoctorDashboard } from './DoctorDashboard';
import { ScheduleManager } from './ScheduleManager';
import { AppointmentManager } from './AppointmentManager';
import { PatientRecordsManager } from './PatientRecordsManager';
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
    { id: 'schedule', label: 'My Schedule', icon: Calendar },
    { id: 'appointments', label: 'Appointments', icon: Clock },
    { id: 'records', label: 'Patient Records', icon: Lock },
    { id: 'profile', label: 'Profile Settings', icon: UserCheck }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--slate-bg)' }}>
      
      {/* FIXED LEFT SIDEBAR (220px DARK NAVY) */}
      <aside
        style={{
          width: '240px',
          backgroundColor: '#0a2540',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100
        }}
      >
        <div>
          {/* LOGO */}
          <div style={{ padding: '0 4px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    backgroundColor: isActive ? 'rgba(15, 98, 254, 0.2)' : 'transparent',
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    borderLeft: isActive ? '4px solid #0f62fe' : '4px solid transparent'
                  }}
                >
                  <Icon size={18} />
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
            color: '#ef4444',
            fontWeight: '700',
            fontSize: '0.875rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            transition: 'all 0.2s'
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
            borderBottom: '1px solid #e2e8f0',
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
            <img
              src={currentDoctor.avatar}
              alt={currentDoctor.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0f62fe' }}
            />
            <div>
              <div style={{ fontWeight: '800', color: '#0a2540', fontSize: '0.95rem' }}>
                {currentDoctor.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} color="#0f62fe" /> {currentDoctor.room} • {currentDoctor.specialization}
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
                backgroundColor: sessionSeconds < 120 ? '#fef3c7' : '#f1f5f9',
                border: sessionSeconds < 120 ? '1px solid #fcd34d' : '1px solid #e2e8f0',
                color: sessionSeconds < 120 ? '#92400e' : '#475569',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}
            >
              <Clock size={14} color={sessionSeconds < 120 ? '#d97706' : '#0f62fe'} />
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
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  color: '#475569'
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
                      backgroundColor: '#ef4444',
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
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    zIndex: 200
                  }}
                >
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#0a2540', marginBottom: '10px' }}>
                    Notifications
                  </h4>
                  {pendingCount > 0 ? (
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      You have <strong>{pendingCount}</strong> new appointment request(s) awaiting review under <button onClick={() => { setActiveTab('appointments'); setShowNotifications(false); }} style={{ color: '#0f62fe', fontWeight: '700', textDecoration: 'underline' }}>Appointments</button>.
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No pending notifications.</div>
                  )}
                </div>
              )}
            </div>

          </div>
        </header>

        {/* TAB CONTENT VIEWPORT */}
        <main style={{ padding: '32px', flex: 1 }}>
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
          <AlertTriangle size={42} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0a2540', marginBottom: '8px' }}>
            Your doctor session is expiring soon
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
            Due to privacy regulations, your active session will auto-terminate in <strong style={{ color: '#d97706' }}>{formatTime(sessionSeconds)}</strong>.
          </p>

          <button
            onClick={handleExtendSession}
            className="btn btn-primary btn-block"
          >
            <RefreshCw size={16} /> Extend Active Session (15 Mins)
          </button>
        </div>
      </Modal>

    </div>
  );
};
