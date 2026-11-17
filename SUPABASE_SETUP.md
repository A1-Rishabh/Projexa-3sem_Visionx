# Jivaka Clinic - Supabase Setup Guide

Follow these quick steps to connect your real Supabase database and enable real Google Authentication:

---

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New Project**.
3. Choose an organization, project name (e.g. `jivaka-clinic`), database password, and preferred region (e.g. *South Asia - Mumbai* for lowest latency in India).
4. Wait 1–2 minutes for the database cluster to initialize.

---

### Step 2: Run Database Schema
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Open the file `supabase/schema.sql` from this repository.
3. Copy its entire contents, paste them into the SQL Editor, and click **Run**.
4. This creates:
   - `profiles` table (linked to `auth.users`)
   - `departments` & `doctors` directories
   - `doctor_schedules` (OPD slots)
   - `appointments` table
   - `medical_records`, `lab_reports`, and `care_messages`
   - **Row Level Security (RLS)** policies on every table
   - `handle_new_user()` trigger for automated Google account profile provisioning.

---

### Step 3: Run Sample Seed Data
1. In the Supabase **SQL Editor**, open `supabase/seed.sql` from this repository.
2. Paste the SQL and click **Run**.
3. This seeds sample clinical departments, sample doctor profiles with consultation fees in INR, and OPD schedule windows.
4. *Every seeded sample row has `is_sample = true` so you can identify, edit, or purge sample records whenever needed.*

---

### Step 4: Enable Google Authentication
1. In the Supabase Dashboard, go to **Authentication > Providers**.
2. Select **Google** and toggle **Enable Sign in with Google**.
3. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Under **Authorized redirect URIs**, add the callback URL displayed in your Supabase Google Provider settings:
     `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Copy your **Client ID** and **Client Secret** from Google Cloud Console and paste them into Supabase.
4. In Supabase Dashboard under **Authentication > URL Configuration**:
   - Set **Site URL** to `http://localhost:3000` (or your live domain).
   - Under **Redirect URLs**, add `http://localhost:3000/**`.
5. Click **Save**.

---

### Step 5: Add Keys to `.env`
1. In Supabase Dashboard, go to **Project Settings > API**.
2. Copy your **Project URL** and **anon (public)** key.
3. In your local project root, create a file named `.env` (or copy from `.env.example`):
   ```env
   VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key-here"
   ```
4. Restart your Vite dev server:
   ```bash
   npm run dev
   ```

---

### Step 6: First-Time Patient Login
- Click **Continue with Google** on the login page.
- You will be redirected to the official Google consent screen.
- On your first login, a **Clinical Intake Modal** will prompt you to verify contact phone, date of birth, blood group, and emergency contact.
- Your clinical records are now live, encrypted, and backed by PostgreSQL!

