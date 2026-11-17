import React, { useEffect, useState, useRef } from 'react';
import { Award, HeartPulse, Users, ShieldCheck } from 'lucide-react';

export const LandingAbout = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const stats = [
    { label: 'Senior Consultants', value: '[00]', suffix: '+', icon: Award },
    { label: 'Clinical Specialty Units', value: '[00]', suffix: '', icon: HeartPulse },
    { label: 'Patient Consultations', value: '[00]', suffix: 'k+', icon: Users },
    { label: 'Patient Satisfaction', value: '[00]', suffix: '%', icon: ShieldCheck }
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: '80px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '48px',
          alignItems: 'center'
        }}
        className="about-grid-container"
      >
        {/* LEFT COLUMN: THE CLINIC STORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--primary-teal)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}
          >
            About Jivaka Clinic
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.5vw, 2.7rem)',
              lineHeight: 1.25,
              color: 'var(--deep-teal)'
            }}
          >
            Thoughtful medicine, dedicated physicians, and enduring patient care.
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}
          >
            Named after the revered ancient physician Jivaka, our clinic is built upon a single enduring standard: unhurried, patient-centered diagnosis guided by clinical integrity. We believe optimal health outcomes occur when patients are heard, respected, and treated with medical thoroughness.
          </p>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}
          >
            From preventative screenings and outpatient chronic disease management to pediatric care and on-site diagnostic reporting, our experienced practitioners collaborate closely to deliver cohesive, family-friendly medical guidance.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: 'var(--mint)',
                color: 'var(--deep-teal)',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}
            >
              <span>Evidence-based clinical protocols</span>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: 'var(--mint)',
                color: 'var(--deep-teal)',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}
            >
              <span>Digitized, encrypted health records</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}
          className="about-stats-grid"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card-interactive"
                style={{
                  padding: '28px 24px',
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div className="mint-icon-box" style={{ width: '42px', height: '42px' }}>
                  <Icon size={20} />
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.2rem',
                    fontWeight: '800',
                    color: 'var(--deep-teal)',
                    lineHeight: 1
                  }}
                >
                  <span>{stat.value}</span>
                  <span style={{ color: 'var(--warm-accent)' }}>{stat.suffix}</span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingAbout;
