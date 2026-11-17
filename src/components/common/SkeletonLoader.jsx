import React from 'react';

export const Skeleton = ({ width, height, borderRadius = '8px', style = {}, className = '' }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius,
        backgroundColor: '#e6ede9',
        ...style
      }}
    />
  );
};

export const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {skeletons.map((_, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              padding: '24px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <Skeleton width="54px" height="54px" borderRadius="14px" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton height="18px" width="65%" />
                <Skeleton height="14px" width="45%" />
              </div>
            </div>
            <Skeleton height="14px" width="90%" />
            <Skeleton height="14px" width="75%" />
            <Skeleton height="40px" borderRadius="10px" style={{ marginTop: '8px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {skeletons.map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#ffffff',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <Skeleton width="36px" height="36px" borderRadius="50%" />
            <Skeleton height="16px" width="30%" />
            <Skeleton height="16px" width="25%" />
            <Skeleton height="16px" width="20%" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {skeletons.map((_, i) => (
        <div 
          key={i} 
          style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)'
          }}
        >
          <Skeleton height="24px" width="40%" style={{ marginBottom: '10px' }} />
          <Skeleton height="16px" width="85%" style={{ marginBottom: '6px' }} />
          <Skeleton height="16px" width="60%" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
