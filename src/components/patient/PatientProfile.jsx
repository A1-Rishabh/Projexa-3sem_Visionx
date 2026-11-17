import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Heart, 
  AlertTriangle, 
  Save, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  Bell, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  KeyRound,
  Users,
  Plus,
  Edit2,
  Calendar,
  X
} from 'lucide-react';
import { 
  getPatients, 
  getDependents, 
  addDependent, 
  updateDependent, 
  deleteDependent 
} from '../../services/mockDataStore';
import { clinic } from '../../config/clinic';
import { Logo } from '../common/Logo';
import { Modal } from '../common/Modal';

export const PatientProfile = ({ 
  patient = {}, 
  onUpdatePatient, 
  onUpdateProfile, 
  showToast, 
  onBackToDashboard, 
  initialSection = 'details' 
}) => {
  // Navigation Section Tab State
  const [activeSection, setActiveSection] = useState(initialSection); // 'details' | 'dependents' | 'emergency' | 'security'

  // Personal Form state
  const [name, setName] = useState(patient.name || '');
  const [phone, setPhone] = useState(patient.phone || '');
  const [email, setEmail] = useState(patient.email || '');
  const [bloodGroup, setBloodGroup] = useState(patient.bloodGroup || 'A+');
  const [allergies, setAllergies] = useState(patient.allergies || '');
  const [emergencyContact, setEmergencyContact] = useState(patient.emergencyContact || '');
  const [emergencyRelation, setEmergencyRelation] = useState(patient.emergencyRelation || 'Spouse / Family');
  const [avatar, setAvatar] = useState(patient.avatar || '');
  
  // Notification preferences
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);
  const [notifReports, setNotifReports] = useState(true);
  const [notifTips, setNotifTips] = useState(false);

  // Security password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Emergency card print modal state
  const [isEmergencyCardOpen, setIsEmergencyCardOpen] = useState(false);

  // Family Dependents state (User-driven, no fake hardcoded dependents!)
  const [dependents, setDependents] = useState([]);
  const [isDepModalOpen, setIsDepModalOpen] = useState(false);
  const [editingDepId, setEditingDepId] = useState(null);
  const [depName, setDepName] = useState('');
  const [depRelation, setDepRelation] = useState('Spouse');
  const [depAge, setDepAge] = useState('');
  const [depGender, setDepGender] = useState('Male');
  const [depBloodGroup, setDepBloodGroup] = useState('A+');
  const [depAllergies, setDepAllergies] = useState('');
  const [depPhone, setDepPhone] = useState('');

  // Errors and dirty state tracking
  const [errors, setErrors] = useState({});
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const fileInputRef = useRef(null);

  // Load dependents for this patient on mount
  useEffect(() => {
    if (patient?.id) {
      setDependents(getDependents(patient.id));
    }
  }, [patient?.id]);

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Check if personal form has unsaved modifications
  const isDirty = useMemo(() => {
    return (
      name !== (patient.name || '') ||
      phone !== (patient.phone || '') ||
      email !== (patient.email || '') ||
      bloodGroup !== (patient.bloodGroup || 'A+') ||
      allergies !== (patient.allergies || '') ||
      emergencyContact !== (patient.emergencyContact || '') ||
      avatar !== (patient.avatar || '')
    );
  }, [name, phone, email, bloodGroup, allergies, emergencyContact, avatar, patient]);

  // Unsaved changes browser warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Initials fallback
  const getInitials = (str = '') => {
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (str[0] || 'P').toUpperCase();
  };

  // Profile photo upload handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      if (showToast) showToast('Photo must be smaller than 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setAvatar(uploadEvent.target.result);
      if (showToast) showToast('Profile portrait updated!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (!phone.trim() || cleanPhone.length < 8) {
      errs.phone = 'Please provide a valid contact phone number.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler for Personal Profile
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const updated = {
      ...patient,
      name,
      phone,
      email,
      bloodGroup,
      allergies,
      emergencyContact,
      emergencyRelation,
      avatar
    };

    // Update in localStorage
    const patients = getPatients();
    const idx = patients.findIndex(p => p.id === patient.id);
    if (idx !== -1) {
      patients[idx] = updated;
      localStorage.setItem('aegis_patients', JSON.stringify(patients));
    }

    if (onUpdateProfile) onUpdateProfile(updated);
    else if (onUpdatePatient) onUpdatePatient(updated);

    setIsSavedRecently(true);
    if (showToast) {
      showToast('Personal profile and clinical alerts updated successfully!', 'success');
    }
    setTimeout(() => setIsSavedRecently(false), 4000);
  };

  // Password Change Handler
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordError('');
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    if (showToast) {
      showToast('Account password successfully updated!', 'success');
    }
  };

  // Family Dependents Handlers
  const handleOpenAddDependent = () => {
    setEditingDepId(null);
    setDepName('');
    setDepRelation('Spouse');
    setDepAge('');
    setDepGender('Male');
    setDepBloodGroup('A+');
    setDepAllergies('');
    setDepPhone('');
    setIsDepModalOpen(true);
  };

  const handleOpenEditDependent = (dep) => {
    setEditingDepId(dep.id);
    setDepName(dep.name || '');
    setDepRelation(dep.relation || 'Spouse');
    setDepAge(dep.age || '');
    setDepGender(dep.gender || 'Male');
    setDepBloodGroup(dep.bloodGroup || 'A+');
    setDepAllergies(dep.allergies || '');
    setDepPhone(dep.phone || '');
    setIsDepModalOpen(true);
  };

  const handleSaveDependentSubmit = (e) => {
    e.preventDefault();
    if (!depName.trim()) {
      if (showToast) showToast('Please enter the dependent’s full name.', 'error');
      return;
    }

    const depData = {
      name: depName.trim(),
      relation: depRelation,
      age: depAge.trim(),
      gender: depGender,
      bloodGroup: depBloodGroup,
      allergies: depAllergies.trim() || 'None recorded',
      phone: depPhone.trim()
    };

    if (editingDepId) {
      updateDependent(patient.id, editingDepId, depData);
      if (showToast) showToast(`Updated details for ${depData.name}`, 'success');
    } else {
      addDependent(patient.id, depData);
      if (showToast) showToast(`Added ${depData.name} (${depData.relation}) as family dependent`, 'success');
    }

    setDependents(getDependents(patient.id));
    setIsDepModalOpen(false);
  };

  const handleDeleteDependent = (depId, depNameStr) => {
    if (window.confirm(`Are you sure you want to remove ${depNameStr} from your registered family dependents?`)) {
      deleteDependent(patient.id, depId);
      setDependents(getDependents(patient.id));
      if (showToast) showToast(`Removed ${depNameStr} from family list`, 'info');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER BAR */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif' }}>
            Account Settings & Clinical Profile
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Manage personal health demographics, self-registered family dependents, security, and responder cards
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isDirty && (
            <span style={{ fontSize: '0.78rem', color: '#D97706', backgroundColor: '#FEF3C7', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>
              ● Unsaved changes
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsEmergencyCardOpen(true)}
            className="btn btn-secondary btn-sm"
          >
            <ShieldCheck size={16} color="var(--primary-teal)" />
            <span>Emergency Card</span>
          </button>
        </div>
      </div>

      {/* SECTION TABS */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          backgroundColor: '#ffffff',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {[
          { id: 'details', label: 'Personal Details', icon: User },
          { id: 'dependents', label: `Family & Dependents (${dependents.length})`, icon: Users },
          { id: 'emergency', label: 'Emergency & Allergies', icon: Heart },
          { id: 'security', label: 'Security & Notifications', icon: Lock }
        ].map((tab) => {
          const isActive = activeSection === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: isActive ? '700' : '600',
                fontSize: '0.84rem',
                backgroundColor: isActive ? 'var(--primary-teal)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <IconComponent size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUCCESS CONFIRMATION BANNER */}
      {isSavedRecently && (
        <div
          style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '12px 18px',
            color: '#15803D',
            fontSize: '0.86rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeUp 0.15s ease-out'
          }}
        >
          <CheckCircle2 size={18} />
          <span>All profile updates have been safely saved to your patient record.</span>
        </div>
      )}

      {/* TAB 1: PERSONAL DETAILS */}
      {activeSection === 'details' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)', 
              padding: '24px', 
              boxShadow: 'var(--shadow-sm)' 
            }}
          >
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0', fontFamily: 'Fraunces, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--primary-teal)" /> Personal Identification & Demographics
            </h2>

            {/* Photo Upload with Initials Fallback */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2.5px solid var(--primary-teal)',
                    flexShrink: 0
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--mint)',
                    color: 'var(--deep-teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1.3rem',
                    border: '2.5px solid var(--primary-teal)',
                    flexShrink: 0
                  }}
                >
                  {getInitials(name)}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', minHeight: '34px' }}
                  >
                    <Upload size={13} /> Change photo
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="btn btn-sm"
                      style={{ backgroundColor: 'transparent', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.78rem', minHeight: '34px' }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  JPG, WebP or PNG • Max 2MB
                </div>
              </div>
            </div>

            {/* Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="patient-profile-name">Full Legal Name</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={16} />
                  <input 
                    id="patient-profile-name"
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    style={{ color: 'var(--text-main)', fontWeight: '600' }}
                    required 
                  />
                </div>
                {errors.name && <div style={{ fontSize: '0.74rem', color: '#DC2626', marginTop: '4px' }}>{errors.name}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="patient-profile-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={16} />
                  <input 
                    id="patient-profile-email"
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={{ color: 'var(--text-main)', fontWeight: '600' }}
                    required 
                  />
                </div>
                {errors.email && <div style={{ fontSize: '0.74rem', color: '#DC2626', marginTop: '4px' }}>{errors.email}</div>}
              </div>
            </div>

            {/* Phone & Blood Group */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="patient-profile-phone">Contact Phone Number</label>
                <div className="input-with-icon">
                  <Phone className="input-icon" size={16} />
                  <input 
                    id="patient-profile-phone"
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    style={{ color: 'var(--text-main)', fontWeight: '600' }}
                    required 
                  />
                </div>
                {errors.phone && <div style={{ fontSize: '0.74rem', color: '#DC2626', marginTop: '4px' }}>{errors.phone}</div>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="patient-profile-blood">Blood Group</label>
                <select
                  id="patient-profile-blood"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="A+">A+ (Positive)</option>
                  <option value="A-">A- (Negative)</option>
                  <option value="B+">B+ (Positive)</option>
                  <option value="B-">B- (Negative)</option>
                  <option value="O+">O+ (Positive)</option>
                  <option value="O-">O- (Negative)</option>
                  <option value="AB+">AB+ (Positive)</option>
                  <option value="AB-">AB- (Negative)</option>
                </select>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div style={{ marginTop: '20px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ minHeight: '44px', padding: '10px 24px', fontSize: '0.9rem' }}
              >
                <Save size={16} /> Save Personal Details
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: FAMILY & DEPENDENTS (USER-MANAGED, NO HARDCODED PRE-SETS) */}
      {activeSection === 'dependents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)', 
              padding: '24px', 
              boxShadow: 'var(--shadow-sm)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary-teal)" /> Registered Family Members & Dependents
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Add your spouse, children, or elderly parents to manage their appointments, prescriptions, and health records under your primary account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddDependent}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px', fontSize: '0.82rem' }}
              >
                <Plus size={15} /> Add Family Member
              </button>
            </div>

            {/* PRIMARY USER CARD (SELF) */}
            <div 
              style={{
                backgroundColor: 'var(--warm-cream)',
                borderRadius: '12px',
                border: '1.5px solid var(--border-color)',
                padding: '16px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-teal)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.95rem'
                  }}
                >
                  {getInitials(name)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{name || 'Primary Patient'}</strong>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--deep-teal)', backgroundColor: 'var(--mint)', padding: '2px 8px', borderRadius: '4px' }}>
                      Primary Account Holder (Self)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Blood Group: <strong>{bloodGroup}</strong> • ID: {patient.id || 'P-1001'} • Phone: {phone}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: '700', backgroundColor: '#DCFCE7', padding: '3px 10px', borderRadius: '6px' }}>
                Active Primary
              </span>
            </div>

            {/* DEPENDENTS LIST OR EMPTY STATE */}
            {dependents.length === 0 ? (
              <div 
                style={{ 
                  padding: '36px 20px', 
                  textAlign: 'center', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '14px', 
                  border: '1px dashed #cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <Users size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>
                    No Family Dependents Added Yet
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, maxWidth: '440px', lineHeight: 1.5 }}>
                    You have not registered any family members. You can add your spouse, children, or parents here to schedule clinical slots and access their health files.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddDependent}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px', marginTop: '6px' }}
                >
                  <Plus size={14} color="var(--primary-teal)" />
                  <span>Register First Family Member</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {dependents.map((dep) => (
                  <div
                    key={dep.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: '#F1F5F9',
                            color: 'var(--primary-teal)',
                            fontWeight: '800',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #E2E8F0'
                          }}
                        >
                          {getInitials(dep.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            {dep.name}
                          </div>
                          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--primary-teal)', backgroundColor: 'var(--mint)', padding: '1px 6px', borderRadius: '4px' }}>
                            {dep.relation}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditDependent(dep)}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#475569', cursor: 'pointer' }}
                          title="Edit family member"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDependent(dep.id, dep.name)}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fecaca', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}
                          title="Remove family member"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Blood Group: <strong>{dep.bloodGroup || 'Not specified'}</strong></span>
                        {dep.age && <span>Age: <strong>{dep.age} Yrs ({dep.gender})</strong></span>}
                      </div>
                      <div>
                        Allergies: <strong style={{ color: dep.allergies && dep.allergies !== 'None' && dep.allergies !== 'None recorded' ? '#dc2626' : 'var(--text-main)' }}>
                          {dep.allergies || 'None documented'}
                        </strong>
                      </div>
                      {dep.phone && <div>Phone: <strong>{dep.phone}</strong></div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: EMERGENCY CARD & ALLERGIES */}
      {activeSection === 'emergency' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)', 
              padding: '24px', 
              boxShadow: 'var(--shadow-sm)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'Fraunces, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={18} color="#DC2626" /> Emergency Contact & Clinical Alerts
              </h2>
              <button
                type="button"
                onClick={() => setIsEmergencyCardOpen(true)}
                className="btn btn-outline-teal btn-sm"
              >
                <Printer size={14} /> Printable Wallet Card
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="patient-profile-emg-name">Emergency Contact Name & Phone</label>
                <div className="input-with-icon">
                  <Phone className="input-icon" size={16} />
                  <input 
                    id="patient-profile-emg-name"
                    type="text" 
                    value={emergencyContact} 
                    onChange={(e) => setEmergencyContact(e.target.value)} 
                    placeholder="e.g. Priya Sharma - +91 98765 43210"
                    style={{ color: 'var(--text-main)', fontWeight: '600' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="patient-profile-emg-rel">Relationship</label>
                <input 
                  id="patient-profile-emg-rel"
                  type="text" 
                  value={emergencyRelation} 
                  onChange={(e) => setEmergencyRelation(e.target.value)} 
                  placeholder="e.g. Spouse / Parent / Sibling"
                  style={{ color: 'var(--text-main)', fontWeight: '600' }}
                />
              </div>
            </div>

            {/* Known Allergies */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="patient-profile-allergies">Known Medical Allergies (Displayed on Clinical EHR & Charts)</label>
              <div className="input-with-icon">
                <AlertTriangle className="input-icon" size={16} color="#DC2626" />
                <input 
                  id="patient-profile-allergies"
                  type="text" 
                  value={allergies} 
                  onChange={(e) => setAllergies(e.target.value)} 
                  placeholder="e.g. Penicillin, Sulfa, Latex (or None recorded)"
                  style={{ color: '#DC2626', fontWeight: '700' }}
                />
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ minHeight: '44px', padding: '10px 24px', fontSize: '0.9rem' }}
              >
                <Save size={16} /> Save Emergency Alerts
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: SECURITY & NOTIFICATIONS */}
      {activeSection === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* SECURITY & AUTH */}
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)', 
              padding: '22px', 
              boxShadow: 'var(--shadow-sm)' 
            }}
          >
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 14px 0', fontFamily: 'Fraunces, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="var(--primary-teal)" /> Security & Credentials
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', backgroundColor: 'var(--warm-cream)' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-main)' }}>Account Password</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Secured with clinical AES-256 standard</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.76rem', minHeight: '32px' }}
                >
                  <KeyRound size={13} /> Change
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', backgroundColor: 'var(--warm-cream)' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-main)' }}>Google OAuth Verification</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Linked: {email || 'patient@jivakaclinic.in'}
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16A34A', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)', 
              padding: '22px', 
              boxShadow: 'var(--shadow-sm)' 
            }}
          >
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 14px 0', fontFamily: 'Fraunces, serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--primary-teal)" /> Clinical Notifications
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '6px 0' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-main)' }}>Email Appointment Reminders</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Receive reminders 24 hours prior to consultation</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifEmail} 
                  onChange={(e) => setNotifEmail(e.target.checked)} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)', cursor: 'pointer' }} 
                />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '6px 0', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-main)' }}>SMS Slot & Token Alerts</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Direct SMS for chamber room number & check-in code</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifSms} 
                  onChange={(e) => setNotifSms(e.target.checked)} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)', cursor: 'pointer' }} 
                />
              </label>

              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '6px 0', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-main)' }}>Diagnostic Lab Result Releases</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Instant alert when pathology test results are verified</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifReports} 
                  onChange={(e) => setNotifReports(e.target.checked)} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-teal)', cursor: 'pointer' }} 
                />
              </label>
            </div>
          </div>

        </div>
      )}

      {/* ADD / EDIT FAMILY DEPENDENT MODAL */}
      <Modal
        isOpen={isDepModalOpen}
        onClose={() => setIsDepModalOpen(false)}
        title={editingDepId ? 'Edit Family Dependent' : 'Register New Family Member / Dependent'}
        maxWidth="520px"
      >
        <form onSubmit={handleSaveDependentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'var(--warm-cream)', padding: '10px 14px', borderRadius: '8px' }}>
            Registered dependents can be selected during doctor booking and will appear in your patient account switch menu.
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Full Legal Name *
            </label>
            <input 
              type="text" 
              placeholder="e.g. Priya Sharma"
              value={depName} 
              onChange={(e) => setDepName(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Relationship *
              </label>
              <select
                value={depRelation}
                onChange={(e) => setDepRelation(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: '600' }}
              >
                <option value="Spouse">Spouse</option>
                <option value="Child">Child (Son / Daughter)</option>
                <option value="Parent">Parent (Mother / Father)</option>
                <option value="Sibling">Sibling (Brother / Sister)</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other Dependent</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Gender
              </label>
              <select
                value={depGender}
                onChange={(e) => setDepGender(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: '600' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Age (Years)
              </label>
              <input 
                type="number" 
                placeholder="e.g. 29"
                value={depAge} 
                onChange={(e) => setDepAge(e.target.value)} 
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Blood Group
              </label>
              <select
                value={depBloodGroup}
                onChange={(e) => setDepBloodGroup(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontWeight: '600' }}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Known Drug Allergies
            </label>
            <input 
              type="text" 
              placeholder="e.g. Penicillin, Sulfa, or None recorded"
              value={depAllergies} 
              onChange={(e) => setDepAllergies(e.target.value)} 
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Phone Number (Optional)
            </label>
            <input 
              type="tel" 
              placeholder="+91 98765 00000"
              value={depPhone} 
              onChange={(e) => setDepPhone(e.target.value)} 
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => setIsDepModalOpen(false)} 
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
            >
              {editingDepId ? 'Save Changes' : 'Register Dependent'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Update Account Password"
        maxWidth="440px"
      >
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {passwordError && (
            <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
              {passwordError}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="patient-curr-pass">Current Password</label>
            <input 
              id="patient-curr-pass"
              type="password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="patient-new-pass">New Password (Min. 6 chars)</label>
            <input 
              id="patient-new-pass"
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="patient-confirm-pass">Confirm New Password</label>
            <input 
              id="patient-confirm-pass"
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button 
              type="button" 
              onClick={() => setIsPasswordModalOpen(false)} 
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>

      {/* PRINTABLE EMERGENCY CARD MODAL */}
      <Modal
        isOpen={isEmergencyCardOpen}
        onClose={() => setIsEmergencyCardOpen(false)}
        title="Official Patient Emergency Card"
        maxWidth="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div 
            id="printable-emergency-card"
            style={{
              backgroundColor: 'var(--deep-teal)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid var(--primary-teal)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid rgba(255, 255, 255, 0.2)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', fontFamily: 'Fraunces, serif', margin: '0 0 2px 0' }}>
                  JIVAKA CLINIC
                </h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--mint)' }}>
                  EMERGENCY MEDICAL IDENTIFICATION CARD
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ backgroundColor: '#DC2626', color: '#ffffff', fontWeight: '800', fontSize: '0.85rem', padding: '3px 10px', borderRadius: '6px' }}>
                  {bloodGroup}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.84rem' }}>
              <div>
                <div style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Patient Name</div>
                <strong style={{ fontSize: '0.95rem' }}>{name || 'Patient'}</strong>
                <div style={{ color: 'var(--mint)', fontSize: '0.74rem' }}>ID: {patient.id || 'P-1001'}</div>
              </div>
              <div>
                <div style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>Primary Phone</div>
                <strong>{phone}</strong>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', padding: '8px 12px' }}>
              <div style={{ fontSize: '0.7rem', color: '#FECACA', fontWeight: '700' }}>CRITICAL ALLERGY ALERT</div>
              <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#ffffff' }}>
                {allergies || 'None documented'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '10px' }}>
              <div>
                <div style={{ color: '#cbd5e1', fontSize: '0.7rem' }}>Emergency Contact</div>
                <strong>{emergencyContact || 'Emergency Contact (+91 98765 43210)'}</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--mint)' }}>({emergencyRelation})</div>
              </div>
              <div>
                <div style={{ color: '#cbd5e1', fontSize: '0.7rem' }}>Clinic 24/7 Helpline</div>
                <strong>{clinic.branches[0]?.emergency || clinic.branches[0]?.phone}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={() => setIsEmergencyCardOpen(false)} 
              className="btn btn-secondary"
            >
              Close
            </button>
            <button 
              type="button" 
              onClick={() => window.print()} 
              className="btn btn-primary"
            >
              <Printer size={16} /> Print Card
            </button>
          </div>

        </div>
      </Modal>

    </div>
  );
};

export default PatientProfile;
