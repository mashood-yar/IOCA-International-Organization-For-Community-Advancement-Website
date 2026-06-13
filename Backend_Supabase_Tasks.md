# IOCA Website - Backend Developer Guide (Supabase)

Welcome to the backend development guide for the IOCA Website. The frontend has been fully built, optimized, and pushed to GitHub. The next and final step before the official launch is setting up the Supabase backend and wiring up the remaining API calls.

Please follow these step-by-step instructions to create the necessary tables, configure security, and finish the frontend integration.

---

## Step 1: Create the Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in.
2. Click **New Project** and select your organization.
3. Name the project `IOCA-Website`.
4. Generate a strong Database Password and save it securely.
5. Select a region closest to your target audience (e.g., Singapore or Mumbai for Pakistan).
6. Click **Create new project**.

Once the project is created, go to **Project Settings > API** to find your `Project URL` and `anon public` key. 
You will need to place these in the `.env` file of the `frontend` folder:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Step 2: Create the Database Tables

You need to create the following tables. You can use the Supabase SQL Editor to run this script:

```sql
-- 1. Contacts Table (For the Contact Us page)
CREATE TABLE contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Donations Table (For the Donation Modal)
CREATE TABLE donations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    donor_name TEXT,
    amount NUMERIC,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. News Table (For the News & Updates Section)
CREATE TABLE news (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Events Table (For the Events Section)
CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    event_date TIMESTAMPTZ,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Projects Table (For the Ongoing/Completed Projects)
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ongoing',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Volunteers Table (For the Volunteer Registration form)
CREATE TABLE volunteers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    program TEXT NOT NULL,
    availability TEXT,
    heard_from TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Step 3: Setup Storage Buckets for Images

The Admin Dashboard allows the admin to upload images for News, Events, and Projects.
1. Go to **Storage** in the Supabase Dashboard.
2. Click **New Bucket**.
3. Name the bucket `public-assets`.
4. Toggle **Public Bucket** to ON (so users can view the images).
5. Click **Save**.

---

## Step 4: Configure Row Level Security (RLS)

To ensure your database is secure, you need to configure RLS. Only authenticated admins should be able to Read/Update/Delete sensitive data, while the public can only Insert (e.g., submitting a contact form) or Read (e.g., reading news).

Run the following SQL in the SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Allow PUBLIC to insert into Contacts, Donations, and Volunteers
CREATE POLICY "Allow public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert volunteers" ON volunteers FOR INSERT WITH CHECK (true);

-- Allow PUBLIC to read News, Events, and Projects
CREATE POLICY "Allow public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Allow public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);

-- Allow ADMINS (authenticated users) full access to everything
CREATE POLICY "Allow admin all contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all donations" ON donations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all news" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin all volunteers" ON volunteers FOR ALL USING (auth.role() = 'authenticated');
```

---

## Step 5: Admin Authentication Setup

The project uses Supabase Authentication for the Admin Dashboard.
1. Go to **Authentication > Users** in Supabase.
2. Click **Add User > Create New User**.
3. Enter the admin email and password.
4. Uncheck "Auto Confirm User" and click Create. (Or confirm them manually via the dashboard if required).
5. Ensure the frontend `AdminLogin.tsx` uses standard email/password Supabase auth (it is already wired up!).

---

## Step 6: Final Frontend Integration Tasks

The frontend is 95% wired up to Supabase. However, you need to complete the following specific files in the React codebase:

### 1. `frontend/src/pages/Volunteer.tsx`
There is a `TODO: Backend dev to integrate volunteer registration API endpoint here` comment (inside the `handleSubmit` function).
**Task:** Import `supabase` from `../lib/supabase.ts` and add the `supabase.from('volunteers').insert({...formData})` logic inside the `handleSubmit` function.

### 2. `frontend/src/pages/Contact.tsx`
Check the `handleSubmit` function inside `Contact.tsx`. 
**Task:** Import `supabase` and add `supabase.from('contacts').insert({ name, email, message })` to wire up the Contact page submissions.

### 3. Verify Admin Dashboard
Go to `/admin/login` on the local server, log in with the admin credentials you created, and verify that the `AdminDashboard.tsx` can successfully fetch, insert, update, and delete rows from the `news`, `events`, and `projects` tables.

---

## Summary
Once you have created the tables, applied the RLS policies, and wired up the `Volunteer.tsx` and `Contact.tsx` forms, the IOCA website backend will be 100% complete and ready for production deployment!
