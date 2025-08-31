# 🚀 Render.com Quick Start Guide

**DEPLOY YOUR DISCORD BOT IN 5 MINUTES**

## ⚡ **Quick Steps**

### **Step 1: Sign Up**
1. **Go to [render.com](https://render.com)**
2. **Click "Get Started"**
3. **Sign up with GitHub** (no payment needed)

### **Step 2: Create Service**
1. **Click "New +"**
2. **Select "Web Service"**
3. **Connect your GitHub repo**
4. **Select your Discord bot repo**

### **Step 3: Configure**
- **Name**: `capsera-discord-bot`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### **Step 4: Add Environment Variables**
Go to "Environment" tab and add:

```env
NODE_ENV=production
PORT=10000
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_GEMINI_KEYS=your_gemini_key_1,your_gemini_key_2,your_gemini_key_3,your_gemini_key_4
DISCORD_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DISCORD_DB_NAME=capsera_discord
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### **Step 5: Deploy**
1. **Click "Create Web Service"**
2. **Wait 2-3 minutes**
3. **Copy the URL**
4. **Test your bot!**

## 🎯 **What Happens Next**

### **Auto-Sleep Behavior**
- **Bot sleeps after 15 minutes** of no activity
- **Wakes up automatically** when Discord sends a request
- **First response**: ~30 seconds (cold start)
- **Subsequent responses**: Instant

### **Monitoring**
- **Check logs** in Render dashboard
- **Monitor performance** in real-time
- **Auto-deploy** on GitHub pushes

## 💰 **Cost: $0/month**

- **750 hours/month FREE**
- **512MB RAM**
- **Automatic SSL**
- **No payment verification needed**

## 🚨 **Troubleshooting**

### **If Build Fails**
- Check `package.json` has all dependencies
- Verify Node.js version compatibility

### **If Bot Doesn't Respond**
- Check environment variables are set
- Verify Discord token is correct
- Check logs for errors

### **If Bot is Slow**
- First request takes 30 seconds (normal)
- Subsequent requests are instant
- This is how Render free tier works

## 🎉 **Success!**

Your Discord bot is now running 24/7 on Render.com!

**No payment, no verification, just pure free hosting!** 🚀
