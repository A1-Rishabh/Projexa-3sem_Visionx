import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  ArrowUpDown,
  CheckCircle2,
  X,
  Award,
  BookOpen,
  MessageSquareQuote,
  ShieldCheck
} from 'lucide-react';
import { getDoctors } from '../../services/mockDataStore';
import { fetchDoctors } from '../../services/clinicService';
import { formatINR } from '../../config/clinic';

export const DoctorDirectory = ({ onSelectDoctorToBook }) => {
  const [doctors, setDoctors] = useState(getDoctors());
  const [selectedSpec, setSelectedSpec] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchTerm, setSearchTerm] = useState('');
  const [avatarErrors, setAvatarErrors] = useState({});
  const [profileModalDoc, setProfileModalDoc] = useState(null);

  useEffect(() => {
    fetchDoctors().then((liveDoctors) => {
      if (liveDoctors && liveDoctors.length > 0) {
        setDoctors(liveDoctors);
      }
    });
  }, []);

  // Doctor initials helper for avatar fallback
  const getInitials = (name = '') => {
    const clean = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (clean[0] || 'D').toUpperCase();
  };

  // Get distinct specializations
  const specializations = useMemo(() => {
    const set = new Set(doctors.map(d => d.specialization));
    return ['all', ...Array.from(set)];
  }, [doctors]);

  // Filter & Sort logic
  const filteredAndSortedDoctors = useMemo(() => {
    return doctors.filter(doc => {
      // Specialization
      if (selectedSpec !== 'all' && doc.specialization.toLowerCase() !== selectedSpec.toLowerCase()) {
        return false;
      }
      // Availability
      if (availabilityFilter === 'today') {
        if (doc.isHoliday || !doc.availableSlots || doc.availableSlots.length === 0) return false;
      }
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialization.toLowerCase().includes(q);
        const matchesQual = (doc.qualifications || '').toLowerCase().includes(q);
        const matchesBio = (doc.bio || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSpec && !matchesQual && !matchesBio) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'soonest') {
        const aSlots = (!a.isHoliday && a.availableSlots) ? a.availableSlots.length : 0;
        const bSlots = (!b.isHoliday && b.availableSlots) ? b.availableSlots.length : 0;
        return bSlots - aSlots;
      }
      return 0;
    });
  }, [doctors, selectedSpec, availabilityFilter, sortBy, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* FILTER & SEARCH HEADER BAR */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
              Find a Doctor
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Consult with board-certified in-clinic specialists. Instant confirmed slot booking.
            </p>
          </div>

          {/* Quick result count pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', backgroundColor: 'var(--warm-cream)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-teal)' }}>
            <span>{filteredAndSortedDoctors.length} {filteredAndSortedDoctors.length === 1 ? 'physician' : 'physicians'} available</span>
          </div>
        </div>

        {/* CONTROLS ROW: SEARCH & COMPACT DROPDOWNS */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '12px',
            alignItems: 'center'
          }}
        >
          {/* SEARCH INPUT */}
          <div className="input-with-icon" style={{ minWidth: '180px' }}>
            <Search className="input-icon" size={16} />
            <input
              type="text"
              placeholder="Search by doctor or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
              aria-label="Search doctors"
            />
          </div>

          {/* SPECIALIZATION DROPDOWN */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} color="var(--primary-teal)" />
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              aria-label="Filter by specialization"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.84rem',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="all">All Specialties</option>
              {specializations.filter(s => s !== 'all').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* AVAILABILITY FILTER */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            aria-label="Filter by availability"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.84rem',
              backgroundColor: '#ffffff'
            }}
          >
            <option value="all">All Availability</option>
            <option value="today">Available Today</option>
          </select>

          {/* SORT BY */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={15} color="var(--primary-teal)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort doctors"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.84rem',
                backgroundColor: '#ffffff',
                fontWeight: '600'
              }}
            >
              <option value="rating">Highest Rated</option>
              <option value="soonest">Soonest Available</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOCTORS GRID: EQUAL-HEIGHT CARDS */}
      {filteredAndSortedDoctors.length > 0 ? (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '18px' 
          }}
        >
          {filteredAndSortedDoctors.map(doc => {
            const hasAvatarFailed = avatarErrors[doc.id];
            const isAvailableToday = !doc.isHoliday && doc.availableSlots && doc.availableSlots.length > 0;
            const nextSlotText = isAvailableToday
              ? `Available today (${doc.availableSlots[0]})`
              : 'Next available: Thu 10:00 AM';

            return (
              <div
                key={doc.id}
                className="card-lift"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
                }}
              >
                <div>
                  {/* TOP ROW: AVATAR & INFO */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
                    {/* Initials Fallback Avatar */}
                    {hasAvatarFailed || !doc.avatar ? (
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--mint)',
                          color: 'var(--deep-teal)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '1.15rem',
                          border: '2px solid var(--primary-teal)',
                          flexShrink: 0
                        }}
                      >
                        {getInitials(doc.name)}
                      </div>
                    ) : (
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        onError={() => setAvatarErrors(prev => ({ ...prev, [doc.id]: true }))}
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--primary-teal)',
                          flexShrink: 0
                        }}
                      />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 2px 0', fontFamily: 'Fraunces, serif' }}>
                          {doc.name}
                        </h2>
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-teal)', marginBottom: '4px' }}>
                        {doc.specialization}
                      </div>

                      {/* Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: '700', color: '#B45309' }}>
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span>{doc.rating}</span>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>({doc.reviewsCount || 100}+ reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* AVAILABILITY BADGE */}
                  <div style={{ marginBottom: '12px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: isAvailableToday ? 'var(--mint)' : '#FEF3C7',
                        color: isAvailableToday ? 'var(--primary-teal)' : '#92400E'
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isAvailableToday ? '#16A34A' : '#D97706'
                        }}
                      />
                      {nextSlotText}
                    </span>
                  </div>

                  {/* 2-LINE CLAMPED BIO WITH VIEW PROFILE LINK */}
                  <div style={{ marginBottom: '14px' }}>
                    <p 
                      style={{ 
                        fontSize: '0.82rem', 
                        color: 'var(--text-secondary)', 
                        lineHeight: 1.45, 
                        margin: '0 0 4px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {doc.bio}
                    </p>
                    <button
                      type="button"
                      onClick={() => setProfileModalDoc(doc)}
                      style={{
                        padding: 0,
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--primary-teal)',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      View profile & reviews
                    </button>
                  </div>

                  {/* KEY METRICS LIST (Room, Hours, Fee in INR) */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '6px', 
                      fontSize: '0.78rem', 
                      color: 'var(--text-secondary)', 
                      padding: '10px 12px', 
                      backgroundColor: 'var(--warm-cream)', 
                      borderRadius: '10px', 
                      marginBottom: '16px' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--primary-teal)" />
                      <span>Location:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{doc.room}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={13} color="var(--primary-teal)" />
                      <span>Hours:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{doc.hours}</strong>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <button
                  type="button"
                  onClick={() => onSelectDoctorToBook(doc)}
                  className="btn btn-primary btn-block"
                  style={{ minHeight: '44px', fontSize: '0.88rem' }}
                >
                  <Calendar size={16} /> Book Consultation
                </button>

              </div>
            );
          })}
        </div>
      ) : (
        /* Friendly Empty State */
        <div 
          style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            padding: '40px 24px', 
            textAlign: 'center', 
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--mint)', color: 'var(--primary-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Search size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px 0', fontFamily: 'Fraunces, serif' }}>
            No physicians match your filter
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px' }}>
            Try clearing the search query or adjusting your specialization and availability filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSpec('all');
              setAvailabilityFilter('all');
              setSearchTerm('');
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* EXPANDED DOCTOR PROFILE & REVIEWS MODAL */}
      {profileModalDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 79, 74, 0.45)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setProfileModalDoc(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              animation: 'fadeUp 0.2s ease-out',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setProfileModalDoc(null)}
              aria-label="Close doctor profile"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>

            {/* Header with Avatar & Details */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '18px' }}>
              {avatarErrors[profileModalDoc.id] || !profileModalDoc.avatar ? (
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--mint)',
                    color: 'var(--deep-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1.3rem',
                    border: '2.5px solid var(--primary-teal)'
                  }}
                >
                  {getInitials(profileModalDoc.name)}
                </div>
              ) : (
                <img
                  src={profileModalDoc.avatar}
                  alt={profileModalDoc.name}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2.5px solid var(--primary-teal)'
                  }}
                />
              )}

              <div>
                <h3 id="doc-modal-title" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0', fontFamily: 'Fraunces, serif' }}>
                  {profileModalDoc.name}
                </h3>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-teal)' }}>
                  {profileModalDoc.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.8rem', fontWeight: '700', color: '#B45309' }}>
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  <span>{profileModalDoc.rating} / 5.0</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>({profileModalDoc.reviewsCount} patient reviews)</span>
                </div>
              </div>
            </div>

            {/* Qualifications & Experience Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--warm-cream)', color: 'var(--text-main)', fontWeight: '600' }}>
                🎓 {profileModalDoc.qualifications}
              </span>
              <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--mint)', color: 'var(--primary-teal)', fontWeight: '700' }}>
                ⭐ {profileModalDoc.experience || '10+ Years'} Experience
              </span>
            </div>

            {/* Full Biography */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                About the Physician
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {profileModalDoc.bio}
              </p>
            </div>

            {/* Consultation Chambers & Hours */}
            <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--warm-cream)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                <MapPin size={16} color="var(--primary-teal)" />
                <span>Consultation Chamber: <strong>{profileModalDoc.room}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-main)' }}>
                <Clock size={16} color="var(--primary-teal)" />
                <span>OPD Working Hours: <strong>{profileModalDoc.hours}</strong></span>
              </div>
            </div>

            {/* Patient Reviews Section */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquareQuote size={16} color="var(--primary-teal)" />
                Verified Patient Feedback
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Rajesh M. (Verified Patient)</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
                    "Extremely attentive and explained the clinical implications with patience. Feeling much better following the revised medication."
                  </p>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Pooja K. (Verified Patient)</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
                    "Short waiting time and very smooth check-in at the clinic. The diagnostic recommendations were precise."
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setProfileModalDoc(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const docToBook = profileModalDoc;
                  setProfileModalDoc(null);
                  onSelectDoctorToBook(docToBook);
                }}
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                <Calendar size={16} /> Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDirectory;
