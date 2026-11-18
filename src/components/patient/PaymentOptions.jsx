import React, { useState, useEffect } from 'react';
import {
  Building2,
  Smartphone,
  QrCode,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { clinic, formatINR, isPlaceholder, buildUpiDeepLink } from '../../config/clinic';

export const PaymentOptions = ({
  amount = 0,
  doctorName = '',
  selectedDate = '',
  selectedTime = '',
  patient = {},
  selectedMethod = 'qr',
  onChangeMethod,
  paymentStatus = 'idle', // 'idle' | 'awaiting' | 'paid' | 'failed'
  onPaymentSuccess,
  onPaymentFailed,
  onCancelPayment
}) => {
  const [upiIdInput, setUpiIdInput] = useState('');
  const [upiError, setUpiError] = useState('');
  const [holdTimerSeconds, setHoldTimerSeconds] = useState(600); // 10 minute hold

  const isUpiConfigured = !isPlaceholder(clinic.upiId) && Boolean(clinic.upiId);
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const isGatewayConfigured = Boolean(razorpayKey && !isPlaceholder(razorpayKey));

  // Build the live or demo UPI link
  const activeUpiId = isUpiConfigured ? clinic.upiId : 'jeevak.clinic03@upi';
  const activePayee = !isPlaceholder(clinic.payeeName) ? clinic.payeeName : clinic.name;

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(activeUpiId)}&pn=${encodeURIComponent(activePayee)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Consultation - ${doctorName}`)}`;

  // 10-minute hold timer effect while awaiting payment
  useEffect(() => {
    if (paymentStatus !== 'awaiting') return;

    const interval = setInterval(() => {
      setHoldTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onPaymentFailed) onPaymentFailed('Payment session expired. Slot released.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentStatus, onPaymentFailed]);

  // Format hold time mm:ss
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Validate UPI ID (e.g. username@bank)
  const validateUpiId = (id) => {
    const regex = /^[\w.-]+@[\w.-]+$/;
    return regex.test(id.trim());
  };

  // Simulate or execute UPI app launch
  const handleInitiateUpiApp = () => {
    if (upiIdInput && !validateUpiId(upiIdInput)) {
      setUpiError('Please enter a valid UPI ID (e.g. yourname@oksbi or mobile@upi)');
      return;
    }
    setUpiError('');

    // On mobile, trigger deep link
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = upiDeepLink;
    }

    // Enter awaiting payment state
    if (onChangeMethod) onChangeMethod('upi', 'awaiting');
  };

  // Simulate Gateway Checkout (Razorpay)
  const handleInitiateCardCheckout = () => {
    if (isGatewayConfigured && window.Razorpay) {
      const options = {
        key: razorpayKey,
        amount: amount * 100, // paisa
        currency: 'INR',
        name: clinic.name,
        description: `Consultation with ${doctorName}`,
        handler: (response) => {
          onPaymentSuccess('Cards / Net Banking', response.razorpay_payment_id || `TXN-RZP-${Date.now().toString().slice(-6)}`);
        },
        prefill: {
          name: patient.name || '',
          email: patient.email || '',
          contact: patient.phone || ''
        },
        theme: { color: '#0F6B63' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Mock gateway checkout simulation
      if (onChangeMethod) onChangeMethod('card', 'awaiting');
    }
  };

  // Simulate approval (for mock mode testing)
  const handleSimulatePaymentApproval = () => {
    const mockTxn = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const methodLabel = selectedMethod === 'upi' ? 'UPI (Verified)' : selectedMethod === 'qr' ? 'UPI QR Code' : 'Card / Net Banking';
    onPaymentSuccess(methodLabel, mockTxn);
  };

  // Simulate failure
  const handleSimulatePaymentFailure = () => {
    if (onPaymentFailed) onPaymentFailed('Payment declined by issuing bank or cancelled.');
  };

  // RENDER AWAITING / PROCESSING MODAL STATE
  if (paymentStatus === 'awaiting') {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid var(--primary-teal)',
          padding: '24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeUp 0.2s ease-out'
        }}
      >
        {/* Slot Hold Timer Banner */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: '#FEF3C7',
            color: '#92400E',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '16px'
          }}
        >
          <Clock size={16} />
          <span>Slot held for you: {formatTimer(holdTimerSeconds)}</span>
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', fontFamily: 'Fraunces, serif' }}>
          Awaiting Payment Confirmation
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto 20px auto' }}>
          Please complete the payment of <strong>{formatINR(amount)}</strong> on your UPI app or checkout screen.
        </p>

        {/* QR Display if QR method was selected */}
        {selectedMethod === 'qr' && (
          <div style={{ display: 'inline-block', padding: '16px', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '18px' }}>
            <QRCodeSVG value={upiDeepLink} size={160} level="M" />
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Scan with GPay, PhonePe, Paytm or BHIM
            </div>
          </div>
        )}

        {/* UPI Payment Confirmation Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
          <button
            type="button"
            onClick={handleSimulatePaymentApproval}
            className="btn btn-primary"
            style={{ minHeight: '44px', padding: '10px 24px', fontWeight: '700' }}
          >
            <CheckCircle2 size={16} /> I Have Completed UPI Payment
          </button>

          <div>
            <button
              type="button"
              onClick={onCancelPayment}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Choose another payment method or pay at clinic
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER FAILED STATE
  if (paymentStatus === 'failed') {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #EF4444',
          padding: '24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
          <AlertCircle size={24} />
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#991B1B', margin: '0 0 6px 0', fontFamily: 'Fraunces, serif' }}>
          Payment Incomplete or Cancelled
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
          Your appointment slot is held for a limited time. Please complete the digital payment via UPI or Cards to confirm your booking.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => onChangeMethod('qr', 'idle')}
            className="btn btn-primary"
          >
            <RefreshCw size={14} /> Try UPI QR Code
          </button>
          <button
            type="button"
            onClick={() => onChangeMethod('card', 'idle')}
            className="btn btn-secondary"
          >
            <CreditCard size={14} /> Pay via Card / Net Banking
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT: RENDER PAYMENT OPTION SELECTOR
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
          Digital Payment Required for Slot Confirmation
        </label>
        <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: '700', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
          100% Refundable up to 2h before
        </span>
      </div>

      {/* SELECTABLE ONLINE PAYMENT OPTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* OPTION 1: SCAN UPI QR CODE (DEFAULT) */}
        <div
          onClick={() => onChangeMethod('qr', 'idle')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '12px',
            border: selectedMethod === 'qr' ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
            backgroundColor: selectedMethod === 'qr' ? 'var(--mint)' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minHeight: '48px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="radio"
              name="paymentMethod"
              checked={selectedMethod === 'qr'}
              onChange={() => onChangeMethod('qr', 'idle')}
              style={{ accentColor: 'var(--primary-teal)', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <QrCode size={16} color="var(--primary-teal)" />
                <span>Instant UPI QR Code</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Instant scan using Google Pay, PhonePe, Paytm, or any BHIM UPI app
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary-teal)', backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            Recommended
          </span>
        </div>

        {/* Expanded QR preview if QR option is active */}
        {selectedMethod === 'qr' && (
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--warm-cream)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              animation: 'fadeUp 0.15s ease-out'
            }}
          >
            <div style={{ display: 'inline-block', padding: '12px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
              <QRCodeSVG value={upiDeepLink} size={140} level="M" />
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '8px' }}>
              Amount: {formatINR(amount)}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Payee: {activePayee} • UPI ID: {activeUpiId}
            </div>
            <button
              type="button"
              onClick={() => onChangeMethod('qr', 'awaiting')}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '12px' }}
            >
              I Have Scanned & Paid
            </button>
          </div>
        )}

        {/* OPTION 3: PAY BY UPI APP / ID */}
        <div
          onClick={() => onChangeMethod('upi', 'idle')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '12px',
            border: selectedMethod === 'upi' ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
            backgroundColor: selectedMethod === 'upi' ? 'var(--mint)' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minHeight: '48px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="radio"
              name="paymentMethod"
              checked={selectedMethod === 'upi'}
              onChange={() => onChangeMethod('upi', 'idle')}
              style={{ accentColor: 'var(--primary-teal)', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={16} color="var(--primary-teal)" />
                <span>UPI ID / Installed UPI App</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Direct app intent on mobile or enter your VPA handle
              </div>
            </div>
          </div>
        </div>

        {/* Expanded UPI ID Input if active */}
        {selectedMethod === 'upi' && (
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--warm-cream)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              animation: 'fadeUp 0.15s ease-out'
            }}
          >
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                Enter your UPI ID (Optional on mobile)
              </label>
              <input
                type="text"
                placeholder="e.g. mobile@upi or name@okaxis"
                value={upiIdInput}
                onChange={(e) => {
                  setUpiIdInput(e.target.value);
                  setUpiError('');
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: upiError ? '1.5px solid #EF4444' : '1px solid var(--border-color)',
                  fontSize: '0.84rem'
                }}
              />
              {upiError && (
                <div style={{ fontSize: '0.74rem', color: '#DC2626', marginTop: '4px' }}>
                  {upiError}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleInitiateUpiApp}
              className="btn btn-primary btn-sm"
              style={{ alignSelf: 'flex-start' }}
            >
              <Smartphone size={14} /> Pay with UPI App
            </button>
          </div>
        )}

        {/* OPTION 4: CARDS & NET BANKING (RAZORPAY) */}
        <div
          onClick={() => onChangeMethod('card', 'idle')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '12px',
            border: selectedMethod === 'card' ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
            backgroundColor: selectedMethod === 'card' ? 'var(--mint)' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            minHeight: '48px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="radio"
              name="paymentMethod"
              checked={selectedMethod === 'card'}
              onChange={() => onChangeMethod('card', 'idle')}
              style={{ accentColor: 'var(--primary-teal)', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={16} color="var(--primary-teal)" />
                <span>Cards & Net Banking</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Visa, MasterCard, RuPay, Netbanking & Wallets via Razorpay
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Cards Action if active */}
        {selectedMethod === 'card' && (
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--warm-cream)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              animation: 'fadeUp 0.15s ease-out'
            }}
          >
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Secure 256-bit encrypted checkout. No card numbers are stored on Jeevak Clinic servers.
            </div>
            <button
              type="button"
              onClick={handleInitiateCardCheckout}
              className="btn btn-primary btn-sm"
              style={{ alignSelf: 'flex-start' }}
            >
              <CreditCard size={14} /> Open Secure Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentOptions;

