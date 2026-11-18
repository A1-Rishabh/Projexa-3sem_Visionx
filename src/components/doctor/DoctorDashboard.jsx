import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  MapPin, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getAppointments, checkInPatient, getPatients } from '../../services/mockDataStore';

export const DoctorDashboard = ({ doctor, onNavigate, showToast }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    loadData();
  }, [doctor.id]);

  const loadData = () => {
    const allAppts = getAppointments();
    const docAppts = allAppts.filter(a => a.doctorId === doctor.id);
    setAppointments(docAppts);
    setPatients(getPatients());
  };

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingRequests = appointments.filter(a => a.status === 'pending');
  const completedThisWeek = appointments.filter(a => a.status === 'completed');

  // Next Patient Card Logic
  const upcomingToday = todayAppointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed');
  const nextPatient = upcomingToday.length > 0 ? upcomingToday[0] : null;

  // Running Late Logic: If scheduled time has passed and patient is not checked in
  const isRunningLate = nextPatient && !nextPatient.checkedIn;

  const handleCheckIn = (aptId) => {
    checkInPatient(aptId);
    loadData();
    showToast('Patient successfully checked in at reception', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* WELCOME BANNER */}
      <div 
        style={{
          background: 'linear-gradient(135deg, var(--deep-teal) 0%, #0E6253 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warm-accent)', fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
            <Sparkles size={16} color="var(--warm-accent)" /> Jeevak Clinic Clinical Command
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: '800', fontFamily: 'Fraunces, serif', marginBottom: '6px', color: '#ffffff' }}>
            Good day, {doctor.name}
          </h2>
          <p style={{ color: '#E2E8F0', fontSize: '0.88rem' }}>
            {doctor.title} • Assigned Consultation Suite: <span style={{ fontWeight: '700', color: '#ffffff' }}>{doctor.room}</span>
          </p>
        </div>

        <button
          onClick={() => onNavigate('appointments')}
          className="btn btn-primary"
          style={{ minHeight: '42px', fontSize: '0.86rem' }}
        >
          <Clock size={17} /> View Appointments
        </button>
      </div>

      {/* PROMINENT FIXED OPD TIMINGS & CLINIC CONTACT CARD */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1.5px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: '20px',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="mint-icon-box" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
            <Clock size={24} color="var(--primary-teal)" />
          </div>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '700' }}>
              Official Fixed OPD Schedule
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--deep-teal)', fontFamily: 'var(--font-heading)' }}>
              Monday – Friday (Sat & Sun Closed)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Jeevak Clinic (जीवक क्लीनिक, Estd. 2003)
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--warm-cream)', padding: '10px 14px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            DAILY SESSIONS:
          </div>
          <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
            Morning: 11:30 AM – 2:00 PM
          </div>
          <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-main)' }}>
            Evening: 6:30 PM – 8:30 PM
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            CLINIC RECEPTION DESK
          </div>
          <a
            href="tel:01145680306"
            style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-teal)', textDecoration: 'none' }}
          >
            011 45680306
          </a>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            C-04, Shakti Vihar, Meethapur, New Delhi
          </div>
        </div>
      </div>

      {/* THREE METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        
        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--mint)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-teal)' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', lineHeight: 1 }}>
              {todayAppointments.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '6px' }}>
              Today's Appointments
            </div>
          </div>
        </div>

        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', backgroundColor: '#FEF3C7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', lineHeight: 1 }}>
              {pendingRequests.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '6px' }}>
              Pending Requests
            </div>
          </div>
        </div>

        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', backgroundColor: '#DCFCE7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', lineHeight: 1 }}>
              {completedThisWeek.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '6px' }}>
              Consultations Completed
            </div>
          </div>
        </div>

      </div>

      {/* NEXT PATIENT HERO CARD (WITH RUNNING LATE STATE) */}
      <div 
        className={isRunningLate ? 'running-late-card' : ''}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: isRunningLate ? '2px solid #FCD34D' : '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.06em', color: 'var(--primary-teal)', textTransform: 'uppercase' }}>
              Next Patient In-Line
            </span>
            {isRunningLate && (
              <span className="badge badge-pending" style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FCD34D', gap: '4px' }}>
                <AlertTriangle size={12} /> Running Late / Awaiting Check-In
              </span>
            )}
          </div>

          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Today, {nextPatient ? nextPatient.time : 'No more patients queued'}
          </span>
        </div>

        {nextPatient ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--deep-teal)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {nextPatient.patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', marginBottom: '4px' }}>
                  {nextPatient.patientName}
                </h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span>ID: <strong style={{ color: 'var(--text-main)' }}>{nextPatient.patientId}</strong></span>
                  <span>Reason: <strong style={{ color: 'var(--text-main)' }}>{nextPatient.visitReason}</strong></span>
                  <span>Location: <strong style={{ color: 'var(--text-main)' }}>{doctor.room}</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {!nextPatient.checkedIn ? (
                <button
                  onClick={() => handleCheckIn(nextPatient.id)}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#16A34A', borderColor: '#16A34A', minHeight: '40px', fontSize: '0.86rem' }}
                >
                  <UserCheck size={17} /> Check In Patient
                </button>
              ) : (
                <span className="badge badge-confirmed" style={{ padding: '8px 14px', fontSize: '0.84rem' }}>
                  <CheckCircle size={15} /> Patient Checked In & Ready
                </span>
              )}

              <button
                onClick={() => onNavigate('appointments')}
                className="btn btn-secondary"
                style={{ minHeight: '40px', fontSize: '0.86rem' }}
              >
                Open Consultation <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)' }}>
            <CheckCircle size={36} color="var(--primary-teal)" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: '600' }}>All scheduled patients for today have been attended to!</p>
          </div>
        )}
      </div>

      {/* TODAY'S SCHEDULED APPOINTMENTS SUMMARY TABLE */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Fraunces, serif', margin: 0 }}>
            Today's Clinical Roster
          </h3>
          <button
            onClick={() => onNavigate('appointments')}
            style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--primary-teal)', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
          >
            View All Appointments ({appointments.length}) →
          </button>
        </div>

        {todayAppointments.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No appointments scheduled for today.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', backgroundColor: 'var(--warm-cream)' }}>
                  <th style={{ padding: '12px 14px' }}>Time</th>
                  <th style={{ padding: '12px 14px' }}>Patient</th>
                  <th style={{ padding: '12px 14px' }}>Reason</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((apt) => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--text-main)', fontFamily: 'Fraunces, serif' }}>{apt.time}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{apt.patientName}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{apt.patientPhone}</div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{apt.visitReason}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge badge-${apt.status}`}>
                        {apt.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => onNavigate('appointments')}
                        className="btn btn-secondary btn-sm"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
