import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { DoctorPortal } from './components/doctor/DoctorPortal';
import { PatientPortal } from './components/patient/PatientPortal';
import { Toast } from './components/common/Toast';
import { getSavedSession, clearSession } from './services/mockDataStore';

export const App = () => {
  const [session, setSession] = useState(null);
  const [toastData, setToastData] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const saved = getSavedSession();
    if (saved) {
      setSession(saved);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToastData({ message, type });
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    showToast('Logged out of Jivaka Clinic platform', 'info');
  };

  return (
    <div className="app-container">
      {!session ? (
        <LoginPage
          onLoginSuccess={(newSession) => setSession(newSession)}
          showToast={showToast}
        />
      ) : session.role === 'doctor' ? (
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
        />
      )}

      {/* Global Toast Manager */}
      <Toast
        message={toastData.message}
        type={toastData.type}
        onClose={() => setToastData({ message: '', type: 'success' })}
      />
    </div>
  );
};

export default App;
