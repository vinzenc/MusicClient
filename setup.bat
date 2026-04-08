@echo off
REM Nocturne Quick Setup Script for Windows
REM Run this after cloning the repository

echo.
echo ==================================
echo 🎵 Nocturne - Music Player Setup
echo ==================================

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ Node.js not found
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo ✅ Node.js version: %NODE_VER%

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

REM Create .env.local
if not exist .env.local (
    echo.
    echo 🔧 Creating .env.local...
    copy .env.local.example .env.local >nul
    echo ✅ Created .env.local
    echo.
    echo ⚠️  Edit .env.local and set VITE_API_BASE_URL to your backend:
    echo    VITE_API_BASE_URL=http://localhost:3000/api
) else (
    echo.
    echo ✅ .env.local already exists
)

REM Verify build
echo.
echo 🔨 Verifying build...
call npm run build >nul 2>&1

if errorlevel 1 (
    echo ⚠️  Build test failed. Run 'npm run build' to see errors
) else (
    echo ✅ Build successful
)

echo.
echo ==================================
echo ✨ Setup Complete!
echo ==================================
echo.
echo Next steps:
echo 1. Edit .env.local with your backend API URL
echo 2. Run:  npm run dev
echo 3. Open: http://localhost:5173
echo.
echo 📚 Documentation:
echo    - README.md              --^> Project overview
echo    - API_SETUP.md           --^> API configuration
echo    - FEATURES.md            --^> Feature list
echo    - DEPLOYMENT.md          --^> Deploy instructions
echo.
echo 🚀 Happy coding!
echo.
pause
