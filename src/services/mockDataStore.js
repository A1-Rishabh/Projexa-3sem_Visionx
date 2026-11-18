// Jeevak Clinic (जीवक क्लीनिक, Estd. 2003) Central Data Store & Persistence Service

const STORE_VERSION = 'jeevak_data_v2003';
const STORE_VERSION_KEY = 'jeevak_store_version';

const STORAGE_KEYS = {
  DOCTORS: 'jeevak_doctors',
  PATIENTS: 'jeevak_patients',
  APPOINTMENTS: 'jeevak_appointments',
  MEDICAL_RECORDS: 'jeevak_medical_records',
  CLINIC_INFO: 'jeevak_clinic_info',
  AUDIT_LOGS: 'jeevak_audit_logs',
  SESSION: 'jeevak_user_session',
  LAST_ROLE: 'jeevak_last_role_tab'
};

// Today's Date formatted YYYY-MM-DD
export const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

/**
 * Authentic Doctor Roster extracted strictly from official Jeevak Clinic prescription pad & stamps:
 * 1. Dr. Shuchi Shivangi - General Practitioner (DMC Reg. 125003)
 * 2. Dr. (Mrs.) Indu Kumari - Consultant Gynecologist & Obstetrician
 * 3. Dr. Surendra Kumar - Senior General & Laparoscopic Surgeon
 * Consultation Fee: Uniform ₹500 across all 3 doctors.
 */
const INITIAL_DOCTORS = [
  {
    id: 'DOC-101',
    name: 'Dr. Shuchi Shivangi',
    hindiName: 'डॉ शुचि शिवांगी',
    title: 'MBBS (Hons), S.I.U. (Pune) • DMC Reg. 125003',
    specialization: 'General Medicine & Family Practice',
    subSpecialty: 'General Practitioner (जनरल प्रैक्टिशनर)',
    qualifications: 'MBBS (Hons), S.I.U. (Pune), DMC Reg. 125003',
    experience: 'General Practitioner',
    room: 'Suite 1 (Chamber 1)',
    fee: 500,
    rating: 4.9,
    reviewsCount: 48,
    avatar: '',
    bio: 'Consultant General Practitioner with dedicated clinical expertise in adult outpatient evaluations, fever management, diabetes, hypertension, and primary healthcare.',
    hours: 'Mon - Sat (Fri M only): 11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM',
    availableSlots: ['11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'],
    isHoliday: false
  },
  {
    id: 'DOC-102',
    name: 'Dr. (Mrs.) Indu Kumari',
    hindiName: 'डॉ (श्रीमती) इंदु कुमारी',
    title: 'MBBS (L.N.M.U, DAR) • Consultant Gynecologist & Obstetrician',
    specialization: 'Obstetrics & Gynecology',
    subSpecialty: 'Consultant Gynecologist (स्त्री रोग विशेषज्ञ)',
    qualifications: 'MBBS (L.N.M.U, DAR)',
    experience: 'Senior Consultant',
    room: 'Suite 2 (Chamber 2)',
    fee: 500,
    rating: 4.95,
    reviewsCount: 64,
    avatar: '',
    bio: 'Senior Consultant Gynecologist & Obstetrician specializing in women’s reproductive health, antenatal care, maternal wellness, and comprehensive gynecological treatments.',
    hours: 'Mon - Sat (Fri M only): 11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM',
    availableSlots: ['11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'],
    isHoliday: false
  },
  {
    id: 'DOC-103',
    name: 'Dr. Surendra Kumar',
    hindiName: 'डॉ सुरेंद्र कुमार',
    title: 'MBBS (Hons.) B.U., M.S. (General Surgery) Patna • General & Laparoscopic Surgeon',
    specialization: 'General & Laparoscopic Surgery',
    subSpecialty: 'Senior Surgeon (जनरल व लेप्रोस्कोपिक सर्जन)',
    qualifications: 'MBBS (Hons.) (B.U.), M.S. (General Surgery) Patna',
    experience: 'Senior Consultant Surgeon',
    room: 'Suite 3 (Chamber 3)',
    fee: 500,
    rating: 4.92,
    reviewsCount: 52,
    avatar: '',
    bio: 'Senior Consultant General & Laparoscopic Surgeon offering expert outpatient evaluations, surgical consultations, pre/post-operative care, and laparoscopic guidance.',
    hours: 'Mon - Sat (Fri M only): 11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM',
    availableSlots: ['11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'],
    isHoliday: false
  }
];

