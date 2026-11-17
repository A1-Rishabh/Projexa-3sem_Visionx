import React from 'react';
import { 
  Building2, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Megaphone, 
  CheckCircle2, 
  Info, 
  Calendar,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { getClinicInfo } from '../../services/mockDataStore';

export const InfoHub = ({ onNavigateToDoctors }) => {
  const info = getClinicInfo();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HERO BANNER WITH QUICK CTA */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0a2540 0%, #0f62fe 100%)',
          borderRadius: '20px',
          padding: '40px 48px',
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ maxWidth: '580px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px' }}>
            <ShieldCheck size={18} /> Welcome to Jivaka Clinic
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1.25, marginBottom: '12px', letterSpacing: '-0.03em' }}>
            Compassionate Healthcare, World-Class Specialists
          </h1>
          <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Book appointments with board-certified physicians, view lab reports, and manage your health records seamlessly.
          </p>

          <button
            onClick={onNavigateToDoctors}
            className="btn"
            style={{ backgroundColor: '#ffffff', color: '#0a2540', padding: '12px 24px', fontSize: '0.95rem' }}
          >
            Find a Doctor & Book Visit <ArrowRight size={18} />
          </button>
        </div>

        {/* STAT BADGE PILLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>4 Senior Staff</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Cardiology, Pediatrics, Neuro, Ortho</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '12px 20px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>In-Clinic Practice</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Dedicated Consultation Rooms</div>
          </div>
        </div>
      </div>

      {/* ACTIVE ANNOUNCEMENT BANNER */}
      {info.activeAnnouncement && (
        <div 
          style={{
            backgroundColor: '#edf5ff',
            border: '1.5px solid #bae6fd',
            borderRadius: '14px',
            padding: '16px 24px',
            color: '#0353e9',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Megaphone size={24} color="#0f62fe" />
          <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: '700' }}>
            {info.activeAnnouncement}
          </div>
        </div>
      )}

      {/* TWO COLUMN CARDS: CLINIC HOURS & FACILITY ARRIVAL INSTRUCTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* OPERATING HOURS & CONTACT */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0a2540', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="#0f62fe" /> Clinic Schedule & Contact
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: '600', color: '#64748b' }}>Monday - Friday:</span>
              <strong style={{ color: '#0a2540' }}>{info.operatingHours.weekdays}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: '600', color: '#64748b' }}>Saturday:</span>
              <strong style={{ color: '#0a2540' }}>{info.operatingHours.saturday}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: '600', color: '#64748b' }}>Sunday & Holidays:</span>
              <strong style={{ color: '#dc2626' }}>{info.operatingHours.sunday}</strong>
            </div>

            <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                <Phone size={16} color="#0f62fe" /> Emergency Helpline: <strong style={{ color: '#0a2540' }}>{info.phone}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                <Mail size={16} color="#0f62fe" /> General Inquiries: <strong style={{ color: '#0a2540' }}>{info.email}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* IN-CLINIC ARRIVAL & LOCATION MAP SIMULATION */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0a2540', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#059669" /> Facility Location & Check-In Guide
          </h3>

          <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
            <p style={{ fontWeight: '600', color: '#0a2540', marginBottom: '4px' }}>
              {info.address}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {info.checkInNotice}
            </p>
          </div>

          {/* INTERACTIVE LOCATION MAP SIMULATION CARD */}
          <div 
            style={{
              height: '140px',
              backgroundColor: '#1e293b',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(15, 98, 254, 0.4) 0%, transparent 70%)',
                opacity: 0.6
              }}
            />
            <div style={{ zIndex: 2, textAlign: 'center' }}>
              <MapPin size={32} color="#38bdf8" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>Metro Health District Campus</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Building B • Elevator to 2nd Floor</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
