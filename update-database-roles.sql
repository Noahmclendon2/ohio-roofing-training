-- IMPORTANT: Run this entire script at once
-- This script will migrate your database from 'user' role to 'trainee' role

-- Step 1: Drop the old constraint FIRST (this allows us to insert/update any role temporarily)
ALTER TABLE user_profiles 
  DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Step 2: Update all existing users with 'user' role to 'trainee'
UPDATE user_profiles 
SET role = 'trainee' 
WHERE role = 'user';

-- Step 3: Update the default value for the column
ALTER TABLE user_profiles 
  ALTER COLUMN role SET DEFAULT 'trainee';

-- Step 4: Add the new constraint with 'trainee' and 'admin'
ALTER TABLE user_profiles 
  ADD CONSTRAINT user_profiles_role_check 
  CHECK (role IN ('trainee', 'admin'));

-- Step 5: Update the trigger function to use 'trainee' instead of 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'trainee');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

