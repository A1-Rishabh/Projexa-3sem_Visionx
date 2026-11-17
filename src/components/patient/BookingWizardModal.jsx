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
  CreditCard,
  Search,
  User,
  CheckCircle2,
  Printer,
  X,
  RefreshCw,
  Star,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { getDoctors, saveAppointment } from '../../services/mockDataStore';
import { bookAppointment } from '../../services/clinicService';
import { Modal } from '../common/Modal';
import { formatINR } from '../../config/clinic';
import { PaymentOptions } from './PaymentOptions';
import { ReceiptModal } from './ReceiptModal';

export const BookingWizardModal = ({ 
  isOpen, 
  onClose, 
  selectedDoctor, 
  preselectedDepartment = '',
  patient = {}, 
  onBookingConfirmed, 
  showToast 
}) => {
  // Current doctor state (can be selected or switched within the wizard)
  const [currentDoctor, setCurrentDoctor] = useState(selectedDoctor || null);

  // Stepper state: 0 = Choose Doctor, 1 = Reason, 2 = Date & Slot, 3 = Review & Pay, 4 = Confirmed Success
  const [step, setStep] = useState(selectedDoctor ? 1 : 0);

  // Form states
  const [visitReason, setVisitReason] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [errors, setErrors] = useState({});
  const [avatarError, setAvatarError] = useState(false);

  // Doctor search & filter for Step 0
  const [doctorSearch, setDoctorSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState(preselectedDepartment || 'all');

  // Payment states for Step 3
  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr' | 'upi' | 'card'
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'awaiting' | 'paid' | 'failed'

  // Post-booking confirmed appointment object & receipt modal
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Available doctors list
  const allDoctors = useMemo(() => getDoctors(), []);

  // Distinct departments
  const departmentsList = useMemo(() => {
    const set = new Set(allDoctors.map(d => d.specialization));
    return ['all', ...Array.from(set)];
  }, [allDoctors]);

  // Reset or configure wizard state when opened
  useEffect(() => {
    if (isOpen) {
      if (selectedDoctor) {
        setCurrentDoctor(selectedDoctor);
        setStep(1);
      } else {
        setCurrentDoctor(null);
        setStep(0);
      }
      if (preselectedDepartment) {
        setDepartmentFilter(preselectedDepartment);
      }
      setVisitReason('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSelectedTime('');
      setErrors({});
      setAvatarError(false);
      setPaymentMethod('qr');
      setPaymentStatus('idle');
      setConfirmedAppointment(null);
      setIsReceiptModalOpen(false);
    }
  }, [isOpen, selectedDoctor, preselectedDepartment]);

  // Filtered doctors for Step 0
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(doc => {
      if (departmentFilter !== 'all' && doc.specialization.toLowerCase() !== departmentFilter.toLowerCase()) {
        return false;
      }
      if (doctorSearch.trim()) {
        const q = doctorSearch.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialization.toLowerCase().includes(q);
        const matchesBio = (doc.bio || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSpec && !matchesBio) return false;
      }
      return true;
    });
  }, [allDoctors, departmentFilter, doctorSearch]);

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

  // Standard 30-minute OPD consultation slots
  const standard30MinSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const doctorAvailableSlots = currentDoctor?.availableSlots || standard30MinSlots;
  const todayIso = new Date().toISOString().split('T')[0];

  // Upcoming 5 days
  const upcomingDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const isToday = isoStr === todayIso;
      
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      
      let freeCount = 0;
      if (currentDoctor && !currentDoctor.isHoliday) {
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
  }, [currentDoctor, doctorAvailableSlots, todayIso]);

  // Initials for avatar fallback
  const getInitials = (name = '') => {
    const clean = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (clean[0] || 'D').toUpperCase();
  };

  // Step 0: Doctor Selected Handler
  const handleSelectDoctorFromList = (doc) => {
    setCurrentDoctor(doc);
    setStep(1); // Advance to Reason for visit, preserving any entered data
  };

  // Validation for Step 1
  const handleNextStep1 = () => {
    const trimmed = visitReason.trim();
    if (!trimmed) {
      setErrors({ visitReason: 'Please enter or select a reason for your consultation.' });
      return;
    }
    if (trimmed.length < 4) {
      setErrors({ visitReason: 'Please provide at least 4 characters describing your symptom or reason.' });
      return;
    }
    setErrors({});
    setStep(2);
  };

  // Validation for Step 2
  const handleNextStep2 = () => {
    if (!selectedTime) {
      setErrors({ time: 'Please choose an available 30-minute consultation time slot.' });
      return;
    }
    setErrors({});
    setStep(3);
  };

  // Step 3: Online Payment Success Confirmation
  const handleOnlinePaymentSuccess = async (methodLabel, txnId) => {
    if (!currentDoctor) return;

    const aptPayload = {
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      patientId: patient.id || 'P-1001',
      patientName: patient.name || 'Patient',
      patientPhone: patient.phone || '',
      date: selectedDate,
      time: selectedTime,
      room: currentDoctor.room,
      fee: currentDoctor.fee,
      paymentMethod: methodLabel,
      paymentStatus: 'Paid',
      transactionId: txnId,
      visitReason
    };

    const newApt = saveAppointment(aptPayload);
    try {
      await bookAppointment(aptPayload);
    } catch (err) {
      console.warn('Booking sync to database:', err);
    }

    setConfirmedAppointment(newApt);
    setStep(4); // Advance to In-Modal Success & Receipt Screen!
    if (showToast) {
      showToast(`Payment received! Appointment confirmed with ${currentDoctor.name}.`, 'success');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={step === 4 ? "Consultation Confirmed & Paid" : "Book In-Clinic Consultation"}
        maxWidth="660px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* STEPPER PROGRESS INDICATOR (Steps 0 to 3) */}
          {step < 4 && (
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
                  left: '40px', 
                  right: '40px', 
                  height: '2px', 
                  backgroundColor: 'var(--border-color)', 
                  zIndex: 1 
                }} 
              />

              {[
                { num: 0, label: 'Doctor' },
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
                      gap: '4px', 
                      zIndex: 2,
                      backgroundColor: '#ffffff',
                      padding: '0 8px'
                    }}
                  >
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? 'var(--primary-teal)' : isCurrent ? 'var(--deep-teal)' : '#F1F5F9',
                        color: isCompleted || isCurrent ? '#ffffff' : 'var(--text-secondary)',
                        border: isCurrent ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        boxShadow: isCurrent ? '0 0 0 3px rgba(15, 107, 99, 0.2)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isCompleted ? <Check size={15} /> : (s.num === 0 ? 'Dr' : s.num)}
                    </div>
                    <span 
                      style={{ 
                        fontSize: '0.72rem', 
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
          )}

          {/* ACTIVE PATIENT IDENTIFIER CHIP (ALWAYS VISIBLE) */}
          {step < 4 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: 'var(--mint)',
                border: '1px solid rgba(15, 107, 99, 0.2)',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--deep-teal)' }}>
                <User size={15} color="var(--primary-teal)" />
                <span>
                  Booking for: <strong>{patient.name || 'Primary Patient'}</strong> ({patient.relation || 'Self'})
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary-teal)', backgroundColor: '#ffffff', padding: '1px 8px', borderRadius: '4px' }}>
                ID: {patient.id || 'P-1001'}
              </span>
            </div>
          )}

          {/* STEP 0: CHOOSE A DOCTOR (Searchable list with Fee in INR & next slot) */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', fontFamily: 'Fraunces, serif' }}>
                  Choose a Specialist Physician
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Select the doctor you wish to consult with for in-clinic OPD care.
                </p>
              </div>

              {/* SEARCH & DEPARTMENT FILTER */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                <div className="input-with-icon">
                  <Search className="input-icon" size={15} />
                  <input
                    type="text"
                    placeholder="Search doctor or specialty..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    style={{ padding: '8px 12px 8px 34px', fontSize: '0.82rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Filter size={14} color="var(--primary-teal)" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.82rem',
                      backgroundColor: '#ffffff',
                      fontWeight: '600'
                    }}
                  >
                    <option value="all">All Departments</option>
                    {departmentsList.filter(d => d !== 'all').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DOCTORS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredDoctors.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    No doctors found matching "{doctorSearch}". Try searching another name or department.
                  </div>
                ) : (
                  filteredDoctors.map((doc) => {
                    const isSelected = currentDoctor?.id === doc.id;
                    const isAvailableToday = !doc.isHoliday && doc.availableSlots && doc.availableSlots.length > 0;
                    const nextSlot = isAvailableToday
                      ? `Available Today (${doc.availableSlots[0]})`
                      : 'Next: Thu 10:00 AM';

                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleSelectDoctorFromList(doc)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'var(--mint)' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          gap: '12px'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--warm-cream)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#ffffff';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                            {getInitials(doc.name)}
                          </div>

                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'Fraunces, serif' }}>
                              {doc.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--primary-teal)', fontWeight: '600' }}>
                              {doc.specialization} • {doc.room}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: isAvailableToday ? '#16A34A' : '#92400E', fontWeight: '700', marginTop: '2px' }}>
                              ● {nextSlot}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary-teal)' }}>
                            {formatINR(doc.fee)}
                          </div>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.74rem', padding: '4px 10px', marginTop: '4px' }}
                          >
                            Select →
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* DOCTOR RECAP BAR WITH "CHANGE DOCTOR" TRIGGER (Steps 1, 2, 3) */}
          {currentDoctor && step >= 1 && step <= 3 && (
            <div 
              style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '10px 14px', 
                backgroundColor: 'var(--warm-cream)', 
                borderRadius: '12px', 
                border: '1px solid var(--border-color)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--mint)',
                    color: 'var(--deep-teal)',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid var(--primary-teal)',
                    flexShrink: 0
                  }}
                >
                  {getInitials(currentDoctor.name)}
                </div>

                <div>
                  <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'Fraunces, serif' }}>
                    {currentDoctor.name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    {currentDoctor.specialization} • {currentDoctor.room} • Fee: <strong style={{ color: 'var(--primary-teal)' }}>{formatINR(currentDoctor.fee)}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(0)}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  color: 'var(--primary-teal)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title="Change physician without losing entered appointment details"
              >
                Change Doctor
              </button>
            </div>
          )}

          {/* STEP 1: VISIT REASON & QUICK CHIPS */}
          {step === 1 && currentDoctor && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label 
                  htmlFor="booking-reason-input"
                  style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}
                >
                  What brings you in today? *
                </label>
                
                {/* Quick Pick Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {quickPickReasons.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setVisitReason(chip);
                        setErrors({});
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        border: visitReason === chip ? '1.5px solid var(--primary-teal)' : '1px solid var(--border-color)',
                        backgroundColor: visitReason === chip ? 'var(--mint)' : '#ffffff',
                        color: visitReason === chip ? 'var(--deep-teal)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <textarea
                  id="booking-reason-input"
                  rows={3}
                  placeholder="Describe your current symptoms, consultation goals, or questions for the doctor..."
                  value={visitReason}
                  onChange={(e) => {
                    setVisitReason(e.target.value);
                    if (errors.visitReason) setErrors({});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: errors.visitReason ? '1.5px solid #DC2626' : '1px solid var(--border-color)',
                    fontSize: '0.86rem',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.visitReason && (
                  <div style={{ fontSize: '0.74rem', color: '#DC2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={13} /> {errors.visitReason}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.84rem' }}
                >
                  <ArrowLeft size={15} /> Back to Doctors
                </button>
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="btn btn-primary"
                  style={{ fontSize: '0.84rem' }}
                >
                  Next: Choose Slot <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & 30-MINUTE SLOT SELECTION */}
          {step === 2 && currentDoctor && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* 5-DAY DATE CHIPS */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                  Select Consultation Date
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
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
                          padding: '8px 4px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'var(--mint)' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '0.74rem', fontWeight: '700', color: isSelected ? 'var(--deep-teal)' : 'var(--text-main)' }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                          {item.subLabel}
                        </span>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: item.freeCount > 0 ? '#16A34A' : '#94A3B8' }}>
                          {item.freeCount > 0 ? `${item.freeCount} slots` : 'Full'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 30-MINUTE SLOT GRID */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                  Select 30-Minute OPD Consultation Slot
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: '8px' }}>
                  {standard30MinSlots.map((timeSlot) => {
                    const isPast = selectedDate === todayIso && isSlotInPast(timeSlot);
                    const isSelected = selectedTime === timeSlot;

                    return (
                      <button
                        key={timeSlot}
                        type="button"
                        disabled={isPast}
                        onClick={() => {
                          setSelectedTime(timeSlot);
                          setErrors({});
                        }}
                        style={{
                          padding: '9px 6px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          border: isSelected ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'var(--primary-teal)' : isPast ? '#F1F5F9' : '#ffffff',
                          color: isSelected ? '#ffffff' : isPast ? '#94A3B8' : 'var(--text-main)',
                          cursor: isPast ? 'not-allowed' : 'pointer',
                          textDecoration: isPast ? 'line-through' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {timeSlot}
                      </button>
                    );
                  })}
                </div>

                {errors.time && (
                  <div style={{ fontSize: '0.74rem', color: '#DC2626', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={13} /> {errors.time}
                  </div>
                )}
              </div>

              {/* FREE CANCELLATION GUARANTEE NOTICE */}
              <div 
                style={{ 
                  backgroundColor: '#DCFCE7', 
                  border: '1px solid #BBF7D0', 
                  borderRadius: '10px', 
                  padding: '10px 14px', 
                  fontSize: '0.78rem', 
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600'
                }}
              >
                <ShieldCheck size={16} color="#16A34A" />
                <span>Free cancellation & 100% full refund available up to 2 hours prior to scheduled consultation.</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.84rem' }}
                >
                  <ArrowLeft size={15} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="btn btn-primary"
                  style={{ fontSize: '0.84rem' }}
                >
                  Next: Review & Pay <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & MANDATORY ONLINE PAYMENT */}
          {step === 3 && currentDoctor && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* APPOINTMENT SUMMARY CARD */}
              <div 
                style={{ 
                  backgroundColor: 'var(--warm-cream)', 
                  borderRadius: '12px', 
                  padding: '14px 16px', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.84rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Consulting Doctor:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{currentDoctor.name} ({currentDoctor.specialization})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Patient:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{patient.name || 'Primary Patient'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Date & Slot:</span>
                  <strong style={{ color: 'var(--deep-teal)' }}>{selectedDate} at {selectedTime}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Consultation Chamber:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{currentDoctor.room}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '6px', marginTop: '2px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>Total Fee to Pay:</span>
                  <strong style={{ color: 'var(--primary-teal)', fontSize: '1.05rem', fontWeight: '800' }}>
                    {formatINR(currentDoctor.fee)}
                  </strong>
                </div>
              </div>

              {/* PAYMENT OPTIONS (MANDATORY ONLINE CHECKOUT) */}
              <PaymentOptions
                amount={currentDoctor.fee}
                doctorName={currentDoctor.name}
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
                  if (showToast) showToast(msg || 'Payment could not be processed.', 'error');
                }}
                onCancelPayment={() => {
                  setPaymentStatus('idle');
                }}
              />

              {paymentStatus === 'idle' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <button 
                    type="button" 
                    onClick={() => setStep(2)} 
                    className="btn btn-secondary"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <ArrowLeft size={15} /> Back
                  </button>
                </div>
              )}

            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION & INVOICE SCREEN */}
          {step === 4 && confirmedAppointment && (
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '10px 0 6px 0',
                textAlign: 'center' 
              }}
            >
              <div 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  backgroundColor: '#DCFCE7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#16A34A'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', fontFamily: 'Fraunces, serif' }}>
                  Appointment Confirmed & Paid
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Payment of <strong>{formatINR(confirmedAppointment.fee)}</strong> received. Your consultation slot is officially locked.
                </p>
              </div>

              {/* TICKET / APPOINTMENT PASS */}
              <div 
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  border: '1.5px solid var(--primary-teal)', 
                  padding: '18px', 
                  width: '100%', 
                  boxSizing: 'border-box',
                  boxShadow: 'var(--shadow-sm)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.84rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      CHECK-IN TOKEN
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--deep-teal)' }}>
                      {confirmedAppointment.id.replace('APT-', 'CHK-')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      STATUS
                    </span>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                        Confirmed & Paid ✓
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '4px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Attending Physician:</span>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{confirmedAppointment.doctorName}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Consultation Room:</span>
                    <div style={{ fontWeight: '700', color: 'var(--primary-teal)' }}>{confirmedAppointment.room}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Date & Slot:</span>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{confirmedAppointment.date} at {confirmedAppointment.time}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Transaction ID:</span>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.78rem' }}>{confirmedAppointment.transactionId}</div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ gap: '6px', fontSize: '0.84rem' }}
                >
                  <Printer size={15} /> Download Invoice / Receipt
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onBookingConfirmed(confirmedAppointment);
                    onClose();
                  }}
                  className="btn btn-primary"
                  style={{ gap: '6px', fontSize: '0.84rem' }}
                >
                  <span>Go to My Appointments</span>
                  <ArrowRight size={15} />
                </button>
              </div>

            </div>
          )}

        </div>
      </Modal>

      {/* RECEIPT MODAL INTEGRATION */}
      {confirmedAppointment && (
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          appointment={confirmedAppointment}
          patient={patient}
          showToast={showToast}
        />
      )}
    </>
  );
};

export default BookingWizardModal;
