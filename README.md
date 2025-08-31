# 🤖 Capsera AI Discord Bot

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.x-blue.svg)](https://discord.js.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)](CHANGELOG.md)

> **AI-Powered Social Media Caption Generator - Discord Bot**

Transform your images into viral-worthy captions with the power of Google Gemini AI! This Discord bot analyzes your images and generates 3 unique, engaging captions optimized for social media platforms.

## ✨ Features

### 🎨 **AI Caption Generation**
- **46+ Mood Options**: From fun and playful to professional and business
- **3 Unique Captions**: Per request for maximum variety
- **Image Analysis**: Real image understanding with Google Gemini AI
- **Social Media Optimized**: Captions designed for engagement

### 🤖 **Discord Integration**
- **Slash Commands**: Easy-to-use Discord slash commands
- **Copy Buttons**: One-click caption copying
- **History Management**: View and manage your generated captions
- **DM Support**: Send caption history to private messages

### 🔧 **Advanced Features**
- **Rate Limiting**: Per-user daily limits with admin whitelist
- **Admin Commands**: Bot management and user administration
- **File Validation**: Image type and size validation
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Discord Bot Token
- MongoDB Database
- Google Gemini AI API Key
- Cloudinary Account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AniketShinde02/Bot.git
   cd Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env-template.txt .env
   # Edit .env with your credentials
   ```

4. **Start the bot**
   ```bash
   npm run dev
   ```

## 📋 Commands

### User Commands
- `/caption` - Generate captions with core moods
- `/caption-seasonal` - Generate captions with seasonal moods
- `/history` - View your caption history
- `/help` - Show help information

### Admin Commands
- `/admin action:Reset My Limit` - Reset your rate limit
- `/admin action:Check Status` - Check bot status
- `/admin action:Reset Rate Limit user_id:USER_ID` - Reset user's rate limit
- `/admin action:Add to Whitelist user_id:USER_ID` - Add user to whitelist
- `/admin action:Remove from Whitelist user_id:USER_ID` - Remove user from whitelist
- `/admin action:Clear User Records user_id:USER_ID` - Clear user's records

## 🎯 Usage Examples

### Basic Caption Generation
```
/caption image:your_image.jpg mood:😜 Fun / Playful
```

### Seasonal Caption Generation
```
/caption-seasonal image:your_image.jpg mood:🏖️ Beach / Summer
```

### View History
```
/history
```

## 🔧 Configuration

### Environment Variables

**Required:**
```bash
DISCORD_BOT_TOKEN=your_discord_bot_token
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

**Optional:**
```bash
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RATE_LIMIT_WINDOW_MS=86400000
RATE_LIMIT_MAX_REQUESTS=25
```

### Rate Limiting
- **Default Limit**: 25 requests per user per day
- **Whitelist**: Admin users bypass rate limits
- **Reset Time**: Daily at midnight UTC

## 🚀 Deployment

### Quick Deploy Options

#### 1. Railway (Recommended) 🚂
- **Free tier available**
- **Automatic scaling**
- **Easy environment management**
- **GitHub integration**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/AniketShinde02/Bot)

#### 2. Render 🌐
- **Free tier available**
- **Automatic deployment**
- **Built-in monitoring**
- **Health checks**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

#### 3. Heroku
- **Free tier available**
- **Easy deployment**
- **Built-in monitoring**

#### 4. DigitalOcean App Platform
- **Scalable infrastructure**
- **Global CDN**
- **Automatic SSL**

#### 5. AWS EC2
- **Full control**
- **Cost-effective**
- **High performance**

### Quick Deploy Instructions

**Railway:**
1. Click the Railway button above
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

