import React from 'react';
import { Clock, ShieldCheck, FileCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const LandingWhyChooseUs = () => {
  const trustPoints = [
    {
      icon: Clock,
      title: 'Dedicated 25+ Minute Doctor Time',
      badge: 'No Rushed Visits',
      description: 'We strictly cap daily appointments per physician so doctors have ample time to listen, perform careful physical examinations, and clearly discuss your care plan.'
    },
    {
      icon: ShieldCheck,
      title: 'NABH Hospital-Grade Sterilization',
      badge: 'Sterile Clinical Suites',
      description: 'Our in-clinic consultation chambers, procedure rooms, and diagnostic collection desks adhere to strict laminar air quality and autoclaved instrument protocols.'
    },
    {
      icon: FileCheck,
      title: 'Encrypted Digital Health Locker',
      badge: 'ABDM & ABHA Aligned',
      description: 'Instant, lifetime access to your clinical notes, diagnostic lab PDFs, and verified prescription slips from any phone or computer through the secure portal.'
    },
    {
      icon: HeartHandshake,
      title: 'Compassionate Care Partnership',
      badge: 'Family-Centered',
      description: 'From routine health screenings to ongoing chronic disease stabilization, our doctors work with you collaboratively to build sustainable lifelong wellness.'
    }
  ];

  return (
    <section
      id="why-us"
      style={{
        padding: '88px 24px',
        backgroundColor: 'var(--warm-cream)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px' }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--primary-teal)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px'
            }}
          >
            Clinical Standards
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.1rem, 3.6vw, 2.7rem)',
              lineHeight: 1.22,
              color: 'var(--deep-teal)',
              marginBottom: '14px'
            }}
          >
            Why Patients & Families Trust Jivaka Clinic.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Every clinical protocol and workflow is designed to eliminate uncertainty, ensure diagnostic precision, and treat patients with the dignity they deserve.
          </p>
        </div>

        {/* 4 TRUST POINTS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="card-interactive"
                style={{
                  backgroundColor: '#ffffff',
                  padding: '34px 26px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: '0 4px 16px rgba(15, 79, 74, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="mint-icon-box" style={{ width: '48px', height: '48px', borderRadius: '14px' }}>
                    <Icon size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      color: 'var(--primary-teal)',
                      backgroundColor: 'var(--mint-light)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(15, 107, 99, 0.15)'
                    }}
                  >
                    {point.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.24rem',
                    fontWeight: '700',
                    color: 'var(--deep-teal)',
                    margin: 0
                  }}
                >
                  {point.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    margin: 0
                  }}
                >
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LandingWhyChooseUs;

