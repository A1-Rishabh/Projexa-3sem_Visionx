-- =====================================================================
-- JIVAKA CLINIC - DATABASE SCHEMA
-- PostgreSQL schema for Supabase with Row Level Security (RLS)
-- =====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS & DOMAINS
do $$ begin
  create type user_role as enum ('patient', 'doctor', 'staff', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type payment_status as enum ('pending', 'paid', 'pay_at_clinic');
exception
  when duplicate_object then null;
end $$;

-- 3. PROFILES TABLE (Linked directly to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role user_role default 'patient' not null,
  full_name text,
  email text,
  phone text,
  date_of_birth date,
  gender text,
  blood_group text,
  allergies text,
  emergency_contact_name text,
  emergency_contact_phone text,
  is_sample boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. DEPARTMENTS TABLE (Publicly visible directory)
create table if not exists public.departments (
  id text primary key,
  name text not null,
  description text,
  icon text,
  is_sample boolean default false not null,
  created_at timestamptz default now() not null
);

-- 5. DOCTORS TABLE (Publicly visible directory)
create table if not exists public.doctors (
  id text primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text,
  department_id text references public.departments(id) on delete set null,
  specialization text not null,
  qualifications text,
  experience_years int default 5,
  consultation_fee numeric not null, -- INR currency
  room_number text not null,
  bio text,
  avatar_url text,
  rating numeric default 4.9,
  reviews_count int default 0,
  is_sample boolean default false not null,
  created_at timestamptz default now() not null
);

-- 6. DOCTOR SCHEDULES TABLE (OPD Available Slots)
create table if not exists public.doctor_schedules (
  id uuid default gen_random_uuid() primary key,
  doctor_id text references public.doctors(id) on delete cascade not null,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0=Sun, 1=Mon, ..., 6=Sat
  start_time time not null,
  end_time time not null,
  slot_duration_minutes int default 30,
  is_available boolean default true not null,
  is_sample boolean default false not null,
  created_at timestamptz default now() not null
);

-- 7. APPOINTMENTS TABLE
create table if not exists public.appointments (
  id text primary key,
  patient_id uuid references public.profiles(id) on delete cascade not null,
  doctor_id text references public.doctors(id) on delete cascade not null,
  doctor_name text not null,
  date date not null,
  time text not null,
  room text not null,
  visit_reason text not null,
  status appointment_status default 'pending' not null,
  payment_status payment_status default 'pay_at_clinic' not null,
  payment_method text default 'Pay at clinic',
  fee numeric not null, -- INR currency
  check_in_code text,
  cancel_reason text,
  pre_visit_intake jsonb,
  is_sample boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 8. MEDICAL RECORDS & VISITS TABLE
create table if not exists public.medical_records (
  id text primary key,
  patient_id uuid references public.profiles(id) on delete cascade not null,
  doctor_id text references public.doctors(id) on delete set null,
  doctor_name text not null,
  date date not null,
  diagnosis text not null,
  clinical_summary text,
  prescriptions jsonb default '[]'::jsonb,
  vitals jsonb default '{}'::jsonb,
  is_sample boolean default false not null,
  created_at timestamptz default now() not null
);

-- 9. LAB REPORTS TABLE
create table if not exists public.lab_reports (
  id text primary key,
  patient_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  issued_by text not null,
  date date not null,
  file_url text,
  file_type text default 'PDF',
  file_size text,
  summary text,
  is_sample boolean default false not null,
  created_at timestamptz default now() not null
);

-- 10. CARE MESSAGES TABLE
create table if not exists public.care_messages (
  id text primary key,
  patient_id uuid references public.profiles(id) on delete cascade not null,
  thread_id text not null,
  sender_role text check (sender_role in ('patient', 'doctor', 'care_desk')) not null,
  sender_name text not null,
  recipient_name text not null,
  subject text,
  message_text text not null,
  is_read boolean default false not null,
  is_sample boolean default false not null,
  created_at timestamptz default now() not null
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on every table
alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_schedules enable row level security;
alter table public.appointments enable row level security;
alter table public.medical_records enable row level security;
alter table public.lab_reports enable row level security;
alter table public.care_messages enable row level security;

-- A. DEPARTMENTS & DOCTORS: Publicly readable directory, staff editable
create policy "Departments are viewable by everyone" 
  on public.departments for select 
  using (true);

create policy "Doctors directory is viewable by everyone" 
  on public.doctors for select 
  using (true);

create policy "Doctor schedules are viewable by everyone" 
  on public.doctor_schedules for select 
  using (true);

-- B. PROFILES: Patients read/update their own profile; doctors read their patients
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- C. APPOINTMENTS: Patients read/insert/update own; Doctors read/update their assigned
create policy "Patients can view own appointments" 
  on public.appointments for select 
  using (auth.uid() = patient_id);

create policy "Patients can create own appointments" 
  on public.appointments for insert 
  with check (auth.uid() = patient_id);

create policy "Patients can update own appointments" 
  on public.appointments for update 
  using (auth.uid() = patient_id);

create policy "Doctors can view assigned appointments" 
  on public.appointments for select 
  using (
    exists (
      select 1 from public.doctors 
      where doctors.id = appointments.doctor_id 
      and doctors.profile_id = auth.uid()
    )
  );

create policy "Doctors can update assigned appointments" 
  on public.appointments for update 
  using (
    exists (
      select 1 from public.doctors 
      where doctors.id = appointments.doctor_id 
      and doctors.profile_id = auth.uid()
    )
  );

-- D. MEDICAL RECORDS: Patients read own; Doctors read/insert for their patients
create policy "Patients can view own medical records" 
  on public.medical_records for select 
  using (auth.uid() = patient_id);

create policy "Doctors can view assigned patient records" 
  on public.medical_records for select 
  using (
    exists (
      select 1 from public.doctors 
      where doctors.id = medical_records.doctor_id 
      and doctors.profile_id = auth.uid()
    )
  );

create policy "Doctors can insert medical records" 
  on public.medical_records for insert 
  with check (
    exists (
      select 1 from public.doctors 
      where doctors.id = medical_records.doctor_id 
      and doctors.profile_id = auth.uid()
    )
  );

-- E. LAB REPORTS: Patients read own & insert uploads
create policy "Patients can view own lab reports" 
  on public.lab_reports for select 
  using (auth.uid() = patient_id);

create policy "Patients can upload own lab reports" 
  on public.lab_reports for insert 
  with check (auth.uid() = patient_id);

-- F. CARE MESSAGES: Patients read/send own messages
create policy "Patients can view own care messages" 
  on public.care_messages for select 
  using (auth.uid() = patient_id);

create policy "Patients can send care messages" 
  on public.care_messages for insert 
  with check (auth.uid() = patient_id);

-- =====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER FOR GOOGLE AUTH & EMAIL SIGN-UP
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    role,
    full_name,
    email,
    created_at,
    updated_at
  )
  values (
    new.id,
    'patient',
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Patient'),
    new.email,
    now(),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if already exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