const INITIAL_PATIENTS = [
  {
    id: 'P-1001',
    email: 'patient@example.com',
    phone: '+91 98765 12345',
    name: 'Rahul Sharma',
    gender: 'Male',
    age: 38,
    bloodGroup: 'A+',
    allergies: 'Penicillin',
    emergencyContact: 'Priya Sharma (+91 98765 43210)',
    vitals: {
      bloodPressure: '120/80 mmHg',
      heartRate: '72 bpm',
      bmi: '23.5 (Normal)',
      spO2: '98%',
      temperature: '98.6 °F',
      weight: '74 kg'
    }
  },
  {
    id: 'P-1002',
    email: 'ananya.iyer@example.com',
    phone: '+91 98765 23456',
    name: 'Ananya Iyer',
    gender: 'Female',
    age: 29,
    bloodGroup: 'O+',
    allergies: 'Latex',
    emergencyContact: 'Murthy Iyer (+91 98765 33211)',
    vitals: {
      bloodPressure: '115/75 mmHg',
      heartRate: '68 bpm',
      bmi: '21.8 (Normal)',
      spO2: '99%',
      temperature: '98.4 °F',
      weight: '58 kg'
    }
  },
  {
    id: 'P-1003',
    email: 'suresh.verma@example.com',
    phone: '+91 98765 34567',
    name: 'Suresh Verma',
    gender: 'Male',
    age: 54,
    bloodGroup: 'B+',
    allergies: 'Sulfa Antibiotics',
    emergencyContact: 'Kavita Verma (+91 98765 22110)',
    vitals: {
      bloodPressure: '130/84 mmHg',
      heartRate: '74 bpm',
      bmi: '26.4 (Overweight)',
      spO2: '97%',
      temperature: '98.6 °F',
      weight: '82 kg'
    }
  }
];

const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-801',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Shuchi Shivangi',
    patientId: 'P-1001',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98765 12345',
    date: getTodayStr(0),
    time: '11:30 AM',
    room: 'Suite 1 (Chamber 1)',
    status: 'confirmed',
    visitReason: 'General Health OPD Consultation',
    notes: 'Routine health assessment and vitals review.',
    checkedIn: false
  },
  {
    id: 'APT-802',
    doctorId: 'DOC-102',
    doctorName: 'Dr. (Mrs.) Indu Kumari',
    patientId: 'P-1002',
    patientName: 'Ananya Iyer',
    patientPhone: '+91 98765 23456',
    date: getTodayStr(0),
    time: '12:00 PM',
    room: 'Suite 2 (Chamber 2)',
    status: 'pending',
    visitReason: 'Antenatal Consultation & Wellness Review',
    notes: 'First trimester follow-up check.',
    checkedIn: false
  },
  {
    id: 'APT-803',
    doctorId: 'DOC-103',
    doctorName: 'Dr. Surendra Kumar',
    patientId: 'P-1003',
    patientName: 'Suresh Verma',
    patientPhone: '+91 98765 34567',
    date: getTodayStr(1),
    time: '06:30 PM',
    room: 'Suite 3 (Chamber 3)',
    status: 'confirmed',
    visitReason: 'Surgical OPD Evaluation',
    notes: 'Abdominal pain evaluation.',
    checkedIn: false
  },
  {
    id: 'APT-799',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Shuchi Shivangi',
    patientId: 'P-1001',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98765 12345',
    date: getTodayStr(-7),
    time: '12:00 PM',
    room: 'Suite 1 (Chamber 1)',
    status: 'completed',
    visitReason: 'Blood Pressure Screening',
    notes: 'Prescribed lifestyle adjustments and follow-up.',
    checkedIn: true
  }
];

