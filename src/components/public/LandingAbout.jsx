import React from 'react';
import { Award, HeartPulse, Users, ShieldCheck, Clock, FileCheck, Stethoscope, HeartHandshake } from 'lucide-react';

export const LandingAbout = () => {
  // All stats shown as [00], suffixes styled without orange accent
  const stats = [
    { label: 'Doctors', value: '[00]', icon: Award },
    { label: 'Specialty areas', value: '[00]', icon: HeartPulse },
    { label: 'Patient visits', value: '[00]', icon: Users },
    { label: 'Patient satisfaction', value: '[00]%', icon: ShieldCheck }
  ];

  // Merged Why Jivaka care points into About (no repeated points, no unverified claims)
  const carePoints = [
    {
      icon: Clock,
      title: 'Attentive Doctor Consultations',
      desc: 'Our doctors take the time needed to listen, perform careful examinations, and explain your treatment plan clearly.'
    },
    {
      icon: Stethoscope,
      title: 'Coordinated Family Care',
      desc: 'From routine health checks to ongoing chronic condition support, our clinic cares for your entire family.'
    },
    {
      icon: HeartPulse,
      title: 'On-Site Diagnostic Sampling',
      desc: 'Routine blood draws, urine tests, and diagnostic panels handled directly at the clinic.'
    },
    {
      icon: FileCheck,
      title: 'Digital Health Records',
      desc: 'Access your doctor notes, verified prescriptions, and test results through your patient portal account.'
    }
  ];

  return (
    <section
      id="about"
      style={{
        padding: '64px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '44px',
          alignItems: 'center'
        }}
        className="about-grid-container"
      >
        {/* LEFT COLUMN: THE CLINIC STORY & CARE POINTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: '600',
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
              fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)',
              lineHeight: 1.25,
              fontWeight: 500,
              color: 'var(--deep-teal)',
              margin: 0
            }}
          >
            Care focused on listening, diagnosis, and patient trust.
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              margin: 0
            }}
          >
            Named after the ancient healer Jivaka, our clinic is founded on unhurried, patient-centered diagnosis. We believe good medicine begins when doctors have the time to listen carefully and treat each patient with thorough attention.
          </p>

          {/* MERGED CARE POINTS (WHY JIVAKA) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginTop: '6px'
            }}
          >
            {carePoints.map((pt) => {
              const Icon = pt.icon;
              return (
                <div
                  key={pt.title}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '16px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div className="mint-icon-box" style={{ width: '28px', height: '28px', borderRadius: '8px' }}>
                      <Icon size={15} />
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--deep-teal)' }}>
                      {pt.title}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {pt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: STATS GRID ([00] PLACEHOLDERS, NO ORANGE ACCENT ON SUFFIX) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}
          className="about-stats-grid"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card-interactive"
                style={{
                  padding: '24px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div className="mint-icon-box" style={{ width: '40px', height: '40px', borderRadius: '10px' }}>
                  <Icon size={20} />
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.1rem',
                    fontWeight: 500,
                    color: 'var(--deep-teal)',
                    lineHeight: 1
                  }}
                >
                  <span>{stat.value}</span>
                </div>

                <div style={{ fontSize: '0.84rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
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

