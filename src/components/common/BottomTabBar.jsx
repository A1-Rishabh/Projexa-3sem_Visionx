import React from 'react';
import { Home, Search, Calendar, FileText } from 'lucide-react';

export const BottomTabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'doctors', label: 'Doctors', icon: Search },
    { id: 'appointments', label: 'Visits', icon: Calendar },
    { id: 'records', label: 'Records', icon: FileText }
  ];

  return (
    <nav
      className="mobile-bottom-tab-bar"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        zIndex: 1000,
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -4px 14px rgba(15, 79, 74, 0.08)',
        padding: '0 8px'
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              height: '100%',
              minHeight: '44px',
              color: isActive ? 'var(--primary-teal)' : 'var(--text-secondary)',
              fontWeight: isActive ? '700' : '500',
              fontSize: '0.74rem',
              transition: 'all 0.15s ease',
              position: 'relative'
            }}
          >
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '32px',
                  height: '3px',
                  backgroundColor: 'var(--primary-teal)',
                  borderRadius: '0 0 4px 4px'
                }}
              />
            )}
            <Icon size={20} color={isActive ? 'var(--primary-teal)' : 'currentColor'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomTabBar;