const INITIAL_MEDICAL_RECORDS = {
  'P-1001': {
    patientId: 'P-1001',
    lastViewedBy: 'Dr. Shuchi Shivangi (DOC-101)',
    lastViewedTime: 'Today, 11:30 AM',
    notesPublic: 'Patient is maintaining a balanced low-sodium diet and daily exercise regimen.',
    notesPrivate: 'Blood pressure stable. Continue routine monitoring.',
    visitTimeline: [
      {
        id: 'VT-101',
        date: getTodayStr(-7),
        doctorName: 'Dr. Shuchi Shivangi',
        diagnosis: 'Routine OPD Examination & Blood Pressure Check',
        summary: 'Normal baseline checkup. Encouraged adequate hydration and sleep.',
        prescription: [
          { medication: 'Paracetamol', dosage: '500mg', frequency: 'SOS (as needed for fever/headache)', duration: '5 Days' },
          { medication: 'Multivitamin & Zinc', dosage: '1 Tab', frequency: 'Once daily after breakfast', duration: '30 Days' }
        ]
      }
    ],
    labReports: [
      {
        id: 'LAB-409',
        title: 'Routine Blood Panel & Hemogram',
        date: getTodayStr(-10),
        issuedBy: 'Jeevak Clinic Diagnostics',
        summary: 'Hemoglobin: 14.2 g/dL, Total WBC: 7,400 /mcL, Platelets: 2.4 Lakh. Parameters within normal range.',
        fileType: 'PDF',
        fileSize: '1.2 MB'
      }
    ]
  },
  'P-1002': {
    patientId: 'P-1002',
    lastViewedBy: 'Dr. (Mrs.) Indu Kumari (DOC-102)',
    lastViewedTime: 'Yesterday, 12:15 PM',
    notesPublic: 'Routine prenatal screening and maternal vitals in healthy reference range.',
    notesPrivate: 'Patient advised to continue iron and calcium supplementation.',
    visitTimeline: [
      {
        id: 'VT-88',
        date: getTodayStr(-14),
        doctorName: 'Dr. (Mrs.) Indu Kumari',
        diagnosis: 'Routine Antenatal Assessment',
        summary: 'Fetal growth appropriate for gestational age. Maternal blood pressure normal.',
        prescription: [
          { medication: 'Ferrous Ascorbate + Folic Acid', dosage: '1 Tab', frequency: 'Once daily after meals', duration: '30 Days' },
          { medication: 'Calcium Carbonate + Vit D3', dosage: '500mg', frequency: 'Once daily after dinner', duration: '30 Days' }
        ]
      }
    ],
    labReports: [
      {
        id: 'LAB-290',
        title: 'Antenatal Screen & Routine Urine Exam',
        date: getTodayStr(-14),
        issuedBy: 'Jeevak Clinic Diagnostics',
        summary: 'All parameters normal. Nil albumin, nil sugar.',
        fileType: 'PDF',
        fileSize: '950 KB'
      }
    ]
  },
  'P-1003': {
    patientId: 'P-1003',
    lastViewedBy: 'Dr. Surendra Kumar (DOC-103)',
    lastViewedTime: '2 days ago',
    notesPublic: 'Surgical recovery review satisfactory.',
    notesPrivate: 'Patient advised to avoid lifting heavy weights for 2 weeks.',
    visitTimeline: [],
    labReports: []
  }
};

const INITIAL_CLINIC_INFO = {
  name: 'Jeevak Clinic',
  hindiName: 'जीवक क्लीनिक',
  tagline: 'Quality Healthcare & In-Clinic Specialists Since 2003',
  phone: '011 45680306',
  email: 'jeevak.clinic03@gmail.com',
  address: 'C-04, Shakti Vihar, Gali No.-6, off School Road, Meethapur, Badarpur, New Delhi-110044',
  operatingHours: {
    morning: '11:30 AM - 2:00 PM',
    evening: '6:30 PM - 8:30 PM (Friday Evening Closed)',
    sunday: 'Closed'
  },
  empanelment: 'On Panel: LIC & Cabinet Secretariat',
  disclaimer: 'You are free to take second opinion. Not valid for Medicolegal Purpose.',
  activeAnnouncement: '📢 Jeevak Clinic operates regular OPD: 11:30 AM - 2:00 PM & 6:30 PM - 8:30 PM (Mon-Sat). Friday evening OPD closed. Sundays closed.',
  checkInNotice: '📌 In-clinic consultation: Please arrive 10 minutes prior to your slot time at C-04, Shakti Vihar, Meethapur.'
};

// Helper to initialize LocalStorage with migration check
export const initializeStore = () => {
  if (typeof window === 'undefined') return;

  const currentVersion = localStorage.getItem(STORE_VERSION_KEY);
  if (currentVersion !== STORE_VERSION) {
    // Reset/migrate store to authentic Jeevak Clinic data
    localStorage.setItem(STORE_VERSION_KEY, STORE_VERSION);
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(INITIAL_MEDICAL_RECORDS));
    localStorage.setItem(STORAGE_KEYS.CLINIC_INFO, JSON.stringify(INITIAL_CLINIC_INFO));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([
      { id: 'LOG-1', timestamp: new Date().toLocaleDateString('en-GB'), doctorId: 'DOC-101', action: 'System initialized with authentic Jeevak Clinic roster' }
    ]));
    return;
  }

  // Graceful initialization if keys missing
  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(INITIAL_MEDICAL_RECORDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLINIC_INFO)) {
    localStorage.setItem(STORAGE_KEYS.CLINIC_INFO, JSON.stringify(INITIAL_CLINIC_INFO));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
  }
};

