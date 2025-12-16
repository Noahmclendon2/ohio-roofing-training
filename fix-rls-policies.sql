-- Fix RLS Policies to prevent infinite recursion
-- Run this in your Supabase SQL Editor

-- Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Create a function to check if current user is admin
-- This function uses SECURITY DEFINER to bypass RLS when checking admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create the admin policy that uses the function
-- This avoids recursion because the function bypasses RLS
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    public.is_admin(auth.uid())
  );

