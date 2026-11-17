// Jivaka Clinic Central Mock Data Store & Persistence Service

const STORAGE_KEYS = {
  DOCTORS: 'aegis_doctors',
  PATIENTS: 'aegis_patients',
  APPOINTMENTS: 'aegis_appointments',
  MEDICAL_RECORDS: 'aegis_medical_records',
  CLINIC_INFO: 'aegis_clinic_info',
  AUDIT_LOGS: 'aegis_audit_logs',
  SESSION: 'aegis_user_session',
  LAST_ROLE: 'aegis_last_role_tab'
};

const INITIAL_DOCTORS = [
  {
    id: 'DOC-101',
    name: 'Dr. Ananya Sharma',
    title: 'MD, DM (Cardiology), FACC - Senior Consultant Cardiologist',
    specialization: 'Cardiology',
    qualifications: 'MD, DM (AIIMS New Delhi), Fellowship in Interventional Cardiology',
    experience: '14 Years',
    room: 'Room 204 (2nd Floor)',
    fee: 1200,
    rating: 4.9,
    reviewsCount: 128,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    bio: 'Specializing in preventive cardiology, echocardiography, and complex coronary artery management. Dedicated to patient-centric cardiovascular wellness.',
    hours: 'Mon - Fri: 8:30 AM - 4:30 PM',
    availableSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'],
    isHoliday: false
  },
  {
    id: 'DOC-102',
    name: 'Dr. Rohan Mehta',
    title: 'MD (Pediatrics), DCH, FAAP - Senior Pediatric Specialist',
    specialization: 'Pediatrics',
    qualifications: 'MD (PGIMER Chandigarh), Pediatric Medicine Board Certified',
    experience: '9 Years',
    room: 'Room 108 (1st Floor)',
    fee: 800,
    rating: 4.85,
    reviewsCount: 94,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    bio: 'Compassionate pediatric healthcare provider focusing on childhood development, immunization schedules, and acute adolescent care.',
    hours: 'Mon - Sat: 9:00 AM - 3:00 PM',
    availableSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '02:30 PM'],
    isHoliday: false
  },
  {
    id: 'DOC-103',
    name: 'Dr. Meera Krishnan',
    title: 'MD, DM (Neurology) - Consultant Neurologist',
    specialization: 'Neurology',
    qualifications: 'MD, DM (NIMHANS Bengaluru), Neurovascular Specialist',
    experience: '16 Years',
    room: 'Room 312 (3rd Floor)',
    fee: 1400,
    rating: 4.96,
    reviewsCount: 156,
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a99478f244?auto=format&fit=crop&q=80&w=300',
    bio: 'Expert diagnosis and therapeutic management of headaches, neuropathy, spine disorders, and neurovascular conditions.',
    hours: 'Tue - Fri: 10:00 AM - 5:00 PM',
    availableSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM'],
    isHoliday: false
  },
  {
    id: 'DOC-104',
    name: 'Dr. Vikram Malhotra',
    title: 'MS (Ortho), MCh - Senior Orthopedic Surgeon',
    specialization: 'Orthopedics',
    qualifications: 'MS (CMC Vellore), Sports Medicine & Joint Reconstruction Fellow',
    experience: '11 Years',
    room: 'Room 105 (1st Floor)',
    fee: 950,
    rating: 4.78,
    reviewsCount: 82,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    bio: 'Focused on joint reconstruction, sports injury rehabilitation, and non-surgical pain management for active adults.',
    hours: 'Mon - Thu: 8:00 AM - 3:30 PM',
    availableSlots: ['08:30 AM', '10:00 AM', '01:00 PM', '02:30 PM'],
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
      bloodPressure: '135/88 mmHg',
      heartRate: '78 bpm',
      bmi: '27.2 (Overweight)',
      spO2: '96%',
      temperature: '98.8 °F',
      weight: '86 kg'
    }
  }
];

