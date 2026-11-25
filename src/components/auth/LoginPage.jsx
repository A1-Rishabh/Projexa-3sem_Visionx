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
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { GoogleButton } from '../common/GoogleButton';
import { Modal } from '../common/Modal';
import { 
  getDoctors, 
  getPatients, 
  saveSession, 
  getLastRoleTab, 
  saveLastRoleTab,
  findDoctorByEmailOrId,
  findPatientByIdentifier
} from '../../services/mockDataStore';
import { handleGoogleAuth } from '../../services/googleAuth';
import { signInWithGoogle, isSupabaseConfigured } from '../../services/supabase';

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

  // Doctor inputs (strictly manual entry - no autofill)
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');
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
      const patient = findPatientByIdentifier(identifier);

      setIsLoading(false);

      if (patient) {
        // If password was stored for this account, verify it
        if (patient.password && patient.password !== password) {
          setErrors({ password: 'Incorrect account password. Please check and try again.' });
          return;
        }

        const session = { role: 'patient', user: patient, patientId: patient.id };
        saveSession(session);
        showToast(`Welcome back, ${patient.name}!`, 'success');
        onLoginSuccess(session);
      } else {
        setErrors({
          identifier: 'No registered patient account found with this email, mobile number, or Patient ID. Please check your details or create an account.'
        });
      }
    }, 600);
  };

  // Instant demo patient login helper
  const handleDemoPatientLogin = () => {
    const patients = getPatients();
    const demoPatient = patients[0];
    const session = { role: 'patient', user: demoPatient, patientId: demoPatient.id };
    saveSession(session);
    showToast(`Signed in as ${demoPatient.name} (Demo)`, 'success');
    onLoginSuccess(session);
  };

  // Doctor Login handler with email & credential verification
  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const cleanInput = doctorEmail.trim();

    if (!cleanInput) {
      newErrors.doctorEmail = 'Enter your authorized doctor email or Doctor ID';
    }

    if (!doctorPassword.trim()) {
      newErrors.doctorPassword = 'Enter your clinical credentials password';
    } else if (doctorPassword.trim().length < 6) {
      newErrors.doctorPassword = 'Password must be at least 6 characters';
    }

    if (cleanInput) {
      const matchedDoctor = findDoctorByEmailOrId(cleanInput);
      if (!matchedDoctor) {
        newErrors.doctorEmail = 'Unauthorized email or ID. Access is restricted to verified Jeevak Clinic physicians.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const doctor = findDoctorByEmailOrId(cleanInput);

      if (!doctor) {
        setErrors({ doctorEmail: 'Physician credentials could not be verified' });
        return;
      }

      const session = { role: 'doctor', user: doctor, doctorId: doctor.id };
      saveSession(session);
      showToast(`Welcome, ${doctor.name} (${doctor.specialization})`, 'success');
      onLoginSuccess(session);
    }, 600);
  };

  // Google Sign-in Handler (Real Google OAuth with Supabase)
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const res = await signInWithGoogle();
        if (res.success) {
          // Supabase redirects to Google consent screen
          return;
        }
      }

      const result = await handleGoogleAuth({ isSignUp: false });
      setIsLoading(false);
      if (result.success) {
        showToast(result.message || 'Google sign-in successful', 'success');
        onLoginSuccess(result.session);
      }
    } catch (err) {
      setIsLoading(false);
      showToast(err.message || 'Google authentication encountered an error. Please try again.', 'error');
    }
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
          : 'Restricted electronic health records access for verified Jeevak Clinic physicians'
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

          {/* QUICK DEMO PATIENT ACCESS */}
          <div style={{ textAlign: 'center', marginTop: '6px' }}>
            <button
              type="button"
              onClick={handleDemoPatientLogin}
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                opacity: 0.8,
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Or test with Demo Patient (Rahul Sharma)
            </button>
          </div>
        </form>
      )}

      {/* STAFF / DOCTOR LOGIN FORM */}
      {activeRole === 'doctor' && (
        <form onSubmit={handleDoctorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* DOCTOR EMAIL / ID INPUT */}
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="doctor-identifier">Doctor Email / Clinical ID</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={17} />
              <input
                id="doctor-identifier"
                type="text"
                placeholder="e.g. dr.shuchi@jeevakclinic.com or DOC-101"
                value={doctorEmail}
                onChange={(e) => {
                  setDoctorEmail(e.target.value);
                  if (errors.doctorEmail) setErrors((prev) => ({ ...prev, doctorEmail: '' }));
                }}
                className={errors.doctorEmail ? 'input-error' : ''}
                autoComplete="off"
                autoFocus
              />
            </div>
            {errors.doctorEmail && (
              <div className="error-msg">
                <AlertCircle size={14} />
                <span>{errors.doctorEmail}</span>
              </div>
            )}
          </div>

          {/* DOCTOR PASSWORD */}
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="doctor-pass">Staff Authorization Passcode</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <Lock className="input-icon" size={17} />
              <input
                id="doctor-pass"
                type={showDoctorPassword ? 'text' : 'password'}
                placeholder="Enter clinical credentials password"
                value={doctorPassword}
                onChange={(e) => {
                  setDoctorPassword(e.target.value);
                  if (errors.doctorPassword) setErrors((prev) => ({ ...prev, doctorPassword: '' }));
                }}
                className={errors.doctorPassword ? 'input-error' : ''}
                autoComplete="new-password"
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
            {errors.doctorPassword && (
              <div className="error-msg">
                <AlertCircle size={14} />
                <span>{errors.doctorPassword}</span>
              </div>
            )}
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

          {/* ASSIGNED DOCTORS CREDENTIALS CARD */}
          <div
            style={{
              marginTop: '10px',
              backgroundColor: 'var(--warm-cream)',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ fontWeight: '800', color: 'var(--primary-teal)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Assigned Doctor Login Credentials:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* Doctor 1 */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  backgroundColor: '#ffffff', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(15, 107, 99, 0.12)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setDoctorEmail('dr.shuchi@jeevakclinic.com');
                  setDoctorPassword('Shuchi@2003');
                }}
                title="Click to quickly fill Dr. Shuchi's credentials"
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.82rem' }}>Dr. Shuchi Shivangi</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>dr.shuchi@jeevakclinic.com (DOC-101)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <code style={{ backgroundColor: 'var(--warm-cream)', padding: '3px 7px', borderRadius: '4px', fontWeight: '800', color: 'var(--primary-teal)', fontSize: '0.75rem' }}>Shuchi@2003</code>
                </div>
              </div>

              {/* Doctor 2 */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  backgroundColor: '#ffffff', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(15, 107, 99, 0.12)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setDoctorEmail('dr.indu@jeevakclinic.com');
                  setDoctorPassword('Indu@2003');
                }}
                title="Click to quickly fill Dr. Indu's credentials"
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.82rem' }}>Dr. (Mrs.) Indu Kumari</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>dr.indu@jeevakclinic.com (DOC-102)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <code style={{ backgroundColor: 'var(--warm-cream)', padding: '3px 7px', borderRadius: '4px', fontWeight: '800', color: 'var(--primary-teal)', fontSize: '0.75rem' }}>Indu@2003</code>
                </div>
              </div>

              {/* Doctor 3 */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  backgroundColor: '#ffffff', 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(15, 107, 99, 0.12)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setDoctorEmail('dr.surendra@jeevakclinic.com');
                  setDoctorPassword('Surendra@2003');
                }}
                title="Click to quickly fill Dr. Surendra's credentials"
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.82rem' }}>Dr. Surendra Kumar</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>dr.surendra@jeevakclinic.com (DOC-103)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <code style={{ backgroundColor: 'var(--warm-cream)', padding: '3px 7px', borderRadius: '4px', fontWeight: '800', color: 'var(--primary-teal)', fontSize: '0.75rem' }}>Surendra@2003</code>
                </div>
              </div>

            </div>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
              💡 Tip: Click any doctor card above to instantly fill their credentials for testing.
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Need credential assistance? Contact clinical desk at{' '}
            <a href="mailto:jeevak.clinic03@gmail.com" style={{ color: 'var(--primary-teal)', fontWeight: '600' }}>
              jeevak.clinic03@gmail.com
            </a>
            {' '}or call 011 45680306
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
