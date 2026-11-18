import React from 'react';
import { Award, HeartPulse, Users, ShieldCheck, Clock, FileCheck, Stethoscope, Sparkles } from 'lucide-react';

export const LandingAbout = () => {
  const stats = [
    { label: 'Years Serving Community', value: '20+', icon: Award },
    { label: 'Consulting Specialists', value: '3', icon: HeartPulse },
    { label: 'In-Clinic Consultation Fee', value: '₹500', icon: ShieldCheck },
    { label: 'Official Panel Coverage', value: 'LIC & Cab. Sec.', icon: Users }
  ];

  const carePoints = [
    {
      icon: Clock,
      title: 'Attentive Doctor Consultations',
      desc: 'Our doctors take the time needed to listen, perform careful physical examinations, and explain treatment plans clearly.'
    },
    {
      icon: Stethoscope,
      title: 'Family & Primary Medicine',
      desc: 'Routine health checkups, fever treatment, blood pressure monitoring, and diabetes care led by Dr. Shuchi Shivangi.'
    },
    {
      icon: Sparkles,
      title: "Women's Health & Maternity",
      desc: "Comprehensive antenatal checkups, maternal wellness, and specialist gynecological care led by Dr. (Mrs.) Indu Kumari."
    },
    {
      icon: HeartPulse,
      title: 'General & Laparoscopic Surgery',
      desc: 'Outpatient surgical evaluations, procedural guidance, and post-operative recovery reviews led by Dr. Surendra Kumar.'
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
            About Jeevak Clinic (जीवक क्लीनिक)
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
            Trusted community medical care in New Delhi since 2003.
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              margin: 0
            }}
          >
            Established in 2003 at Meethapur, Badarpur, Jeevak Clinic has served local families and patients across South Delhi for over two decades. On panel with LIC and the Cabinet Secretariat, our clinic is committed to patient-first diagnosis, unhurried consultations, and transparent medical care.
          </p>

          {/* CARE POINTS */}
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

        {/* RIGHT COLUMN: STATS GRID */}
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
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    color: 'var(--deep-teal)',
                    lineHeight: 1.1
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