// Today's Date formatted YYYY-MM-DD
export const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-801',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Ananya Sharma',
    patientId: 'P-1001',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98765 12345',
    date: getTodayStr(0),
    time: '09:00 AM',
    room: 'Room 204 (2nd Floor)',
    status: 'confirmed',
    visitReason: 'Routine Cardiovascular Follow-up & ECG Check',
    notes: 'Patient reported slight dizziness during heavy exertion. Needs BP review.',
    checkedIn: false
  },
  {
    id: 'APT-802',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Ananya Sharma',
    patientId: 'P-1002',
    patientName: 'Ananya Iyer',
    patientPhone: '+91 98765 23456',
    date: getTodayStr(0),
    time: '11:30 AM',
    room: 'Room 204 (2nd Floor)',
    status: 'pending',
    visitReason: 'Chest Tightness Consultation',
    notes: 'First time visit.',
    checkedIn: false
  },
  {
    id: 'APT-803',
    doctorId: 'DOC-102',
    doctorName: 'Dr. Rohan Mehta',
    patientId: 'P-1003',
    patientName: 'Suresh Verma',
    patientPhone: '+91 98765 34567',
    date: getTodayStr(1),
    time: '09:30 AM',
    room: 'Room 108 (1st Floor)',
    status: 'confirmed',
    visitReason: 'Annual Pediatric & Family Wellness Check',
    notes: 'Bring vaccination records.',
    checkedIn: false
  },
  {
    id: 'APT-799',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Ananya Sharma',
    patientId: 'P-1001',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98765 12345',
    date: getTodayStr(-7),
    time: '10:00 AM',
    room: 'Room 204 (2nd Floor)',
    status: 'completed',
    visitReason: 'Hypertension Screening',
    notes: 'Prescribed Lisinopril 10mg daily. Re-check in 1 week.',
    checkedIn: true
  }
];

const INITIAL_MEDICAL_RECORDS = {
  'P-1001': {
    patientId: 'P-1001',
    lastViewedBy: 'Dr. Ananya Sharma (DOC-101)',
    lastViewedTime: '2026-09-23 09:14 AM',
    notesPublic: 'Patient is maintaining healthy low-sodium diet. Continue current medication regimen.',
    notesPrivate: 'Patient inquired about strenuous athletic conditioning. Advised baseline stress test first.',
    visitTimeline: [
      {
        id: 'VT-101',
        date: '2026-09-16',
        doctorName: 'Dr. Ananya Sharma',
        diagnosis: 'I10 - Essential Primary Hypertension',
        summary: 'Elevated systolic blood pressure noted during routine check-up.',
        prescription: [
          { medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily after breakfast', duration: '30 Days' },
          { medication: 'Aspirin (Low Dose)', dosage: '81mg', frequency: 'Once daily with meal', duration: '30 Days' }
        ]
      },
      {
        id: 'VT-98',
        date: '2026-05-10',
        doctorName: 'Dr. Vikram Malhotra',
        diagnosis: 'M25.561 - Pain in Right Knee',
        summary: 'Mild patellar tendon strain post-marathon training.',
        prescription: [
          { medication: 'Ibuprofen', dosage: '400mg', frequency: 'As needed for joint pain (Max 3x/day)', duration: '10 Days' }
        ]
      }
    ],
    labReports: [
      {
        id: 'LAB-409',
        title: 'Comprehensive Lipid Panel',
        date: '2026-09-15',
        issuedBy: 'Jivaka Central Diagnostic Pathology Lab',
        summary: 'Total Cholesterol: 192 mg/dL, HDL: 54 mg/dL, LDL: 118 mg/dL, Triglycerides: 110 mg/dL.',
        fileType: 'PDF',
        fileSize: '1.4 MB'
      },
      {
        id: 'LAB-388',
        title: '12-Lead Electrocardiogram (ECG)',
        date: '2026-09-16',
        issuedBy: 'Jivaka Diagnostic Unit',
        summary: 'Normal sinus rhythm at 72 bpm. No ST-segment elevation or ischmic shifts.',
        fileType: 'PDF',
        fileSize: '2.8 MB'
      }
    ]
  },
  'P-1002': {
    patientId: 'P-1002',
    lastViewedBy: 'Dr. Rohan Mehta (DOC-102)',
    lastViewedTime: '2026-09-22 04:30 PM',
    notesPublic: 'Routine baseline vitals documented. All systems normal.',
    notesPrivate: 'Patient requested allergen screening for seasonal rhinitis.',
    visitTimeline: [
      {
        id: 'VT-88',
        date: '2026-04-12',
        doctorName: 'Dr. Rohan Mehta',
        diagnosis: 'J30.1 - Allergic Rhinitis due to Pollen',
        summary: 'Mild seasonal nasal congestion.',
        prescription: [
          { medication: 'Cetirizine (Zyrtec)', dosage: '10mg', frequency: 'Once daily at bedtime', duration: '14 Days' }
        ]
      }
    ],
    labReports: [
      {
        id: 'LAB-290',
        title: 'Complete Blood Count (CBC) with Differential',
        date: '2026-04-12',
        issuedBy: 'Jivaka Diagnostic Unit',
        summary: 'WBC, RBC, Hemoglobin and Platelets within standard reference parameters.',
        fileType: 'PDF',
        fileSize: '950 KB'
      }
    ]
  },
  'P-1003': {
    patientId: 'P-1003',
    lastViewedBy: 'Dr. Meera Krishnan (DOC-103)',
    lastViewedTime: '2026-09-20 11:00 AM',
    notesPublic: 'Blood glucose level check recommended before next quarterly review.',
    notesPrivate: 'Patient displays mild lumbar spine stiffness.',
    visitTimeline: [],
    labReports: []
  }
};

const INITIAL_CLINIC_INFO = {
  name: 'Jivaka Clinic',
  tagline: 'Connected Clinical Excellence, Trusted Specialists, Elevated Care',
  phone: '[Phone number]',
  email: 'care@jivakaclinic.org',
  address: '450 Health Sciences Parkway, Suite 200, Metro Health District',
  operatingHours: {
    weekdays: '8:00 AM - 8:00 PM',
    saturday: '9:00 AM - 4:00 PM',
    sunday: 'Closed for Emergency Services Only'
  },
  activeAnnouncement: '📢 Annual Flu & Booster Vaccination Drive open this Saturday! Walk-ins welcome for registered Jivaka Clinic patients.',
  checkInNotice: '📌 Please present a valid photo ID at Room 101 reception counter 10 minutes prior to your appointment time.'
};

// Helper to initialize LocalStorage if empty
export const initializeStore = () => {
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
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([
      { id: 'LOG-1', timestamp: '2026-09-23 09:14 AM', doctorId: 'DOC-101', action: 'Accessed Patient Record P-1001 (Aarav Sharma)' }
    ]));
  }
};

