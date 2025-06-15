
-- Create settings table for configurable values
CREATE TABLE IF NOT EXISTS public.settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
('service_prices', '{"facial": 75, "haircut": 50, "manicure": 35, "pedicure": 45}', 'Default service prices'),
('referral_amounts', '{"referrer_credit": 10, "referred_discount": 10}', 'Referral program amounts'),
('loyalty_settings', '{"points_per_dollar": 10, "min_redemption": 100, "redemption_rate": 10}', 'Loyalty program settings'),
('in_home_fee', '25', 'Additional fee for in-home services'),
('loyalty_tiers', '{"bronze": 0, "silver": 500, "gold": 1000, "platinum": 2000}', 'Loyalty tier thresholds');

-- Create admin role if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'technician', 'admin');
    ELSE
        -- Add admin to existing enum if it doesn't exist
        BEGIN
            ALTER TYPE user_role ADD VALUE 'admin';
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- Enable RLS on settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings
CREATE POLICY "Anyone can read settings" ON public.settings
    FOR SELECT USING (true);

-- Only admins can modify settings
CREATE POLICY "Only admins can modify settings" ON public.settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create first admin user (you'll need to update this with a real user ID)
-- INSERT INTO public.profiles (id, email, full_name, role) 
-- VALUES ('your-user-id-here', 'admin@beautyplaza.com', 'Admin User', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Add unique constraint for technician datetime to prevent double booking
ALTER TABLE public.appointments 
ADD CONSTRAINT unique_technician_datetime 
UNIQUE (technician_id, appointment_date, appointment_time);
