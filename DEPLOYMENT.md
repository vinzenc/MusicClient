# 🚀 Deployment Guide - Nocturne Music Player

## 📦 Chuẩn bị trước deploy

### 1. Cơ bản
```bash
# Xoá node_modules cũ
rm -rf node_modules package-lock.json

# Cài đặt lại dependencies (sau khi đã remove @tailwindcss/postcss)
npm install

# Kiểm tra dev server chạy ok không
npm run dev
```

### 2. Build & Test
```bash
# Build production
npm run build

# Kiểm tra build output
npm run preview
```

## 🐙 Push lên GitHub

### Lần đầu
```bash
# Init git repo (nếu chưa có)
git init

# Add all files (except .env.local, node_modules, dist)
git add .

# Commit đầu tiên
git commit -m "Initial commit: React music player with API integration"

# Add GitHub repo
git remote add origin https://github.com/your-username/nocturne.git

# Push
git push -u origin main
```

### Push lần sau
```bash
git add .
git commit -m "Your commit message"
git push
```

## 🌐 Deploy lên Production Server

### Tùy chọn 1: Vercel (Khuyên dùng)
```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables trong Vercel dashboard:
# VITE_API_BASE_URL = https://your-api.com/api
```

### Tùy chọn 2: Netlify
```bash
# Cài Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables trong Netlify UI
```

### Tùy chọn 3: Docker (VPS, Server riêng)

**Dockerfile:**
```dockerfile
# Build stage
FROM node:20 as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build & Run:**
```bash
docker build -t nocturne-player .
docker run -p 3000:3000 \
  -e VITE_API_BASE_URL=https://api.example.com/api \
  nocturne-player
```

### Tùy chọn 4: Manual Deploy (VPS/Dedicated Server)

1. **SSH vào server:**
```bash
ssh user@your-server.com
```

2. **Clone repo:**
```bash
cd /var/www
git clone https://github.com/your-username/nocturne.git
cd nocturne
```

3. **Cài đặt:**
```bash
npm install --production
npm run build
```

4. **Setup Nginx:**
```nginx
server {
    listen 80;
    server_name music.example.com;

    location / {
        root /var/www/nocturne/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-api-server:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

5. **Reload Nginx:**
```bash
sudo systemctl reload nginx
```

## 🔐 Environment Variables

**Production: Set trong platform (Vercel, Netlify, Docker, etc.)**
```env
VITE_API_BASE_URL=https://api.example.com/api
```

Backend API URL phải:
- ✅ HTTPS (không HTTP)
- ✅ Có CORS headers
- ✅ Endpoints match với API_SETUP.md

## 🔄 CI/CD Pipeline (GitHub Actions)

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📋 Pre-Deploy Checklist

- [ ] `.env.local` file tạo từ `.env.local.example` với đúng API URL
- [ ] `npm install` chạy thành công (không errors)
- [ ] `npm run dev` hoạt động bình thường
- [ ] `npm run build` không có errors
- [ ] Backend API sẵn sàng và CORS được config
- [ ] Tất cả API endpoints hoạt động (test qua Postman/curl)
- [ ] All components render đúng (no console errors)
- [ ] responsive design kiểm tra được trên mobile
- [ ] Production build được `npm run preview` test

## 🔗 Kết nối Backend API

**Đảm bảo backend trả về đúng response format:**

```javascript
// Login response
{ user: { id, email, name, tier }, token: "jwt-token-here" }

// Trending tracks response
[
  { id, title, artist, duration, cover },
  ...
]

// Error response
{ error: "Error message here" }
```

## 📊 Monitoring

Sau khi deploy, monitor:
- Frontend errors (Sentry, LogRocket)
- API call failures
- User analytics
- Performance metrics (Core Web Vitals)

## 🔄 Update Existing Deployment

```bash
# Pull latest changes
git pull

# Update git
npm ci

# Rebuild
npm run build

# Redeploy (platform-specific commands)
vercel --prod  # Vercel
netlify deploy --prod  # Netlify
```

---

**Sẵn sàng live! 🎉**
