import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Check, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  Sparkles,
  Building2,
  Tag,
  CreditCard
} from 'lucide-react';
import { saveAppointment } from '../../services/mockDataStore';
import { Modal } from '../common/Modal';
import { formatINR } from '../../config/clinic';
import { PaymentOptions } from './PaymentOptions';

export const BookingWizardModal = ({ 
  isOpen, 
  onClose, 
  selectedDoctor, 
  patient, 
  onBookingConfirmed, 
  showToast 
}) => {
  const [step, setStep] = useState(1);
  const [visitReason, setVisitReason] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [errors, setErrors] = useState({});
  const [avatarError, setAvatarError] = useState(false);

  // Payment states for Step 3
  const [paymentMethod, setPaymentMethod] = useState('clinic'); // 'clinic' | 'qr' | 'upi' | 'card'
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'awaiting' | 'paid' | 'failed'

  // Reset state when doctor changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setVisitReason('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSelectedTime('');
      setErrors({});
      setAvatarError(false);
      setPaymentMethod('clinic');
      setPaymentStatus('idle');
    }
  }, [isOpen, selectedDoctor]);

  if (!selectedDoctor) return null;

  // Quick pick chips for visit reason
  const quickPickReasons = [
    'Routine Check-up',
    'Follow-up Consultation',
    'New Symptom Review',
    'Prescription Refill',
    'Diagnostic Report Discussion'
  ];

  // Helper to check if a time slot has already passed for today
  const isSlotInPast = (timeStr) => {
    try {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const slotDate = new Date();
      slotDate.setHours(hours, minutes, 0, 0);
      return slotDate.getTime() <= Date.now();
    } catch {
      return false;
    }
  };

  // Standard slot times
  const allSlotTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '01:30 PM', '02:00 PM',
    '02:30 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const doctorAvailableSlots = selectedDoctor.availableSlots || [
    '09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'
  ];

  const todayIso = new Date().toISOString().split('T')[0];

  // Calculate upcoming 5 days with slot counts
  const upcomingDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const isToday = isoStr === todayIso;
      
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      
      // Calculate available count
      let freeCount = 0;
      if (!selectedDoctor.isHoliday) {
        if (isToday) {
          freeCount = doctorAvailableSlots.filter(s => !isSlotInPast(s)).length;
        } else {
          freeCount = doctorAvailableSlots.length;
        }
      }

      dates.push({
        dateStr: isoStr,
        label,
        subLabel: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        freeCount
      });
    }
    return dates;
  }, [selectedDoctor, doctorAvailableSlots, todayIso]);

  // Initials for avatar fallback
  const getInitials = (name = '') => {
    const clean = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (clean[0] || 'D').toUpperCase();
  };

  // Validation for Step 1
  const handleNextStep1 = () => {
    const trimmed = visitReason.trim();
    if (!trimmed) {
      setErrors({ visitReason: 'Please enter or select a reason for your consultation.' });
      return;
    }
    if (trimmed.length < 5) {
      setErrors({ visitReason: 'Please provide a little more detail (at least 5 characters).' });
      return;
    }
    if (!/[a-zA-Z]{3,}/.test(trimmed)) {
      setErrors({ visitReason: 'Please enter a valid description of your symptom or visit reason.' });
      return;
    }
    setErrors({});
    setStep(2);
  };

  // Validation for Step 2
  const handleNextStep2 = () => {
    if (!selectedTime) {
      setErrors({ time: 'Please choose an available consultation time slot.' });
      return;
    }
    setErrors({});
    setStep(3);
  };

  // Step 3 Confirmation (Pay at Clinic)
  const handleConfirmPayAtClinic = () => {
    const newApt = saveAppointment({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      date: selectedDate,
      time: selectedTime,
      room: selectedDoctor.room,
      fee: selectedDoctor.fee,
      paymentMethod: 'Pay at clinic',
      paymentStatus: 'Pay at clinic',
      transactionId: null,
      visitReason
    });

    if (showToast) {
      showToast(`Appointment confirmed with ${selectedDoctor.name} at ${selectedDoctor.room}!`, 'success');
    }
    onBookingConfirmed(newApt);
    onClose();
  };

  // Step 3 Confirmation (Online Payment Success)
  const handleOnlinePaymentSuccess = (methodLabel, txnId) => {
    const newApt = saveAppointment({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      date: selectedDate,
      time: selectedTime,
      room: selectedDoctor.room,
      fee: selectedDoctor.fee,
      paymentMethod: methodLabel,
      paymentStatus: 'Paid',
      transactionId: txnId,
      visitReason
    });

    if (showToast) {
      showToast(`Payment of ${formatINR(selectedDoctor.fee)} received! Appointment confirmed.`, 'success');
    }
    onBookingConfirmed(newApt);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book In-Clinic Consultation"
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* STEPPER WITH NUMBERED CIRCLES AND CHECKMARKS */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            position: 'relative',
            padding: '4px 12px 14px 12px',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          {/* Connecting Line */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '18px', 
              left: '48px', 
              right: '48px', 
              height: '2px', 
              backgroundColor: 'var(--border-color)', 
              zIndex: 1 
            }} 
          />

          {[
            { num: 1, label: 'Reason' },
            { num: 2, label: 'Date & Slot' },
            { num: 3, label: 'Review & Pay' }
          ].map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div 
                key={s.num} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '6px', 
                  zIndex: 2,
                  backgroundColor: '#ffffff',
                  padding: '0 8px'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? 'var(--primary-teal)' : isCurrent ? 'var(--deep-teal)' : '#F1F5F9',
                    color: isCompleted || isCurrent ? '#ffffff' : 'var(--text-secondary)',
                    border: isCurrent ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    boxShadow: isCurrent ? '0 0 0 3px rgba(15, 107, 99, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isCompleted ? <Check size={16} /> : s.num}
                </div>
                <span 
                  style={{ 
                    fontSize: '0.74rem', 
                    fontWeight: isCurrent ? '700' : '500', 
                    color: isCurrent ? 'var(--deep-teal)' : 'var(--text-secondary)' 
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* COMPACT DOCTOR RECAP PILL */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '12px', 
            alignItems: 'center', 
            padding: '10px 14px', 
            backgroundColor: 'var(--warm-cream)', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)' 
          }}
        >
          {avatarError || !selectedDoctor.avatar ? (
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--mint)',
                color: 'var(--deep-teal)',
                fontWeight: '700',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid var(--primary-teal)',
                flexShrink: 0
              }}
            >
              {getInitials(selectedDoctor.name)}
            </div>
          ) : (
            <img 
              src={selectedDoctor.avatar} 
              alt={selectedDoctor.name} 
              onError={() => setAvatarError(true)}
              style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '1.5px solid var(--primary-teal)',
                flexShrink: 0
              }} 
            />
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.92rem', fontFamily: 'Fraunces, serif' }}>
              {selectedDoctor.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {selectedDoctor.specialization} • <strong>{selectedDoctor.room}</strong> • Fee: <strong style={{ color: 'var(--primary-teal)' }}>{formatINR(selectedDoctor.fee)}</strong>
            </div>
          </div>
        </div>

        {/* STEP 1: VISIT REASON & QUICK CHIPS */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label 
                htmlFor="booking-reason-input"
                style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}
              >
                Choose or Describe Reason for Visit
              </label>

              {/* Quick-Pick Reason Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {quickPickReasons.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setVisitReason(chip);
                      setErrors(prev => ({ ...prev, visitReason: null }));
                    }}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: visitReason === chip ? 'var(--mint)' : '#ffffff',
                      border: visitReason === chip ? '1.5px solid var(--primary-teal)' : '1px solid var(--border-color)',
                      color: visitReason === chip ? 'var(--primary-teal)' : 'var(--text-main)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              {/* Reason Textarea */}
              <textarea
                id="booking-reason-input"
                rows={3}
                placeholder="Describe any symptoms, follow-up goals, or medications you wish to review..."
                value={visitReason}
                onChange={(e) => {
                  setVisitReason(e.target.value);
                  if (errors.visitReason) setErrors(prev => ({ ...prev, visitReason: null }));
                }}
                className={errors.visitReason ? 'input-error' : ''}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: errors.visitReason ? '1.5px solid #EF4444' : '1px solid var(--border-color)',
                  fontSize: '0.86rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              {errors.visitReason && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>
                  <AlertCircle size={13} />
                  <span>{errors.visitReason}</span>
                </div>
              )}
            </div>

            {/* In-Clinic Notice */}
            <div 
              style={{ 
                backgroundColor: 'var(--warm-cream)', 
                padding: '10px 14px', 
                borderRadius: '10px', 
                fontSize: '0.78rem', 
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              ℹ️ <strong>In-Clinic Visit:</strong> Your time slot is reserved exclusively. Please arrive 10 minutes prior to your time.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button 
                type="button" 
                onClick={handleNextStep1} 
                className="btn btn-primary"
              >
                Choose Date & Slot <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME SLOT PICKER (WITH PAST-SLOT BUG FIX) */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* DATE CHIPS WITH FREE SLOT COUNTS */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                Select Appointment Date
              </label>

              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', 
                  gap: '8px' 
                }}
              >
                {upcomingDates.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item.dateStr);
                        setSelectedTime('');
                        setErrors({});
                      }}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: isSelected ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--mint)' : '#ffffff',
                        color: isSelected ? 'var(--deep-teal)' : 'var(--text-main)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        minHeight: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>
                        {item.label}
                      </span>
                      <span 
                        style={{ 
                          fontSize: '0.68rem', 
                          fontWeight: '600', 
                          color: item.freeCount > 0 ? (isSelected ? 'var(--primary-teal)' : '#16A34A') : '#94A3B8',
                          marginTop: '2px'
                        }}
                      >
                        {item.freeCount > 0 ? `${item.freeCount} slots free` : 'Fully booked'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TIME SLOTS GRID WITH PAST-SLOT BUG FIX & STRIKETHROUGH STYLING */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Available Time Slots
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Slots marked with strike-through are unavailable
                </span>
              </div>

              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', 
                  gap: '8px' 
                }}
              >
                {allSlotTimes.map((t) => {
                  const isToday = selectedDate === todayIso;
                  const isPast = isToday && isSlotInPast(t);
                  const isAvailableInSchedule = doctorAvailableSlots.includes(t) && !selectedDoctor.isHoliday;
                  const isAvailable = isAvailableInSchedule && !isPast;
                  const isSelected = selectedTime === t;

                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedTime(t);
                        setErrors(prev => ({ ...prev, time: null }));
                      }}
                      aria-label={`${t} - ${isAvailable ? 'Available' : isPast ? 'Time passed' : 'Unavailable'}`}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        textAlign: 'center',
                        border: isSelected 
                          ? '2px solid var(--primary-teal)' 
                          : isAvailable 
                            ? '1px solid var(--border-color)' 
                            : '1px solid #E2E8F0',
                        backgroundColor: isSelected 
                          ? 'var(--primary-teal)' 
                          : isAvailable 
                            ? '#ffffff' 
                            : '#F8FAFC',
                        color: isSelected 
                          ? '#ffffff' 
                          : isAvailable 
                            ? 'var(--text-main)' 
                            : '#94A3B8',
                        textDecoration: !isAvailable ? 'line-through' : 'none',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        opacity: isAvailable ? 1 : 0.45,
                        minHeight: '44px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              {errors.time && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626', fontSize: '0.78rem', marginTop: '6px' }}>
                  <AlertCircle size={13} />
                  <span>{errors.time}</span>
                </div>
              )}
            </div>

            {/* Stepper Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="btn btn-secondary"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                type="button" 
                onClick={handleNextStep2} 
                className="btn btn-primary"
              >
                Proceed to Payment & Review <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUMMARY CARD & CHOOSE HOW TO PAY */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* BOOKING SUMMARY CARD */}
            <div 
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1.5px solid var(--primary-teal)', 
                borderRadius: '14px', 
                padding: '16px', 
                boxShadow: 'var(--shadow-sm)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-teal)', fontSize: '0.82rem', fontWeight: '800', marginBottom: '10px' }}>
                <Sparkles size={16} /> APPOINTMENT SUMMARY
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Physician:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{selectedDoctor.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Date & Slot:</span>
                  <strong>{selectedDate} at {selectedTime}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Consultation Chamber:</span>
                  <strong style={{ color: 'var(--primary-teal)' }}>{selectedDoctor.room}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Consultation Fee:</span>
                  <strong style={{ color: 'var(--primary-teal)', fontSize: '0.96rem' }}>
                    {formatINR(selectedDoctor.fee)}
                  </strong>
                </div>
              </div>
            </div>

            {/* PAYMENT OPTIONS COMPONENT */}
            <PaymentOptions
              amount={selectedDoctor.fee}
              doctorName={selectedDoctor.name}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              patient={patient}
              selectedMethod={paymentMethod}
              onChangeMethod={(m, s = 'idle') => {
                setPaymentMethod(m);
                setPaymentStatus(s);
              }}
              paymentStatus={paymentStatus}
              onPaymentSuccess={handleOnlinePaymentSuccess}
              onPaymentFailed={(msg) => {
                setPaymentStatus('failed');
                if (showToast) showToast(msg || 'Payment failed.', 'error');
              }}
              onCancelPayment={() => {
                setPaymentStatus('idle');
                setPaymentMethod('clinic');
              }}
            />

            {/* Check-In Instructions for Pay at Clinic */}
            {paymentMethod === 'clinic' && paymentStatus === 'idle' && (
              <div 
                style={{ 
                  backgroundColor: '#FFF7ED', 
                  border: '1px solid #FED7AA', 
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  fontSize: '0.8rem', 
                  color: '#9A3412',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <MapPin size={16} color="#EA580C" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Check-In Instructions:</strong> Please report to {selectedDoctor.room} 10 minutes prior to {selectedTime}. You can pay directly at the counter via cash or card.
                </div>
              </div>
            )}

            {/* Stepper Buttons for Step 3 (Shown when in idle mode) */}
            {paymentStatus === 'idle' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setStep(2)} 
                  className="btn btn-secondary"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                {paymentMethod === 'clinic' && (
                  <button 
                    type="button" 
                    onClick={handleConfirmPayAtClinic} 
                    className="btn btn-primary"
                    style={{ 
                      backgroundColor: 'var(--deep-teal)', 
                      boxShadow: '0 4px 14px rgba(15, 79, 74, 0.35)',
                      minHeight: '44px',
                      padding: '10px 24px',
                      fontSize: '0.92rem'
                    }}
                  >
                    <Check size={18} /> Confirm Appointment
                  </button>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </Modal>
  );
};

export default BookingWizardModal;
