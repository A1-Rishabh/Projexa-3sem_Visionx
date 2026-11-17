=====================================================================
STEP 0: PROGRESS LOG AND SESSION CONTINUITY (do this first, always)
=====================================================================

RESUME RULE
Before doing any work, check whether /PROGRESS.md exists.
- If it exists: read /PROMPT.md and /PROGRESS.md fully, do NOT recreate
  either file, do NOT redo anything marked DONE, and continue from the
  first task marked TODO or IN PROGRESS. Start your reply with a short
  "Resuming from: <task ID and name>" line, plus a one-line summary of
  what is already done.
- If it does not exist: this is a fresh start. First, save this entire
  prompt, exactly as written, to /PROMPT.md. Then create /PROGRESS.md
  using the template at the end of this step, with every task listed as
  TODO, and start with task 0.1.
- The same rule applies when I change accounts, IDs, machines or
  sessions. The files in the project folder are the only memory. Never
  assume anything that is not written in /PROGRESS.md.

RESUME COMMAND (write it into both /README.md and the top of
/PROGRESS.md, in a "How to resume" section)
"Read /PROMPT.md and /PROGRESS.md. Follow Step 0, report where you are
resuming from, and continue with the first task that is not DONE. Do not
redo completed work."
Also add a short "Project progress" section to /README.md that links to
/PROGRESS.md and /PROMPT.md.

LOGGING RULES
- Work on ONE task at a time, in the order of the task list.
- Immediately after finishing each task (not at the end of a phase),
  update /PROGRESS.md: set the status to DONE, add the date and time,
  the files created or changed, a one-line summary of what was done,
  and any bug fixed. Then move to the next task.
- VERIFY BEFORE DONE: before marking a task DONE, run the app, confirm
  it builds with no errors, and confirm the task's feature works in the
  browser or by a test. Write one line in the log saying how you
  verified it. If you cannot verify it, mark it IN PROGRESS and say why.
- If you stop mid-task or hit an error, mark it IN PROGRESS and write
  exactly what is finished, what is left, and the error if any, so the
  next session can continue precisely from there.
- Never delete or rewrite earlier log entries. Only append or update
  the status of the current task.
- Record every decision (for example: which auth provider was detected,
  which libraries were added, what stays mock) in the Decisions section.
- Record every item I still need to provide (logo, photos, address, UPI
  ID, API keys) in the "Waiting on me" section, and tick them off when
  done. Never write secret keys or passwords in this file.
- After updating the log, make a git commit if git is available, with
  the message "Task <ID>: <short name>". If git is not set up, run
  "git init" once and log that decision.
- At the start of every session, run the app and confirm it still
  builds before continuing. If it doesn't build, fix that first and
  log it as a task.
- SIZE CONTROL: if a task feels too large, split it into smaller
  sub-tasks (for example 2.5a, 2.5b) in the log before starting, and
  finish them one at a time. If I say "Do only task <ID> now", do
  exactly that task, update the log and stop.
- Work through the task list in order. After task 1.8 (end of Phase 1),
  stop and wait for me to say "continue".

/PROGRESS.md TEMPLATE
# Jivaka Clinic: Progress Log
Last updated: <date and time>
Current task: <ID and name>
Status key: TODO | IN PROGRESS | DONE | BLOCKED

## How to resume
<the RESUME COMMAND text above>

## Original features (confirmed working after each phase)
[List every existing page and feature found in the initial scan.
Tick each one after verifying it still works.]

## Task list
### Phase 0: Setup
- 0.1 Scan the project and list the existing features ........ TODO
- 0.2 Create the design system (colors, fonts, theme config) .... TODO
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
### <Task ID>: <name>
- Status: DONE
- Completed: <date and time>
- Files changed or added: ...
- Summary: ...
- Bugs fixed: ...
- Verified by: <how you checked it works>
- Notes: ...

## Decisions
[Auth provider detected, libraries added, mock vs. real features, etc.]

## Waiting on me
- [ ] Logo file
- [ ] Clinic photos
- [ ] Clinic address, phone, hours (clinic.js)
- [ ] UPI ID and payee name
- [ ] Google OAuth client ID
- [ ] Razorpay test key

