# 🚀 Deployment Quick Reference

Quick checklist for deploying Course Builder.

---

## 📋 Environment Variables Checklist

### 🗄️ Supabase (Database)

**Get Connection String:**
1. Supabase Dashboard → **Settings** → **Database**
2. Copy **"URI"** connection string
3. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

**Run Migration:**
- Use Supabase **SQL Editor** → Paste `backend/database/schema.sql` → Run

---

### 🚂 Railway (Backend)

**Required Variables:**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Steps:**
1. Connect GitHub repo → Select `backend/` as root
2. Add environment variables above
3. Deploy → Copy Railway URL
4. Test: `https://your-backend.railway.app/api/v1/courses`

---

### ⚡ Vercel (Frontend)

**Required Variables:**
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
VITE_ENV=production
```

**Steps:**
1. Import GitHub repo → Set root to `frontend/`
2. Add environment variables (use your Railway URL)
3. Deploy → Copy Vercel URL
4. Update Railway `CORS_ORIGIN` with Vercel URL

---

## 🔄 Deployment Order

1. **Supabase** → Create project → Run migration
2. **Railway** → Deploy backend → Get URL
3. **Vercel** → Deploy frontend → Get URL
4. **Railway** → Update CORS with Vercel URL

---

## ✅ Quick Test

- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.railway.app/api/v1/courses`
- Should see JSON with courses

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Update `CORS_ORIGIN` in Railway with exact Vercel URL |
| Database connection failed | Check `DATABASE_URL` format in Railway |
| Frontend can't reach backend | Verify `VITE_API_URL` in Vercel matches Railway URL |
| Migration failed | Run in Supabase SQL Editor instead |

---

**Full Guide:** See `DEPLOYMENT_GUIDE.md` for detailed steps.

