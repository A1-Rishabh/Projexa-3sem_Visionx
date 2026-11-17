import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  FileText,
  User,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Pill,
  Sparkles,
  X,
  ChevronRight
} from 'lucide-react';
import { clinic, isPlaceholder, getMapEmbedUrl, getDirectionsUrl } from '../../config/clinic';
import { getAppointments, getMedicalRecords, updateAppointmentStatus } from '../../services/mockDataStore';
import { StatusBadge } from '../common/StatusBadge';

export const InfoHub = ({ 
  patient = {}, 
  onNavigateToDoctors, 
  onNavigateToAppointments, 
  onNavigateToRecords, 
  onNavigateToProfile,
  showToast 
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [cancelModalApt, setCancelModalApt] = useState(null);

  const mainBranch = clinic.branches[0] || {};
  const isMapPlaceholder = isPlaceholder(mainBranch.mapQuery);
  const isAddressPlaceholder = isPlaceholder(mainBranch.address);
  const isPhonePlaceholder = isPlaceholder(mainBranch.phone);
  const isEmailPlaceholder = isPlaceholder(mainBranch.email);

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const cleanName = useMemo(() => {
    const raw = patient?.name;
    if (!raw || raw === 'John Doe') return 'Rahul Sharma';
    return raw
      .replace(/^Dr\.\s*/i, '')
      .replace(/\s*\(Google User\)/i, '')
      .replace(/\s*\(Demo\)/i, '')
      .trim() || 'Rahul Sharma';
  }, [patient?.name]);

  const patientFirstName = cleanName.split(' ')[0] || 'Patient';

  // Format today's human-readable date
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  // Today's day of week to highlight in operating hours
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1-6 Mon-Sat

  // Check clinic Open/Closed status
  const isClinicOpen = useMemo(() => {
    const hour = new Date().getHours();
    // Mon-Sat: 9am - 6pm (18:00), Sun: Closed
    if (currentDayIndex === 0) return false;
    return hour >= 9 && hour < 18;
  }, [currentDayIndex]);

  // Find patient's next upcoming appointment
  const allAppointments = getAppointments();
  const nextAppointment = useMemo(() => {
    const patientApts = allAppointments.filter(
      (a) => a.patientId === patient.id && a.status !== 'cancelled' && a.status !== 'completed'
    );
    // Return first upcoming or confirmed
    return patientApts.length > 0 ? patientApts[0] : null;
  }, [allAppointments, patient.id]);

  // Calculate human countdown for next appointment
  const appointmentCountdown = useMemo(() => {
    if (!nextAppointment) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    if (nextAppointment.date === todayStr) {
      return 'Today, scheduled visit';
    }
    const aptDate = new Date(nextAppointment.date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    aptDate.setHours(0, 0, 0, 0);
    const diffTime = aptDate - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Upcoming';
  }, [nextAppointment]);

  // Find latest lab report for patient
  const records = getMedicalRecords();
  const patientRecord = records[patient.id] || null;
  const latestLabReport = patientRecord?.labReports?.[0] || null;

  // Handle Cancel Appointment Confirmation
  const handleConfirmCancel = () => {
    if (!cancelModalApt) return;
    updateAppointmentStatus(cancelModalApt.id, 'cancelled', { cancelReason: 'Patient cancelled from dashboard' });
    setCancelModalApt(null);
    if (showToast) {
      showToast('Appointment successfully cancelled.', 'info');
    }
  };

  // Copy Address Handler
  const handleCopyAddress = () => {
    if (isAddressPlaceholder) {
      if (showToast) showToast('Address is currently being configured.', 'warning');
      return;
    }
    navigator.clipboard.writeText(mainBranch.address);
    setCopiedAddress(true);
    if (showToast) showToast('Clinic address copied to clipboard!', 'success');
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* TOP COMPACT GREETING BAR */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--mint)',
              color: 'var(--primary-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '1.1rem'
            }}
          >
            {patientFirstName[0]}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
                {greeting}, {patientFirstName}
              </h1>
              <span 
                style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: '700', 
                  color: 'var(--primary-teal)', 
                  backgroundColor: 'var(--mint)', 
                  padding: '2px 8px', 
                  borderRadius: '6px' 
                }}
              >
                ID: {patient.id || 'P-1001'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              {todayFormatted} • Jivaka Patient Health Hub
            </p>
          </div>
        </div>

        {/* Quick Top CTA */}
        <button
          type="button"
          onClick={onNavigateToDoctors}
          className="btn btn-primary btn-sm"
          style={{ minHeight: '40px' }}
        >
          <Calendar size={16} /> Book Appointment
        </button>
      </div>

      {/* ABOVE-THE-FOLD PRIMARY DASHBOARD GRID (3 CLINICAL CARDS) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}
      >
        {/* CARD 1: NEXT APPOINTMENT */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--mint)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} />
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
                  Next Appointment
                </h2>
              </div>
              {nextAppointment && (
                <StatusBadge status={nextAppointment.status} />
              )}
            </div>

            {nextAppointment ? (
              <div>
                <div style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--deep-teal)', marginBottom: '4px' }}>
                  {nextAppointment.doctorName}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {nextAppointment.date} at {nextAppointment.time}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'var(--warm-cream)', color: 'var(--text-main)', fontWeight: '600' }}>
                    {nextAppointment.room}
                  </span>
                  {appointmentCountdown && (
                    <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: '700' }}>
                      ⏳ {appointmentCountdown}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  "{nextAppointment.visitReason}"
                </p>
              </div>
            ) : (
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
                  No upcoming appointments scheduled.
                </p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}>
            {nextAppointment ? (
              <>
                <button
                  type="button"
                  onClick={onNavigateToDoctors}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setCancelModalApt(nextAppointment)}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: '1px solid #FECACA',
                    color: '#DC2626'
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onNavigateToDoctors}
                className="btn btn-primary btn-sm btn-block"
              >
                Book a Visit
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: LATEST LAB REPORT */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--mint)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
                  Latest Lab Report
                </h2>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary-teal)', backgroundColor: 'var(--mint)', padding: '2px 8px', borderRadius: '6px' }}>
                Verified
              </span>
            </div>

            {latestLabReport ? (
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                  {latestLabReport.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Date: {latestLabReport.date} • {latestLabReport.issuedBy}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {latestLabReport.summary}
                </p>
              </div>
            ) : (
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  No diagnostic records on file yet.
                </p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={onNavigateToRecords}
              className="btn btn-secondary btn-sm btn-block"
              style={{ justifyContent: 'space-between' }}
            >
              <span>View In Medical Records</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* CARD 3: REMINDERS & HEALTH TIPS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--mint)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pill size={18} />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
                Reminders & Care Tips
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--warm-cream)', borderLeft: '3px solid var(--primary-teal)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--deep-teal)' }}>
                  Medication Reminder
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Lisinopril 10mg — 1 tablet daily after breakfast.
                </div>
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: '#F0FDF4', borderLeft: '3px solid #16A34A' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#166534' }}>
                  Hydration & Blood Pressure
                </div>
                <div style={{ fontSize: '0.76rem', color: '#15803D', marginTop: '2px' }}>
                  Aim for 2.5L water daily to maintain stable renal filtration.
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Allergy alerts:</span>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#DC2626', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '4px' }}>
              {patient.allergies || 'Penicillin'}
            </span>
          </div>
        </div>

      </div>

      {/* BELOW-THE-FOLD: CLINIC SCHEDULE & LOCATION MAP (Clean Two-Column Grid) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '16px' 
        }}
      >
        
        {/* CLINIC SCHEDULE & CONTACT */}
        <div 
          style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)', 
            padding: '22px', 
            boxShadow: 'var(--shadow-sm)' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--mint)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
                Clinic Schedule & Contact
              </h3>
            </div>
            
            {/* Live Open / Closed Badge */}
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                backgroundColor: isClinicOpen ? 'var(--mint)' : '#FEE2E2',
                color: isClinicOpen ? 'var(--primary-teal)' : '#DC2626'
              }}
            >
              <span 
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isClinicOpen ? '#16A34A' : '#DC2626'
                }}
              />
              {isClinicOpen ? 'Open Now' : 'Closed Now'}
            </span>
          </div>

          {/* Operating Hours with Today Row Highlighted */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', marginBottom: '16px' }}>
            {mainBranch.hours?.map((h, idx) => {
              // Check if today matches Mon-Sat (1 to 6) or Sunday (0)
              const isToday = (idx === 0 && currentDayIndex >= 1 && currentDayIndex <= 6) ||
                              (idx === 1 && currentDayIndex === 0);
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: isToday ? 'var(--mint)' : 'transparent',
                    border: isToday ? '1px solid rgba(15, 107, 99, 0.2)' : 'none'
                  }}
                >
                  <span style={{ fontWeight: isToday ? '700' : '500', color: isToday ? 'var(--deep-teal)' : 'var(--text-secondary)' }}>
                    {h.days} {isToday && '(Today)'}:
                  </span>
                  <strong style={{ color: isToday ? 'var(--primary-teal)' : 'var(--text-main)' }}>
                    {h.time}
                  </strong>
                </div>
              );
            })}
          </div>

          {/* Contact Details with Tappable Links */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <Phone size={16} color="var(--primary-teal)" />
                <span>Helpline:</span>
                <strong>{mainBranch.phone}</strong>
              </div>
              {!isPhonePlaceholder && (
                <a
                  href={`tel:${mainBranch.phone}`}
                  className="btn btn-outline-teal btn-sm"
                  style={{ padding: '4px 12px', minHeight: '32px', fontSize: '0.78rem' }}
                >
                  Call now
                </a>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <Mail size={16} color="var(--primary-teal)" />
              <span>Inquiries:</span>
              {!isEmailPlaceholder ? (
                <a href={`mailto:${mainBranch.email}`} style={{ color: 'var(--primary-teal)', fontWeight: '600', textDecoration: 'none' }}>
                  {mainBranch.email}
                </a>
              ) : (
                <strong>{mainBranch.email}</strong>
              )}
            </div>
          </div>
        </div>

        {/* LOCATION & DIRECTIONS */}
        <div 
          style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)', 
            padding: '22px', 
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--mint)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={18} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
                Clinic Location & Directions
              </h3>
            </div>

            {/* Address Display */}
            <div style={{ fontSize: '0.86rem', color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.45 }}>
              <div style={{ fontWeight: '600' }}>
                {mainBranch.address}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Level 2 • In-Clinic Consultation Chambers
              </div>
            </div>

            {/* Map Frame or Mint Placeholder Panel */}
            <div 
              style={{
                height: '140px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--border-color)',
                marginBottom: '14px'
              }}
            >
              {isMapPlaceholder ? (
                <div
                  style={{
                    height: '100%',
                    backgroundColor: 'var(--mint)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--deep-teal)',
                    gap: '6px'
                  }}
                >
                  <MapPin size={28} color="var(--primary-teal)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>Clinic location coming soon</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Configured via src/config/clinic.js</span>
                </div>
              ) : (
                <iframe
                  title="Jivaka Clinic Location Map"
                  src={getMapEmbedUrl(mainBranch.mapQuery)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              )}
            </div>
          </div>

          {/* Action Buttons: Get Directions & Copy Address */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {!isMapPlaceholder && (
              <a
                href={getDirectionsUrl(mainBranch.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, textDecoration: 'none' }}
              >
                <ExternalLink size={14} /> Get directions
              </a>
            )}
            <button
              type="button"
              onClick={handleCopyAddress}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              {copiedAddress ? (
                <>
                  <Check size={14} color="#16A34A" /> Address copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy address
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* CANCEL APPOINTMENT CONFIRMATION DIALOG */}
      {cancelModalApt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 79, 74, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              animation: 'fadeUp 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', marginBottom: '12px' }}>
              <AlertCircle size={24} />
              <h3 id="cancel-dialog-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>
                Cancel Appointment?
              </h3>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Are you sure you want to cancel your appointment with <strong>{cancelModalApt.doctorName}</strong> on <strong>{cancelModalApt.date} at {cancelModalApt.time}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="btn btn-secondary btn-sm"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="btn btn-danger btn-sm"
              >
                Yes, Cancel Visit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InfoHub;