## Known issues and TODOs
[Anything that needs a backend, or is not finished]

REPORT CONTENTS
- Task 1.8 report: (1) files changed or added, (2) .env variables
  needed for Google sign-in, (3) a checklist confirming each original
  feature still works, (4) placeholder images and details I still need
  to replace.
- Task 2.12 report: (1) files changed or added, (2) bugs fixed,
  (3) a checklist confirming each original feature still works,
  (4) features that are UI-only and need a backend, (5) the .env
  variables and clinic.js fields needed for Google sign-in, UPI and the
  payment gateway, (6) which payment features are mock, and (7) the
  placeholder images and details I still need to replace.
Write both reports into /PROGRESS.md as those tasks.

=====================================================================
ROLE AND PROJECT
=====================================================================

You are a senior front-end engineer and UI/UX designer. Redesign my
existing web app, "MediConnect", into "Jivaka Clinic". This is a UI/UX
redesign plus the features listed below.

Rename the product from "MediConnect" (and "AegisCare", "mwdiconnect"
and any other variant) to "Jivaka Clinic". Search the entire codebase
and replace the name in titles, headings, meta tags, navbar, footer,
banners, lab names, email addresses, alerts and comments. Use the
attached logo everywhere (navbar, favicon, login pages, footer). Put it
in /public/images/logo.* and do not distort it.

HARD CONSTRAINTS (do not violate)
- Keep every existing feature, route, role, form, API call, state flow
  and data working exactly as it does now.
- You may change layout, position, styling, component structure and
  interactivity. You may not remove functionality.
- Before editing, scan the project and list the existing pages and
  features (task 0.1). At the end of each phase, confirm each one still
  works.
- Keep the current stack (React + Vite). Add only small dependencies,
  and tell me what you add.
- List every bug fix separately in the log and reports.

DESIGN SYSTEM (apply to every page)
Colors (put them in the Tailwind theme or CSS variables):
- Primary teal #0F6B63 (buttons, links, focus rings)
- Deep teal #0F4F4A (footer, dark sections, navbar accents)
- Mint #DCEFE6 (icon backgrounds, soft panels)
- Warm cream #FAF6EC (page background, with white cards on top)
- Warm accent #E8A25C (small highlights, badges and announcements only,
  plus one CTA glow)
- Text #1C2B29, secondary text #51625F
Replace all navy and electric blue. Keep text contrast at 4.5:1 or
better. Headings in Fraunces with normal letter-spacing (no tight
tracking), body in Inter. Rounded 16-18px cards, soft shadows, generous
spacing. One icon set only (lucide-react). Remove all emojis. No neon
and no heavy gradients.

ANIMATION (minimal)
- Subtle fade-up on scroll for sections (once only)
- Card hover lift of about 4-6px
- Frosted navbar on scroll
- Count-up stats
- Button press feedback and loading states
All animations under 500ms and disabled when prefers-reduced-motion is
set. No parallax and no autoplay motion.

UX AND ACCESSIBILITY (global)
- Mobile-first and responsive at 360, 768, 1024 and 1440px
- Minimum 44px tap targets, visible focus rings, semantic HTML,
  skip-to-content link, labels on every input, aria-labels on icon
  buttons, descriptive alt text
- Address, phone and "Get directions" tappable on mobile
- Fast load: lazy images, explicit width and height, no layout shift
- Fix all form controls that render black (selects, textareas, inputs):
  white background, 1px visible border, teal focus ring, readable text
- Toasts: auto-dismiss after 3 seconds, close button, bottom-right,
  never covering page content
- Skeleton loaders while data loads, friendly empty states with an
  action button
- Auto logout after inactivity, with a warning dialog 30 seconds before

CLINIC CONFIG (single source of truth)
Create /src/config/clinic.js and export one object. Every component
that shows location, contact, currency or payee data must import from
this file. Never hard-code these values anywhere else. Add a comment at
the top: "Edit this file to update clinic details everywhere on the
site."

