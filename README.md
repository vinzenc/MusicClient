# 🎵 Nocturne - Music Streaming Player

A modern, sleek music streaming application built with **React 19**, **Vite**, and **Tailwind CSS**. Features a neon-inspired dark theme with full music player controls and API integration.

## ✨ Features

- 🎶 **Music Player** - Play, pause, skip controls
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔐 **User Authentication** - Login, register, user profiles
- 📊 **Trending Tracks** - Discover what's popular
- ⏰ **Recently Played** - Track your listening history
- 🌙 **Dark Theme** - Neon colors with sleek UI
- 🔄 **Real API Integration** - All features call backend API
- ⚡ **Fast** - Vite bundler for instant HMR

## 🚀 Quick Start

### 1. Setup
```bash
git clone <your-repo-url>
cd musicclient
npm install
```

### 2. Configure API
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and set your backend API URL:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser

### 4. Build for Production
```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/              # React components
│   ├── Header.jsx           # Top navigation with user menu
│   ├── Sidebar.jsx          # Left navigation panel
│   ├── PlayerFooter.jsx     # Music player controls
│   ├── TrendingSection.jsx  # Trending tracks
│   ├── RecentlyPlayedSection.jsx  # User's recently played
│   └── FeaturedSection.jsx  # Featured albums
├── contexts/                # React Context API
│   ├── AuthContext.jsx      # User authentication state
│   └── MusicContext.jsx     # Music player state
├── services/
│   └── api.js              # API integration layer
├── App.jsx                 # Root component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## 🎨 Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool & dev server
- **Tailwind CSS 3** - Styling framework
- **Material Symbols** - Icon library
- **Context API** - State management

## 🔐 Authentication

The app uses Context API for auth state management. All auth endpoints are pre-configured:
- Login/Register
- Logout
- Get current user
- Automatic session restore on app load

Example:
```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  return user ? <div>Hello {user.name}</div> : <LoginButton />;
}
```

## 🎵 Music Player

Control music playback with pre-configured endpoints:
```jsx
import { useMusic } from './contexts/MusicContext';

function Player() {
  const { currentTrack, isPlaying, togglePlayPause, skipTrack } = useMusic();
  
  return (
    <button onClick={togglePlayPause}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}
```

## 📝 Environment Variables

Create `.env.local` from `.env.local.example`:

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:3000/api
```

The API base URL must match your backend server URL (development, staging, or production).

## 🧪 Testing

Test the app with mock API responses (fallback mode):
```bash
npm run dev
# The app will use mock data if backend is unavailable
```

## 📦 Build & Deploy

### Build
```bash
npm run build
# Output: dist/ folder with optimized assets
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
# Then set VITE_API_BASE_URL in Vercel dashboard
```

### Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
# Then set VITE_API_BASE_URL in Netlify UI
```

## 🐛 Error Handling

All API calls have built-in error handling:
- Network errors logged to console
- User-friendly error messages shown in UI
- Automatic fallback to mock data in development

## 🔗 Backend API

Frontend expects backend API at the URL configured in `.env.local`.

**Required endpoints:**

Quick checklist:
- ✅ Auth endpoints (login, register, logout, me)
- ✅ Track endpoints (trending, search, play, pause, skip)
- ✅ Album endpoints (featured, details)
- ✅ User endpoints (recently played, playlists)
- ✅ CORS headers enabled

## ✅ Checklist

- [ ] Backend API ready and running
- [ ] `.env.local` configured with correct API URL
- [ ] `npm install` successful
- [ ] `npm run dev` no errors
- [ ] `npm run build` no errors
- [ ] All API endpoints responding
- [ ] Ready to deploy!

## 🎯 Next Steps

1. **Setup Backend** - Ensure your backend API is running.
2. **Configure API URL** - Set in `.env.local`
3. **Test Locally** - Run `npm run dev`
4. **Deploy** - Build and deploy to your preferred platform.

## 📄 License

[Your License Here]

## 👥 Contributing

Contributions welcome! Please follow the existing code style.

---

**Built with ❤️ for music lovers** 🎵
