import React, { useState, useEffect } from 'react';
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
  FileCheck2
} from 'lucide-react';
import { getAppointments, updateAppointmentStatus } from '../../services/mockDataStore';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { ReceiptModal } from './ReceiptModal';
import { formatINR, clinic, getDirectionsUrl, isPlaceholder } from '../../config/clinic';

export const PatientAppointments = ({ patient, showToast, onBookNew }) => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [cancelModalApt, setCancelModalApt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedReceiptApt, setSelectedReceiptApt] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, [patient.id]);

  const loadAppointments = () => {
    const all = getAppointments();
    setAppointments(all.filter(a => a.patientId === patient.id));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingList = appointments.filter(a => a.date >= todayStr && a.status !== 'completed' && a.status !== 'cancelled');
  const pastList = appointments.filter(a => a.date < todayStr || a.status === 'completed' || a.status === 'cancelled');

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

  const displayList = activeTab === 'upcoming' ? upcomingList : pastList;
  const mainBranch = clinic.branches[0] || {};

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
            Track your consultation chambers, payment receipts, and appointment history
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
                onClick={onBookNew}
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
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* Date badge */}
                  <div 
                    style={{ 
                      width: '56px', 
                      height: '56px', 
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
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', marginTop: '2px' }}>
                      {apt.date.split('-')[2] || '16'}
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
                        {apt.doctorName}
                      </h3>
                      
                      {/* Clinical status badge */}
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
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '14px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span>Date: <strong>{apt.date}</strong> at <strong style={{ color: 'var(--primary-teal)' }}>{apt.time}</strong></span>
                      <span>Chamber: <strong style={{ color: 'var(--deep-teal)' }}>{apt.room}</strong></span>
                      {apt.transactionId && (
                        <span>Txn: <code style={{ fontSize: '0.74rem' }}>{apt.transactionId}</code></span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Reason: <em>"{apt.visitReason}"</em>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* View Receipt Button (Available for all bookings) */}
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

                  {/* Reschedule Button */}
                  {activeTab === 'upcoming' && onBookNew && (
                    <button
                      type="button"
                      onClick={onBookNew}
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
                      onClick={onBookNew}
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

      {/* CANCEL MODAL */}
      <Modal
        isOpen={!!cancelModalApt}
        onClose={() => setCancelModalApt(null)}
        title="Cancel Appointment Confirmation"
        maxWidth="440px"
      >
        {cancelModalApt && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Are you sure you want to cancel your appointment with <strong>{cancelModalApt.doctorName}</strong> scheduled for <strong>{cancelModalApt.date} at {cancelModalApt.time}</strong>?
            </p>

            <div className="form-group">
              <label>Reason for Cancellation (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Schedule conflict, illness..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                type="button"
                onClick={() => setCancelModalApt(null)} 
                className="btn btn-secondary"
              >
                Keep Appointment
              </button>
              <button 
                type="button"
                onClick={handleCancelSubmit} 
                className="btn btn-danger"
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

    </div>
  );
};

export default PatientAppointments;
