-- =====================================================================
-- JIVAKA CLINIC - DATABASE SAMPLE SEED DATA
-- Note: Every seeded row has `is_sample = true` so sample records 
-- can be identified, updated, or removed easily.
-- =====================================================================

-- 1. DEPARTMENTS (Sample Clinical Units)
insert into public.departments (id, name, description, icon, is_sample)
values
  ('gen-med', 'General Medicine', 'Comprehensive outpatient diagnostics, chronic condition management, and wellness checks.', 'Stethoscope', true),
  ('cardio', 'Cardiology', 'Preventive heart health screenings, hypertension therapy, ECG, and cardiovascular evaluations.', 'Heart', true),
  ('peds', 'Pediatrics', 'Child healthcare from infancy to adolescence, developmental assessments, and immunization schedules.', 'Users', true),
  ('neuro', 'Neurology', 'Consultations for neurological disorders, chronic headaches, sleep conditions, and nerve wellness.', 'Activity', true),
  ('diagnostics', 'Pathology & Diagnostics', 'Integrated digital pathology and biochemical blood panel diagnostics with fast turnaround.', 'FlaskConical', true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  is_sample = true;

-- 2. DOCTORS (Sample Physicians based on existing clinic profiles)
insert into public.doctors (
  id, 
  name, 
  email, 
  department_id, 
  specialization, 
  qualifications, 
  experience_years, 
  consultation_fee, 
  room_number, 
  bio, 
  avatar_url, 
  rating, 
  reviews_count, 
  is_sample
)
values
  (
    'DOC-101', 
    'Dr. Sarah Jenkins', 
    'dr.jenkins@sample.jivakaclinic.in', 
    'cardio', 
    'Cardiology', 
    'MD, FACC - Clinical Cardiology', 
    14, 
    1200, 
    'Chamber 204B', 
    'Consultant cardiologist specializing in preventive cardiovascular wellness, hypertension management, and non-invasive diagnostics.', 
    '/images/doctor-1.webp', 
    4.9, 
    128, 
    true
  ),
  (
    'DOC-102', 
    'Dr. Marcus Vance', 
    'dr.vance@sample.jivakaclinic.in', 
    'neuro', 
    'Neurology', 
    'MD, DM - Neuro-diagnostics', 
    16, 
    1400, 
    'Chamber 310A', 
    'Consultant neurologist with clinical expertise in chronic migraine management, neuro-rehabilitation, and sleep disorder assessments.', 
    '/images/doctor-2.webp', 
    4.8, 
    94, 
    true
  ),
  (
    'DOC-103', 
    'Dr. Priya Sharma', 
    'dr.sharma@sample.jivakaclinic.in', 
    'peds', 
    'Pediatrics', 
    'MD, DCH - Pediatric Medicine', 
    11, 
    900, 
    'Chamber 108C', 
    'Dedicated pediatrician focusing on developmental milestones, preventive pediatric immunology, and adolescent healthcare.', 
    '/images/doctor-3.webp', 
    4.9, 
    142, 
    true
  ),
  (
    'DOC-104', 
    'Dr. Aris Thorne', 
    'dr.thorne@sample.jivakaclinic.in', 
    'gen-med', 
    'General Medicine', 
    'MBBS, MD - Internal Medicine', 
    12, 
    800, 
    'Chamber 102A', 
    'Primary care physician dedicated to comprehensive outpatient diagnostics, geriatric wellness, and metabolic health monitoring.', 
    '/images/doctor-4.webp', 
    4.7, 
    115, 
    true
  )
on conflict (id) do update set
  name = excluded.name,
  department_id = excluded.department_id,
  specialization = excluded.specialization,
  qualifications = excluded.qualifications,
  experience_years = excluded.experience_years,
  consultation_fee = excluded.consultation_fee,
  room_number = excluded.room_number,
  bio = excluded.bio,
  avatar_url = excluded.avatar_url,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  is_sample = true;

-- 3. DOCTOR SCHEDULES (Sample OPD time windows)
insert into public.doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available, is_sample)
values
  -- Dr. Jenkins (Mon, Wed, Fri)
  ('DOC-101', 1, '09:00:00', '13:00:00', 30, true, true),
  ('DOC-101', 3, '09:00:00', '13:00:00', 30, true, true),
  ('DOC-101', 5, '14:00:00', '18:00:00', 30, true, true),
  -- Dr. Vance (Tue, Thu, Sat)
  ('DOC-102', 2, '10:00:00', '14:00:00', 30, true, true),
  ('DOC-102', 4, '10:00:00', '14:00:00', 30, true, true),
  ('DOC-102', 6, '09:00:00', '12:00:00', 30, true, true),
  -- Dr. Sharma (Mon through Fri Morning)
  ('DOC-103', 1, '08:30:00', '12:30:00', 30, true, true),
  ('DOC-103', 2, '08:30:00', '12:30:00', 30, true, true),
  ('DOC-103', 3, '08:30:00', '12:30:00', 30, true, true),
  ('DOC-103', 4, '08:30:00', '12:30:00', 30, true, true),
  ('DOC-103', 5, '08:30:00', '12:30:00', 30, true, true),
  -- Dr. Thorne (Mon through Sat Full OPD)
  ('DOC-104', 1, '09:00:00', '17:00:00', 30, true, true),
  ('DOC-104', 2, '09:00:00', '17:00:00', 30, true, true),
  ('DOC-104', 3, '09:00:00', '17:00:00', 30, true, true),
  ('DOC-104', 4, '09:00:00', '17:00:00', 30, true, true),
  ('DOC-104', 5, '09:00:00', '17:00:00', 30, true, true),
  ('DOC-104', 6, '09:00:00', '13:00:00', 30, true, true);

