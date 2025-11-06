# 📁 Deployment File Structure

## ✅ Correct Structure for Railway Deployment

```
MainDevelopment_tamplates/
├── Dockerfile              ← Single Dockerfile at root (builds backend/)
├── railway.json            ← Railway config (points to Dockerfile)
├── .dockerignore           ← Excludes frontend, docs, etc.
│
├── backend/                ← Backend source code
│   ├── Dockerfile          ❌ REMOVED (was duplicate)
│   ├── railway.json        ❌ REMOVED (was conflicting)
│   ├── Procfile            ✅ Kept as backup (not used with Docker)
│   ├── package.json
│   ├── server.js
│   └── ...
│
├── frontend/               ← Frontend (not needed for Railway)
│   └── ...
│
└── scripts/                ← Local dev scripts (not in Docker)
    └── ...
```

## 🎯 Railway Configuration

**In Railway Dashboard:**
- **Root Directory:** `/` (root of repo)
- **Builder:** Dockerfile (auto-detected from `railway.json`)
- **Dockerfile Path:** `Dockerfile` (root level)

**How it works:**
1. Railway reads `railway.json` → finds `Dockerfile`
2. Dockerfile copies `backend/` into container
3. Installs dependencies from `backend/package.json`
4. Runs `npm start` (which runs `node server.js`)

## 🗑️ Files Removed (Were Duplicates/Conflicts)

- ❌ Root `Procfile` (not needed with Docker)
- ❌ Root `start.sh` (not needed with Docker)
- ❌ `backend/Dockerfile` (duplicate, moved to root)
- ❌ `backend/railway.json` (conflicting config)

## ✅ Files Kept

- ✅ `backend/Procfile` - Backup if Railway falls back to NIXPACKS
- ✅ `railway.json` - Main Railway configuration
- ✅ `Dockerfile` - Single source of truth for Docker build
- ✅ `.dockerignore` - Optimizes Docker build

## 🔧 Environment Variables (Railway)

Required in Railway dashboard:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app
```

## ✅ Verification Checklist

- [x] Single Dockerfile at root
- [x] Single railway.json at root
- [x] No duplicate Procfiles
- [x] .dockerignore excludes frontend
- [x] backend/Procfile kept as backup
- [x] All conflicting files removed

---

**Status:** ✅ Project structure cleaned and ready for deployment!

