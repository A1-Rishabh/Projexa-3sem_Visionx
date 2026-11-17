import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  User, 
  CheckCheck, 
  Clock, 
  ShieldCheck, 
  Paperclip,
  X
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const CareTeamMessagingModal = ({ isOpen, onClose, patient, showToast }) => {
  const [activeThreadId, setActiveThreadId] = useState('TH-1');
  const [replyText, setReplyText] = useState('');
  
  const [threads, setThreads] = useState([
    {
      id: 'TH-1',
      recipient: 'Dr. Sarah Jenkins',
      role: 'Attending Cardiologist',
      subject: 'Post-visit BP monitoring question',
      unread: false,
      messages: [
        {
          id: 'M-1',
          sender: 'patient',
          senderName: patient?.name || 'You',
          time: 'Yesterday, 04:15 PM',
          text: 'Good afternoon Dr. Jenkins, I logged a blood pressure of 122/82 this morning. Should I continue the same Lisinopril 10mg dosage?'
        },
        {
          id: 'M-2',
          sender: 'doctor',
          senderName: 'Dr. Sarah Jenkins',
          time: 'Today, 09:30 AM',
          text: 'Hello! That is a very reassuring reading. Yes, please maintain your current dosage of Lisinopril 10mg once daily after breakfast. Keep recording readings twice weekly.'
        }
      ]
    },
    {
      id: 'TH-2',
      recipient: 'Jivaka Nursing Care Desk',
      role: 'Clinical Coordination',
      subject: 'Pre-visit fasting instructions for lipid panel',
      unread: true,
      messages: [
        {
          id: 'M-3',
          sender: 'doctor',
          senderName: 'Nurse Desk (Priya R.)',
          time: '2 days ago',
          text: 'Reminder for your diagnostic appointment: Please observe 10 to 12 hours of overnight fasting prior to your morning blood draw. Water is permitted.'
        }
      ]
    }
  ]);

  if (!isOpen) return null;

  const currentThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: `M-${Date.now()}`,
      sender: 'patient',
      senderName: patient?.name || 'You',
      time: 'Just now',
      text: replyText.trim()
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    setReplyText('');
    if (showToast) {
      showToast('Secure message delivered to care team.', 'success');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Secure Care Team Messaging"
      maxWidth="720px"
    >
      <div style={{ display: 'flex', height: '480px', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* LEFT: THREADS LIST */}
        <div style={{ width: '240px', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--warm-cream)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', fontWeight: '700', fontSize: '0.84rem', color: 'var(--deep-teal)' }}>
            Conversations ({threads.length})
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {threads.map(t => {
              const isSelected = t.id === activeThreadId;
              const lastMsg = t.messages[t.messages.length - 1];

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveThreadId(t.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: isSelected ? '800' : '700', fontSize: '0.84rem', color: 'var(--text-main)' }}>
                      {t.recipient}
                    </div>
                    {t.unread && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-teal)' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary-teal)', fontWeight: '600', marginTop: '2px' }}>
                    {t.role}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lastMsg?.text}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: CHAT THREAD VIEW */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          
          {/* Thread Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                {currentThread.recipient}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                {currentThread.subject}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontSize: '0.72rem', fontWeight: '700' }}>
              <ShieldCheck size={14} /> End-to-End Encrypted
            </div>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#F8FAFC' }}>
            {currentThread.messages.map((m) => {
              const isPatient = m.sender === 'patient';
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isPatient ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    backgroundColor: isPatient ? 'var(--deep-teal)' : '#ffffff',
                    color: isPatient ? '#ffffff' : 'var(--text-main)',
                    borderRadius: isPatient ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    padding: '10px 14px',
                    boxShadow: 'var(--shadow-sm)',
                    border: isPatient ? 'none' : '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: isPatient ? 'var(--mint)' : 'var(--primary-teal)', fontWeight: '700', marginBottom: '2px' }}>
                    {m.senderName}
                  </div>
                  <div style={{ fontSize: '0.84rem', lineHeight: 1.45 }}>
                    {m.text}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: isPatient ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)', textAlign: 'right', marginTop: '4px' }}>
                    {m.time}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', backgroundColor: '#ffffff' }}>
            <input
              type="text"
              placeholder="Type your message to the medical team..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.84rem'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ minHeight: '38px', padding: '0 16px' }}
            >
              <Send size={15} /> Send
            </button>
          </form>

        </div>

      </div>
    </Modal>
  );
};

export default CareTeamMessagingModal;
