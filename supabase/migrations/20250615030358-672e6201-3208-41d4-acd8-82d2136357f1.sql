
-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'customer', 'technician');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER, -- in minutes
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technicians table
CREATE TABLE public.technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialties TEXT[],
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id),
  technician_id UUID REFERENCES public.technicians(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type TEXT CHECK (service_type IN ('in-store', 'in-home')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  otp_verified BOOLEAN DEFAULT false,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loyalty_points table
CREATE TABLE public.loyalty_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_redeemed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'redeemed')),
  referrer_credit DECIMAL(10,2) DEFAULT 10.00,
  referred_discount DECIMAL(10,2) DEFAULT 10.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gift_cards table
CREATE TABLE public.gift_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  buyer_email TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  message TEXT,
  is_redeemed BOOLEAN DEFAULT false,
  redeemed_by UUID REFERENCES auth.users(id),
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year')
);

-- Create promotions table
CREATE TABLE public.promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage DECIMAL(5,2),
  discount_amount DECIMAL(10,2),
  code TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for services (public read, admin write)
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can create their own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = customer_id);

-- RLS Policies for loyalty points
CREATE POLICY "Users can view their own loyalty points" ON public.loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'customer');
  
  INSERT INTO public.loyalty_points (user_id, points)
  VALUES (NEW.id, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default services
INSERT INTO public.services (name, description, price, duration, is_active) VALUES
('Facial Treatment', 'Deep cleansing facial with moisturizing', 75.00, 60, true),
('Hair Styling', 'Professional hair styling and blow-dry', 45.00, 45, true),
('Makeup Application', 'Professional makeup for special occasions', 65.00, 60, true),
('Manicure', 'Complete nail care and polish application', 35.00, 30, true),
('Pedicure', 'Foot care and nail polish application', 40.00, 45, true),
('Eyebrow Threading', 'Professional eyebrow shaping', 15.00, 15, true),
('Hair Cut & Style', 'Hair cutting and styling service', 55.00, 60, true);

-- Insert some default technicians
INSERT INTO public.technicians (name, specialties, is_available) VALUES
('Sarah Johnson', '{"Facial Treatment", "Makeup Application"}', true),
('Maria Garcia', '{"Hair Styling", "Hair Cut & Style"}', true),
('Ashley Chen', '{"Manicure", "Pedicure", "Eyebrow Threading"}', true),
('Emily Rodriguez', '{"Facial Treatment", "Eyebrow Threading"}', true);

-- Insert default promotion for new customers
INSERT INTO public.promotions (title, description, discount_percentage, code, is_active, max_uses) VALUES
('New Customer Special', 'Get 10% off all services on your first appointment', 10.00, 'NEWCUSTOMER10', true, 1000);
