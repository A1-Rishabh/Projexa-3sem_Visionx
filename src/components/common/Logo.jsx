import React from 'react';

export const Logo = ({ size = 'medium', theme = 'dark', variant = 'full', className = '' }) => {
  // Size presets
  const iconSizes = {
    small: { w: 32, h: 32, font: '1.15rem' },
    medium: { w: 42, h: 42, font: '1.4rem' },
    large: { w: 56, h: 56, font: '1.75rem' }
  };

  const s = iconSizes[size] || iconSizes.medium;
  const textColor = theme === 'light' ? '#ffffff' : '#1C2B29';
  const accentColor = theme === 'light' ? '#DCEFE6' : '#0F6B63';

  return (
    <div 
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', userSelect: 'none' }}
    >
      {/* JIVAKA CLINIC LOGO IMAGE */}
      <img
        src="/images/logo.jpg"
        alt="Jivaka Clinic Logo"
        width={s.w}
        height={s.h}
        style={{
          width: `${s.w}px`,
          height: `${s.h}px`,
          objectFit: 'contain',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(15, 79, 74, 0.15)',
          flexShrink: 0
        }}
      />

      {/* BRAND TEXT */}
      {variant === 'full' && (
        <span
          style={{
            fontSize: s.font,
            fontWeight: '700',
            letterSpacing: 'normal',
            fontFamily: "var(--font-heading)",
            color: textColor,
            lineHeight: 1
          }}
        >
          Jivaka <span style={{ color: accentColor }}>Clinic</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
