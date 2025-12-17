-- Function to delete a user from both user_profiles and auth.users
-- This function requires admin privileges and uses SECURITY DEFINER to bypass RLS

CREATE OR REPLACE FUNCTION public.delete_user(user_id_to_delete UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;

  -- Prevent deleting yourself
  IF user_id_to_delete = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own account';
  END IF;

  -- Delete from user_profiles first (cascade will handle related data)
  DELETE FROM public.user_profiles WHERE id = user_id_to_delete;

  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$$;

-- Grant execute permission to authenticated users (the function itself checks for admin)
GRANT EXECUTE ON FUNCTION public.delete_user(UUID) TO authenticated;

