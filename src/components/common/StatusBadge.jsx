import React from 'react';
import { Clock, CheckCircle2, Check, XCircle } from 'lucide-react';

export const StatusBadge = ({ status = 'pending', showIcon = true, size = 'medium' }) => {
  const norm = String(status).toLowerCase();

  const configs = {
    pending: {
      label: 'Pending',
      bg: '#fef3c7',
      color: '#92400e',
      border: '#fcd34d',
      Icon: Clock
    },
    confirmed: {
      label: 'Confirmed',
      bg: '#dcfce7',
      color: '#0F6B63',
      border: '#86efac',
      Icon: CheckCircle2
    },
    completed: {
      label: 'Completed',
      bg: '#f1f5f9',
      color: '#334155',
      border: '#cbd5e1',
      Icon: Check
    },
    cancelled: {
      label: 'Cancelled',
      bg: '#fee2e2',
      color: '#991b1b',
      border: '#fca5a5',
      Icon: XCircle
    }
  };

  const cfg = configs[norm] || configs.pending;
  const Icon = cfg.Icon;
  const isSmall = size === 'small';

  return (
    <span
      className={`badge badge-${norm}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '4px' : '6px',
        padding: isSmall ? '2px 8px' : '4px 12px',
        borderRadius: '9999px',
        fontSize: isSmall ? '0.72rem' : '0.8rem',
        fontWeight: '600',
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: 'nowrap'
      }}
    >
      {showIcon && <Icon size={isSmall ? 12 : 14} />}
      <span>{cfg.label}</span>
    </span>
  );
};

export default StatusBadge;
