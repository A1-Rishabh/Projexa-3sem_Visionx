import React from 'react';
import { Inbox, ArrowRight } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There is currently no data or activity to display here.',
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = ''
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* MINT ICON CONTAINER */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: 'var(--mint)',
          color: 'var(--primary-teal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: '0 2px 6px rgba(15, 107, 99, 0.12)'
        }}
      >
        <Icon size={26} />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          fontWeight: '700',
          color: 'var(--text-main)',
          marginBottom: '8px'
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.92rem',
          color: 'var(--text-secondary)',
          maxWidth: '420px',
          lineHeight: 1.5,
          marginBottom: actionText ? '20px' : 0
        }}
      >
        {description}
      </p>

      {(actionText || secondaryActionText) && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {actionText && (
            <button
              type="button"
              onClick={onAction}
              className="btn btn-primary"
            >
              <span>{actionText}</span>
              <ArrowRight size={16} />
            </button>
          )}
          {secondaryActionText && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="btn btn-secondary"
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

