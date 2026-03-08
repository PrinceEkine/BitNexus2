-- BitNexus Database Schema (Updated)

-- 1. Profiles (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT UNIQUE,
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

-- 6. Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  balance DECIMAL(12, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'NGN',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID REFERENCES wallets(id),
  amount DECIMAL(12, 2) NOT NULL,
  type TEXT CHECK (type IN ('deposit', 'withdrawal', 'payment', 'refund')),
  status TEXT DEFAULT 'completed',
  reference TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Service Categories
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Stores the icon name (e.g., 'Zap', 'Droplet')
  base_fee DECIMAL(12, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

-- Service Categories Policies
CREATE POLICY "Anyone can view active service categories" ON service_categories FOR SELECT USING (status = 'Active');
CREATE POLICY "Admins can manage all service categories" ON service_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Wallet Policies
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM wallets WHERE wallets.id = wallet_transactions.wallet_id AND wallets.user_id = auth.uid())
);

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tickets: Customers can read own, technicians assigned to them can read, admins can read all
CREATE POLICY "Customers can read own tickets" ON tickets FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Admins can read all tickets" ON tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Messages: Only sender, ticket customer, or admin can read
CREATE POLICY "Relevant parties can read messages" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM tickets 
    WHERE tickets.id = messages.ticket_id AND tickets.customer_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Relevant parties can insert messages" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Insert initial technicians
INSERT INTO technicians (name, status, load, specialty, phone)
VALUES 
  ('David Okoro', 'Active', 85, 'Electrical', '+2348012345678'),
  ('Grace Eze', 'Idle', 0, 'HVAC', '+2348023456789'),
  ('Samuel Ade', 'Offline', 0, 'Plumbing', '+2348034567890')
ON CONFLICT DO NOTHING;

-- Insert initial service categories
INSERT INTO service_categories (name, description, icon, base_fee, status)
VALUES 
  ('Electrical', 'Wiring, repairs, and installations.', 'Zap', 15000, 'Active'),
  ('Plumbing', 'Pipe repairs, leaks, and drainage.', 'Droplet', 12000, 'Active'),
  ('HVAC', 'Air conditioning and heating systems.', 'Wind', 25000, 'Active'),
  ('Cleaning', 'Deep cleaning and maintenance.', 'Home', 8000, 'Active'),
  ('Tech Support', 'Device setup and troubleshooting.', 'Laptop', 20000, 'Active'),
  ('Handyman', 'General repairs and assembly.', 'Wrench', 10000, 'Active')
ON CONFLICT (name) DO NOTHING;
