# BitNexus Service Management Platform

## Setup Instructions

### 1. Supabase Database
Go to your Supabase dashboard and run the queries found in `supabase_schema.sql` in the SQL Editor. This will set up all necessary tables and Row Level Security (RLS) policies.

### 2. Environment Variables
Add the following to your `.env` file (or Netlify environment variables):
- `VITE_SUPABASE_URL`: Your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key

### 3. Google Maps API (Optional)
To enable address auto-fill, you will need to integrate the Google Maps Places Autocomplete library in `src/components/BookingPage.tsx`.

### 4. Payments
The platform is designed to integrate with Paystack or Flutterwave. You can add your public keys and use their respective SDKs in the checkout flow.

## Features
- **Luxury UI**: Minimalist design with high-quality imagery and premium typography.
- **Customer Portal**: Booking workflow, active ticket tracking, and service history.
- **Admin Engine**: Ticket assignment, technician performance tracking, and dynamic pricing control.
- **Responsive**: Fully optimized for desktop and mobile devices.
