
-- Create a function to get all settings as a JSON object
CREATE OR REPLACE FUNCTION public.get_settings()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb := '{}';
  setting_record RECORD;
BEGIN
  FOR setting_record IN 
    SELECT key, value FROM public.settings
  LOOP
    result := result || jsonb_build_object(setting_record.key, setting_record.value);
  END LOOP;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_settings() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_settings() TO anon;
