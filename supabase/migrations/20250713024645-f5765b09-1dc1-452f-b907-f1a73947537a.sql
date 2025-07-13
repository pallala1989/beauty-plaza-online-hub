
-- First, let's clear existing technicians and add the new ones
DELETE FROM technicians;

-- Add the two new technicians with all services capabilities
INSERT INTO technicians (name, specialties, is_available) VALUES
('Yashu', ARRAY['Facial', 'Anti-Aging', 'Hair', 'Color', 'Makeup', 'Bridal', 'Waxing', 'Nails', 'Eyebrow Threading'], true),
('Maneesha', ARRAY['Facial', 'Anti-Aging', 'Hair', 'Color', 'Makeup', 'Bridal', 'Waxing', 'Nails', 'Eyebrow Threading'], true);

-- Create business hours table if it doesn't exist with proper structure
INSERT INTO business_hours (day_of_week, start_time, end_time, is_open) VALUES
(1, '09:00', '18:00', true), -- Monday
(2, '09:00', '18:00', true), -- Tuesday  
(3, '09:00', '18:00', true), -- Wednesday
(4, '09:00', '18:00', true), -- Thursday
(5, '09:00', '18:00', true), -- Friday
(6, '09:00', '17:00', true), -- Saturday
(0, '10:00', '16:00', false) -- Sunday (closed)
ON CONFLICT (day_of_week) DO UPDATE SET
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  is_open = EXCLUDED.is_open;

-- Create a function to get available time slots for a technician on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
  technician_id_param UUID,
  appointment_date_param DATE
) RETURNS TABLE(time_slot TIME) AS $$
DECLARE
  day_of_week_val INTEGER;
  business_start TIME;
  business_end TIME;
  is_business_open BOOLEAN;
BEGIN
  -- Get day of week (0 = Sunday, 1 = Monday, etc.)
  day_of_week_val := EXTRACT(DOW FROM appointment_date_param);
  
  -- Get business hours for this day
  SELECT start_time, end_time, is_open 
  INTO business_start, business_end, is_business_open
  FROM business_hours 
  WHERE day_of_week = day_of_week_val;
  
  -- If business is closed or no hours found, return empty
  IF NOT is_business_open OR business_start IS NULL THEN
    RETURN;
  END IF;
  
  -- Generate time slots every 30 minutes within business hours
  -- Exclude slots that are already booked for this technician
  RETURN QUERY
  WITH RECURSIVE time_series AS (
    SELECT business_start as slot_time
    UNION ALL
    SELECT (slot_time + INTERVAL '30 minutes')::TIME
    FROM time_series 
    WHERE (slot_time + INTERVAL '30 minutes')::TIME < business_end
  )
  SELECT slot_time
  FROM time_series ts
  WHERE NOT EXISTS (
    SELECT 1 FROM appointments a 
    WHERE a.technician_id = technician_id_param 
    AND a.appointment_date = appointment_date_param 
    AND a.appointment_time = ts.slot_time
    AND a.status NOT IN ('cancelled', 'completed')
  )
  -- Only return future slots if the date is today
  AND (
    appointment_date_param > CURRENT_DATE 
    OR (appointment_date_param = CURRENT_DATE AND slot_time > CURRENT_TIME)
  );
END;
$$ LANGUAGE plpgsql;
