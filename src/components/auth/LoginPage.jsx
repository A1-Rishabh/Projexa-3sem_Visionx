import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Stethoscope, 
  UserCheck, 
  Clock, 
  Lock, 
  Mail, 
  Phone, 
  Key, 
  User, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { 
  getLastRoleTab, 
  saveLastRoleTab, 
  getDoctors, 
  getPatients, 
  saveSession 
} from '../../services/mockDataStore';

export const LoginPage = ({ onLoginSuccess, showToast }) => {
  // Active Role Tab: 'patient' or 'doctor'
  const [activeTab, setActiveTab] = useState('patient');
  // Patient sub-mode: 'signin' or 'signup'
  const [patientMode, setPatientMode] = useState('signin');

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientName, setPatientName] = useState('');

  // Doctor credentials
  const [doctorId, setDoctorId] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');

  // Validation & Error states
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');

  // Modals & Overlays
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const otpInputsRef = useRef([]);

  // Load last used role tab on mount
  useEffect(() => {
    const saved = getLastRoleTab();
    if (saved) setActiveTab(saved);
  }, []);

  // Update tab & remember in localStorage
  const handleTabChange = (role) => {
    setActiveTab(role);
    saveLastRoleTab(role);
    setErrors({});
  };

  // Password strength calculation
  const handlePasswordChange = (val) => {
    setPassword(val);
    if (!val) {
      setPasswordStrength('');
      return;
    }
    if (val.length < 6) {
      setPasswordStrength('weak');
    } else if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
  };

  // Doctor quick-fill demo pills
  const fillDoctorDemo = (id) => {
    setDoctorId(id);
    setDoctorPassword('password123');
    setErrors({});
  };

  // Doctor login handler
  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!doctorId.trim()) {
      setErrors({ doctorId: 'Please enter your Doctor ID (e.g. DOC-101)' });
      return;
    }
    if (!doctorPassword) {
      setErrors({ doctorPassword: 'Password is required' });
      return;
    }

    // Lookup pre-provisioned doctor
    const doctors = getDoctors();
    const doc = doctors.find(d => d.id.toUpperCase() === doctorId.trim().toUpperCase());

    if (!doc) {
      setErrors({ 
        doctorId: 'Doctor ID not recognized. Please use format DOC-101 or click a demo pill below.' 
      });
      return;
    }

    if (doctorPassword !== 'password123' && doctorPassword.length < 4) {
      setErrors({ doctorPassword: 'Invalid credentials. Contact clinic admin for password assistance.' });
      return;
    }

    // Role-mismatch guard passed -> trigger authenticating transition
    setAuthMessage(`Logging in as Doctor (${doc.name} - ${doc.id})...`);
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      const session = { role: 'doctor', user: doc, doctorId: doc.id };
      saveSession(session);
      onLoginSuccess(session);
      showToast(`Welcome back, ${doc.name}!`, 'success');
    }, 1200);
  };

  // Patient sign in handler
  const handlePatientSignIn = (e) => {
    e.preventDefault();
    setErrors({});

    if (!emailOrPhone.trim()) {
      setErrors({ emailOrPhone: 'Please enter your registered Email or Mobile number' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    const patients = getPatients();
    const pat = patients.find(p => p.email.toLowerCase() === emailOrPhone.trim().toLowerCase() || p.phone.includes(emailOrPhone.trim()));

    if (!pat && !emailOrPhone.includes('patient@example.com')) {
      setErrors({ emailOrPhone: 'Account not found. Switch to Sign Up tab or use demo email patient@example.com' });
      return;
    }

    const matchedPatient = pat || patients[0];

    setAuthMessage(`Logging in as Patient (${matchedPatient.name})...`);
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      const session = { role: 'patient', user: matchedPatient, patientId: matchedPatient.id };
      saveSession(session);
      onLoginSuccess(session);
      showToast(`Welcome, ${matchedPatient.name}!`, 'success');
    }, 1200);
  };

  // Patient signup handler -> trigger OTP modal
  const handlePatientSignUpSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!patientName.trim()) newErrors.patientName = 'Full name is required';
    if (!patientEmail.trim() || !patientEmail.includes('@')) newErrors.patientEmail = 'Valid email is required';
    if (!mobileNumber.trim() || mobileNumber.length < 8) newErrors.mobileNumber = 'Valid mobile number required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Open 6-digit OTP verification modal
    setShowOtpModal(true);
  };

  // Auto advance OTP input boxes
  const handleOtpChange = (index, val) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otpDigits];
    newOtp[index] = val;
    setOtpDigits(newOtp);

    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Confirm OTP & Complete Signup
  const handleVerifyOtp = () => {
    const code = otpDigits.join('');
    if (code.length < 6) {
      showToast('Please enter the full 6-digit OTP code', 'warning');
      return;
    }

    setShowOtpModal(false);
    setAuthMessage(`Creating Patient Account for ${patientName}...`);
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      const newPatient = {
        id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
        email: patientEmail,
        phone: mobileNumber,
        name: patientName,
        gender: 'Not specified',
        age: 30,
        bloodGroup: 'O+',
        allergies: 'None reported',
        vitals: {
          bloodPressure: '120/80 mmHg',
          heartRate: '72 bpm',
          bmi: '22.4 (Normal)',
          spO2: '98%',
          temperature: '98.6 °F',
          weight: '68 kg'
        }
      };

      const session = { role: 'patient', user: newPatient, patientId: newPatient.id };
      saveSession(session);
      onLoginSuccess(session);
      showToast('Account verified successfully! Welcome to Jivaka Clinic.', 'success');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* FULL-SCREEN AUTHENTICATING OVERLAY */}
      {isAuthenticating && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 37, 64, 0.92)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            gap: '20px'
          }}
        >
          <div 
            style={{
              width: '54px',
              height: '54px',
              border: '4px solid rgba(255, 255, 255, 0.2)',
              borderTopColor: '#0f62fe',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            {authMessage}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Securing your session...</p>
        </div>
      )}

      {/* LEFT PANEL (60%) — DEEP OCEAN NAVY BRANDING */}
      <div 
        style={{
          width: '60%',
          backgroundColor: 'var(--navy-deep)',
          background: 'linear-gradient(135deg, #0a2540 0%, #103154 50%, #081d33 100%)',
          padding: '48px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Background Geometric Line Texture */}
        <div 
          style={{
            position: 'absolute',
            top: 0, right: 0, bottom: 0, left: 0,
            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(15, 98, 254, 0.15) 0%, transparent 40%),
                              radial-gradient(circle at 20% 80%, rgba(5, 150, 105, 0.1) 0%, transparent 40%)`,
            pointerEvents: 'none'
          }}
        />

        {/* LOGO & TAGLINE */}
        <div style={{ zIndex: 2 }}>
          <Logo size="large" theme="light" />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500', marginTop: '10px' }}>
            Connected Clinical Excellence, Trusted Specialists, Elevated Care
          </p>
        </div>

        {/* HERO TRUST CONTENT & PILL BADGES */}
        <div style={{ zIndex: 2, margin: '40px 0' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '20px', letterSpacing: '-0.03em' }}>
            Unified Health Management for Clinics & Patients
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '540px', marginBottom: '32px' }}>
            Streamlined scheduling, clinical documentation, and encrypted personal health records — built for absolute clarity and peace of mind.
          </p>

          {/* 3 GLASSMOPHISM TRUST PILLS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              <Stethoscope size={16} color="#38bdf8" />
              <span>Verified Doctors</span>
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              <Lock size={16} color="#4ade80" />
              <span>Role-Based Access Protected</span>
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              <Clock size={16} color="#facc15" />
              <span>24/7 Record Access</span>
            </div>
          </div>
        </div>

        {/* FADED VECTOR CLINICAL ART */}
        <div style={{ zIndex: 1, opacity: 0.15, display: 'flex', alignItems: 'center', gap: '24px' }}>
          <svg width="320" height="90" viewBox="0 0 320 90" fill="none" stroke="#ffffff" strokeWidth="2">
            <path d="M0 45H60L75 15L95 75L115 35L135 55L145 45H320" strokeDasharray="4 4" />
          </svg>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Jivaka Clinic Security Architecture</div>
        </div>

      </div>

      {/* RIGHT PANEL (40%) — FORM CONTAINER */}
      <div 
        style={{
          width: '40%',
          backgroundColor: 'var(--slate-bg)',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: '440px',
            padding: '36px',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)'
          }}
        >

          {/* TOP SEGMENTED ROLE TOGGLE CONTROL */}
          <div 
            style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '28px'
            }}
          >
            <button
              type="button"
              onClick={() => handleTabChange('patient')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'patient' ? '#ffffff' : 'transparent',
                color: activeTab === 'patient' ? '#0a2540' : '#64748b',
                boxShadow: activeTab === 'patient' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <User size={16} />
              Patient Portal
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('doctor')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: activeTab === 'doctor' ? '#ffffff' : 'transparent',
                color: activeTab === 'doctor' ? '#0a2540' : '#64748b',
                boxShadow: activeTab === 'doctor' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Stethoscope size={16} />
              Doctor Portal
            </button>
          </div>

          {/* TAB CONTENT: DOCTOR LOGIN */}
          {activeTab === 'doctor' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0a2540', marginBottom: '4px' }}>
                  Doctor Authorization
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Restricted portal for pre-provisioned clinical staff
                </p>
              </div>

              <form onSubmit={handleDoctorSubmit}>
                {/* Doctor ID Field with Padlock Icon */}
                <div className="form-group">
                  <label>Doctor Identification ID</label>
                  <div className="input-with-icon">
                    <Lock className="input-icon" size={18} color="#0f62fe" />
                    <input
                      type="text"
                      placeholder="e.g. DOC-101"
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      className={errors.doctorId ? 'input-error' : ''}
                    />
                  </div>
                  {errors.doctorId && (
                    <div className="error-msg">
                      <AlertCircle size={14} /> {errors.doctorId}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <Key className="input-icon" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                      className={errors.doctorPassword ? 'input-error' : ''}
                    />
                  </div>
                  {errors.doctorPassword && (
                    <div className="error-msg">
                      <AlertCircle size={14} /> {errors.doctorPassword}
                    </div>
                  )}
                </div>

                {/* DEMO ACCOUNTS PILLS */}
                <div style={{ margin: '18px 0', padding: '12px', backgroundColor: '#edf5ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0353e9', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> CLICK TO AUTO-FILL DEMO DOCTOR ACCOUNTS:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => fillDoctorDemo('DOC-101')}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #0f62fe',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#0f62fe'
                      }}
                    >
                      DOC-101 (Cardiology)
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDoctorDemo('DOC-102')}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #0f62fe',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#0f62fe'
                      }}
                    >
                      DOC-102 (Pediatrics)
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '8px' }}>
                  Access Doctor Portal <ArrowRight size={16} />
                </button>

                <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                  Forgot your credentials? Contact clinic admin at <span style={{ fontWeight: '600' }}>admin@jivakaclinic.org</span>
                </div>
              </form>
            </div>
          )}

          {/* TAB CONTENT: PATIENT PORTAL */}
          {activeTab === 'patient' && (
            <div>
              {/* SECONDARY SIGN IN / SIGN UP SWITCH */}
              <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => { setPatientMode('signin'); setErrors({}); }}
                  style={{
                    padding: '8px 16px',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    borderBottom: patientMode === 'signin' ? '3px solid #0f62fe' : '3px solid transparent',
                    color: patientMode === 'signin' ? '#0f62fe' : '#64748b',
                    marginBottom: '-2px'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setPatientMode('signup'); setErrors({}); }}
                  style={{
                    padding: '8px 16px',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    borderBottom: patientMode === 'signup' ? '3px solid #0f62fe' : '3px solid transparent',
                    color: patientMode === 'signup' ? '#0f62fe' : '#64748b',
                    marginBottom: '-2px'
                  }}
                >
                  Create Account
                </button>
              </div>

              {/* PATIENT SIGN IN FORM */}
              {patientMode === 'signin' && (
                <form onSubmit={handlePatientSignIn}>
                  <div className="form-group">
                    <label>Email or Mobile Number</label>
                    <div className="input-with-icon">
                      <Mail className="input-icon" size={18} />
                      <input
                        type="text"
                        placeholder="patient@example.com"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className={errors.emailOrPhone ? 'input-error' : ''}
                      />
                    </div>
                    {errors.emailOrPhone && (
                      <div className="error-msg"><AlertCircle size={14} /> {errors.emailOrPhone}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label>Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPasswordModal(true)}
                        style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0f62fe' }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="input-with-icon">
                      <Key className="input-icon" size={18} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={errors.password ? 'input-error' : ''}
                      />
                    </div>
                    {errors.password && (
                      <div className="error-msg"><AlertCircle size={14} /> {errors.password}</div>
                    )}
                  </div>

                  {/* QUICK DEMO PATIENT FILL */}
                  <div style={{ marginBottom: '16px', fontSize: '0.75rem', color: '#64748b' }}>
                    💡 <span style={{ fontWeight: '600' }}>Demo Patient:</span> <button type="button" onClick={() => { setEmailOrPhone('patient@example.com'); setPassword('Patient123!'); }} style={{ color: '#0f62fe', textDecoration: 'underline', fontWeight: '600' }}>Click to autofill patient@example.com</button>
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In to Patient Portal <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {/* PATIENT SIGN UP FORM */}
              {patientMode === 'signup' && (
                <form onSubmit={handlePatientSignUpSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User className="input-icon" size={18} />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className={errors.patientName ? 'input-error' : ''}
                      />
                    </div>
                    {errors.patientName && <div className="error-msg"><AlertCircle size={14} /> {errors.patientName}</div>}
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <Mail className="input-icon" size={18} />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className={errors.patientEmail ? 'input-error' : ''}
                      />
                    </div>
                    {errors.patientEmail && <div className="error-msg"><AlertCircle size={14} /> {errors.patientEmail}</div>}
                  </div>

                  <div className="form-group">
                    <label>Mobile Number</label>
                    <div className="input-with-icon">
                      <Phone className="input-icon" size={18} />
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className={errors.mobileNumber ? 'input-error' : ''}
                      />
                    </div>
                    {errors.mobileNumber && <div className="error-msg"><AlertCircle size={14} /> {errors.mobileNumber}</div>}
                  </div>

                  <div className="form-group">
                    <label>Create Password</label>
                    <div className="input-with-icon">
                      <Key className="input-icon" size={18} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className={errors.password ? 'input-error' : ''}
                      />
                    </div>
                    {/* LIVE PASSWORD STRENGTH METER */}
                    {password && (
                      <div className="strength-bar-container">
                        <div className={`strength-bar-fill strength-${passwordStrength}`} />
                      </div>
                    )}
                    {errors.password && <div className="error-msg"><AlertCircle size={14} /> {errors.password}</div>}
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-with-icon">
                      <Key className="input-icon" size={18} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={errors.confirmPassword ? 'input-error' : ''}
                      />
                    </div>
                    {errors.confirmPassword && <div className="error-msg"><AlertCircle size={14} /> {errors.confirmPassword}</div>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-block">
                    Proceed to 2FA Verification <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 6-DIGIT OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '440px', padding: '28px', textAlign: 'center' }}>
            <div 
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#edf5ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#0f62fe'
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0a2540', marginBottom: '6px' }}>
              Two-Factor OTP Verification
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
              We sent a 6-digit verification code to <span style={{ fontWeight: '700', color: '#16191f' }}>{patientEmail || mobileNumber}</span>
            </p>

            {/* 6-digit auto advancing inputs */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputsRef.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  style={{
                    width: '46px',
                    height: '54px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    borderRadius: '10px',
                    border: '2px solid #cbd5e1',
                    outline: 'none'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#0f62fe')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              ))}
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '24px' }}>
              Demo Hint: Enter any 6 numbers (e.g. <span style={{ fontWeight: '700' }}>123456</span>)
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowOtpModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleVerifyOtp}
              >
                Verify & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {showForgotPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '420px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0a2540', marginBottom: '8px' }}>
              Reset Patient Password
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Enter your registered email address and we will send a password reset link.
            </p>
            <div className="form-group">
              <label>Registered Email</label>
              <input
                type="email"
                placeholder="patient@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForgotPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  showToast('Password reset link sent to ' + (forgotEmail || 'your email'), 'info');
                }}
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
