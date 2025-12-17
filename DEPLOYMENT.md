# Deployment Guide

This guide will help you deploy your Ohio Roofing Training application to a live environment.

## Prerequisites

1. **GitHub Account** (recommended for easy deployment)
2. **Supabase Project** with all SQL scripts run
3. **Environment Variables** from your Supabase project

## Step 1: Prepare Your Code

### 1.1 Create Environment File

Create a `.env` file in the root directory (this file should NOT be committed to git):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get these values:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

### 1.2 Add .env to .gitignore

Make sure `.env` is in your `.gitignore` file (it should be by default).

### 1.3 Commit Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ohio-roofing-training.git
git push -u origin main
```

## Step 2: Deploy to Vercel (Recommended - Easiest Option)

### 2.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Sign up with your GitHub account

### 2.2 Import Your Project

1. Click "Add New Project"
2. Import your GitHub repository
3. Vercel will auto-detect it's a Vite project

### 2.3 Configure Environment Variables

1. In the project settings, go to "Environment Variables"
2. Add the following:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click "Save"

### 2.4 Deploy

1. Click "Deploy"
2. Vercel will automatically build and deploy your app
3. Your app will be live at `https://your-project-name.vercel.app`

### 2.5 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow the DNS configuration instructions

## Alternative: Deploy to Netlify

### 3.1 Sign Up for Netlify

1. Go to https://netlify.com
2. Sign up with your GitHub account

### 3.2 Import Your Project

1. Click "Add new site" → "Import an existing project"
2. Connect to GitHub and select your repository
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Click "Show advanced" and add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### 3.3 Deploy

1. Click "Deploy site"
2. Your app will be live at `https://random-name.netlify.app`

## Alternative: Deploy to GitHub Pages

### 4.1 Install gh-pages

```bash
npm install --save-dev gh-pages
```

### 4.2 Update package.json

Add these scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "npm run build && gh-pages -d dist"
}
```

### 4.3 Update vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.PNG", "**/*.JPG", "**/*.JPEG", "**/*.MOV", "**/*.MP4", "**/*.PDF"],
  base: '/ohio-roofing-training/', // Replace with your repo name
});
```

### 4.4 Deploy

```bash
npm run deploy
```

**Note:** GitHub Pages doesn't support environment variables easily. You may need to use a different approach for Supabase credentials.

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test user registration
- [ ] Test user login
- [ ] Test quiz functionality
- [ ] Test leaderboard
- [ ] Verify all images and videos load correctly
- [ ] Test on mobile devices
- [ ] Set up custom domain (if desired)

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify `npm run build` works locally
- Check build logs for specific errors

### Supabase Connection Issues
- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies are set up correctly

### Assets Not Loading
- Verify file paths are correct
- Check that assets are in the `src/assets` directory
- Ensure Vite config includes all file extensions

## Recommended: Vercel

**Why Vercel?**
- ✅ Automatic deployments on git push
- ✅ Free tier with generous limits
- ✅ Easy environment variable management
- ✅ Built-in SSL certificates
- ✅ Excellent performance (CDN)
- ✅ Perfect for Vite/React apps

## Support

If you encounter issues:
1. Check the deployment platform's logs
2. Verify all SQL scripts have been run in Supabase
3. Test the build locally: `npm run build && npm run preview`

