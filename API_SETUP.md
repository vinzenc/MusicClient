# 🎵 Nocturne - Music Player Frontend

Ứng dụng nghe nhạc hiện đại được xây dựng với **React 19 + Vite + Tailwind CSS**.

## 📋 Yêu cầu Backend API

Để chạy ứng dụng, bạn cần một backend API với các endpoint sau:

### **Authentication Endpoints**
```
POST /api/auth/login
  Body: { email: string, password: string }
  Response: { user: User, token: string }

POST /api/auth/register
  Body: { email: string, password: string, name: string }
  Response: { user: User, token: string }

POST /api/auth/logout
  Response: { message: string }

GET /api/auth/me
  Response: { user: User }
```

### **Tracks Endpoints**
```
GET /api/tracks/trending
  Response: Array<Track>

GET /api/tracks/:id
  Response: Track

GET /api/tracks/search?q=query
  Response: Array<Track>

POST /api/player/play
  Body: { trackId: number }
  Response: { success: boolean }

POST /api/player/pause
  Response: { success: boolean }

POST /api/player/skip
  Body: { direction: 'next' | 'prev' }
  Response: { success: boolean }
```

### **Albums Endpoints**
```
GET /api/albums/featured
  Response: Array<Album>

GET /api/albums/:id
  Response: Album
```

### **Playlists Endpoints**
```
GET /api/users/:userId/playlists
  Response: Array<Playlist>

GET /api/playlists/:id
  Response: Playlist

GET /api/users/:userId/recently-played
  Response: Array<Track>
```

### **Library Endpoints**
```
POST /api/library/add
  Body: { trackId: number }
  Response: { success: boolean }

POST /api/library/remove
  Body: { trackId: number }
  Response: { success: boolean }
```

## 🚀 Cấu hình Frontend

### 1. Clone và cài đặt
```bash
npm install
```

### 2. Tạo `.env.local`
Copy từ `.env.local.example`:
```bash
cp .env.local.example .env.local
```

Sau đó sửa URL backend của bạn:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Chạy dev server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173/`

## 📁 Cấu trúc Project

```
src/
├── components/          # React components
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── MainContent.jsx
│   ├── FeaturedSection.jsx
│   ├── TrendingSection.jsx
│   ├── RecentlyPlayedSection.jsx
│   ├── PlayerFooter.jsx
│   └── index.js
├── contexts/            # React Context for state management
│   ├── AuthContext.jsx  # User authentication
│   └── MusicContext.jsx # Music player state
├── services/            # API integration
│   └── api.js          # API endpoints
├── App.jsx
├── main.jsx
└── index.css
```

## 🔌 Tích hợp API

Tất cả các components đều sử dụng API thực từ backend qua:
- `useAuth()` - Quản lý authentication
- `useMusic()` - Quản lý player state và tracks

**Ví dụ:**
```javascript
import { useMusic } from '../contexts/MusicContext';

function Component() {
  const { trendingTracks, playTrack, loading } = useMusic();
  
  useEffect(() => {
    fetchTrendingTracks();
  }, []);
  
  return <div onClick={() => playTrack(trackId)}>Play</div>;
}
```

## ⚙️ Mock Data Fallback

Nếu API chưa sẵn sàng hoặc fail, app sẽ tự động fallback sang mock data để UI vẫn hiển thị được. Khi backend API sẵn sàng, dữ liệu sẽ tự động thay thế.

## 🛠 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📚 Công nghệ sử dụng

- **React 19** - UI framework
- **Vite 7** - Build tool
- **Tailwind CSS 3** - Styling
- **Material Symbols** - Icons
- **Context API** - State management

## 📝 Notes

- Tất cả API calls có error handling tích hợp
- Loading states được quản lý trong contexts
- Responsive design - hoạt động trên desktop và mobile
- Dark mode được enable mặc định

## 🔐 Authentication Flow

1. User bấm "Đăng nhập & Đăng ký"
2. Form login/register gọi `musicAPI.login()` hoặc `musicAPI.register()`
3. Server trả về user object + token
4. Token được lưu (frontend hoặc localStorage - tuỳ backend)
5. Tất cả API calls sau đó include token trong headers (tuỳ backend setup)

## ❓ Troubleshooting

**Lỗi "Cannot apply unknown utility class"**
- Xoá `node_modules` và `.next` (nếu có)
- Chạy `npm install` lại
- Restart dev server

**Backend API không kết nối**
- Kiểm tra `VITE_API_BASE_URL` trong `.env.local`
- Đảm bảo backend server đang chạy
- Kiểm tra CORS headers từ backend

---

**Sẵn sàng để commit lên GitHub!** 🚀
