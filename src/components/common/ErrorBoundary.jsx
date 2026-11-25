import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Jeevak Clinic Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('jeevak_user_session');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF6EC',
          padding: '24px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: '0 20px 40px rgba(15, 79, 74, 0.12)',
            border: '1px solid rgba(15, 107, 99, 0.16)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(220, 38, 38, 0.10)',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertCircle size={28} />
            </div>

            <h2 style={{
              fontFamily: 'Fraunces, serif',
              fontSize: '1.4rem',
              fontWeight: '800',
              color: '#1C2B29',
              margin: '0 0 8px'
            }}>
              Something encountered an issue
            </h2>

            <p style={{
              fontSize: '0.88rem',
              color: '#6B7C78',
              lineHeight: 1.5,
              margin: '0 0 24px'
            }}>
              The application encountered a temporary display error. Click below to refresh your session and return to the home screen.
            </p>

            <button
              type="button"
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: '#0F6B63',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.92rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={16} /> Return to Homepage & Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
