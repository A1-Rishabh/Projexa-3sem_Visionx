import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Bell, 
  Users, 
  User, 
  Megaphone, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { getPatients } from '../../services/mockDataStore';

export const CommunicationsManager = ({ doctor, showToast }) => {
  const [patients, setPatients] = useState([]);
  const [audience, setAudience] = useState('all'); // 'all' | 'individual'
  const [targetPatientId, setTargetPatientId] = useState('');
  const [category, setCategory] = useState('Clinic Advisory');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [actionTab, setActionTab] = useState('appointments');
  const [dispatchedList, setDispatchedList] = useState([]);

  useEffect(() => {
    const pats = getPatients();
    setPatients(pats);
    if (pats.length > 0) {
      setTargetPatientId(pats[0].id);
    }

    // Load recent dispatches from storage
    try {
      const stored = localStorage.getItem('jeevak_dispatched_notifications');
      if (stored) {
        setDispatchedList(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const categories = [
    { label: 'Clinic Advisory', icon: Megaphone, color: '#0F6B63', bg: 'rgba(15, 107, 99, 0.10)' },
    { label: 'OPD Schedule / Holiday Notice', icon: Clock, color: '#d97706', bg: 'rgba(217, 119, 6, 0.10)' },
    { label: 'Diagnostic & Lab Update', icon: FileText, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.10)' },
    { label: 'Urgent Patient Alert', icon: AlertTriangle, color: '#dc2626', bg: 'rgba(220, 38, 38, 0.10)' }
  ];

  // Quick prefill templates
  const templates = [
    {
      label: 'Friday OPD Closed',
      cat: 'OPD Schedule / Holiday Notice',
      title: 'Friday Evening OPD Closed',
      msg: 'Please note: OPD is closed on Friday evenings (open 11:30 AM – 2:00 PM only) as per clinic timings.',
      tab: 'appointments'
    },
    {
      label: 'Lab Report Ready',
      cat: 'Diagnostic & Lab Update',
      title: 'Lab Investigation Results Ready',
      msg: 'Your routine blood & diagnostic reports have been verified by the doctor and are ready in your Records tab.',
      tab: 'records'
    },
    {
      label: 'Seasonal Vaccine Drive',
      cat: 'Clinic Advisory',
      title: 'Flu Vaccination & Health Packages',
      msg: 'Annual seasonal flu vaccination and preventive health assessments are currently available at the OPD reception.',
      tab: null
    },
    {
      label: 'Next Token Ready',
      cat: 'Urgent Patient Alert',
      title: 'Consultation Ready - Proceed to Chamber',
      msg: 'Your token number has been called. Please proceed directly to Chamber Suite for your consultation.',
      tab: 'appointments'
    }
  ];

  const applyTemplate = (tpl) => {
    setCategory(tpl.cat);
    setTitle(tpl.title);
    setMessage(tpl.msg);
    setActionTab(tpl.tab || 'appointments');
  };

  const handleDispatch = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      if (showToast) showToast('Please enter both a title and message', 'error');
      return;
    }

    const selectedPatient = patients.find(p => p.id === targetPatientId);
    const targetLabel = audience === 'all' ? 'All Registered Patients (Broadcast)' : `Patient: ${selectedPatient?.name || targetPatientId}`;

    const newNotification = {
      id: `notif-${Date.now()}`,
      category,
      title: title.trim(),
      description: message.trim(),
      time: 'Just now',
      unread: true,
      actionTab,
      actionLabel: actionTab === 'records' ? 'View Records' : 'View Details',
      type: category === 'Clinic Advisory' ? 'announcement' : category === 'Diagnostic & Lab Update' ? 'records' : 'appointment',
      target: audience,
      targetPatientId: audience === 'individual' ? targetPatientId : null,
      targetName: targetLabel,
      senderDoctorName: doctor?.name || 'Jeevak Clinic Medical Staff',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Dispatch custom event for active patient windows
    window.dispatchEvent(new CustomEvent('jeevak_notification_dispatched', { detail: newNotification }));

    // 2. Persist in broadcasts store
    try {
      const existingBroadcasts = JSON.parse(localStorage.getItem('jeevak_clinic_broadcasts') || '[]');
      existingBroadcasts.unshift(newNotification);
      localStorage.setItem('jeevak_clinic_broadcasts', JSON.stringify(existingBroadcasts.slice(0, 30)));

      // If targeted to a specific patient, also inject directly into their specific notification store
      if (audience === 'individual' && targetPatientId) {
        const pKey = `jeevak_notifications_${targetPatientId}`;
        const patientNotifs = JSON.parse(localStorage.getItem(pKey) || '[]');
        patientNotifs.unshift(newNotification);
        localStorage.setItem(pKey, JSON.stringify(patientNotifs.slice(0, 30)));
      } else {
        // Injected into all patient caches
        patients.forEach(p => {
          const pKey = `jeevak_notifications_${p.id}`;
          const patientNotifs = JSON.parse(localStorage.getItem(pKey) || '[]');
          patientNotifs.unshift(newNotification);
          localStorage.setItem(pKey, JSON.stringify(patientNotifs.slice(0, 30)));
        });
      }

      // Update doctor's local dispatched list
      const updatedList = [newNotification, ...dispatchedList];
      setDispatchedList(updatedList);
      localStorage.setItem('jeevak_dispatched_notifications', JSON.stringify(updatedList.slice(0, 30)));
    } catch (err) {
      console.warn('Could not persist notification', err);
    }

    if (showToast) {
      showToast(audience === 'all' ? 'Clinic broadcast dispatched to all patients!' : `Alert delivered to ${selectedPatient?.name}!`, 'success');
    }

    // Reset fields
    setTitle('');
    setMessage('');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* SECTION HEADER CARD */}
      <div 
        style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          border: '1px solid #E2E8F0',
          borderLeft: '5px solid var(--primary-teal, #0F6B63)',
          boxShadow: '0 8px 24px -4px rgba(15, 107, 99, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', backgroundColor: 'rgba(15, 107, 99, 0.08)', color: 'var(--primary-teal, #0F6B63)', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <Megaphone size={12} color="var(--primary-teal, #0F6B63)" />
            <span>Staff Communications Hub</span>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: '0 0 6px 0', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Communications <span style={{ color: 'var(--primary-teal, #0F6B63)', fontWeight: '700' }}>&amp;</span> Patient Alerts
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B', fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", lineHeight: 1.55, maxWidth: '640px' }}>
            Compose and dispatch real-time notifications to all clinic patients or directly to an individual patient regarding visits and diagnostics.
          </p>
        </div>

        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            borderRadius: '9999px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            fontSize: '0.78rem',
            fontWeight: '700',
            color: '#15803D'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block', boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.25)' }} />
          <span>Real-Time Patient Feed Active</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '28px', alignItems: 'start' }}>
        
        {/* COMPOSER CARD */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '28px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
            <Send size={18} color="var(--primary-teal)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Dispatch New Notification
            </h3>
          </div>

          {/* QUICK TEMPLATES */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} color="var(--primary-teal)" /> Quick Prefill Templates
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {templates.map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  style={{
                    backgroundColor: 'var(--warm-cream)',
                    border: '1px solid var(--border-color)',
                    padding: '5px 11px',
                    borderRadius: '9999px',
                    fontSize: '0.74rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-teal)'; e.currentTarget.style.color = 'var(--primary-teal)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                >
                  + {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleDispatch} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* AUDIENCE SELECTOR */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Target Audience
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAudience('all')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    border: audience === 'all' ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
                    backgroundColor: audience === 'all' ? 'rgba(15, 107, 99, 0.08)' : '#ffffff',
                    color: audience === 'all' ? 'var(--primary-teal)' : 'var(--text-secondary)'
                  }}
                >
                  <Users size={16} /> Broadcast (All Patients)
                </button>
                <button
                  type="button"
                  onClick={() => setAudience('individual')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    border: audience === 'individual' ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
                    backgroundColor: audience === 'individual' ? 'rgba(15, 107, 99, 0.08)' : '#ffffff',
                    color: audience === 'individual' ? 'var(--primary-teal)' : 'var(--text-secondary)'
                  }}
                >
                  <User size={16} /> Targeted Patient
                </button>
              </div>
            </div>

            {/* IF INDIVIDUAL: PATIENT SELECTOR */}
            {audience === 'individual' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Select Recipient Patient
                </label>
                <select
                  value={targetPatientId}
                  onChange={(e) => setTargetPatientId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) — {p.phone || 'No phone'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* CATEGORY SELECTOR */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Notification Category
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.label;
                  return (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setCategory(c.label)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textAlign: 'left',
                        border: isSelected ? `2px solid ${c.color}` : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? c.bg : '#ffffff',
                        color: isSelected ? c.color : 'var(--text-secondary)'
                      }}
                    >
                      <Icon size={14} color={c.color} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TITLE */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                Notification Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fasting Blood Sugar Test Instructions"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                required
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                Message Content
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write the message that will appear in the patient's notification drop-down..."
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.88rem', resize: 'vertical' }}
                required
              />
            </div>

            {/* ACTION REDIRECT TAB */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                Patient Quick-Action Link
              </label>
              <select
                value={actionTab}
                onChange={(e) => setActionTab(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
              >
                <option value="appointments">Link to Appointments Tab ("View Details")</option>
                <option value="records">Link to Medical Records Tab ("View Records")</option>
              </select>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '13px',
                borderRadius: '10px',
                fontSize: '0.92rem',
                fontWeight: '700',
                marginTop: '6px'
              }}
            >
              <Send size={16} /> Dispatch Notification Now
            </button>
          </form>
        </div>

        {/* RECENT DISPATCHES HISTORY */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} color="var(--primary-teal)" />
              <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Recent Dispatches
              </h4>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              {dispatchedList.length} sent
            </span>
          </div>

          {dispatchedList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={32} color="var(--primary-teal)" style={{ margin: '0 auto 8px auto', opacity: 0.6 }} />
              <div style={{ fontSize: '0.86rem', fontWeight: '700' }}>No broadcasts dispatched yet</div>
              <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>Draft and send your first clinic notification using the composer.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
              {dispatchedList.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--warm-cream)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        backgroundColor: 'rgba(15, 107, 99, 0.12)',
                        color: 'var(--primary-teal)'
                      }}
                    >
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {item.timestamp || 'Just now'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {item.title}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {item.description}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--primary-teal)', fontWeight: '700', marginTop: '4px' }}>
                    Target: {item.targetName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
