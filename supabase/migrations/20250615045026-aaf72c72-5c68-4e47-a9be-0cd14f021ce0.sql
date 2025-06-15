
-- Enable RLS on technicians table if not already enabled
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to technicians
-- This is needed for the booking system to show available technicians
CREATE POLICY "Allow public read access to technicians" 
ON technicians 
FOR SELECT 
USING (true);
