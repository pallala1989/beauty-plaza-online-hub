
-- Remove the existing constraint if it exists and recreate it properly
DO $$
BEGIN
    -- Try to drop the constraint if it exists
    BEGIN
        ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS unique_technician_datetime;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
    
    -- Recreate the constraint
    ALTER TABLE public.appointments 
    ADD CONSTRAINT unique_technician_datetime 
    UNIQUE (technician_id, appointment_date, appointment_time);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create a function to make a user admin (replace 'your-email@example.com' with actual email)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin'
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'User with email % not found. Please make sure the user has signed up first.', user_email;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users (admins can use this)
GRANT EXECUTE ON FUNCTION public.make_user_admin(text) TO authenticated;
