
-- Add unique constraint to prevent double bookings for same technician, date, and time
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'unique_technician_datetime') THEN
        ALTER TABLE appointments ADD CONSTRAINT unique_technician_datetime 
        UNIQUE (technician_id, appointment_date, appointment_time);
    END IF;
END $$;

-- Add status column if it doesn't exist with proper default
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'status') THEN
        ALTER TABLE appointments ADD COLUMN status text DEFAULT 'scheduled';
    END IF;
END $$;

-- Enable RLS on appointments table if not already enabled
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;

-- Create policy for customers to view their own appointments
CREATE POLICY "Users can view their own appointments" 
ON appointments FOR SELECT 
USING (auth.uid() = customer_id);

-- Create policy for customers to insert their own appointments
CREATE POLICY "Users can insert their own appointments" 
ON appointments FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Create policy for customers to update their own appointments
CREATE POLICY "Users can update their own appointments" 
ON appointments FOR UPDATE 
USING (auth.uid() = customer_id);
