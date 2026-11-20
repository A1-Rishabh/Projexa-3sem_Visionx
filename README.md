# Jeevak Clinic – Healthcare Management & Digital Outpatient System
**Academic Project | K.R. Mangalam University**

An enterprise-grade, accessible outpatient healthcare portal and clinic management web application engineered for **Jeevak Clinic** (Estd. 2003, Meethapur, Badarpur, New Delhi). The platform digitizes patient appointments, clinical intake, doctor consultations, diagnostic lab reporting, and digital prescription access while ensuring compliance with empanelment standards (LIC of India & Cabinet Secretariat).

---

## 📌 Project Overview
- **Community Partner:** Jeevak Clinic, C-04 Shakti Vihar, New Delhi
- **Core Specializations:** General Medicine, Obstetrics & Gynecology, General & Laparoscopic Surgery, On-site Diagnostics
- **OPD Timings:** Monday to Friday (11:30 AM – 2:00 PM & 6:30 PM – 8:30 PM) | Sat & Sun Closed
- **Consultation Fee:** ₹500 In-Clinic Flat Consultation

---

## 🛠️ Technology Stack & Architecture
- **Frontend:** React 18, Vite 5, Modern Editorial CSS, Lucide Icons, QRCode.react
- **Backend & Database:** Supabase (PostgreSQL 15 with Row Level Security - RLS)
- **Authentication:** Google OAuth 2.0 (Google Identity Services) & Role-Based Auth (Doctor vs. Patient)
- **Payment Gateway:** Razorpay API (UPI / Card In-Clinic Receipts)
- **CI/CD & Deployment:** GitHub Actions, Vercel & GitHub Pages

---

## 🧩 Core Working Modules

### 1. Public Healthcare & Appointment Booking Module
- **Editorial Landing UI:** Modern two-column hero with verified clinic branding, credentials, and location maps.
- **Doctor Roster & Verification:** Real profiles and credentials for consulting specialists:
  - *Dr. Shuchi Shivangi* – General Physician (MBBS Hons, S.I.U. Pune, DMC Reg. 125003)
  - *Dr. (Mrs.) Indu Kumari* – Consultant Gynecologist (MBBS, L.N.M.U. Darbhanga)
  - *Dr. Surendra Kumar* – Senior Surgeon (MBBS Hons, M.S. General Surgery, Patna)
- **Digital Intake & Booking:** Step-by-step triage form, slot reservation, and real-time token allocation.

### 2. Doctor OPD & Clinical Workstation (Staff Portal)
- **Patient Queue Manager:** Live waiting room queue with real-time consultation status (`WAITING`, `IN_CONSULTATION`, `COMPLETED`).
- **Clinical Records Entry:** Direct entry of vitals, diagnosis, differential notes, and prescriptions.
- **Diagnostic Investigation Management:** Direct issuance of on-site lab reports (CBC, HbA1c, Urine Analysis) linked to patient files.

### 3. Patient Health Record (PHR) & Diagnostics Portal
- **Real-time Synchronization:** Instant access to updated visit records and published diagnostic reports.
- **Digital Receipts & QR Pass:** Auto-generated printable receipts with QR code verification.
- **Secure Google Sign-In:** One-click OAuth login linked to the patient's personal record.

### 4. Security, Compliance & Empanelment Engine
- **Role-Based Access Control (RBAC):** Strict boundaries separating patient medical privacy from clinical staff operations.
- **Row-Level Security (RLS):** Supabase database policies guaranteeing patients can only view their own medical data.
- **Panel Verification:** Official display and verification for LIC and Cabinet Secretariat empanelment.
- **Offline Resilience:** Auto-fallback to local state when backend connections are unavailable.

---

## 🚀 Deployment & Live Links
- **GitHub Repository:** [https://github.com/A1-Rishabh/Projexa-3sem_Visionx](https://github.com/A1-Rishabh/Projexa-3sem_Visionx)
- **Live GitHub Pages:** [https://a1-rishabh.github.io/Projexa-3sem_Visionx/](https://a1-rishabh.github.io/Projexa-3sem_Visionx/)
