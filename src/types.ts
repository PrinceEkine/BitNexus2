export type Role = 'customer' | 'provider' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: Role;
  phone?: string;
  address?: string;
  household_profile?: {
    size?: string;
    preferences?: string[];
    connected_devices?: Array<{ id: string; name: string; type: string; status: 'online' | 'offline' }>;
  };
  created_at: string;
}

export interface Provider extends Profile {
  specialty: string;
  bio: string;
  rating: number;
  jobs_completed: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_documents?: string[];
  availability?: Array<{ day: string; hours: string[] }>;
  is_online: boolean;
  current_location?: { lat: number; lng: number };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  base_fee: number;
  status: 'active' | 'inactive';
}

export type BookingStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'escrow' | 'released' | 'refunded';

export interface Booking {
  id: string;
  customer_id: string;
  provider_id?: string;
  category_id: string;
  description: string;
  media_urls: string[];
  scheduled_at: string;
  address: string;
  is_live_video: boolean;
  is_emergency: boolean;
  status: BookingStatus;
  payment_status: PaymentStatus;
  total_price: number;
  created_at: string;
  category?: Category;
  provider?: Provider;
}

export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  type: 'payment' | 'payout' | 'refund';
  status: string;
  provider_transaction_id?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success';
  is_read: boolean;
  created_at: string;
}