// Accessors & Mutators
export const getDoctors = () => {
  initializeStore();
  const raw = localStorage.getItem(STORAGE_KEYS.DOCTORS);
  if (!raw) return INITIAL_DOCTORS;
  try {
    const docs = JSON.parse(raw);
    let changed = false;
    docs.forEach(d => {
      if (d.name === 'Dr. Sarah Jenkins') { d.name = 'Dr. Ananya Sharma'; d.title = 'MD, DM (Cardiology), FACC - Senior Consultant Cardiologist'; d.qualifications = 'MD, DM (AIIMS New Delhi)'; changed = true; }
      if (d.name === 'Dr. Marcus Vance') { d.name = 'Dr. Rohan Mehta'; d.title = 'MD (Pediatrics), DCH, FAAP - Senior Pediatric Specialist'; d.qualifications = 'MD (PGIMER Chandigarh)'; changed = true; }
      if (d.name === 'Dr. Elena Rostova') { d.name = 'Dr. Meera Krishnan'; d.title = 'MD, DM (Neurology) - Consultant Neurologist'; d.qualifications = 'MD, DM (NIMHANS Bengaluru)'; changed = true; }
      if (d.name === 'Dr. Aris Thorne') { d.name = 'Dr. Vikram Malhotra'; d.title = 'MS (Ortho), MCh - Senior Orthopedic Surgeon'; d.qualifications = 'MS (CMC Vellore)'; changed = true; }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(docs));
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
  if (!raw) return [];
  try {
    const patients = JSON.parse(raw);
    let changed = false;
    patients.forEach(p => {
      if (p.name && (p.name.includes('Dr.') || p.name.includes('Google User') || p.name === 'John Doe')) {
        p.name = 'Rahul Sharma';
        changed = true;
      }
      if (p.id === 'P-1002' && p.name === 'Emma Watson') {
        p.name = 'Ananya Iyer';
        changed = true;
      }
      if (p.id === 'P-1003' && p.name === 'Robert Vance') {
        p.name = 'Suresh Verma';
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    }
    return patients;
  } catch (e) {
    return [];
  }
};

export const getAppointments = () => {
  initializeStore();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS));
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
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS));
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
const getDependentsKey = (patientId) => `aegis_dependents_${patientId || 'default'}`;

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
  const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) || [];
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
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS));
};

export const getClinicInfo = () => {
  initializeStore();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLINIC_INFO));
};

export const getSavedSession = () => {
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
  return localStorage.getItem(STORAGE_KEYS.LAST_ROLE) || 'patient';
};

export const saveLastRoleTab = (role) => {
  localStorage.setItem(STORAGE_KEYS.LAST_ROLE, role);
};
