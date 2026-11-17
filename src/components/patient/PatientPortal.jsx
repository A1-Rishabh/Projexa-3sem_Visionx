import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Calendar, 
  FileText, 
  User, 
  LogOut, 
  ShieldCheck, 
  Heart,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { getDoctors } from '../../services/mockDataStore';

import { InfoHub } from './InfoHub';
import { DoctorDirectory } from './DoctorDirectory';
import { BookingWizardModal } from './BookingWizardModal';
import { PatientAppointments } from './PatientAppointments';
import { PatientMedicalRecords } from './PatientMedicalRecords';
import { PatientProfile } from './PatientProfile';

export const PatientPortal = ({ session, onLogout, showToast, initialBookingPref }) => {
  const [currentPatient, setCurrentPatient] = useState(session.user);
  const [activeTab, setActiveTab] = useState('home');

  // Booking Wizard Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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

  const handleStartBooking = (doctor) => {
    setBookingDoctor(doctor);
    setIsBookingOpen(true);
  };

  const navItems = [
    { id: 'home', label: 'Home & Info', icon: Home },
    { id: 'doctors', label: 'Find a Doctor', icon: Search },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'profile', label: 'Profile Settings', icon: User }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--slate-bg)' }}>
      
      {/* TOP DESKTOP NAVIGATION BAR */}
      <header
        style={{
          backgroundColor: '#0a2540',
          color: '#ffffff',
          height: '72px',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* LOGO */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ cursor: 'pointer' }}
        >
          <Logo size="medium" theme="light" />
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  backgroundColor: isActive ? '#0f62fe' : 'transparent',
                  color: isActive ? '#ffffff' : '#cbd5e1'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* USER PROFILE & LOGOUT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlignment: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ffffff' }}>
              {currentPatient.name}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
              ID: {currentPatient.id}
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontWeight: '700',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={16} /> Exit Portal
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main style={{ padding: '32px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'home' && (
          <InfoHub onNavigateToDoctors={() => setActiveTab('doctors')} />
        )}

        {activeTab === 'doctors' && (
          <DoctorDirectory onSelectDoctorToBook={handleStartBooking} />
        )}

        {activeTab === 'appointments' && (
          <PatientAppointments patient={currentPatient} showToast={showToast} />
        )}

        {activeTab === 'records' && (
          <PatientMedicalRecords patient={currentPatient} showToast={showToast} />
        )}

        {activeTab === 'profile' && (
          <PatientProfile
            patient={currentPatient}
            onUpdatePatient={(p) => setCurrentPatient(p)}
            showToast={showToast}
          />
        )}
      </main>

      {/* FIXED MOBILE BOTTOM NAVBAR (< 768px SCREEN ACCESSIBILITY) */}
      <div 
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          backgroundColor: '#0a2540',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
        className="mobile-bottom-nav"
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontSize: '0.65rem',
                fontWeight: '700'
              }}
            >
              <Icon size={20} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 3-STEP BOOKING WIZARD MODAL */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedDoctor={bookingDoctor}
        patient={currentPatient}
        onBookingConfirmed={() => setActiveTab('appointments')}
        showToast={showToast}
      />

    </div>
  );
};
