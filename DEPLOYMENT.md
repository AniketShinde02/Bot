# Deployment Guide

This guide covers various deployment options for the Capsera AI Discord Bot.

## 🚀 Quick Deploy Options

### 1. Railway (Recommended)

Railway is the easiest way to deploy your Discord bot with automatic scaling.

#### Setup Steps:

1. **Fork this repository** to your GitHub account
2. **Go to [Railway](https://railway.app/)** and sign up
3. **Connect your GitHub** account
4. **Create a new project** and select "Deploy from GitHub repo"
5. **Select your forked repository**
6. **Add environment variables**:
   ```
   DISCORD_BOT_TOKEN=your_discord_bot_token
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
7. **Deploy** - Railway will automatically build and deploy your bot

#### Railway Benefits:
- ✅ **Free tier available**
- ✅ **Automatic scaling**
- ✅ **Easy environment management**
- ✅ **GitHub integration**
- ✅ **Custom domains**

### 2. Heroku

#### Setup Steps:

1. **Install Heroku CLI** and login
2. **Create a new Heroku app**:
   ```bash
   heroku create your-bot-name
   ```
3. **Add environment variables**:
   ```bash
   heroku config:set DISCORD_BOT_TOKEN=your_token
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set GEMINI_API_KEY=your_gemini_key
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_cloudinary_key
   heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. **Deploy**:
   ```bash
   git push heroku main
   ```

### 3. DigitalOcean App Platform

#### Setup Steps:

1. **Go to DigitalOcean App Platform**
2. **Connect your GitHub repository**
3. **Configure the app**:
   - **Source**: Your GitHub repo
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
4. **Add environment variables** in the dashboard
5. **Deploy**

### 4. AWS EC2

#### Setup Steps:

1. **Launch an EC2 instance** (Ubuntu recommended)
2. **Connect via SSH**:
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```
3. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. **Clone your repository**:
   ```bash
   git clone https://github.com/your-username/capsera-discord-bot.git
   cd capsera-discord-bot
   ```
5. **Install dependencies**:
   ```bash
   npm install
   ```
6. **Create environment file**:
   ```bash
   cp env-template.txt .env
   nano .env  # Edit with your credentials
   ```
7. **Install PM2** for process management:
   ```bash
   sudo npm install -g pm2
   ```
8. **Start the bot**:
   ```bash
   pm2 start discord-bot.js --name "capsera-bot"
   pm2 startup
   pm2 save
   ```

### 5. Google Cloud Run

#### Setup Steps:

1. **Install Google Cloud SDK**
2. **Create a new project**:
   ```bash
   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```
3. **Enable required APIs**:
   ```bash
   gcloud services enable run.googleapis.com
   ```
4. **Deploy**:
   ```bash
   gcloud run deploy capsera-bot \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## 🔧 Environment Variables

### Required Variables:

```bash
# Discord Bot Token
DISCORD_BOT_TOKEN=your_discord_bot_token_here

# MongoDB Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=capsera_discord

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Optional Variables:

```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=86400000
RATE_LIMIT_MAX_REQUESTS=25

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## 📊 Monitoring & Logs

### Railway:
- **Logs**: Available in the Railway dashboard
- **Metrics**: Built-in monitoring
- **Alerts**: Automatic notifications

### Heroku:
```bash
# View logs
heroku logs --tail

# Monitor dyno usage
heroku ps
```

### PM2 (EC2):
```bash
# View logs
pm2 logs capsera-bot

# Monitor processes
pm2 monit

# Restart bot
pm2 restart capsera-bot
```

## 🔄 Continuous Deployment

### GitHub Actions (Recommended):

1. **Create `.github/workflows/deploy.yml`**:
   ```yaml
   name: Deploy to Railway
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: railway/deploy@v1
           with:
             service: your-railway-service
   ```

2. **Add Railway token** to GitHub Secrets

### Automatic Deployment:
- **Railway**: Automatic deployment on git push
- **Heroku**: Automatic deployment on git push
- **DigitalOcean**: Automatic deployment on git push

## 🛠️ Troubleshooting

### Common Issues:

1. **Bot not responding**:
   - Check if bot token is correct
   - Verify bot has proper permissions
   - Check if bot is online

2. **Database connection failed**:
   - Verify MongoDB URI
   - Check network connectivity
   - Ensure database exists

3. **Rate limiting issues**:
   - Check rate limit configuration
   - Verify whitelist settings
   - Monitor usage patterns

4. **Image upload failures**:
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file formats

### Debug Commands:

```bash
# Check bot status
npm run dev

# View detailed logs
DEBUG=* npm start

# Test database connection
node -e "require('./server/services/databaseService.js').testConnection()"

# Check environment variables
node -e "console.log(process.env)"
```

## 📈 Scaling

### Horizontal Scaling:
- **Railway**: Automatic scaling based on demand
- **Heroku**: Add more dynos as needed
- **AWS**: Use Auto Scaling Groups
- **Google Cloud**: Automatic scaling with Cloud Run

### Vertical Scaling:
- **Upgrade resources** on your hosting platform
- **Optimize code** for better performance
- **Use caching** for frequently accessed data

## 🔒 Security

### Best Practices:
1. **Never commit secrets** to git
2. **Use environment variables** for all sensitive data
3. **Regularly rotate API keys**
4. **Monitor for suspicious activity**
5. **Keep dependencies updated**

### Security Checklist:
- [ ] All API keys are in environment variables
- [ ] Database connection uses SSL
- [ ] Rate limiting is properly configured
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive data

## 📞 Support

### Getting Help:
- **GitHub Issues**: For bug reports and feature requests
- **Discord Community**: Join our support server
- **Documentation**: Check the README and wiki

### Emergency Contacts:
- **Critical Issues**: Create urgent GitHub issue
- **Security Issues**: Use private GitHub issue
- **Deployment Issues**: Check platform-specific documentation

---

**Happy Deploying! 🚀**
