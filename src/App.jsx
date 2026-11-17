import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/public/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { DoctorPortal } from './components/doctor/DoctorPortal';
import { PatientPortal } from './components/patient/PatientPortal';
import { Toast } from './components/common/Toast';
import { getSavedSession, clearSession } from './services/mockDataStore';

export const App = () => {
  const [session, setSession] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    return 'landing';
  });
  const [authRole, setAuthRole] = useState('patient');
  const [bookingPref, setBookingPref] = useState(null);
  const [toastData, setToastData] = useState({ message: '', type: 'success' });

  // Load saved session on mount
  useEffect(() => {
    const saved = getSavedSession();
    if (saved) {
      setSession(saved);
    }
  }, []);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/login') setCurrentRoute('login');
      else if (path === '/signup') setCurrentRoute('signup');
      else setCurrentRoute('landing');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route, role = 'patient', pref = null) => {
    setCurrentRoute(route);
    setAuthRole(role);
    if (pref) setBookingPref(pref);

    const path = route === 'landing' ? '/' : `/${route}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message, type = 'success') => {
    setToastData({ message, type });
  };

  const handleLoginSuccess = (newSession) => {
    setSession(newSession);
    navigateTo(newSession.role === 'doctor' ? 'doctor-portal' : 'portal');
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setBookingPref(null);
    navigateTo('landing');
    showToast('Logged out of Jivaka Clinic platform', 'info');
  };

  return (
    <div className="app-container">
      {/* ACCESSIBILITY: SKIP TO MAIN CONTENT */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* ROUTING VIEW LOGIC */}
      {session ? (
        session.role === 'doctor' ? (
          <DoctorPortal
            session={session}
            onLogout={handleLogout}
            showToast={showToast}
          />
        ) : (
          <PatientPortal
            session={session}
            onLogout={handleLogout}
            showToast={showToast}
            initialBookingPref={bookingPref}
          />
        )
      ) : currentRoute === 'login' ? (
        <LoginPage
          initialRole={authRole}
          onLoginSuccess={handleLoginSuccess}
          showToast={showToast}
          onNavigateToSignup={() => navigateTo('signup')}
          onBackToHome={() => navigateTo('landing')}
        />
      ) : currentRoute === 'signup' ? (
        <SignUpPage
          onLoginSuccess={handleLoginSuccess}
          showToast={showToast}
          onNavigateToLogin={() => navigateTo('login')}
          onBackToHome={() => navigateTo('landing')}
        />
      ) : (
        <LandingPage
          onNavigateToAuth={(role, pref) => navigateTo('login', role, pref)}
          onQuickBookDoctor={(doc) => navigateTo('login', 'patient', { doctorId: doc.id, doctorName: doc.name })}
          showToast={showToast}
        />
      )}

      {/* GLOBAL TOAST MANAGER */}
      <Toast
        message={toastData.message}
        type={toastData.type}
        onClose={() => setToastData({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default App;
