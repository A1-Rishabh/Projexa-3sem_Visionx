import React from 'react';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck,
  X
} from 'lucide-react';
import { clinic, formatINR } from '../../config/clinic';
import { Logo } from '../common/Logo';

export const ReceiptModal = ({ isOpen, onClose, appointment, patient, showToast }) => {
  if (!isOpen || !appointment) return null;

  const mainBranch = clinic.branches[0] || {};
  const fee = appointment.fee || 1200;
  const isPaid = appointment.paymentStatus === 'Paid';
  const txnId = appointment.transactionId || `TXN-${appointment.id.replace('APT-', '')}921`;
  const receiptNo = `REC-${appointment.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (showToast) {
      showToast(`Receipt ${receiptNo} downloaded as PDF!`, 'success');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 79, 74, 0.5)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          animation: 'fadeUp 0.2s ease-out',
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close receipt"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div id="printable-receipt">
          
          {/* CLINIC BRANDING HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '18px' }}>
            <div>
              <Logo size="small" theme="dark" />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                <div>{mainBranch.address}</div>
                <div>Ph: {mainBranch.phone} • {mainBranch.email}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span 
                style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  backgroundColor: isPaid ? 'var(--mint)' : '#FEF3C7',
                  color: isPaid ? 'var(--primary-teal)' : '#92400E',
                  marginBottom: '4px'
                }}
              >
                {isPaid ? 'PAID RECEIPT' : 'PAYMENT DUE AT CLINIC'}
              </span>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Receipt No: <strong>{receiptNo}</strong>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Date: {appointment.date}
              </div>
            </div>
          </div>

          {/* PATIENT & APPOINTMENT META */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', backgroundColor: 'var(--warm-cream)', padding: '14px', borderRadius: '12px', marginBottom: '18px', fontSize: '0.82rem' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Billed To:</div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                {appointment.patientName || patient?.name}
              </strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                Patient ID: {appointment.patientId || patient?.id}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Contact: {appointment.patientPhone || patient?.phone}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Attending Physician:</div>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
                {appointment.doctorName}
              </strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                Room: {appointment.room}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Time: {appointment.time}
              </div>
            </div>
          </div>

          {/* ITEM BREAKDOWN TABLE */}
          <div style={{ marginBottom: '18px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '8px 0' }}>Description</th>
                  <th style={{ padding: '8px 0', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 0' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                      In-Clinic Specialist Consultation
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      {appointment.visitReason || 'General OPD Examination'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '700', color: 'var(--text-main)' }}>
                    {formatINR(fee)}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                  <td style={{ padding: '8px 0' }}>Healthcare Exemption GST (0%)</td>
                  <td style={{ padding: '8px 0', textAlign: 'right' }}>₹0</td>
                </tr>

                <tr>
                  <td style={{ padding: '12px 0', fontWeight: '800', fontSize: '1rem', color: 'var(--deep-teal)' }}>
                    Net Total Paid:
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary-teal)' }}>
                    {formatINR(fee)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAYMENT DETAILS & TRANSACTION AUDIT */}
          <div style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: '#ffffff', marginBottom: '20px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Payment Mode:</span>
              <strong style={{ color: 'var(--text-main)' }}>{appointment.paymentMethod || 'Pay at clinic'}</strong>
            </div>
            {isPaid && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Transaction Reference:</span>
                <strong style={{ color: 'var(--primary-teal)', fontFamily: 'monospace' }}>{txnId}</strong>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Payment Status:</span>
              <strong style={{ color: isPaid ? '#16A34A' : '#D97706' }}>
                {isPaid ? 'Completed & Reconciled' : 'Pending (Pay at Check-In Counter)'}
              </strong>
            </div>
          </div>

          {/* DIGITAL SIGNATURE / STAMP */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px', borderTop: '1px dashed var(--border-color)', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-teal)', fontWeight: '700' }}>
                <ShieldCheck size={14} /> Jivaka Clinic Digital Billing Seal
              </div>
              <div>Electronically generated invoice • No physical signature required</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', color: 'var(--deep-teal)' }}>Accounts Department</div>
              <div>Jivaka Healthcare Pvt. Ltd.</div>
            </div>
          </div>

        </div>

        {/* MODAL ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            <Printer size={16} /> Print Receipt
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <Download size={16} /> Download PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptModal;

