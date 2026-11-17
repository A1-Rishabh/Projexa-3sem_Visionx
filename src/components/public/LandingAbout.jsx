import React, { useEffect, useState, useRef } from 'react';
import { Award, HeartPulse, Users, ShieldCheck, Stethoscope, Clock, CheckCircle2 } from 'lucide-react';

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
    { label: 'Senior Medical Consultants', value: '18', suffix: '+', icon: Award },
    { label: 'Outpatient Specialty Units', value: '6', suffix: ' Units', icon: HeartPulse },
    { label: 'Verified Consultations', value: '24', suffix: 'k+', icon: Users },
    { label: 'Clinical Satisfaction Rating', value: '99.4', suffix: '%', icon: ShieldCheck }
  ];

  const clinicalPillars = [
    {
      title: 'Attentive Doctor Time',
      desc: 'Average 25+ minutes per consultation for comprehensive evaluation.'
    },
    {
      title: 'Multidisciplinary Care',
      desc: 'Coordinated referrals and collaborative diagnosis between specialists.'
    },
    {
      title: 'Sterile Facility Standards',
      desc: 'NABH-compliant air filtration, ultrasonic sterilization & clean suites.'
    },
    {
      title: 'Digital Health Locker',
      desc: 'Instant, encrypted access to lab reports and digital prescriptions.'
    }
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: '88px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '56px',
          alignItems: 'center'
        }}
        className="about-grid-container"
      >
        {/* LEFT COLUMN: THE CLINICAL HERITAGE STORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
              fontSize: 'clamp(2.1rem, 3.6vw, 2.8rem)',
              lineHeight: 1.22,
              color: 'var(--deep-teal)'
            }}
          >
            Rooted in Medical Excellence, Ethical Practice & Compassionate Care.
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}
          >
            Named after the legendary ancient physician Jivaka—famed for profound diagnostic skill and ethical care—our institution is founded upon a fundamental principle: <strong>medicine must never be rushed</strong>. We believe optimal health outcomes emerge when doctors have ample time to listen, investigate thoroughly, and build enduring patient trust.
          </p>

          <p
            style={{
              fontSize: '0.98rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}
          >
            Our senior medical faculty brings decades of combined tertiary experience from prestigious institutions including AIIMS, PGIMER, and CMC Vellore. Supported by our on-site automated pathology lab and seamless digital patient records, we provide coordinated healthcare for the entire family.
          </p>

          {/* 4 CLINICAL PILLARS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              marginTop: '10px'
            }}
          >
            {clinicalPillars.map((pillar) => (
              <div
                key={pillar.title}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <CheckCircle2 size={16} color="var(--primary-teal)" />
                  <span style={{ fontSize: '0.90rem', fontWeight: '700', color: 'var(--deep-teal)' }}>
                    {pillar.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: INSTITUTIONAL STATS GRID */}
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
                  padding: '30px 24px',
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 16px rgba(15, 79, 74, 0.05)'
                }}
              >
                <div className="mint-icon-box" style={{ width: '46px', height: '46px', borderRadius: '14px' }}>
                  <Icon size={22} />
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.4rem',
                    fontWeight: '800',
                    color: 'var(--deep-teal)',
                    lineHeight: 1
                  }}
                >
                  <span>{stat.value}</span>
                  <span style={{ color: 'var(--warm-accent)' }}>{stat.suffix}</span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
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