**Render:**
1. Go to [Render.com](https://render.com)
2. Connect your GitHub repository
3. Configure as Web Service
4. Add environment variables
5. Deploy

### Detailed Deployment Guides
- [Railway & Render Guide](RAILWAY_RENDER_DEPLOYMENT.md) - Quick deployment
- [Full Deployment Guide](DEPLOYMENT.md) - All platforms

## 📊 Features in Detail

### AI Integration
- **Google Gemini AI**: State-of-the-art image understanding
- **Multi-Key Support**: Load balancing across multiple API keys
- **Context Awareness**: Understands image content and context
- **Mood Matching**: Generates captions matching specific moods

### Database Features
- **MongoDB Integration**: Scalable NoSQL database
- **Caption History**: Store and retrieve generated captions
- **User Management**: Track user usage and preferences
- **Performance Optimization**: Indexed queries for fast access

### Security Features
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize user inputs
- **Error Handling**: Secure error messages
- **Environment Variables**: Secure credential management

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code of Conduct
Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 📚 Documentation

- [📖 Setup Guide](README.md) - This file
- [🚀 Deployment Guide](DEPLOYMENT.md) - Deployment instructions
- [🤝 Contributing](CONTRIBUTING.md) - How to contribute
- [📋 Changelog](CHANGELOG.md) - Version history
- [🔒 Security](SECURITY.md) - Security best practices
- [🎯 GitHub Setup](GITHUB_SETUP.md) - GitHub upload guide

## 🔧 Development

### Project Structure
```
Bot/
├── discord-bot.js          # Main bot file
├── server/                 # Backend services
│   ├── models/            # Database models
│   ├── services/          # Business logic
│   └── utils/             # Utilities
├── .github/               # GitHub templates
├── docs/                  # Documentation
└── package.json           # Dependencies
```

### Scripts
```bash
npm run dev      # Development mode with nodemon
npm start        # Production mode
npm run build    # Build project (if needed)
```

### Testing
```bash
npm test         # Run tests
npm run lint     # Run linting
```

## 📈 Roadmap

### v1.1.0 (Planned)
- [ ] Multi-language support
- [ ] Advanced image filters
- [ ] User preferences system
- [ ] Analytics dashboard
- [ ] Webhook integration

### v1.2.0 (Future)
- [ ] Premium features
- [ ] Advanced AI models
- [ ] Custom mood creation
- [ ] Bulk processing
- [ ] API endpoints for external use

## 🐛 Troubleshooting

### Common Issues

**Bot not responding:**
- Check if bot token is correct
- Verify bot has proper permissions
- Check if bot is online

**Database connection failed:**
- Verify MongoDB URI
- Check network connectivity
- Ensure database exists

**Rate limiting issues:**
- Check rate limit configuration
- Verify whitelist settings
- Monitor usage patterns

**Image upload failures:**
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper file formats

### Getting Help
- **GitHub Issues**: [Create an issue](https://github.com/AniketShinde02/Bot/issues)
- **Discord Community**: Join our support server
- **Documentation**: Check the guides above

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful image understanding
- **Discord.js** for excellent Discord API wrapper
- **MongoDB** for reliable database storage
- **Cloudinary** for image processing services
- **Open Source Community** for inspiration and support

## 📞 Support

- **GitHub Issues**: Bug reports and feature requests
- **Discord Community**: Real-time support and discussions
- **Email**: [aniket.shinde02@gmail.com]
- **Documentation**: Comprehensive guides and tutorials

---

## 🚀 Ready for GitHub?

Your project is now fully prepared for GitHub upload! 

### Quick Upload Steps:
1. **Initialize Git**: `git init`
2. **Add Files**: `git add .`
3. **Commit**: `git commit -m "Initial commit: Capsera AI Discord Bot v1.0.0"`
4. **Create Repository** on GitHub
5. **Push**: `git push -u origin main`

### What's Included:
- ✅ **Complete Documentation**: README, CHANGELOG, CONTRIBUTING
- ✅ **GitHub Templates**: Issue templates, PR templates, CI/CD
- ✅ **Security**: .gitignore, environment templates, best practices
- ✅ **Deployment Guides**: Multiple platform options
- ✅ **Community Standards**: Code of conduct, contributing guidelines

See [GITHUB_SETUP.md](GITHUB_SETUP.md) for detailed upload instructions!

---

**Made with ❤️ by the Capsera Team**

[![GitHub stars](https://img.shields.io/github/stars/AniketShinde02/Bot?style=social)](https://github.com/AniketShinde02/Bot)
[![GitHub forks](https://img.shields.io/github/forks/AniketShinde02/Bot?style=social)](https://github.com/AniketShinde02/Bot)
[![GitHub issues](https://img.shields.io/github/issues/AniketShinde02/Bot)](https://github.com/AniketShinde02/Bot/issues)
