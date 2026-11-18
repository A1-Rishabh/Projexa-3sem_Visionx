import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingAbout } from './LandingAbout';
import { LandingDepartments } from './LandingDepartments';
import { LandingDoctors } from './LandingDoctors';
import { LandingLocations } from './LandingLocations';
import { LandingCtaBand } from './LandingCtaBand';
import { LandingFooter } from './LandingFooter';
// LandingWhyChooseUs removed — contained unverified claims (NABH, ABDM, ABHA)

export const LandingPage = ({ onNavigateToAuth, onQuickBookDoctor, showToast }) => {
  const handleStartBooking = (bookingPref = {}) => {
    // Navigates to patient auth or booking flow
    onNavigateToAuth('patient', bookingPref);
  };

  const handleBookDoctor = (doctor) => {
    if (onQuickBookDoctor) {
      onQuickBookDoctor(doctor);
    } else {
      onNavigateToAuth('patient', { doctorId: doctor.id, doctorName: doctor.name });
    }
  };

  return (
    <div className="landing-page-wrapper" style={{ minHeight: '100vh', backgroundColor: 'var(--warm-cream)' }}>
      {/* 1. STICKY FROSTED NAVBAR */}
      <LandingNavbar
        onNavigateToAuth={(role) => onNavigateToAuth(role)}
      />

      <main id="main-content">
        {/* 2. HERO */}
        <LandingHero
          onStartBooking={handleStartBooking}
          onSignIn={() => onNavigateToAuth('patient')}
        />

        {/* 3. ABOUT (WITH MERGED CARE POINTS & CLEAN STATS) */}
        <LandingAbout />

        {/* 4. DEPARTMENTS */}
        <LandingDepartments
          onSelectDepartment={(deptName) => handleStartBooking({ department: deptName })}
        />

        {/* 5. DOCTORS */}
        <LandingDoctors
          onBookDoctor={handleBookDoctor}
        />

        {/* 6. LOCATIONS / FIND US */}
        <LandingLocations showToast={showToast} />

        {/* 7. FINAL CTA BAND WITH WARM ACCENT GLOW */}
        <LandingCtaBand
          onStartBooking={() => handleStartBooking()}
          onSignIn={() => onNavigateToAuth('patient')}
        />
      </main>

      {/* 8. FOOTER */}
      <LandingFooter
        onNavigateToAuth={(role) => onNavigateToAuth(role)}
      />
    </div>
  );
};

export default LandingPage;

