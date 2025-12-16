-- How to properly delete users from Supabase
-- IMPORTANT: Run these in order

-- Step 1: Delete from user_profiles table (if you haven't already)
DELETE FROM user_profiles;

-- Step 2: Delete from auth.users table
-- This is the actual authentication table - users can still sign in if they exist here
-- You can delete all users or specific ones

-- Option A: Delete ALL users (use with caution!)
-- DELETE FROM auth.users;

-- Option B: Delete specific user by email
-- DELETE FROM auth.users WHERE email = 'user@example.com';

-- Option C: Delete specific user by ID (UUID)
-- DELETE FROM auth.users WHERE id = 'user-uuid-here';

-- Step 3: Verify deletion
-- Check auth.users table
SELECT id, email, created_at FROM auth.users;

-- Check user_profiles table
SELECT id, email, first_name, last_name, role FROM user_profiles;