export const clinic = {
  name: "Jivaka Clinic",
  currency: "INR",
  upiId: "[clinic UPI ID, e.g. name@bank]",
  payeeName: "[Payee name]",
  branches: [
    {
      id: "main",
      label: "[Main branch]",
      address: "[Street address, City, State, PIN]",
      phone: "[Phone number]",
      email: "[Email]",
      emergency: "[Emergency number]",
      hours: [
        { days: "[Mon-Sat]", time: "[9:00 AM - 6:00 PM]" },
        { days: "[Sunday]", time: "[Closed]" }
      ],
      mapQuery: "[Address or clinic name for Google Maps]"
    }
  ]
};

IMAGES
- Use realistic, warm, professional images: the clinic building,
  doctors, patient care and the reception. Put them in /public/images/
  as optimized WebP with descriptive alt text.
- If I haven't supplied photos, use clearly named placeholders (for
  example hero.webp) and tell me exactly which files to replace.
  Do not hotlink random URLs.

CURRENCY (INR)
- All amounts across the app must be in Indian rupees (₹, INR).
  Convert every existing "$ USD" value (doctor fees, summary card,
  receipts, records).
- Create one helper, formatINR(amount), using
  Intl.NumberFormat("en-IN", { style: "currency", currency: "INR",
  maximumFractionDigits: 0 }). Use it everywhere. Never hard-code a
  currency symbol elsewhere.
- Use realistic placeholder fees (₹500 to ₹1500) and mark them clearly
  as sample data to replace.

=====================================================================
PHASE 1: PUBLIC SITE (landing page, login, sign up)
=====================================================================

LANDING PAGE (route "/")
This is the first page a visitor sees, and it leads to login or sign up.
Sections in order:
1. Sticky navbar: logo + "Jivaka Clinic", links (About, Departments,
   Doctors, Locations, Contact), "Staff Login" (outline) and
   "Patient Portal / Sign In" (filled). It turns frosted glass on
   scroll. Mobile gets a hamburger menu.