// Accessors & Mutators
export const getDoctors = () => {
  initializeStore();
  const raw = localStorage.getItem(STORAGE_KEYS.DOCTORS);
  if (!raw) return INITIAL_DOCTORS;
  try {
    const docs = JSON.parse(raw);
    // Sanity check: Ensure authentic doctors are present
    if (!Array.isArray(docs) || docs.length === 0 || !docs.some(d => d.name?.includes('Shuchi') || d.name?.includes('Surendra'))) {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
      return INITIAL_DOCTORS;
    }
    return docs;
  } catch (e) {
    return INITIAL_DOCTORS;
  }
};

export const updateDoctorProfile = (doctorId, updatedData) => {
  const doctors = getDoctors();
  const index = doctors.findIndex(d => d.id === doctorId);
  if (index !== -1) {
    doctors[index] = { ...doctors[index], ...updatedData };
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  }
  return doctors;
};

export const getPatients = () => {
  initializeStore();
  const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  if (!raw) return INITIAL_PATIENTS;
  try {
    const patients = JSON.parse(raw);
    let changed = false;
    patients.forEach(p => {
      if (p.name && (p.name.includes('Dr.') || p.name.includes('Google User') || p.name === 'John Doe')) {
        p.name = 'Rahul Sharma';
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    }
    return patients;
  } catch (e) {
    return INITIAL_PATIENTS;
  }
};

export const getAppointments = () => {
  initializeStore();
  const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  if (!raw) return INITIAL_APPOINTMENTS;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_APPOINTMENTS;
  }
};

export const saveAppointment = (appointmentData) => {
  const appointments = getAppointments();
  const newAppointment = {
    id: `APT-${Math.floor(100 + Math.random() * 900)}`,
    status: 'pending',
    checkedIn: false,
    ...appointmentData
  };
  appointments.unshift(newAppointment);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  return newAppointment;
};

export const updateAppointmentStatus = (aptId, newStatus, extraData = {}) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === aptId);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], status: newStatus, ...extraData };
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }
  return appointments;
};

export const checkInPatient = (aptId) => {
  return updateAppointmentStatus(aptId, 'confirmed', { checkedIn: true });
};

export const getMedicalRecords = () => {
  initializeStore();
  const raw = localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS);
  if (!raw) return INITIAL_MEDICAL_RECORDS;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_MEDICAL_RECORDS;
  }
};

export const updatePatientRecord = (patientId, recordData, doctorId, doctorName = 'Attending Doctor') => {
  const records = getMedicalRecords();
  const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
  
  if (!records[patientId]) {
    records[patientId] = {
      patientId,
      visitTimeline: [],
      labReports: [],
      notesPublic: '',
      notesPrivate: ''
    };
  }

  records[patientId] = {
    ...records[patientId],
    ...recordData,
    lastViewedBy: doctorName ? `Dr. ${doctorName.replace(/^Dr\.\s*/, '')} (${doctorId})` : `Doctor ${doctorId}`,
    lastViewedTime: timestamp
  };

  localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(records));
  
  // Log Audit Entry
  logAuditEntry(doctorId, `Updated medical record & clinical notes for Patient ${patientId}`);
  
  return records[patientId];
};

export const updatePatientVitals = (patientId, vitalsData, doctorId, doctorName = 'Doctor') => {
  initializeStore();
  const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  
  const formattedVitals = {
    ...vitalsData,
    recordedDate: vitalsData.recordedDate || timestamp,
    recordedBy: doctorName ? `Dr. ${doctorName.replace(/^Dr\.\s*/, '')}` : `Doctor ${doctorId}`,
    lastExamType: vitalsData.lastExamType || 'In-Clinic OPD Examination'
  };

  // 1. Update in patients list
  const patients = getPatients();
  const pIndex = patients.findIndex(p => p.id === patientId);
  if (pIndex !== -1) {
    patients[pIndex].vitals = formattedVitals;
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }

  // 2. Update in medical records
  const records = getMedicalRecords();
  if (!records[patientId]) {
    records[patientId] = {
      patientId,
      visitTimeline: [],
      labReports: [],
      notesPublic: '',
      notesPrivate: ''
    };
  }
  records[patientId].vitals = formattedVitals;
  records[patientId].lastViewedBy = `Dr. ${doctorName.replace(/^Dr\.\s*/, '')} (${doctorId})`;
  records[patientId].lastViewedTime = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
  localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(records));

  // 3. Update session if currently logged in patient
  const session = getSavedSession();
  if (session?.user && session.user.id === patientId) {
    session.user.vitals = formattedVitals;
    saveSession(session);
  }

  // Audit log
  logAuditEntry(doctorId, `Recorded clinical examination vitals for Patient ${patientId}: BP ${formattedVitals.bloodPressure || '--'}, HR ${formattedVitals.heartRate || '--'}`);

  return formattedVitals;
};

