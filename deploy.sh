#!/bin/bash

# Capsera AI Discord Bot - Deployment Script
# This script helps you deploy to Railway or Render

echo "🤖 Capsera AI Discord Bot - Deployment Helper"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized!"
    echo "Please run: git init"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Git remote not set!"
    echo "Please run: git remote add origin https://github.com/AniketShinde02/Bot.git"
    exit 1
fi

echo "✅ Git repository is ready!"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Please create .env file from env-template.txt"
    echo "Run: cp env-template.txt .env"
    echo "Then edit .env with your credentials"
    exit 1
fi

echo "✅ Environment file exists!"

# Check required environment variables
echo "🔍 Checking environment variables..."

required_vars=("DISCORD_BOT_TOKEN" "MONGODB_URI" "GEMINI_API_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo "Please add them to your .env file"
    exit 1
fi

echo "✅ All required environment variables are set!"

# Check if files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes!"
    echo "Please commit your changes before deploying:"
    echo "   git add ."
    echo "   git commit -m 'Update for deployment'"
    exit 1
fi

echo "✅ All changes are committed!"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "❌ Failed to push to GitHub!"
    exit 1
fi

echo ""
echo "🎉 Your bot is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to Railway: https://railway.app/"
echo "   - Click 'New Project'"
echo "   - Select 'Deploy from GitHub repo'"
echo "   - Choose your repository: AniketShinde02/Bot"
echo ""
echo "2. Go to Render: https://render.com/"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Configure as Node.js service"
echo ""
echo "3. Add Environment Variables in platform dashboard:"
echo "   - DISCORD_BOT_TOKEN"
echo "   - MONGODB_URI"
echo "   - GEMINI_API_KEY"
echo "   - CLOUDINARY_* (optional)"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - RAILWAY_RENDER_DEPLOYMENT.md"
echo "   - DEPLOYMENT.md"
echo ""
echo "🔗 Your repository: https://github.com/AniketShinde02/Bot"
echo ""
echo "Happy Deploying! 🚀"
