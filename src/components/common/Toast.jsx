import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#0F6B63" />,
    error: <AlertCircle size={18} color="#dc2626" />,
    warning: <AlertCircle size={18} color="#d97706" />,
    info: <Info size={18} color="#0F6B63" />
  };

  const bgColors = {
    success: '#edf7f2',
    error: '#fef2f2',
    warning: '#fffbeb',
    info: '#FAF6EC'
  };

  const borderColors = {
    success: '#DCEFE6',
    error: '#fecaca',
    warning: '#fde68a',
    info: '#e3ebe7'
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: bgColors[type] || '#ffffff',
        border: `1.5px solid ${borderColors[type] || '#e3ebe7'}`,
        padding: '12px 18px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(15, 79, 74, 0.14)',
        fontSize: '0.88rem',
        fontWeight: '600',
        color: '#1C2B29',
        maxWidth: 'min(420px, calc(100vw - 32px))',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ flexShrink: 0 }}>{icons[type]}</div>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        style={{
          marginLeft: '4px',
          color: '#51625F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          transition: 'background 0.2s',
          flexShrink: 0
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(15, 79, 74, 0.08)')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
