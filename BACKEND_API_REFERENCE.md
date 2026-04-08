# Backend API Reference for Nocturne Frontend

Frontend được implement sẵn để gọi các API endpoints dưới đây. Backend team cần implement đúng endpoints này để frontend hoạt động.

## Base URL
```
http://localhost:3000/api  (development)
https://api.example.com/api  (production)
```

Environment variable từ frontend: `VITE_API_BASE_URL`

---

## 🔐 Authentication Endpoints

### POST /auth/login
**Purpose:** User đăng nhập

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "tier": "premium"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

---

### POST /auth/register
**Purpose:** Tạo account mới

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "secure_password",
  "name": "New User"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "name": "New User",
    "tier": "free"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### POST /auth/logout
**Purpose:** Đăng xuất user hiện tại

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /auth/me
**Purpose:** Lấy thông tin user hiện tại

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "tier": "premium"
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

---

## 🎵 Tracks Endpoints

### GET /tracks/trending
**Purpose:** Lấy danh sách trending tracks

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Midnight Pulse",
    "artist": "Synthwave Dreams",
    "duration": 240,
    "cover": "https://...",
    "plays": 15000,
    "isPopular": true
  },
  ...
]
```

---

### GET /tracks/:id
**Purpose:** Lấy thông tin chi tiết của 1 track

**URL:** `/tracks/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Midnight Pulse",
  "artist": "Synthwave Dreams",
  "duration": 240,
  "cover": "https://...",
  "album": "Neon Dreams",
  "year": 2024,
  "plays": 15000,
  "likes": 1200,
  "isPopular": true
}
```

---

### GET /tracks/search?q=query
**Purpose:** Tìm kiếm tracks theo keyword

**Query Parameters:**
- `q` (required): Từ khóa tìm kiếm

**Example:** `/tracks/search?q=midnight`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Midnight Pulse",
    "artist": "Synthwave Dreams",
    "duration": 240,
    "cover": "https://..."
  },
  ...
]
```

---

## 💿 Albums Endpoints

### GET /albums/featured
**Purpose:** Lấy danh sách featured albums

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Neon Dreams",
    "artist": "Synthwave Dreams",
    "cover": "https://...",
    "tracks": [
      { "id": 1, "title": "Midnight Pulse", "duration": 240 },
      ...
    ],
    "year": 2024,
    "genre": "Synthwave"
  },
  ...
]
```

---

### GET /albums/:id
**Purpose:** Lấy thông tin album chi tiết

**URL:** `/albums/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Neon Dreams",
  "artist": "Synthwave Dreams",
  "cover": "https://...",
  "description": "...",
  "year": 2024,
  "genre": "Synthwave",
  "tracks": [
    {
      "id": 1,
      "title": "Midnight Pulse",
      "duration": 240,
      "artist": "Synthwave Dreams"
    },
    ...
  ]
}
```

---

## ▶️ Player Endpoints

### POST /player/play
**Purpose:** Phát 1 track

**Request:**
```json
{
  "trackId": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "currentTrack": {
    "id": 1,
    "title": "Midnight Pulse",
    "artist": "Synthwave Dreams"
  }
}
```

---

### POST /player/pause
**Purpose:** Tạm dừng playback

**Response (200 OK):**
```json
{
  "success": true
}
```

---

### POST /player/skip
**Purpose:** Bỏ qua track hiện tại (next hoặc previous)

**Request:**
```json
{
  "direction": "next"
}
```

**Possible directions:** `"next"` | `"prev"`

**Response (200 OK):**
```json
{
  "success": true,
  "currentTrack": {
    "id": 2,
    "title": "Neon Nights",
    "artist": "Synthwave Dreams"
  }
}
```

---

## 👤 User Endpoints

### GET /users/:userId/recently-played
**Purpose:** Lấy danh sách tracks đã phát gần đây của user

**URL:** `/users/1/recently-played`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Midnight Pulse",
    "artist": "Synthwave Dreams",
    "duration": 240,
    "cover": "https://...",
    "playedAt": "2024-01-10T15:30:00Z"
  },
  ...
]
```

---

### GET /users/:userId/playlists
**Purpose:** Lấy danh sách playlists của user

**URL:** `/users/1/playlists`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "My Favorites",
    "description": "My favorite tracks",
    "cover": "https://...",
    "trackCount": 25,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  ...
]
```

---

## 📚 Library Endpoints

### POST /library/add
**Purpose:** Thêm track vào library

**Request:**
```json
{
  "trackId": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Track added to library"
}
```

---

### POST /library/remove
**Purpose:** Xoá track khỏi library

**Request:**
```json
{
  "trackId": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Track removed from library"
}
```

---

## 🔒 Authentication

Tất cả protected endpoints (có `Authorization` header requirement) cần return:

**401 Unauthorized:**
```json
{
  "error": "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "error": "You don't have permission"
}
```

---

## 📡 CORS Configuration

Backend CẦN có CORS headers:

```javascript
// Example response headers
Access-Control-Allow-Origin: http://localhost:5173, https://your-frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 🧪 Test với Frontend

**1. Tạo `.env.local` với:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**2. Run frontend:**
```bash
npm run dev
```

**3. Backend cần running trên `http://localhost:3000`**

**4. Frontend sẽ tự động gọi API khi:**
- Page load lần đầu
- User click buttons
- Form submissions
- Navigation

---

## 💡 Notes

- Frontend sử dụng `fetch` API (modern browsers)
- Error handling: Frontend log errors vào console, show simple messages to users
- Token storage: Tùy backend (JWT, sessions, etc.) - frontend sẽ send như backend expects
- Response format phải đúng JSON hoặc API will fail
- Recommended response times: < 1s cho best UX

---

**Backend ready? Hãy set VITE_API_BASE_URL và test! 🚀**