2. Hero: headline, one line of support text, two buttons ("Book an
   appointment", "Sign in"), a hero image, and a small quick-booking
   card with a Department dropdown. If more than one branch exists in
   the config, also show a Location dropdown.
3. About: short story plus count-up stats (placeholders: [00]).
4. Departments: cards for General Medicine, Pediatrics, Cardiology,
   Diagnostics, each with an icon, a one-line description and a
   "Learn more" link.
5. Doctors: cards with photo, name, specialty and an "Available"
   badge. Snap-scroll carousel on mobile.
6. Why choose us: 3-4 trust points with icons.
7. Locations / Find Us (id="locations"): see LOCATION SECTION.
8. Final CTA band leading to sign in / sign up.
9. Footer: logo, tagline, address, phone, hours, "Get directions"
   link, quick links, emergency number.
Use [bracketed placeholders] for real details. Never invent data.
Sticky "Book appointment" bar on mobile.

LOCATION SECTION
Generate the map embed URL and the "Get directions" link from mapQuery,
for example
https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed
so I only change text, never code. No API key.
While values are still [bracketed]:
- Do not show a broken map. Show a clean mint panel with a map-pin icon
  and the text "Clinic location coming soon".
- Hide "Get directions", "Call now" and "Copy address".
- Hide the branch selector when there is only one branch. Show it
  automatically when a second branch is added.
When real data is added:
- Map on the left, info card on the right: address, phone, email,
  emergency number, hours with an "Open now / Closed" badge, and the
  buttons "Get directions" (new tab), "Call now" (tel: link) and
  "Copy address".
- With multiple branches, show tabs that update the map, address and
  hours without a page reload.
- Optional "Use my location" button that suggests the nearest branch.
  It must fail gracefully if permission is denied and never store
  coordinates.
- Map iframe gets a descriptive title and lazy loading, and the full
  address is also shown as text for screen readers.

LOGIN AND SIGN UP (routes "/login" and "/signup")
- Split layout: form on one side, branded image panel on the other
  (stacked on mobile).
- Email + password with show/hide toggle, inline validation, loading
  state and clear error messages.
- "Continue with Google" button on both pages (official Google "G"
  logo) with an "or" divider.
- "Forgot password" link, a link between login and sign up, and a role
  selector (Patient / Staff) if the current app has roles.
- Integrate Google sign-in with my existing auth setup (detect whether
  it is Firebase, Supabase or custom). Read keys from .env and document
  the variables. Do not hard-code secrets.
- After login, redirect to the same dashboard as before, according to
  the user's role.

=====================================================================
PHASE 2: PATIENT PORTAL
=====================================================================

GLOBAL PORTAL FIXES
- Navbar: reduce to four items (Home, Find a Doctor, Appointments,
  Records). Move Profile Settings and Log out into a dropdown under the
  user name and ID. Rename "Exit Portal" to "Log out" with a neutral
  style, not red. On mobile, use a bottom tab bar.

PAGE 1: HOME becomes a DASHBOARD
- Replace the large hero with a compact greeting ("Good morning,
  John") and the patient ID.
- Above the fold, show cards for: Next appointment (doctor, date, time,
  room, countdown, Reschedule and Cancel buttons), Latest lab report,
  Quick actions (Book visit, View records, Update profile), Reminders.
- Below, keep the Clinic Schedule and Contact card with an
  "Open now / Closed" badge and today's row highlighted. Phone and
  email tappable (tel: and mailto:), plus a "Call now" button.
- Keep the Location card with an embedded map, "Get directions" and
  "Copy address", reading from clinic.js, with the "Location coming
  soon" panel while values are placeholders.
- Keep the announcement banner in the warm accent color with a dismiss
  button.
- Remove the vague "4 Senior Staff" and "In-Clinic Practice" cards.

PAGE 2: FIND A DOCTOR
- Fix the broken doctor photo with an initials-avatar fallback for any
  image that fails to load.
- Equal-height cards in a clean grid. Bios clamp to two lines with a
  "View profile" link.
- Availability badge on each card ("Available today" or "Next
  available: Thu 10:00 AM") calculated from the slot data.
- Filters: specialization, availability, fee range. Sorting: rating,
  soonest available, fee. Keep the existing search box.
- Keep rating, room, hours and fee (in ₹).

PAGE 3: BOOKING MODAL (3 steps)
- Proper stepper with numbered circles and a checkmark on completed
  steps.
- BUG FIX: hide or disable time slots that have already passed for
  today. Never allow booking a past time.
- Date chips ("Today", "Tomorrow", next days) with the number of free
  slots under each.
- Style unavailable slots as lighter with a strikethrough instead of
  repeating "Booked / Unavailable" text. Keep an accessible label.
- Step 1: quick-pick chips ("Check-up", "Follow-up", "New symptom",
  "Prescription review") above the reason box. Validate the reason
  (minimum length, not gibberish-only) with an inline error.
- Step 3: keep the summary card (amount in ₹), check-in instructions
  with an icon, and make the confirm button the single strongest
  button.
- Trap focus inside the modal, close on Escape, restore focus on close.

PAYMENT OPTIONS (in Step 3, after the summary card)
Add a "Choose how to pay" section with selectable option cards
(radio-style, 44px minimum, with icons):
1. Pay by UPI: UPI ID field (validate name@bank format) and a
   "Pay with UPI app" button. On mobile, open a upi://pay deep link
   built from clinic.js (upiId, payeeName, amount, note) so the
   patient's installed UPI app opens (GPay, PhonePe, Paytm, BHIM).
2. Scan QR code: a QR generated from the same UPI link (use a small
   library such as qrcode.react), with the amount, clinic name and the
   caption "Scan with any UPI app". On desktop, show the QR by default.
3. Cards and Net Banking: a button that opens the payment gateway
   checkout (Razorpay Checkout or similar) for cards, net banking and
   wallets.
4. Pay at clinic (cash or card at check-in): the default option, so
   the current "Pay at Check-In" flow keeps working exactly as before.
Rules:
- If the patient picks "Pay at clinic", booking confirms immediately as
  it does today.
- For online options, show a payment status step: Awaiting payment,
  Paid, Failed. A failed or abandoned payment must not silently lose
  the slot: hold it for 10 minutes with a visible timer, then release.
- Show a payment badge (Paid, Pay at clinic, Pending) on the
  appointment card, booking summary and receipt.
- Add a receipt view per paid appointment (clinic name, patient,
  doctor, date, amount in ₹, method, transaction ID) with
  "Download PDF" and "Print", and a "Payment history" list in Records
  or Profile.
- Read keys and payee details from .env and clinic.js (for example
  VITE_RAZORPAY_KEY_ID, clinic.upiId, clinic.payeeName). Never hard-code
  secrets and never put secret keys in front-end code.
- If no UPI ID or gateway key is configured, show UPI, QR and Cards as
  disabled with the note "Online payment coming soon", and keep
  "Pay at clinic" active.
- Verify payment on the server (webhook or verify endpoint) before
  marking an appointment "Paid". If no backend exists, list it as a
  TODO and use clearly labelled mock behaviour.

PAGE 4: MY APPOINTMENTS
- BUG FIX: make status consistent. The toast says "confirmed" while the
  card says "PENDING". Use one status flow (Pending, Confirmed,
  Completed, Cancelled) with color-coded badges (amber, teal, grey,
  red) everywhere.
- Add "Reschedule" next to "Cancel" (it opens the same slot picker) and
  a confirmation dialog before cancelling.
- Add a countdown ("Today, in 2 hours"), the check-in code if one
  exists, "Get directions", and "Add to calendar" (generate an .ics
  file in the browser).
- In Past History, add a "Book again" button on each row.

PAGE 5: MEDICAL RECORDS
- Vitals cards: add the measurement date and a small trend arrow or
  mini chart if past readings exist.
- Show allergies as a visible alert chip near the top next to blood
  group.
- Group visit history by year, collapse older entries, and avoid
  repeating identical blocks.
- Lab reports: keep "View PDF" and add "Download". Add filter tabs
  (All, Labs, Prescriptions, Visits).
- Rename "Doctor Healthcare Recommendations" to a clearer heading and
  show real recommendations, not a copy of the visit note.
- Add a short privacy note about who can see this data.

PAGE 6: PROFILE SETTINGS
- Make saved values look filled in (dark text), not like faded
  placeholders. Two-column layout on wide screens, plus profile photo
  upload with an initials fallback.
- Inline validation (email, phone), a success message after saving, and
  an unsaved-changes warning when leaving the page.
- Sections: Personal details, Emergency contact, Security (change
  password, linked Google account), Notification preferences.
- An "Emergency card" view (blood group, allergies, emergency contact)
  that can be printed or saved.

NEW PATIENT FEATURES (build the UI now; wire to a backend only if one
exists, otherwise use clearly marked mock data)
- Appointment reminders (email toggle in settings, plus a "reminder
  set" badge on appointments)
- Waitlist: "Notify me if an earlier slot opens"
- Prescription refill request form
- Secure messaging with the care team (inbox and thread view)
- Upload your own documents (old reports, insurance card)
- Doctor profile pages (qualifications, experience, reviews)
- Pre-visit form (symptoms, history) before the appointment
- Family or dependents switcher in the profile menu
- Dark mode toggle and a larger-text option
- Health tips and vaccination reminders card on the dashboard
Mark anything that needs a backend in the TODO section of the log.

CODE QUALITY
Reusable components (Navbar, BottomTabBar, Hero, BookingCard,
DashboardCard, DepartmentCard, DoctorCard, SlotPicker, Stepper,
PaymentOptions, UpiQr, StatusBadge, VitalsCard, LocationSection,
AuthLayout, GoogleButton, Toast, EmptyState, Skeleton, Footer).
Colors, fonts, currency and clinic details live in one config. All
location, contact and payee data comes only from
/src/config/clinic.js. Add comments only where logic isn't obvious.

=====================================================================
FIRST ACTION
=====================================================================
Now follow STEP 0: check for /PROGRESS.md. If it exists, resume from
the first task that is not DONE. If not, save this prompt to
/PROMPT.md, create /PROGRESS.md, and begin with task 0.1.
