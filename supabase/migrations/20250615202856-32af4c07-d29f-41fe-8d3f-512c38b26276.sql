
-- Create settings table for configurable values
CREATE TABLE IF NOT EXISTS public.settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on settings if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class
        WHERE relname = 'settings' AND relrowsecurity = 't'
    ) THEN
        ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
    END IF;
END;
$$;


-- Allow everyone to read settings
DROP POLICY IF EXISTS "Anyone can read settings" ON public.settings;
CREATE POLICY "Anyone can read settings" ON public.settings
    FOR SELECT USING (true);

-- Only admins can modify settings
DROP POLICY IF EXISTS "Only admins can modify settings" ON public.settings;
CREATE POLICY "Only admins can modify settings" ON public.settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
         EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Insert default settings if they don't exist
INSERT INTO public.settings (key, value, description) VALUES
('service_prices', '{"facial": 75, "haircut": 50, "manicure": 35, "pedicure": 45}', 'Default service prices'),
('referral_amounts', '{"referrer_credit": 10, "referred_discount": 10}', 'Referral program amounts'),
('loyalty_settings', '{"points_per_dollar": 10, "min_redemption": 100, "redemption_rate": 10}', 'Loyalty program settings'),
('in_home_fee', '25', 'Additional fee for in-home services'),
('loyalty_tiers', '{"bronze": 0, "silver": 500, "gold": 1000, "platinum": 2000}', 'Loyalty tier thresholds')
ON CONFLICT (key) DO NOTHING;

-- Insert/Update contact info
INSERT INTO public.settings (key, value)
VALUES
  ('contact_phone', '"(903) 921-0271"'),
  ('contact_email', '"info@beautyplaza.com"'),
  ('contact_address_line1', '"2604 Jacqueline Dr"'),
  ('contact_address_line2', '"Wilmington, DE - 19810"')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value;
