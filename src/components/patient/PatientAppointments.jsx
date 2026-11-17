import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Check, 
  X, 
  Receipt,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Download,
  CalendarPlus,
  QrCode,
  Bell,
  FileText
} from 'lucide-react';
import { getAppointments, updateAppointmentStatus, getDoctors } from '../../services/mockDataStore';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { ReceiptModal } from './ReceiptModal';
import { PreVisitFormModal } from './PreVisitFormModal';
import { WaitlistModal } from './WaitlistModal';
import { formatINR, clinic, getDirectionsUrl, isPlaceholder } from '../../config/clinic';

export const PatientAppointments = ({ patient, showToast, onBookNew }) => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [cancelModalApt, setCancelModalApt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedReceiptApt, setSelectedReceiptApt] = useState(null);
  const [preVisitApt, setPreVisitApt] = useState(null);
  const [waitlistApt, setWaitlistApt] = useState(null);
  const [reminderApts, setReminderApts] = useState({ 'APT-801': true });

  const toggleReminder = (aptId) => {
    setReminderApts(prev => {
      const nextState = !prev[aptId];
      if (showToast) {
        showToast(nextState ? 'Appointment reminder active (Email & SMS)' : 'Appointment reminder muted', 'info');
      }
      return { ...prev, [aptId]: nextState };
    });
  };

  useEffect(() => {
    loadAppointments();
  }, [patient.id]);

  const loadAppointments = () => {
    const all = getAppointments();
    setAppointments(all.filter(a => a.patientId === patient.id));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingList = appointments.filter(
    a => a.date >= todayStr && a.status !== 'completed' && a.status !== 'cancelled'
  );
  const pastList = appointments.filter(
    a => a.date < todayStr || a.status === 'completed' || a.status === 'cancelled'
  );

  const displayList = activeTab === 'upcoming' ? upcomingList : pastList;
  const mainBranch = clinic.branches[0] || {};
  const isMapConfigured = !isPlaceholder(mainBranch.mapQuery);

  // Compute countdown label
  const getCountdownLabel = (dateStr, timeStr) => {
    if (dateStr === todayStr) {
      return `Today, at ${timeStr}`;
    }
    const aptDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    aptDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((aptDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Scheduled';
  };

  // Generate .ics calendar download
  const handleAddToCalendar = (apt) => {
    try {
      // Parse date and time into YYYYMMDDTHHMMSSZ
      const [year, month, day] = apt.date.split('-');
      let hours = 9;
      let minutes = 0;
      if (apt.time) {
        const [timePart, modifier] = apt.time.split(' ');
        const [h, m] = timePart.split(':').map(Number);
        hours = modifier === 'PM' && h < 12 ? h + 12 : modifier === 'AM' && h === 12 ? 0 : h;
        minutes = m || 0;
      }
      
      const pad = (n) => n.toString().padStart(2, '0');
      const startStr = `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}00`;
      // 30 min duration
      const endHours = minutes + 30 >= 60 ? hours + 1 : hours;
      const endMinutes = (minutes + 30) % 60;
      const endStr = `${year}${pad(month)}${pad(day)}T${pad(endHours)}${pad(endMinutes)}00`;

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Jivaka Clinic//Appointment Scheduler//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `SUMMARY:Consultation with ${apt.doctorName}`,
        `DESCRIPTION:In-clinic consultation at Jivaka Clinic. Assigned Chamber: ${apt.room}. Reason: ${apt.visitReason || 'Clinical consultation'}`,
        `LOCATION:${mainBranch.address || 'Jivaka Clinic'}`,
        `DTSTART:${startStr}`,
        `DTEND:${endStr}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `jivaka-appointment-${apt.id}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (showToast) {
        showToast('Calendar event (.ics) downloaded!', 'success');
      }
    } catch {
      if (showToast) {
        showToast('Unable to export calendar event.', 'warning');
      }
    }
  };

  // Find doctor object for rescheduling / booking again
  const getDoctorForApt = (apt) => {
    const doctors = getDoctors();
    return doctors.find(d => d.id === apt.doctorId || d.name === apt.doctorName) || null;
  };

  const handleCancelSubmit = () => {
    if (!cancelModalApt) return;
    updateAppointmentStatus(cancelModalApt.id, 'cancelled', { cancelReason });
    loadAppointments();
    setCancelModalApt(null);
    setCancelReason('');
    if (showToast) {
      showToast('Appointment cancelled successfully', 'info');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TAB HEADER */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
            My Appointments
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Track your upcoming visits, chamber check-in codes, and consultation receipts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--warm-cream)', padding: '4px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.84rem',
              backgroundColor: activeTab === 'upcoming' ? '#ffffff' : 'transparent',
              color: activeTab === 'upcoming' ? 'var(--deep-teal)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'upcoming' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Upcoming ({upcomingList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('past')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.84rem',
              backgroundColor: activeTab === 'past' ? '#ffffff' : 'transparent',
              color: activeTab === 'past' ? 'var(--deep-teal)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'past' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Past History ({pastList.length})
          </button>
        </div>
      </div>

      {/* APPOINTMENTS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {displayList.length === 0 ? (
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '16px', 
              padding: '40px 24px', 
              textAlign: 'center', 
              color: 'var(--text-secondary)', 
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Calendar size={36} color="var(--primary-teal)" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', fontFamily: 'Fraunces, serif' }}>
              No {activeTab} appointments found
            </h3>
            <p style={{ fontSize: '0.84rem', margin: '0 0 16px 0' }}>
              Schedule an in-clinic consultation with any of our board-certified physicians.
            </p>
            {onBookNew && (
              <button
                type="button"
                onClick={() => onBookNew()}
                className="btn btn-primary btn-sm"
              >
                Book an Appointment
              </button>
            )}
          </div>
        ) : (
          displayList.map(apt => {
            const isPaid = apt.paymentStatus === 'Paid';
            const fee = apt.fee || 1200;
            const checkInCode = `CHK-${apt.id.replace('APT-', '')}`;
            const targetDoc = getDoctorForApt(apt);

            return (
              <div
                key={apt.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  {/* Date badge */}
                  <div 
                    style={{ 
                      width: '58px', 
                      height: '58px', 
                      backgroundColor: 'var(--mint)', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'var(--primary-teal)',
                      flexShrink: 0
                    }}
                  >
                    <Calendar size={18} />
                    <span style={{ fontSize: '0.74rem', fontWeight: '800', marginTop: '2px' }}>
                      {apt.date.split('-')[2] || '16'}
                    </span>
                  </div>

                  <div>
                    {/* Top Row: Doctor name, Status badge, Payment badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
                        {apt.doctorName}
                      </h3>
                      
                      {/* Unified StatusBadge (Pending, Confirmed, Completed, Cancelled) */}
                      <StatusBadge status={apt.status} />

                      {/* Payment Badge */}
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: isPaid ? '#DCFCE7' : '#FEF3C7',
                          color: isPaid ? '#15803D' : '#92400E'
                        }}
                      >
                        {isPaid ? `Paid • ${formatINR(fee)}` : `Pay at Clinic • ${formatINR(fee)}`}
                      </span>

                      {/* Reminder Set / Toggle Badge */}
                      {activeTab === 'upcoming' && (
                        <button
                          type="button"
                          onClick={() => toggleReminder(apt.id)}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: reminderApts[apt.id] ? '#DCEFE6' : '#F1F5F9',
                            color: reminderApts[apt.id] ? 'var(--deep-teal)' : 'var(--text-secondary)',
                            border: '1px solid ' + (reminderApts[apt.id] ? 'var(--primary-teal)' : 'var(--border-color)'),
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                          title={reminderApts[apt.id] ? "Reminder active (SMS & Email). Click to mute" : "Click to activate SMS & Email reminders"}
                        >
                          <Bell size={11} color={reminderApts[apt.id] ? "var(--primary-teal)" : "var(--text-secondary)"} />
                          <span>{reminderApts[apt.id] ? '🔔 Reminder Set' : 'Set Reminder'}</span>
                        </button>
                      )}

                      {/* Countdown badge for upcoming visits */}
                      {activeTab === 'upcoming' && (
                        <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: '700' }}>
                          ⏳ {getCountdownLabel(apt.date, apt.time)}
                        </span>
                      )}
                    </div>

                    {/* Metadata line: Date, Time, Room, Check-in Code */}
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span>Date: <strong>{apt.date}</strong> at <strong style={{ color: 'var(--primary-teal)' }}>{apt.time}</strong></span>
                      <span>Chamber: <strong style={{ color: 'var(--deep-teal)' }}>{apt.room}</strong></span>
                      <span style={{ backgroundColor: 'var(--warm-cream)', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.74rem', color: 'var(--text-main)' }}>
                        Check-in Code: <strong>{checkInCode}</strong>
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Reason: <em>"{apt.visitReason}"</em>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* View Receipt Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptApt(apt)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '6px' }}
                    title="View Tax Invoice & Receipt"
                  >
                    <Receipt size={14} color="var(--primary-teal)" />
                    <span>Receipt</span>
                  </button>

                  {/* Add to Calendar (.ics) for upcoming visits */}
                  {activeTab === 'upcoming' && (
                    <button
                      type="button"
                      onClick={() => handleAddToCalendar(apt)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '6px' }}
                      title="Download iCalendar event (.ics)"
                    >
                      <CalendarPlus size={14} color="var(--primary-teal)" />
                      <span>Calendar</span>
                    </button>
                  )}

                  {/* Pre-visit Questionnaire for upcoming visits */}
                  {activeTab === 'upcoming' && (
                    <button
                      type="button"
                      onClick={() => setPreVisitApt(apt)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '6px' }}
                      title="Fill out your symptoms and history before your appointment"
                    >
                      <FileText size={14} color="var(--primary-teal)" />
                      <span>Pre-visit Form</span>
                    </button>
                  )}

                  {/* Waitlist for earlier openings */}
                  {activeTab === 'upcoming' && (
                    <button
                      type="button"
                      onClick={() => setWaitlistApt(apt)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '6px' }}
                      title="Notify me if an earlier cancellation slot becomes available"
                    >
                      <Clock size={14} color="var(--warm-accent)" />
                      <span>Waitlist</span>
                    </button>
                  )}

                  {/* Get Directions Link if map is configured */}
                  {activeTab === 'upcoming' && isMapConfigured && (
                    <a
                      href={getDirectionsUrl(mainBranch.mapQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '6px', textDecoration: 'none' }}
                      title="Get Directions in Google Maps"
                    >
                      <ExternalLink size={14} />
                      <span>Directions</span>
                    </a>
                  )}

                  {/* Reschedule Button */}
                  {activeTab === 'upcoming' && onBookNew && (
                    <button
                      type="button"
                      onClick={() => onBookNew(targetDoc)}
                      className="btn btn-secondary btn-sm"
                    >
                      Reschedule
                    </button>
                  )}

                  {/* Cancel Button */}
                  {activeTab === 'upcoming' && (
                    <button
                      type="button"
                      onClick={() => setCancelModalApt(apt)}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #FECACA',
                        color: '#DC2626'
                      }}
                    >
                      <X size={14} /> Cancel
                    </button>
                  )}

                  {/* Past: Book Again Button */}
                  {activeTab === 'past' && onBookNew && (
                    <button
                      type="button"
                      onClick={() => onBookNew(targetDoc)}
                      className="btn btn-primary btn-sm"
                    >
                      <RotateCcw size={14} /> Book again
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CANCEL APPOINTMENT CONFIRMATION DIALOG */}
      <Modal
        isOpen={!!cancelModalApt}
        onClose={() => setCancelModalApt(null)}
        title="Cancel Appointment Confirmation"
        maxWidth="440px"
      >
        {cancelModalApt && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626' }}>
              <AlertCircle size={20} />
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Are you sure you want to cancel?</div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Your appointment with <strong>{cancelModalApt.doctorName}</strong> on <strong>{cancelModalApt.date} at {cancelModalApt.time}</strong> will be released.
            </p>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700' }}>Reason for Cancellation (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Schedule conflict, illness..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.84rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button 
                type="button"
                onClick={() => setCancelModalApt(null)} 
                className="btn btn-secondary btn-sm"
              >
                Keep Appointment
              </button>
              <button 
                type="button"
                onClick={handleCancelSubmit} 
                className="btn btn-danger btn-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* RECEIPT MODAL */}
      {selectedReceiptApt && (
        <ReceiptModal
          isOpen={!!selectedReceiptApt}
          onClose={() => setSelectedReceiptApt(null)}
          appointment={selectedReceiptApt}
          patient={patient}
          showToast={showToast}
        />
      )}

      {/* PRE-VISIT CLINICAL FORM MODAL */}
      {preVisitApt && (
        <PreVisitFormModal
          isOpen={!!preVisitApt}
          onClose={() => setPreVisitApt(null)}
          appointment={preVisitApt}
          patient={patient}
          showToast={showToast}
        />
      )}

      {/* PRIORITY WAITLIST MODAL */}
      {waitlistApt && (
        <WaitlistModal
          isOpen={!!waitlistApt}
          onClose={() => setWaitlistApt(null)}
          appointment={waitlistApt}
          showToast={showToast}
        />
      )}

    </div>
  );
};

export default PatientAppointments;
