# Railway & Render Deployment Guide

This guide will help you deploy your Capsera AI Discord Bot to Railway or Render platforms.

## 🚀 Quick Deploy to Railway

### Step 1: Prepare Your Repository

Your repository is already prepared! The following files are configured:

- ✅ `railway.json` - Railway configuration
- ✅ `health-check.js` - Health check server
- ✅ `package.json` - Correct start script
- ✅ `discord-bot.js` - Updated with health check

### Step 2: Deploy to Railway

1. **Go to [Railway](https://railway.app/)** and sign up
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**: `AniketShinde02/Bot`
5. **Railway will automatically detect the configuration**

### Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```bash
# Required Variables
DISCORD_BOT_TOKEN=your_discord_bot_token_here
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key_here

# Optional Variables
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
DB_NAME=capsera_discord
NODE_ENV=production
PORT=10000
```

### Step 4: Deploy

Railway will automatically:
- ✅ Install dependencies (`npm install`)
- ✅ Start the bot (`npm start`)
- ✅ Run health checks
- ✅ Provide a public URL

## 🌐 Quick Deploy to Render

### Step 1: Deploy to Render

1. **Go to [Render](https://render.com/)** and sign up
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**: `AniketShinde02/Bot`
4. **Configure the service**:
   - **Name**: `capsera-discord-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 2: Configure Environment Variables

In Render dashboard, go to **Environment** tab and add:

```bash
# Required Variables
DISCORD_BOT_TOKEN=your_discord_bot_token_here
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key_here

# Optional Variables
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
DB_NAME=capsera_discord
NODE_ENV=production
PORT=10000
```

### Step 3: Deploy

Render will automatically:
- ✅ Build your application
- ✅ Start the Discord bot
- ✅ Provide a public URL
- ✅ Enable auto-deploy on git push

## 🔧 Configuration Files

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### render.yaml
```yaml
services:
  - type: web
    name: capsera-discord-bot
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    autoDeploy: true
```

## 🏥 Health Check

Your bot includes a health check server that responds to `/health` endpoint:

```bash
# Test health check
curl https://your-app-name.railway.app/health
curl https://your-app-name.onrender.com/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": 123456,
    "heapTotal": 98765,
    "heapUsed": 54321
  },
  "discord": "Capsera AI Bot is running"
}
```

## 📊 Monitoring

### Railway Monitoring
- **Logs**: Available in Railway dashboard
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: Automatic on git push
- **Health Checks**: Automatic monitoring

### Render Monitoring
- **Logs**: Available in Render dashboard
- **Metrics**: Resource usage
- **Auto-deploy**: On git push to main branch
- **Health Checks**: Built-in monitoring

## 🔄 Continuous Deployment

Both platforms support automatic deployment:

### Railway
- ✅ Automatic deployment on git push
- ✅ Branch-based deployments
- ✅ Preview deployments for PRs

### Render
- ✅ Automatic deployment on git push
- ✅ Branch-based deployments
- ✅ Manual deployment option

## 🛠️ Troubleshooting

### Common Issues

**Bot not responding:**
```bash
# Check logs in platform dashboard
# Verify DISCORD_BOT_TOKEN is correct
# Ensure bot has proper permissions
```

**Health check failing:**
```bash
# Check if PORT is set correctly
# Verify health-check.js is working
# Check platform logs for errors
```

**Database connection issues:**
```bash
# Verify MONGODB_URI is correct
# Check if MongoDB Atlas IP whitelist includes platform IPs
# Ensure database exists
```

### Debug Commands

**Check environment variables:**
```bash
# In platform dashboard, check Variables section
# Ensure all required variables are set
```

**View logs:**
```bash
# Railway: Dashboard → Your Service → Logs
# Render: Dashboard → Your Service → Logs
```

## 🚀 Quick Commands

### Railway CLI (Optional)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from local
railway up

# View logs
railway logs
```

### Render CLI (Optional)
```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Deploy from local
render deploy
```

## 📋 Deployment Checklist

### Before Deploying
- [ ] All environment variables are ready
- [ ] Discord bot token is valid
- [ ] MongoDB connection string is correct
- [ ] Gemini API key is active
- [ ] Cloudinary credentials are set (optional)

### After Deploying
- [ ] Health check endpoint responds
- [ ] Discord bot is online
- [ ] Commands are working
- [ ] Database connection is established
- [ ] Logs show no errors

## 🎉 Success!

Once deployed, your bot will be:
- ✅ **24/7 Online**: Always running
- ✅ **Auto-updating**: Deploys on git push
- ✅ **Monitored**: Health checks and logs
- ✅ **Scalable**: Can handle multiple servers
- ✅ **Secure**: Environment variables protected

## 📞 Support

### Railway Support
- **Documentation**: [railway.app/docs](https://railway.app/docs)
- **Discord**: [Railway Discord](https://discord.gg/railway)
- **Email**: support@railway.app

### Render Support
- **Documentation**: [render.com/docs](https://render.com/docs)
- **Email**: support@render.com
- **Status**: [status.render.com](https://status.render.com)

---

**🎉 Your Capsera AI Discord Bot is now ready for 24/7 deployment!**
