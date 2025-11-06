# 🚀 Complete Deployment Guide

This guide will help you deploy the Course Builder to:
- **Supabase** - PostgreSQL Database
- **Railway** - Backend API
- **Vercel** - Frontend Application

---

## 📋 Prerequisites

- ✅ GitHub repository (already connected)
- ✅ Supabase account (free tier works)
- ✅ Railway account (free tier works)
- ✅ Vercel account (free tier works)

---

## 🗄️ Step 1: Supabase Database Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name:** `course-builder-db`
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

### 1.2 Get Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Copy the **"URI"** connection string
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
4. **Save this** - you'll need it for Railway!

### 1.3 Run Database Migration

**Option A: Using Supabase SQL Editor (Recommended)**

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Open `backend/database/schema.sql` from your project
4. Copy **ALL** contents and paste into SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. You should see: "Success. No rows returned"

**Option B: Using Local Script**

```bash
# Set DATABASE_URL to your Supabase connection string
cd backend
$env:DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
npm run migrate
```

### 1.4 Seed Database (Optional)

1. In Supabase SQL Editor, create a new query
2. Copy contents from `backend/database/seed.sql`
3. Paste and run

**✅ Database is ready!**

---

## 🚂 Step 2: Railway Backend Deployment

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `course_builder_fs`
5. Railway will detect the project

### 2.2 Configure Backend Service

1. Railway should auto-detect `backend/` folder
2. If not, click **"Add Service"** → **"GitHub Repo"**
3. Select your repo and set **Root Directory** to `backend`

### 2.3 Set Environment Variables

In Railway dashboard, go to your service → **Variables** tab, add:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Server
PORT=3000
NODE_ENV=production

# API URLs (update after Vercel deployment)
API_BASE_URL=https://your-backend.railway.app
FRONTEND_URL=https://your-frontend.vercel.app

# CORS
CORS_ORIGIN=https://your-frontend.vercel.app
```

**⚠️ Important:**
- Replace `[PASSWORD]` and `[PROJECT]` with your Supabase credentials
- `FRONTEND_URL` and `CORS_ORIGIN` - update after Vercel deployment

### 2.4 Deploy

1. Railway will auto-deploy when you push to GitHub
2. Or click **"Deploy"** button
3. Wait for build to complete
4. Copy your **Railway URL** (e.g., `https://your-backend.railway.app`)

**✅ Backend is deployed!**

### 2.5 Test Backend

Open in browser:
- `https://your-backend.railway.app/api/v1/courses`
- Should return JSON with courses

---

## ⚡ Step 3: Vercel Frontend Deployment

### 3.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `course_builder_fs`
4. Vercel will auto-detect it's a Vite project

### 3.2 Configure Build Settings

1. **Root Directory:** `frontend`
2. **Framework Preset:** Vite (auto-detected)
3. **Build Command:** `npm run build` (auto)
4. **Output Directory:** `dist` (auto)
5. **Install Command:** `npm ci` (auto)

### 3.3 Set Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**, add:

```env
VITE_API_URL=https://your-backend.railway.app/api/v1
VITE_ENV=production
```

**⚠️ Replace `your-backend.railway.app` with your actual Railway URL!**

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Copy your **Vercel URL** (e.g., `https://your-frontend.vercel.app`)

**✅ Frontend is deployed!**

### 3.5 Update Railway CORS

Now go back to Railway and update:
- `FRONTEND_URL=https://your-frontend.vercel.app`
- `CORS_ORIGIN=https://your-frontend.vercel.app`

Railway will auto-redeploy.

---

## 🔄 Step 4: Final Configuration

### 4.1 Update Vercel Environment Variable

If your Railway URL changed, update `VITE_API_URL` in Vercel:
1. Go to Vercel → **Settings** → **Environment Variables**
2. Update `VITE_API_URL` with correct Railway URL
3. Redeploy (or it will auto-update)

### 4.2 Test Complete Flow

1. **Frontend:** `https://your-frontend.vercel.app`
2. **Backend API:** `https://your-backend.railway.app/api/v1/courses`
3. **Database:** Check Supabase dashboard → **Table Editor**

---

## 🐛 Troubleshooting

### Backend Not Connecting to Database

- ✅ Check `DATABASE_URL` in Railway matches Supabase connection string
- ✅ Verify Supabase project is active (not paused)
- ✅ Check Railway logs: Railway dashboard → **Deployments** → **View Logs**

### CORS Errors

- ✅ Ensure `CORS_ORIGIN` in Railway matches your Vercel URL exactly
- ✅ Include `https://` in the URL
- ✅ No trailing slash

### Frontend Can't Reach Backend

- ✅ Check `VITE_API_URL` in Vercel matches Railway URL
- ✅ Include `/api/v1` at the end
- ✅ Verify Railway service is running (check logs)

### Database Migration Failed

- ✅ Run migration in Supabase SQL Editor instead
- ✅ Check for syntax errors in `schema.sql`
- ✅ Verify you're using the correct database (not template1)

---

## 📝 Environment Variables Summary

### Railway (Backend)
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
PORT=3000
NODE_ENV=production
API_BASE_URL=https://your-backend.railway.app
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Vercel (Frontend)
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
VITE_ENV=production
```

### Supabase
- Connection string from Settings → Database
- No environment variables needed (just the connection string)

---

## ✅ Deployment Checklist

- [ ] Supabase project created
- [ ] Database migration run in Supabase SQL Editor
- [ ] Database seeded (optional)
- [ ] Railway project created and connected to GitHub
- [ ] Railway environment variables set
- [ ] Railway deployment successful
- [ ] Railway URL copied
- [ ] Vercel project created and connected to GitHub
- [ ] Vercel environment variables set (with Railway URL)
- [ ] Vercel deployment successful
- [ ] Vercel URL copied
- [ ] Railway CORS updated with Vercel URL
- [ ] Frontend can load courses from backend
- [ ] All services working end-to-end

---

## 🎉 Success!

Your Course Builder is now live:
- **Frontend:** `https://your-frontend.vercel.app`
- **Backend:** `https://your-backend.railway.app`
- **Database:** Supabase (managed)

**Next Steps:**
- Monitor logs in Railway and Vercel dashboards
- Set up custom domains (optional)
- Configure CI/CD for auto-deployment on push

---

**Need help?** Check the troubleshooting section or review logs in each platform's dashboard.

