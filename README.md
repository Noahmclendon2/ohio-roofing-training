# Ohio Roofing Training Webapp

A modern web application with admin and user authentication, built with React, Vite, and Supabase.

## Features

- User registration and authentication
- User login
- Admin login with role-based access control
- Separate dashboards for users and admins
- Modern, responsive UI

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend/Auth**: Supabase (Authentication + PostgreSQL)
- **Routing**: React Router DOM

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the database to be set up

### 2. Set Up Database Schema

In your Supabase SQL Editor, run this SQL to create the user_profiles table:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project settings
   - Navigate to API settings
   - Copy your `Project URL` and `anon/public` key

3. Add them to `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Create an Admin User

1. Register a user through the app (they'll be a regular user by default)
2. Go to Supabase Dashboard > Authentication > Users
3. Note the user's UUID
4. Go to SQL Editor and run:
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE id = 'user-uuid-here';
   ```

### 5. Install Dependencies and Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
  components/          # React components
    Login.jsx         # User login page
    Register.jsx      # User registration page
    UserDashboard.jsx # User dashboard
    AdminDashboard.jsx # Admin dashboard
    ProtectedRoute.jsx # Route protection component
    Auth.css          # Auth page styles
    Dashboard.css     # Dashboard styles
  contexts/
    AuthContext.jsx   # Authentication context provider
  lib/
    supabase.js       # Supabase client configuration
  App.jsx             # Main app component with routing
  main.jsx            # App entry point
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Notes

- Email confirmation is enabled by default in Supabase. You can disable it in Supabase Auth settings if needed for development.
- The app uses Row Level Security (RLS) policies to ensure data security.
- Admin users can view all user profiles in the admin dashboard.
