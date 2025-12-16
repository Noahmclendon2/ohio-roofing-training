-- Add first_name and last_name columns to existing user_profiles table
-- Run this in your Supabase SQL Editor

ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS first_name TEXT;

ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Update the trigger function to include names from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role)
  VALUES (NEW.id, NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NULL),
    'trainee');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

