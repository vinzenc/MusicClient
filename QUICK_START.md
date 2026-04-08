# 🚀 Quick Start Guide

**Want to get started in 5 minutes?** Follow this guide.

## Step 1: Setup (2 minutes)

### Windows
```bash
setup.bat
```

### macOS/Linux
```bash
bash setup.sh
```

### Or Manual Setup
```bash
npm install
cp .env.local.example .env.local
```

## Step 2: Configure Backend (1 minute)

Edit `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Replace `http://localhost:3000/api` with your actual backend URL.

## Step 3: Run (1 minute)

```bash
npm run dev
```

Open: **http://localhost:5173**

## Step 4: Test Features

1. **Login/Register** - Click "Đăng nhập & Đăng ký"
2. **Trending Tracks** - Scroll down to see trending songs
3. **Player** - Click play button at bottom
4. **Skip** - Use next/prev buttons

## 🎸 That's it!

Start developing. The app is ready to integrate with your backend API.

---

## 📚 Need More Info?

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Full project overview |
| [API_SETUP.md](./API_SETUP.md) | API configuration details |
| [BACKEND_API_REFERENCE.md](./BACKEND_API_REFERENCE.md) | Backend implementation guide |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | How to deploy to production |
| [FEATURES.md](./FEATURES.md) | Feature list & status |
| [COMMIT_CHECKLIST.md](./COMMIT_CHECKLIST.md) | Ready to push to GitHub? |

---

## ⚡ Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Debugging
npm run build            # Check for build errors
# Check browser console (F12) for API errors

# Cleanup
npm install              # Reinstall dependencies
rm -rf node_modules      # Delete dependencies (then npm install)
```

---

## 🔗 Backend API Setup

Your backend needs these endpoints:

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me
GET    /api/tracks/trending
POST   /api/player/play
POST   /api/player/pause
POST   /api/player/skip
```

See [BACKEND_API_REFERENCE.md](./BACKEND_API_REFERENCE.md) for full spec.

---

## 🆘 Troubleshooting

**API calls failing?**
- Check `VITE_API_BASE_URL` in `.env.local`
- Ensure backend is running
- Check browser console (F12) for CORS errors
- Backend must have CORS headers

**Build errors?**
- Run `npm install` again
- Delete `node_modules` and `.vite`
- Restart dev server

**Styling not loading?**
- Hard refresh browser (Ctrl+Shift+R)
- Check Tailwind config in `tailwind.config.js`

---

## 📱 Responsive?

The app is responsive by default. Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Use Chrome DevTools: F12 → Device toolbar

---

## ✅ Ready for Production?

1. ✅ Backend API ready?
2. ✅ `npm run build` works?
3. ✅ Ready to deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment options.

---

## 🎵 Enjoy Building!

You have a modern music player. Add your API endpoints and go live!

**Next:** Read [BACKEND_API_REFERENCE.md](./BACKEND_API_REFERENCE.md) to implement backend endpoints.

---

**Problems? Check the full [README.md](./README.md)** 📖
