# Nocturne - Music Player Application

Một ứng dụng nghe nhạc hiện đại được xây dựng với **React + Vite + Tailwind CSS**

## 🎨 Tính năng

- ✨ Giao diện modern với neon colors (Fuchsia, Teal, Yellow)
- 🎵 Hiển thị danh sách nhạc trending
- 📻 Trình phát nhạc tích hợp
- 🔍 Tìm kiếm nhạc và nghệ sĩ
- 📚 Quản lý thư viện nhạc
- 🎯 Danh sách nhạc vừa phát

## 📁 Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── Header.jsx       # Top header with search
│   ├── MainContent.jsx  # Main layout container
│   ├── FeaturedSection.jsx      # Hero section
│   ├── TrendingSection.jsx      # Trending tracks display
│   ├── RecentlyPlayedSection.jsx # Recently played tracks
│   └── PlayerFooter.jsx # Music player controls
├── services/            # API services
│   └── api.js          # API integration
├── App.jsx             # Root component
├── main.jsx            # Entry point
├── index.css           # Global styles + Tailwind
└── config.js           # App configuration
```

## 🚀 Bắt đầu

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy dev server
```bash
npm run dev
```
Ứng dụng sẽ chạy ở `http://localhost:5173/`

### 3. Build cho production
```bash
npm run build
```

## 🔌 Tích hợp Backend API

### Bước 1: Cấu hình API base URL

Tạo file `.env.local` trong thư mục gốc:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Bước 2: Sử dụng API service

Import và sử dụng `musicAPI` từ `src/services/api.js`:

```jsx
import { musicAPI } from './services/api';

// Lấy danh sách nhạc trending
const tracks = await musicAPI.getTrendingTracks();

// Tìm kiếm
const results = await musicAPI.searchTracks('song name');

// Thêm vào thư viện
await musicAPI.addToLibrary(trackId);
```

## 📝 API Endpoints (chuẩn bị)

### Tracks
- `GET /api/tracks/trending` - Lấy nhạc trending
- `GET /api/tracks/:id` - Lấy thông tin track
- `GET /api/tracks/search?q=:query` - Tìm kiếm track

### Albums
- `GET /api/albums/featured` - Albums nổi bật
- `GET /api/albums/:id` - Thông tin album

### Users
- `GET /api/users/:id/recently-played` - Nhạc vừa phát
- `GET /api/users/:id/playlists` - Danh sách playlist
- `POST /api/library/add` - Thêm vào thư viện
- `POST /api/library/remove` - Xóa khỏi thư viện

## 🛠 Công nghệ sử dụng

- **React 19** - UI library
- **Vite 7** - Build tool
- **Tailwind CSS 3** - Styling
- **Material Symbols** - Icons

## 📧 Liên hệ

Để thêm tính năng hoặc báo cáo lỗi, vui lòng tạo issue hoặc pull request.
