# Contributing to Capsera AI Discord Bot

Thank you for your interest in contributing to Capsera AI Discord Bot! This document provides guidelines for contributing to this project.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Discord Bot Token
- MongoDB Database
- Google Gemini AI API Key
- Cloudinary Account (optional)

### Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/capsera-discord-bot.git
   cd capsera-discord-bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env-template.txt .env
   # Edit .env with your credentials
   ```

4. **Run the Bot**
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### 1. Fork the Repository

Fork the main repository to your GitHub account.

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes

```bash
npm test  # if tests are available
npm run dev  # test the bot locally
```

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🎯 Contribution Areas

### Code Contributions

- **New Commands**: Add new Discord slash commands
- **AI Improvements**: Enhance caption generation logic
- **Database**: Improve data models and queries
- **Rate Limiting**: Optimize rate limiting system
- **Error Handling**: Better error messages and handling

### Documentation

- **README Updates**: Improve setup instructions
- **Code Comments**: Add inline documentation
- **API Documentation**: Document new features
- **Tutorials**: Create usage guides

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Node.js version, OS, etc.
- **Screenshots**: If applicable

### Feature Requests

When requesting features, please include:

- **Description**: Clear description of the feature
- **Use Case**: Why this feature is needed
- **Implementation Ideas**: How it could be implemented
- **Priority**: High/Medium/Low

## 📋 Code Style Guidelines

### JavaScript/Node.js

- Use ES6+ features
- Prefer `const` and `let` over `var`
- Use async/await for promises
- Follow camelCase naming convention
- Add JSDoc comments for functions

### Discord.js

- Use Discord.js v14+ features
- Follow Discord.js best practices
- Handle interactions properly
- Use proper error handling

### Database

- Use Mongoose ODM patterns
- Add proper validation
- Use indexes for performance
- Handle connection errors

## 🔧 Development Setup

### Local Development

1. **Database**: Use MongoDB Atlas (free tier) or local MongoDB
2. **Discord Bot**: Create a test server for development
3. **Environment**: Use separate .env files for dev/prod

### Testing

```bash
# Run tests (when available)
npm test

# Run linting
npm run lint

# Check code formatting
npm run format
```

## 🚨 Important Notes

### Security

- **Never commit sensitive data** (API keys, tokens, etc.)
- **Use environment variables** for all secrets
- **Validate user inputs** to prevent injection attacks
- **Rate limit properly** to prevent abuse

### Discord API Limits

- **Respect Discord rate limits**
- **Handle large servers** efficiently
- **Use proper intents** (only what you need)
- **Test with multiple users**

## 📞 Getting Help

### Questions?

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and discussions
- **Discord**: Join our community server (if available)

### Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Google Gemini AI Documentation](https://ai.google.dev/)

## 🎉 Recognition

Contributors will be recognized in:

- **README.md**: List of contributors
- **Release Notes**: Credit for significant contributions
- **GitHub**: Contributor profile recognition

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Capsera AI Discord Bot! 🚀
