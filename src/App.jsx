import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/public/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { DoctorPortal } from './components/doctor/DoctorPortal';
import { PatientPortal } from './components/patient/PatientPortal';
import { Toast } from './components/common/Toast';
import { ClinicalIntakeModal } from './components/patient/ClinicalIntakeModal';
import { getSavedSession, saveSession, clearSession } from './services/mockDataStore';
import { supabase, isSupabaseConfigured, getProfile, signOutSupabase } from './services/supabase';

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
  const [intakePatient, setIntakePatient] = useState(null);

  // Load saved session and listen to Supabase auth events
  useEffect(() => {
    const saved = getSavedSession();
    if (saved) {
      setSession(saved);
    }

    if (isSupabaseConfigured()) {
      // Check current session from Supabase
      supabase.auth.getSession().then(({ data: { session: currentAuthSession } }) => {
        if (currentAuthSession?.user) {
          handleSupabaseAuthUser(currentAuthSession.user);
        }
      });

      // Listen to auth changes (e.g. Google OAuth redirect)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newAuthSession) => {
        if (event === 'SIGNED_IN' && newAuthSession?.user) {
          await handleSupabaseAuthUser(newAuthSession.user);
        } else if (event === 'SIGNED_OUT') {
          clearSession();
          setSession(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  const handleSupabaseAuthUser = async (user) => {
    try {
      const profile = await getProfile(user.id);
      const userProfile = profile || {
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || 'Patient',
        email: user.email,
        role: 'patient'
      };

      const userSession = {
        role: userProfile.role || 'patient',
        user: userProfile,
        id: user.id
      };

      setSession(userSession);
      saveSession(userSession);
      navigateTo('portal');

      // Check if first-time clinical intake is required
      if (!userProfile.phone || !userProfile.date_of_birth) {
        setIntakePatient(userProfile);
      }
    } catch (err) {
      console.warn('Error syncing Supabase user profile:', err);
    }
  };

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

  const handleLogout = async () => {
    try {
      await signOutSupabase();
    } catch (err) {
      console.warn('Supabase signout:', err);
    }
    clearSession();
    setSession(null);
    setBookingPref(null);
    navigateTo('landing');
    showToast('Logged out of Jivaka Clinic platform', 'info');
  };

  const handleIntakeComplete = (updatedPatient) => {
    setSession(prev => ({
      ...prev,
      user: updatedPatient
    }));
    setIntakePatient(null);
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

      {/* FIRST-TIME GOOGLE PATIENT CLINICAL INTAKE MODAL */}
      <ClinicalIntakeModal
        isOpen={!!intakePatient}
        onClose={() => setIntakePatient(null)}
        patient={intakePatient}
        onComplete={handleIntakeComplete}
        showToast={showToast}
      />
    </div>
  );
};

export default App;
