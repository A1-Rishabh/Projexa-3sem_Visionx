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
      title: 'Attentive Doctor Consultations',
      desc: 'Unhurried examinations and dedicated diagnostic attention.'
    },
    {
      icon: Stethoscope,
      title: 'Family & Primary Medicine',
      desc: 'Routine checkups, blood pressure, fever, and diabetes management.'
    },
    {
      icon: Sparkles,
      title: "Women's Health & Maternity",
      desc: 'Antenatal care, prenatal guidance, and gynecological consultations.'
    },
    {
      icon: Activity,
      title: 'General & Laparoscopic Surgery',
      desc: 'Specialist surgical evaluations and pre/post-operative recovery reviews.'
    }
  ];

  return (
    <section
      id="about"
      style={{
        padding: '72px 28px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}
    >
      {/* TOP SECTION: TWO-COLUMN COMPOSITION (TEXT + IMAGE/STATS) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center',
          marginBottom: '48px'
        }}
        className="about-grid-container"
      >
        {/* LEFT COLUMN: STORY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              fontSize: '0.80rem',
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
              fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
              lineHeight: 1.22,
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
        </div>

        {/* RIGHT COLUMN: DOCTOR IMAGE + 4 STAT CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            alignItems: 'stretch'
          }}
        >
          {/* HEALTHCARE PROFESSIONAL PHOTO */}
          <div
            style={{
              gridRow: 'span 2',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              minHeight: '260px',
              backgroundColor: 'var(--mint-light)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=900"
              alt="Experienced medical specialist at Jeevak Clinic"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              loading="lazy"
            />
          </div>

          {/* 4 STAT CARDS */}
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card-interactive"
                style={{
                  padding: '20px 18px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="mint-icon-box" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
                    <Icon size={18} />
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: idx === 3 ? '1.25rem' : '1.75rem',
                    fontWeight: 600,
                    color: 'var(--deep-teal)',
                    lineHeight: 1.15
                  }}
                >
                  {stat.value}
                </div>

                <div style={{ fontSize: '0.80rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ROW: 4 HORIZONTAL CARE POINT PILLS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
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
                padding: '20px 18px',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div className="mint-icon-box" style={{ width: '42px', height: '42px', borderRadius: '12px', minWidth: '42px' }}>
                <Icon size={20} color="var(--primary-teal)" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--deep-teal)', lineHeight: 1.3 }}>
                  {pt.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingAbout;
