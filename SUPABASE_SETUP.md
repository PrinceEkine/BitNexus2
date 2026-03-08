# Supabase Setup Guide for BitNexus

Follow these steps to set up your Supabase backend for the BitNexus platform.

## 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and select your organization.
3. Enter a project name (e.g., `BitNexus`), a database password, and select a region.
4. Click **Create new project**.

## 2. Configure Environment Variables
1. In your Supabase dashboard, go to **Project Settings** > **API**.
2. Copy the **Project URL** and the **anon public** key.
3. In your local development environment, add these to your `.env` file (or set them in AI Studio Secrets):
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

## 3. Set Up the Database Schema
Go to the **SQL Editor** in your Supabase dashboard and run the following script to create the necessary tables and set up Row Level Security (RLS).

```sql
-- 1. Profiles (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('customer', 'worker', 'admin')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Technicians (Managed by Admin)
CREATE TABLE IF NOT EXISTS technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Idle',
  load INTEGER DEFAULT 0,
  specialty TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tickets (Service Requests)
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  service TEXT NOT NULL,
  description TEXT,
  priority TEXT,
  status TEXT DEFAULT 'Pending',
  technician_id UUID REFERENCES technicians(id),
  date TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Transactions (Financial Tracking)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id),
  amount DECIMAL(12,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'escrow', 'paid', 'failed')),
  type TEXT CHECK (type IN ('payment', 'payout')),
  reference TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Messages (Real-time Chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id),
  sender_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

## 4. Authentication
BitNexus is configured to use Supabase Auth. You can enable Email/Password, Google, or other providers in the **Authentication** > **Providers** section of your Supabase dashboard.
