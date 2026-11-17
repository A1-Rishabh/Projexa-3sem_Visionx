# Jivaka Clinic: Progress Log
Last updated: 2026-11-17 13:20 IST
Current task: 0.2 Create the design system (colors, fonts, theme config)
Status key: TODO | IN PROGRESS | DONE | BLOCKED

## How to resume
Read /PROMPT.md and /PROGRESS.md. Follow Step 0, report where you are resuming from, and continue with the first task that is not DONE. Do not redo completed work.

## Original features (confirmed working after each phase)
- [x] Auth System: Patient vs. Doctor role tabs (`LoginPage.jsx`)
- [x] Auth System: Patient email/phone sign-in with show/hide password toggle & inline validation
- [x] Auth System: Patient sign-up mode with name, phone, email, password strength meter
- [x] Auth System: Patient 6-digit mock OTP verification modal with resend countdown
- [x] Auth System: Doctor quick-fill demo pills (DOC-101 to DOC-104) and sign-in verification
- [x] Auth System: Forgot password modal with email reset dispatch
- [x] Auth System: Persistent session storage (`aegis_user_session`) & last role memory (`aegis_last_role_tab`)
- [x] Patient Portal: Navigation header with Logo, tabs, user pill, and logout
- [x] Patient Portal - Home & Info (`InfoHub.jsx`): Hero banner, quick CTA, stats pills, active announcement banner, operating hours & contact card, check-in instructions
- [x] Patient Portal - Find a Doctor (`DoctorDirectory.jsx`): Search box, specialization filter dropdown, doctor cards with ratings, fee ($), room, bio, available slot preview, booking trigger
- [x] Patient Portal - Booking Wizard Modal (`BookingWizardModal.jsx`): 3-step modal (reason for visit, upcoming date chips & time slot picker, summary card & confirmation)
- [x] Patient Portal - My Appointments (`PatientAppointments.jsx`): Upcoming vs Past history tabs, appointment cards with room & status badges, cancellation modal with reason input
- [x] Patient Portal - Medical Records (`PatientMedicalRecords.jsx`): Encrypted banner with blood group & allergy chip, 4 vitals summary cards, clinical notes, visit timeline with diagnosis & prescriptions, lab reports list with "View PDF" modal preview, prescription print preview
- [x] Patient Portal - Profile Settings (`PatientProfile.jsx`): Form for full name, email, phone, blood group dropdown, allergies, emergency contact, save handler with persistence
- [x] Doctor Portal (`DoctorPortal.jsx`): Left sidebar navigation, 15-minute session timeout monitor with 2-min warning & extension modal, notification drawer
- [x] Doctor Portal - Dashboard (`DoctorDashboard.jsx`): Stat metrics, "Next Patient" callout card with check-in button, today's schedule table
- [x] Doctor Portal - Schedule Manager (`ScheduleManager.jsx`): 7-column weekly schedule grid with slot status toggles (Available/Blocked/Lunch) & holiday toggle
- [x] Doctor Portal - Appointment Manager (`AppointmentManager.jsx`): Filter by status, confirm/reschedule/complete/cancel actions, patient details modal
- [x] Doctor Portal - Patient Records Manager (`PatientRecordsManager.jsx`): Patient search, clinical notes editor (public & private), audit logging
- [x] Doctor Portal - Doctor Profile Editor (`DoctorProfileEditor.jsx`): Room, bio, hours, fee update
- [x] Common Components: `Logo.jsx`, `Modal.jsx`, `SkeletonLoader.jsx`, `Toast.jsx`, `mockDataStore.js`

## Task list
### Phase 0: Setup
- 0.1 Scan the project and list the existing features ........ DONE
- 0.2 Create the design system (colors, fonts, theme config) .... IN PROGRESS
- 0.3 Create /src/config/clinic.js and the formatINR helper ..... TODO
- 0.4 Rename MediConnect and AegisCare everywhere, add logo ...... TODO
- 0.5 Fix the black form fields, the toast, and the shared
      components (skeleton, empty state, toast) ................. TODO

### Phase 1: Public site
- 1.1 Landing page: navbar and hero ............................. TODO
- 1.2 Landing page: About, Departments, Doctors ................. TODO
- 1.3 Landing page: Why choose us, Locations, CTA, Footer ........ TODO
- 1.4 Login page ................................................ TODO
- 1.5 Sign up page ............................................... TODO
- 1.6 Google sign-in integration ................................ TODO
- 1.7 Forgot password and role-based redirect .................. TODO
- 1.8 Phase 1 report (see report contents below) ................. TODO

### Phase 2: Patient portal
- 2.1 Portal navbar, profile dropdown, mobile tab bar ........... TODO
- 2.2 Home dashboard ............................................ TODO
- 2.3 Find a Doctor ............................................. TODO
- 2.4 Booking modal: stepper, slots, past-slot bug fix .......... TODO
- 2.5 Payment options: UPI, QR, cards, pay at clinic ............ TODO
- 2.6 Receipts and payment history .............................. TODO
- 2.7 My Appointments: status fix, reschedule, cancel dialog .... TODO
- 2.8 Medical Records ........................................... TODO
- 2.9 Profile Settings and emergency card ....................... TODO
- 2.10 New patient features (reminders, waitlist, refill,
       messaging, uploads, doctor profiles, pre-visit form,
       dependents, dark mode, health tips) ....................... TODO
- 2.11 Final accessibility, responsive and performance pass ....... TODO
- 2.12 Final report (see report contents below) ................. TODO

## Log (newest at the bottom)
### Task 0.1: Scan the project and list the existing features
- Status: DONE
- Completed: 2026-11-17 13:20 IST
- Files changed or added: PROMPT.md, PROGRESS.md, README.md, .gitignore
- Summary: Scanned entire project tree, mapped all components across auth, patient portal, doctor portal, common components, and mockDataStore. Verified production build compiles successfully with Vite.
- Bugs fixed: None (audit and setup task).
- Verified by: Inspected source files and executed `npm run build` which succeeded with 0 errors.
- Notes: Git initialized in project root with clean .gitignore.

## Decisions
- 2026-11-17: Initialized git repository locally in Prototype2 directory with standard .gitignore.
- 2026-11-17: All existing features documented in PROGRESS.md under "Original features".

## Waiting on me
- [ ] Logo file
- [ ] Clinic photos
- [ ] Clinic address, phone, hours (clinic.js)
- [ ] UPI ID and payee name
- [ ] Google OAuth client ID
- [ ] Razorpay test key

## Known issues and TODOs
[Anything that needs a backend, or is not finished]
