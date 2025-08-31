# 🚀 Render.com Deployment Guide - Capsera Discord Bot

**FREE 24/7 HOSTING WITH RENDER.COM**

Render.com offers **completely FREE hosting** with no payment verification required!

## 🎯 **Why Render.com?**

### ✅ **Free Benefits**
- **100% FREE** - No payment method needed
- **Easy setup** - Just connect GitHub
- **Auto-deploy** - Updates automatically
- **Health checks** - Built-in monitoring
- **SSL certificates** - Automatic HTTPS

### ⚠️ **Auto-Sleep Note**
- **Bot sleeps after 15 minutes** of inactivity
- **Wakes up automatically** when Discord sends a request
- **Cold start takes ~30 seconds**
- **Perfect for Discord bots** (they wake up when needed)

## 📋 **Prerequisites**

Before deploying, ensure you have:
- [Render.com Account](https://render.com) (free signup)
- [GitHub Account](https://github.com) (free)
- [Discord Bot Token](https://discord.com/developers/applications)
- [Gemini API Keys](https://makersuite.google.com/app/apikey)

## 🚀 **Step-by-Step Deployment**

### **Step 1: Sign Up for Render**

1. **Go to [render.com](https://render.com)**
2. **Click "Get Started"**
3. **Sign up with GitHub** (recommended)
4. **No payment method required!**

### **Step 2: Create New Web Service**

1. **Click "New +"**
2. **Select "Web Service"**
3. **Connect your GitHub repository**
4. **Select your Discord bot repository**

### **Step 3: Configure Service**

**Service Settings:**
- **Name**: `capsera-discord-bot`
- **Environment**: `Node`
- **Region**: `Oregon (US West)` (or closest to you)
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### **Step 4: Add Environment Variables**

Click "Environment" tab and add:

```env
NODE_ENV=production
PORT=10000
DISCORD_BOT_TOKEN=your_actual_discord_bot_token
DISCORD_CLIENT_ID=your_actual_discord_client_id
DISCORD_GEMINI_KEYS=your_gemini_key_1,your_gemini_key_2,your_gemini_key_3,your_gemini_key_4
DISCORD_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DISCORD_DB_NAME=capsera_discord
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### **Step 5: Deploy**

1. **Click "Create Web Service"**
2. **Wait for deployment** (2-3 minutes)
3. **Copy the service URL**

## 🔧 **Auto-Sleep Configuration**

### **Understanding Auto-Sleep**
- **Bot sleeps after 15 minutes** of no activity
- **Discord will wake it up** when someone uses a command
- **First response takes ~30 seconds** (cold start)
- **Subsequent responses are instant**

### **Optimizing for Discord**
- **Bot wakes up automatically** when Discord sends a request
- **No manual intervention needed**
- **Perfect for Discord bots** (they only run when needed)

## 📊 **Render.com Benefits**

### **Free Tier (Forever)**
- ✅ **750 hours/month** (enough for Discord bot)
- ✅ **512MB RAM**
- ✅ **Shared CPU**
- ✅ **Automatic SSL**
- ✅ **Custom domains**

### **Performance**
- ✅ **Cold start**: ~30 seconds
- ✅ **Warm start**: ~1 second
- ✅ **Auto-scaling**: Built-in
- ✅ **Global CDN**: Fast response

## 🔍 **Monitoring & Logs**

### **View Logs**
1. **Go to your service dashboard**
2. **Click "Logs" tab**
3. **View real-time logs**

### **Check Status**
1. **Service status** shows in dashboard
2. **Health checks** run automatically
3. **Deployments** show in timeline

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build Failed**
   ```bash
   # Check package.json
   # Ensure all dependencies are listed
   # Verify Node.js version compatibility
   ```

2. **Environment Variables Missing**
   ```bash
   # Go to Environment tab
   # Add all required variables
   # Redeploy after adding variables
   ```

3. **Bot Not Responding**
   ```bash
   # Check logs for errors
   # Verify Discord token is correct
   # Check if bot is online in Discord
   ```

## 💰 **Cost Breakdown**

### **Free Tier Usage**
- **Discord Bot**: ~500 hours/month
- **Free Limit**: 750 hours/month
- **Usage**: 67% of free tier
- **Cost**: $0/month

### **If You Exceed Free Tier**
- **Additional hours**: $7/month
- **Your bot would need 3x more traffic**
- **Unlikely for Discord bot usage**

## 🎉 **Success Checklist**

- [ ] Render.com account created
- [ ] GitHub repository connected
- [ ] Web service created
- [ ] Environment variables added
- [ ] Service deployed successfully
- [ ] Health check passing
- [ ] Discord bot responding
- [ ] Logs showing no errors

## 🚀 **Next Steps After Deployment**

1. **Test your bot** in Discord
2. **Check logs** for any errors
3. **Monitor performance**
4. **Set up custom domain** (optional)

---

**Render.com is the perfect FREE solution for your Discord bot!** 🚀

**No payment verification, no complex setup, just pure free hosting!** ✨
