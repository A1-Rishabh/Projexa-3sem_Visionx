import React, { useState, useEffect } from 'react';
import { 
  User, 
  Stethoscope, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  KeyRound
} from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { GoogleButton } from '../common/GoogleButton';
import { Modal } from '../common/Modal';
import { 
  getDoctors, 
  getPatients, 
  saveSession, 
  getLastRoleTab, 
  saveLastRoleTab 
} from '../../services/mockDataStore';

export const LoginPage = ({
  onLoginSuccess,
  showToast,
  onNavigateToSignup,
  onBackToHome,
  initialRole = 'patient',
  prefilledEmail = ''
}) => {
  // Role switcher: 'patient' or 'doctor'
  const [activeRole, setActiveRole] = useState(initialRole);

  // Form inputs
  const [identifier, setIdentifier] = useState(prefilledEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Doctor inputs
  const [doctorId, setDoctorId] = useState('DOC-101');
  const [doctorPassword, setDoctorPassword] = useState('password123');
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Load last role on mount
  useEffect(() => {
    if (!initialRole || initialRole === 'patient') {
      const saved = getLastRoleTab();
      if (saved) setActiveRole(saved);
    }
  }, [initialRole]);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    saveLastRoleTab(role);
    setErrors({});
  };

  // Demo auto-fill helpers
  const fillPatientDemo = () => {
    setIdentifier('patient@example.com');
    setPassword('password123');
    setErrors({});
  };

  const fillDoctorDemo = (id) => {
    setDoctorId(id);
    setDoctorPassword('password123');
    setErrors({});
  };

  // Patient Login handler
  const handlePatientSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Please enter your registered email or phone number';
    }
    if (!password) {
      newErrors.password = 'Please enter your account password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      const patients = getPatients();
      const patient = patients.find(
        (p) =>
          p.email.toLowerCase() === identifier.trim().toLowerCase() ||
          p.phone.replace(/\D/g, '') === identifier.replace(/\D/g, '')
      );

      setIsLoading(false);

      if (patient) {
        const session = { role: 'patient', user: patient, patientId: patient.id };
        saveSession(session);
        showToast(`Welcome back, ${patient.name}!`, 'success');
        onLoginSuccess(session);
      } else {
        // Allow demonstration login for testing
        const fallbackPatient = patients[0];
        const session = { role: 'patient', user: fallbackPatient, patientId: fallbackPatient.id };
        saveSession(session);
        showToast(`Signed in as ${fallbackPatient.name} (Demo)`, 'success');
        onLoginSuccess(session);
      }
    }, 600);
  };

  // Doctor Login handler
  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!doctorId) {
      newErrors.doctorId = 'Please select your Doctor ID';
    }
    if (!doctorPassword) {
      newErrors.doctorPassword = 'Enter your clinical credentials password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const doctors = getDoctors();
      const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];

      const session = { role: 'doctor', user: doctor, doctorId: doctor.id };
      saveSession(session);
      showToast(`Welcome, ${doctor.name} (${doctor.specialization})`, 'success');
      onLoginSuccess(session);
    }, 600);
  };

  // Google Sign-in Handler
  const handleGoogleSignIn = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const patients = getPatients();
      const googleUser = patients[0]; // John Doe as authenticated user
      const session = {
        role: 'patient',
        user: {
          ...googleUser,
          isGoogleAuth: true
        },
        patientId: googleUser.id
      };
      saveSession(session);

      if (!googleClientId) {
        showToast('Signed in with Google (Demo account). Set VITE_GOOGLE_CLIENT_ID in .env for production OAuth.', 'info');
      } else {
        showToast(`Google Sign-In successful. Welcome ${googleUser.name}!`, 'success');
      }

      onLoginSuccess(session);
    }, 800);
  };

  // Forgot password submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setForgotSubmitted(true);
    showToast(`Password recovery link sent to ${forgotEmail}`, 'success');
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <AuthLayout
      title={activeRole === 'patient' ? 'Sign into Patient Portal' : 'Clinical Staff Gateway'}
      subtitle={
        activeRole === 'patient'
          ? 'Access your consultation history, upcoming appointments, and diagnostic reports'
          : 'Restricted electronic health records access for verified Jivaka Clinic physicians'
      }
      onBackToHome={onBackToHome}
    >
      {/* ROLE SWITCHER TABS */}
      <div
        role="tablist"
        aria-label="Login Role Selection"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'var(--warm-cream)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px',
          border: '1px solid var(--border-color)'
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'patient'}
          onClick={() => handleRoleChange('patient')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.88rem',
            backgroundColor: activeRole === 'patient' ? '#ffffff' : 'transparent',
            color: activeRole === 'patient' ? 'var(--deep-teal)' : 'var(--text-secondary)',
            boxShadow: activeRole === 'patient' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <User size={16} color={activeRole === 'patient' ? 'var(--primary-teal)' : 'currentColor'} />
          <span>Patient Portal</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeRole === 'doctor'}
          onClick={() => handleRoleChange('doctor')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.88rem',
            backgroundColor: activeRole === 'doctor' ? '#ffffff' : 'transparent',
            color: activeRole === 'doctor' ? 'var(--deep-teal)' : 'var(--text-secondary)',
            boxShadow: activeRole === 'doctor' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Stethoscope size={16} color={activeRole === 'doctor' ? 'var(--primary-teal)' : 'currentColor'} />
          <span>Staff / Doctor</span>
        </button>
      </div>

      {/* PATIENT LOGIN FORM */}
      {activeRole === 'patient' && (
        <form onSubmit={handlePatientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* EMAIL OR MOBILE */}
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="patient-identifier">Email Address or Mobile Number</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={17} />
              <input
                id="patient-identifier"
                type="text"
                placeholder="e.g. patient@example.com or phone"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: '' }));
                }}
                className={errors.identifier ? 'input-error' : ''}
                autoComplete="username"
              />
            </div>
            {errors.identifier && (
              <div className="error-msg">
                <AlertCircle size={14} />
                <span>{errors.identifier}</span>
              </div>
            )}
          </div>

          {/* PASSWORD WITH SHOW/HIDE */}
          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label htmlFor="patient-password" style={{ margin: 0 }}>Account Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--primary-teal)',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Forgot password?
              </button>
            </div>

            <div className="input-with-icon" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={17} />
              <input
                id="patient-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                className={errors.password ? 'input-error' : ''}
                autoComplete="current-password"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="error-msg">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-block"
            style={{ marginTop: '8px', borderRadius: '12px', fontWeight: '700' }}
          >
            <span>{isLoading ? 'Verifying credentials...' : 'Sign In to Patient Portal'}</span>
            {!isLoading && <ArrowRight size={16} />}
          </button>

          {/* OR DIVIDER */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          {/* GOOGLE SIGN-IN BUTTON */}
          <GoogleButton
            onClick={handleGoogleSignIn}
            isLoading={isLoading}
            label="Continue with Google"
          />

          {/* DEMO QUICK-FILL HELPER */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'var(--warm-cream)',
              border: '1px dashed var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem'
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Demo Patient:</span>
            <button
              type="button"
              onClick={fillPatientDemo}
              style={{
                color: 'var(--primary-teal)',
                fontWeight: '700',
                textDecoration: 'underline'
              }}
            >
              Autofill (John Doe)
            </button>
          </div>

          {/* LINK TO SIGNUP */}
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onNavigateToSignup}
              style={{
                color: 'var(--primary-teal)',
                fontWeight: '700',
                textDecoration: 'underline'
              }}
            >
              Create patient account
            </button>
          </div>
        </form>
      )}

      {/* STAFF / DOCTOR LOGIN FORM */}
      {activeRole === 'doctor' && (
        <form onSubmit={handleDoctorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="doctor-select">Select Doctor / Staff Profile</label>
            <select
              id="doctor-select"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              style={{ width: '100%', fontWeight: '600' }}
            >
              <option value="DOC-101">Dr. Sarah Jenkins (Cardiology • Room 204)</option>
              <option value="DOC-102">Dr. Marcus Vance (Pediatrics • Room 108)</option>
              <option value="DOC-103">Dr. Elena Rostova (Neurology • Room 312)</option>
              <option value="DOC-104">Dr. Aris Thorne (Orthopedics • Room 105)</option>
            </select>
          </div>

          {/* QUICK-FILL DOCTOR PILLS */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Quick Demo Fill:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['DOC-101', 'DOC-102', 'DOC-103', 'DOC-104'].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => fillDoctorDemo(id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    backgroundColor: doctorId === id ? 'var(--mint)' : '#ffffff',
                    color: doctorId === id ? 'var(--deep-teal)' : 'var(--text-secondary)',
                    border: `1px solid ${doctorId === id ? 'var(--primary-teal)' : 'var(--border-color)'}`
                  }}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          {/* DOCTOR PASSWORD */}
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="doctor-pass">Staff Authorization Passcode</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={17} />
              <input
                id="doctor-pass"
                type={showDoctorPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={doctorPassword}
                onChange={(e) => setDoctorPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowDoctorPassword(!showDoctorPassword)}
                aria-label={showDoctorPassword ? 'Hide passcode' : 'Show passcode'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showDoctorPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-block"
            style={{ marginTop: '8px', borderRadius: '12px', fontWeight: '700' }}
          >
            <span>{isLoading ? 'Verifying staff badge...' : 'Enter Clinical Command'}</span>
            {!isLoading && <ArrowRight size={16} />}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Need credential assistance? Contact clinical administrator at{' '}
            <a href="mailto:admin@jivakaclinic.org" style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>
              admin@jivakaclinic.org
            </a>
          </div>
        </form>
      )}

      {/* FORGOT PASSWORD MODAL */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Account Password"
        maxWidth="460px"
      >
        <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Enter your registered patient email address and we will dispatch a secure verification link to reset your credentials.
          </p>

          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="forgot-email-input">Registered Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={17} />
              <input
                id="forgot-email-input"
                type="email"
                placeholder="e.g. patient@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              <span>{forgotSubmitted ? 'Sent!' : 'Send Reset Link'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </Modal>
    </AuthLayout>
  );
};

export default LoginPage;