export const addPatientVisit = (patientId, visitData, doctorId, doctorName = 'Doctor') => {
  initializeStore();
  const records = getMedicalRecords();
  if (!records[patientId]) {
    records[patientId] = {
      patientId,
      visitTimeline: [],
      labReports: [],
      notesPublic: '',
      notesPrivate: ''
    };
  }

  const newVisit = {
    id: `VT-${Math.floor(100 + Math.random() * 900)}`,
    date: visitData.date || new Date().toISOString().split('T')[0],
    doctorName: doctorName ? `Dr. ${doctorName.replace(/^Dr\.\s*/, '')}` : `Doctor ${doctorId}`,
    doctorId,
    diagnosis: visitData.diagnosis || 'Clinical OPD Consultation',
    summary: visitData.summary || 'Routine physical assessment and consultation.',
    prescription: visitData.prescription || []
  };

  records[patientId].visitTimeline = [newVisit, ...(records[patientId].visitTimeline || [])];
  records[patientId].lastViewedBy = `Dr. ${doctorName.replace(/^Dr\.\s*/, '')} (${doctorId})`;
  records[patientId].lastViewedTime = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

  localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(records));

  // Log Audit Entry
  logAuditEntry(doctorId, `Documented new clinical consultation & prescription for Patient ${patientId}: ${newVisit.diagnosis}`);

  return newVisit;
};

// Family / Dependents Storage Service (User-managed, zero hardcoded dependents)
const getDependentsKey = (patientId) => `jeevak_dependents_${patientId || 'default'}`;

export const getDependents = (patientId) => {
  if (!patientId) return [];
  const raw = localStorage.getItem(getDependentsKey(patientId));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveDependents = (patientId, dependents) => {
  if (!patientId) return;
  localStorage.setItem(getDependentsKey(patientId), JSON.stringify(dependents));
};

export const addDependent = (patientId, dependentData) => {
  const list = getDependents(patientId);
  const newDependent = {
    id: `DEP-${Date.now().toString(36).toUpperCase()}`,
    name: dependentData.name,
    relation: dependentData.relation || 'Family Member',
    bloodGroup: dependentData.bloodGroup || 'Not Specified',
    allergies: dependentData.allergies || 'None recorded',
    dob: dependentData.dob || '',
    age: dependentData.age || '',
    gender: dependentData.gender || 'Not specified',
    phone: dependentData.phone || '',
    createdAt: new Date().toISOString()
  };
  const updated = [...list, newDependent];
  saveDependents(patientId, updated);
  return newDependent;
};

export const updateDependent = (patientId, depId, updatedData) => {
  const list = getDependents(patientId);
  const updated = list.map(item => item.id === depId ? { ...item, ...updatedData } : item);
  saveDependents(patientId, updated);
  return updated;
};

export const deleteDependent = (patientId, depId) => {
  const list = getDependents(patientId);
  const updated = list.filter(item => item.id !== depId);
  saveDependents(patientId, updated);
  return updated;
};

export const logAuditEntry = (doctorId, action) => {
  initializeStore();
  const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
  const logs = raw ? JSON.parse(raw) : [];
  const newLog = {
    id: `LOG-${logs.length + 1}`,
    timestamp: new Date().toLocaleString(),
    doctorId,
    action
  };
  logs.unshift(newLog);
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  return logs;
};

export const getAuditLogs = () => {
  initializeStore();
  const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
  return raw ? JSON.parse(raw) : [];
};

export const getClinicInfo = () => {
  initializeStore();
  const raw = localStorage.getItem(STORAGE_KEYS.CLINIC_INFO);
  return raw ? JSON.parse(raw) : INITIAL_CLINIC_INFO;
};

export const getSavedSession = () => {
  if (typeof window === 'undefined') return null;
  const s = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!s) return null;
  try {
    const session = JSON.parse(s);
    if (session?.user?.name) {
      if (session.user.name.includes('Dr.') || session.user.name.includes('Google User') || session.user.name === 'John Doe') {
        session.user.name = 'Rahul Sharma';
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      }
    }
    return session;
  } catch (e) {
    return null;
  }
};

export const saveSession = (sessionData) => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const getLastRoleTab = () => {
  if (typeof window === 'undefined') return 'patient';
  return localStorage.getItem(STORAGE_KEYS.LAST_ROLE) || 'patient';
};

export const saveLastRoleTab = (role) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LAST_ROLE, role);
};
