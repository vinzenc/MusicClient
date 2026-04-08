#!/bin/bash

# Nocturne Quick Setup Script
# Run this after cloning the repository

echo "🎵 Nocturne - Music Player Setup"
echo "=================================="

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

# Create .env.local
if [ ! -f .env.local ]; then
    echo ""
    echo "🔧 Creating .env.local..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  Edit .env.local and set VITE_API_BASE_URL to your backend:"
    echo "   VITE_API_BASE_URL=http://localhost:3000/api"
else
    echo ""
    echo "✅ .env.local already exists"
fi

# Verify build
echo ""
echo "🔨 Verifying build..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "⚠️  Build test failed. Run 'npm run build' to see errors"
fi

echo ""
echo "=================================="
echo "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your backend API URL"
echo "2. Run:  npm run dev"
echo "3. Open: http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "   - README.md              → Project overview"
echo "   - API_SETUP.md           → API configuration"
echo "   - FEATURES.md            → Feature list"
echo "   - DEPLOYMENT.md          → Deploy instructions"
echo ""
echo "🚀 Happy coding!"
