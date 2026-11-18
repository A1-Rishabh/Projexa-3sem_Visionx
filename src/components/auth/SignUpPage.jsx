import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { GoogleButton } from '../common/GoogleButton';
import { Modal } from '../common/Modal';
import { getPatients, saveSession } from '../../services/mockDataStore';
import { handleGoogleAuth } from '../../services/googleAuth';

export const SignUpPage = ({
  onLoginSuccess,
  showToast,
  onNavigateToLogin,
  onBackToHome
}) => {
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Strength and validation
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const otpInputsRef = useRef([]);

  // Calculate password strength
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

  // OTP Timer countdown
  useEffect(() => {
    let interval = null;
    if (showOtpModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

  // Form submit -> Show OTP modal
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Please provide your full legal name';
    if (!phone.trim()) newErrors.phone = 'Please provide a valid 10-digit mobile number';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Please provide a valid email address';
    if (!password) newErrors.password = 'Password must be at least 6 characters';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowOtpModal(true);
      setOtpTimer(60);
      setCanResend(false);
      showToast(`Verification OTP dispatched to ${phone}`, 'info');
    }, 600);
  };

  // OTP Digit Change
  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    setOtpTimer(60);
    setCanResend(false);
    setOtpDigits(['', '', '', '', '', '']);
    showToast('A fresh 6-digit OTP code has been sent', 'info');
    otpInputsRef.current[0]?.focus();
  };

  // Verify OTP and complete registration
  const handleVerifyOtp = () => {
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      showToast('Please enter the full 6-digit verification code', 'error');
      return;
    }

    setIsVerifyingOtp(true);

    setTimeout(() => {
      setIsVerifyingOtp(false);
      setShowOtpModal(false);

      const patients = getPatients();
      const newPatient = {
        id: `P-${1000 + patients.length + 1}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        gender: 'Not Specified',
        age: 30,
        bloodGroup: 'B+',
        allergies: 'None recorded',
        emergencyContact: '',
        vitals: null // Only recorded by attending doctors during in-person clinical exam
      };

      patients.push(newPatient);
      localStorage.setItem('aegis_patients', JSON.stringify(patients));

      const session = { role: 'patient', user: newPatient, patientId: newPatient.id };
      saveSession(session);
      showToast(`Welcome to Jeevak Clinic, ${newPatient.name}!`, 'success');
      onLoginSuccess(session);
    }, 800);
  };

  // Google sign-up handler
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await handleGoogleAuth({ isSignUp: true });
      setIsLoading(false);
      if (result.success) {
        showToast(result.message || 'Account created via Google. Welcome!', 'success');
        onLoginSuccess(result.session);
      }
    } catch (err) {
      setIsLoading(false);
      showToast('Google sign-up failed. Please try again.', 'error');
    }
  };

  return (
    <AuthLayout
      title="Create Patient Account"
      subtitle="Register to book clinic consultations, view prescription slips, and manage medical reports"
      onBackToHome={onBackToHome}
    >
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* FULL NAME */}
        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="signup-name">Full Name</label>
          <div className="input-with-icon">
            <User className="input-icon" size={17} />
            <input
              id="signup-name"
              type="text"
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={errors.name ? 'input-error' : ''}
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <div className="error-msg">
              <AlertCircle size={14} />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* MOBILE NUMBER */}
        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="signup-phone">Mobile Number</label>
          <div className="input-with-icon">
            <Phone className="input-icon" size={17} />
            <input
              id="signup-phone"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              className={errors.phone ? 'input-error' : ''}
              autoComplete="tel"
            />
          </div>
          {errors.phone && (
            <div className="error-msg">
              <AlertCircle size={14} />
              <span>{errors.phone}</span>
            </div>
          )}
        </div>

        {/* EMAIL ADDRESS */}
        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="signup-email">Email Address</label>
          <div className="input-with-icon">
            <Mail className="input-icon" size={17} />
            <input
              id="signup-email"
              type="email"
              placeholder="e.g. eleanor@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <div className="error-msg">
              <AlertCircle size={14} />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* PASSWORD + STRENGTH METER */}
        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="signup-password">Create Account Password</label>
          <div className="input-with-icon" style={{ position: 'relative' }}>
            <Lock className="input-icon" size={17} />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => {
                handlePasswordChange(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              className={errors.password ? 'input-error' : ''}
              autoComplete="new-password"
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

          {/* PASSWORD STRENGTH BAR */}
          {password && (
            <div style={{ marginTop: '8px' }}>
              <div
                style={{
                  height: '4px',
                  backgroundColor: 'var(--border-color)',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%',
                    backgroundColor: passwordStrength === 'weak' ? '#ef4444' : passwordStrength === 'medium' ? '#f59e0b' : '#0F6B63',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', marginTop: '4px', color: passwordStrength === 'weak' ? '#dc2626' : passwordStrength === 'medium' ? '#d97706' : '#0F6B63', textTransform: 'capitalize' }}>
                Password strength: {passwordStrength}
              </div>
            </div>
          )}

          {errors.password && (
            <div className="error-msg">
              <AlertCircle size={14} />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <div className="input-with-icon" style={{ position: 'relative' }}>
            <Lock className="input-icon" size={17} />
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              className={errors.confirmPassword ? 'input-error' : ''}
              autoComplete="new-password"
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="error-msg">
              <AlertCircle size={14} />
              <span>{errors.confirmPassword}</span>
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
          <span>{isLoading ? 'Preparing verification...' : 'Continue to Phone Verification'}</span>
          {!isLoading && <ArrowRight size={16} />}
        </button>

        {/* OR DIVIDER */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        {/* GOOGLE SIGN UP BUTTON */}
        <GoogleButton
          onClick={handleGoogleSignUp}
          isLoading={isLoading}
          label="Sign up with Google"
        />

        {/* LINK TO LOGIN */}
        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            style={{
              color: 'var(--primary-teal)',
              fontWeight: '700',
              textDecoration: 'underline'
            }}
          >
            Sign into Patient Portal
          </button>
        </div>
      </form>

      {/* 6-DIGIT OTP VERIFICATION MODAL */}
      <Modal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        title="Verify Your Mobile Number"
        maxWidth="460px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
          <div className="mint-icon-box" style={{ width: '56px', height: '56px', margin: '0 auto', borderRadius: '16px' }}>
            <KeyRound size={26} color="var(--primary-teal)" />
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--deep-teal)', marginBottom: '6px' }}>
              Enter 6-Digit OTP Code
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              We have dispatched a one-time verification passcode to <strong>{phone || 'your phone'}</strong>. (Any 6 digits will verify in demo).
            </p>
          </div>

          {/* 6 OTP DIGIT BOXES */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (otpInputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                style={{
                  width: '46px',
                  height: '52px',
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  padding: 0,
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: '#ffffff'
                }}
              />
            ))}
          </div>

          {/* RESEND COUNTDOWN */}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {otpTimer > 0 ? (
              <span>Resend code available in <strong>{otpTimer}s</strong></span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--primary-teal)',
                  fontWeight: '700'
                }}
              >
                <RotateCcw size={14} />
                <span>Resend OTP Code</span>
              </button>
            )}
          </div>

          {/* CONFIRM VERIFICATION BUTTON */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isVerifyingOtp}
              onClick={handleVerifyOtp}
              className="btn btn-primary"
              style={{ flex: 1.5, fontWeight: '700' }}
            >
              <span>{isVerifyingOtp ? 'Verifying...' : 'Verify & Create Account'}</span>
              <CheckCircle2 size={16} />
            </button>
          </div>
        </div>
      </Modal>
    </AuthLayout>
  );
};

export default SignUpPage;
