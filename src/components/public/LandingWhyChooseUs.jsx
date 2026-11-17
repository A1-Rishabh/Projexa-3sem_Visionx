import React from 'react';
import { Clock, ShieldCheck, FileCheck, HeartHandshake } from 'lucide-react';

export const LandingWhyChooseUs = () => {
  const trustPoints = [
    {
      icon: Clock,
      title: 'Dedicated Consultation Time',
      description: 'We strictly cap daily patient appointments so physicians have ample time to listen, perform thorough examinations, and explain treatment plans clearly.'
    },
    {
      icon: ShieldCheck,
      title: 'Accredited Safety & Standards',
      description: 'Our in-clinic pharmacy, consultation chambers, and pathology diagnostics follow stringent clinical protocols and hospital-grade sterilization.'
    },
    {
      icon: FileCheck,
      title: 'Encrypted Digital Records',
      description: 'Instant, secure access to your clinical notes, diagnostic lab PDFs, and verified prescription slips from any device through the Patient Portal.'
    },
    {
      icon: HeartHandshake,
      title: 'Compassionate Care Partnership',
      description: 'From routine health screenings to ongoing chronic disease stabilization, our doctors work with you collaboratively to build sustainable wellness.'
    }
  ];

  return (
    <section
      style={{
        padding: '80px 24px',
        backgroundColor: 'var(--warm-cream)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
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
            Why Choose Us
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              lineHeight: 1.25,
              color: 'var(--deep-teal)',
              marginBottom: '12px'
            }}
          >
            Clinical standards designed around the patient experience.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Every touchpoint at Jivaka Clinic is engineered to minimize stress, eliminate guesswork, and prioritize medical diligence.
          </p>
        </div>

        {/* 4 TRUST POINTS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
                  padding: '32px 24px',
                  borderRadius: '18px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div className="mint-icon-box" style={{ width: '48px', height: '48px' }}>
                  <Icon size={22} />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
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

