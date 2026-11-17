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
          background: 'linear-gradient(135deg, #0a2540 0%, #103154 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
            <Sparkles size={16} /> Jivaka Clinic Clinical Command
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '6px' }}>
            Good day, {doctor.name}
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            {doctor.title} • Assigned to <span style={{ fontWeight: '700', color: '#ffffff' }}>{doctor.room}</span>
          </p>
        </div>

        <button
          onClick={() => onNavigate('schedule')}
          className="btn btn-primary"
          style={{ backgroundColor: '#0f62fe' }}
        >
          <Calendar size={18} /> Manage Schedule
        </button>
      </div>

      {/* THREE METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', backgroundColor: '#edf5ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f62fe' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0a2540', lineHeight: 1 }}>
              {todayAppointments.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>
              Today's Appointments
            </div>
          </div>
        </div>

        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', backgroundColor: '#fff7ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0a2540', lineHeight: 1 }}>
              {pendingRequests.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>
              Pending Requests
            </div>
          </div>
        </div>

        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div style={{ width: '48px', height: '48px', backgroundColor: '#ecfdf5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0a2540', lineHeight: 1 }}>
              {completedThisWeek.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>
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
          border: '1.5px solid #cbd5e1',
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.3s'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.05em', color: '#0f62fe', textTransform: 'uppercase' }}>
              Next Patient In-Line
            </span>
            {isRunningLate && (
              <span className="badge badge-pending" style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fcd34d' }}>
                <AlertTriangle size={12} /> Running Late / Awaiting Check-In
              </span>
            )}
          </div>

          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>
            Today, {nextPatient ? nextPatient.time : 'No more patients queued'}
          </span>
        </div>

        {nextPatient ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#0a2540',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {nextPatient.patientName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0a2540', marginBottom: '4px' }}>
                  {nextPatient.patientName}
                </h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>ID: <strong style={{ color: '#16191f' }}>{nextPatient.patientId}</strong></span>
                  <span>Reason: <strong style={{ color: '#16191f' }}>{nextPatient.visitReason}</strong></span>
                  <span>Location: <strong style={{ color: '#16191f' }}>{doctor.room}</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {!nextPatient.checkedIn ? (
                <button
                  onClick={() => handleCheckIn(nextPatient.id)}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#059669' }}
                >
                  <UserCheck size={18} /> Check In Patient
                </button>
              ) : (
                <span className="badge badge-confirmed" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  <CheckCircle size={16} /> Patient Checked In & Ready
                </span>
              )}

              <button
                onClick={() => onNavigate('appointments')}
                className="btn btn-secondary"
              >
                Open Consultation <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b' }}>
            <CheckCircle size={36} color="#10b981" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: '600' }}>All scheduled patients for today have been attended to!</p>
          </div>
        )}
      </div>

      {/* TODAY'S SCHEDULED APPOINTMENTS SUMMARY TABLE */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0a2540' }}>
            Today's Clinical Roster
          </h3>
          <button
            onClick={() => onNavigate('appointments')}
            style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f62fe' }}
          >
            View All Appointments ({appointments.length})
          </button>
        </div>

        {todayAppointments.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
            No appointments scheduled for today.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                  <th style={{ padding: '12px' }}>Time</th>
                  <th style={{ padding: '12px' }}>Patient</th>
                  <th style={{ padding: '12px' }}>Reason</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((apt) => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#0a2540' }}>{apt.time}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '700' }}>{apt.patientName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{apt.patientPhone}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#475569' }}>{apt.visitReason}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge badge-${apt.status}`}>
                        {apt.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
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
