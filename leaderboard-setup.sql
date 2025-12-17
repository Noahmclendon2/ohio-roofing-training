-- Leaderboard Setup
-- This script creates a leaderboard system with monthly earnings tracking

-- Create leaderboard_earnings table
CREATE TABLE IF NOT EXISTS public.leaderboard_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM' (e.g., '2024-01')
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_by UUID REFERENCES auth.users(id), -- Admin who updated this
  CONSTRAINT leaderboard_earnings_amount_check CHECK (amount >= 0),
  CONSTRAINT leaderboard_earnings_month_year_format CHECK (month_year ~ '^\d{4}-\d{2}$'),
  UNIQUE(user_id, month_year) -- One entry per user per month
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_leaderboard_earnings_user_id ON public.leaderboard_earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_earnings_month_year ON public.leaderboard_earnings(month_year DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_earnings_amount ON public.leaderboard_earnings(month_year, amount DESC);

-- Enable Row Level Security
ALTER TABLE public.leaderboard_earnings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own earnings
CREATE POLICY "Users can view their own earnings"
  ON public.leaderboard_earnings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can view all earnings for current month (for leaderboard)
CREATE POLICY "Users can view current month leaderboard"
  ON public.leaderboard_earnings
  FOR SELECT
  USING (
    month_year = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
  );

-- Policy: Admins can view all earnings
CREATE POLICY "Admins can view all earnings"
  ON public.leaderboard_earnings
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Policy: Admins can insert earnings
CREATE POLICY "Admins can insert earnings"
  ON public.leaderboard_earnings
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Policy: Admins can update earnings
CREATE POLICY "Admins can update earnings"
  ON public.leaderboard_earnings
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.leaderboard_earnings TO authenticated;

-- Function to get or create current month entry for a user
CREATE OR REPLACE FUNCTION public.get_or_create_leaderboard_entry(
  p_user_id UUID,
  p_amount DECIMAL DEFAULT 0.00
)
RETURNS UUID AS $$
DECLARE
  v_month_year TEXT;
  v_entry_id UUID;
BEGIN
  v_month_year := TO_CHAR(CURRENT_DATE, 'YYYY-MM');
  
  -- Try to get existing entry
  SELECT id INTO v_entry_id
  FROM public.leaderboard_earnings
  WHERE user_id = p_user_id AND month_year = v_month_year;
  
  -- If no entry exists, create one
  IF v_entry_id IS NULL THEN
    INSERT INTO public.leaderboard_earnings (user_id, amount, month_year, updated_by)
    VALUES (p_user_id, p_amount, v_month_year, auth.uid())
    RETURNING id INTO v_entry_id;
  END IF;
  
  RETURN v_entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

