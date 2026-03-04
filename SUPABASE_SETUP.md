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
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text check (role in ('customer', 'worker', 'admin')) default 'customer',
  phone text,
  address text,
  household_size integer,
  preferences text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Service Categories
create table public.service_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  icon text,
  base_price decimal(12,2),
  is_active boolean default true
);

-- 3. Bookings (Tickets)
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.profiles(id) not null,
  worker_id uuid references public.profiles(id),
  service_id uuid references public.service_categories(id) not null,
  status text check (status in ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')) default 'pending',
  priority text check (priority in ('standard', 'emergency')) default 'standard',
  scheduled_at timestamp with time zone not null,
  location text not null,
  description text,
  total_amount decimal(12,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Smart Devices
create table public.smart_devices (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null,
  status text,
  battery_level text,
  last_activity timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.service_categories enable row level security;
alter table public.bookings enable row level security;
alter table public.smart_devices enable row level security;

-- Basic RLS Policies
-- Profiles: Users can read/write their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Bookings: Customers see their own, Workers see assigned, Admins see all
create policy "Customers view own bookings" on public.bookings for select using (auth.uid() = customer_id);
create policy "Workers view assigned bookings" on public.bookings for select using (auth.uid() = worker_id);
create policy "Admins view all bookings" on public.bookings for select using (true); -- Add role check here later
```

## 4. Authentication
BitNexus is configured to use Supabase Auth. You can enable Email/Password, Google, or other providers in the **Authentication** > **Providers** section of your Supabase dashboard.
