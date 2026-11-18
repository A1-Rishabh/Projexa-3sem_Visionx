import React from 'react';
import { Award, Users, ShieldCheck, Clock, Stethoscope, Sparkles, Activity } from 'lucide-react';

export const LandingAbout = () => {
  const stats = [
    { label: 'Years Serving Community', value: '20+', icon: Award },
    { label: 'Consulting Specialists', value: '3', icon: Users },
    { label: 'In-Clinic Consultation Fee', value: '₹500', icon: ShieldCheck },
    { label: 'Official Panel Coverage', value: 'LIC & Cab. Sec.', icon: ShieldCheck }
  ];

  const carePoints = [
    {
      icon: Clock,
      title: 'Attentive Doctor Consultations'
    },
    {
      icon: Stethoscope,
      title: 'Family & Primary Medicine'
    },
    {
      icon: Sparkles,
      title: "Women's Health & Maternity"
    },
    {
      icon: Activity,
      title: 'General & Laparoscopic Surgery'
    }
  ];

  return (
    <section
      id="about"
      style={{
        padding: '36px 28px',
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* TOP SECTION: TWO-COLUMN COMPOSITION (TEXT LEFT + DOCTOR & 4 STATS RIGHT) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.35fr',
          gap: '36px',
          alignItems: 'center',
          marginBottom: '28px'
        }}
        className="about-grid-container"
      >
        {/* LEFT COLUMN: STORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: '700',
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
              fontSize: 'clamp(1.95rem, 3.2vw, 2.5rem)',
              lineHeight: 1.2,
              fontWeight: 500,
              color: 'var(--deep-teal)',
              margin: 0
            }}
          >
            Trusted community medical care in New Delhi since 2003.
          </h2>

          <p
            style={{
              fontSize: '0.96rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0
            }}
          >
            Established in 2003 at Meethapur, Badarpur, Jeevak Clinic has served local families and patients across South Delhi for over two decades. On panel with LIC and the Cabinet Secretariat, our clinic is committed to patient-first diagnosis, unhurried consultations, and transparent medical care.
          </p>
        </div>

        {/* RIGHT COLUMN: DOCTOR PHOTO (LEFT) + 4 STAT CARDS 2x2 (RIGHT) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '0.85fr 1.15fr',
            gap: '14px',
            alignItems: 'stretch'
          }}
          className="about-doctor-stats-grid"
        >
          {/* PROFESSIONAL PHYSICIAN PORTRAIT */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              border: '1.5px solid var(--border-color)',
              minHeight: '230px',
              backgroundColor: 'var(--mint-light)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=900"
              alt="Experienced physician at Jeevak Clinic"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              loading="lazy"
            />
          </div>

          {/* 4 STAT CARDS (2x2 GRID TO THE RIGHT OF DOCTOR) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
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
                    padding: '16px 14px',
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    border: '1.5px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div className="mint-icon-box" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                    <Icon size={16} />
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: idx === 3 ? '1.1rem' : '1.55rem',
                      fontWeight: 600,
                      color: 'var(--deep-teal)',
                      lineHeight: 1.15,
                      marginTop: '2px'
                    }}
                  >
                    {stat.value}
                  </div>

                  <div style={{ fontSize: '0.74rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 4 HORIZONTAL CARE CARDS WITH CRISP BORDERS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px'
        }}
        className="about-care-points-row"
      >
        {carePoints.map((pt) => {
          const Icon = pt.icon;
          return (
            <div
              key={pt.title}
              className="card-interactive"
              style={{
                backgroundColor: '#ffffff',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div className="mint-icon-box" style={{ width: '36px', height: '36px', borderRadius: '10px', minWidth: '36px' }}>
                <Icon size={18} color="var(--primary-teal)" />
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--deep-teal)', lineHeight: 1.3 }}>
                {pt.title}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingAbout;
