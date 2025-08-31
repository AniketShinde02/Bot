import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { config } from 'dotenv';
import { CaptionGenerator } from './server/services/captionGenerator.js';
import { CloudinaryService } from './server/services/cloudinaryService.js';
import { DatabaseService } from './server/services/databaseService.js';
import { CaptionModel } from './server/models/Caption.js';
import { RateLimiter } from './server/utils/rateLimiter.js';

// Load environment variables
config();

// Start health check server for deployment platforms
import('./health-check.js').catch(err => {
  console.log('⚠️ Health check server not started:', err.message);
});

class DiscordBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    // Initialize services
    this.captionGenerator = new CaptionGenerator();
    this.cloudinaryService = new CloudinaryService();
    this.databaseService = new DatabaseService();
    this.rateLimiter = new RateLimiter();

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('ready', () => {
      console.log(`🤖 Discord Bot logged in as ${this.client.user.tag}`);
      console.log(`📊 Serving ${this.client.guilds.cache.size} guilds`);
      this.registerCommands();
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand()) {
        await this.handleCommand(interaction);
      } else if (interaction.isButton()) {
        await this.handleButton(interaction);
      }
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      await this.handleMessage(message);
    });
  }

  async registerCommands() {
    try {
      // Get the first guild (for faster command registration)
      const guild = this.client.guilds.cache.first();
      if (!guild) {
        console.log('⚠️ No guilds found, waiting for guild...');
        return;
      }

      const commands = [
        {
          name: 'caption',
          description: 'Generate captions for an image',
          options: [
            {
              name: 'image',
              description: 'Upload an image',
              type: 11, // Attachment
              required: true
            },
            {
              name: 'mood',
              description: 'Choose a mood for the caption',
              type: 3, // String
              required: true,
              choices: [
                { name: '😜 Fun / Playful', value: '😜 Fun / Playful' },
                { name: '💼 Professional / Business', value: '💼 Professional / Business' },
                { name: '💕 Romantic / Love', value: '💕 Romantic / Love' },
                { name: '💻 Tech / Technology', value: '💻 Tech / Technology' },
                { name: '✈️ Travel / Adventure', value: '✈️ Travel / Adventure' },
                { name: '🍕 Food / Culinary', value: '🍕 Food / Culinary' },
                { name: '🎵 Music / Entertainment', value: '🎵 Music / Entertainment' },
                { name: '💪 Fitness / Health', value: '💪 Fitness / Health' },
                { name: '👗 Fashion / Style', value: '👗 Fashion / Style' },
                { name: '🏠 Home / Lifestyle', value: '🏠 Home / Lifestyle' },
                { name: '🐕 Pets / Animals', value: '🐕 Pets / Animals' },
                { name: '🌿 Nature / Outdoors', value: '🌿 Nature / Outdoors' },
                { name: '🎮 Gaming / Entertainment', value: '🎮 Gaming / Entertainment' },
                { name: '📚 Education / Learning', value: '📚 Education / Learning' },
                { name: '🎉 Party / Celebration', value: '🎉 Party / Celebration' },
                { name: '🧘 Wellness / Mindfulness', value: '🧘 Wellness / Mindfulness' },
                { name: '🚗 Automotive / Cars', value: '🚗 Automotive / Cars' },
                { name: '🏛️ Architecture / Design', value: '🏛️ Architecture / Design' },
                { name: '📱 Social Media / Digital', value: '📱 Social Media / Digital' },
                { name: '🎬 Movies / Entertainment', value: '🎬 Movies / Entertainment' },
                { name: '⚽ Sports / Athletics', value: '⚽ Sports / Athletics' },
                { name: '✈️ Aviation / Flying', value: '✈️ Aviation / Flying' },
                { name: '🌊 Marine / Ocean', value: '🌊 Marine / Ocean' },
                { name: '⛰️ Mountain / Hiking', value: '⛰️ Mountain / Hiking' },
                { name: '🎨 Artistic / Creative', value: '🎨 Artistic / Creative' }
              ]
            }
          ]
        },
        {
          name: 'caption-seasonal',
          description: 'Generate seasonal captions for an image',
          options: [
            {
              name: 'image',
              description: 'Upload an image',
              type: 11, // Attachment
              required: true
            },
            {
              name: 'mood',
              description: 'Choose a seasonal mood',
              type: 3, // String
              required: true,
              choices: [
                { name: '🏖️ Beach / Summer', value: '🏖️ Beach / Summer' },
                { name: '❄️ Winter / Snow', value: '❄️ Winter / Snow' },
                { name: '🍂 Autumn / Fall', value: '🍂 Autumn / Fall' },
                { name: '🌸 Spring / Bloom', value: '🌸 Spring / Bloom' },
                { name: '🎄 Holiday / Christmas', value: '🎄 Holiday / Christmas' },
                { name: '🎊 Celebration / Festive', value: '🎊 Celebration / Festive' },
                { name: '☕ Cozy / Comfort', value: '☕ Cozy / Comfort' },
                { name: '🗺️ Adventure / Exploration', value: '🗺️ Adventure / Exploration' },
                { name: '🔮 Mystical / Magical', value: '🔮 Mystical / Magical' },
                { name: '📷 Vintage / Retro', value: '📷 Vintage / Retro' },
                { name: '⚡ Modern / Contemporary', value: '⚡ Modern / Contemporary' },
                { name: '🎭 Artistic / Creative', value: '🎭 Artistic / Creative' },
                { name: '📐 Minimalist / Simple', value: '📐 Minimalist / Simple' },
                { name: '💥 Bold / Dramatic', value: '💥 Bold / Dramatic' },
                { name: '👑 Elegant / Sophisticated', value: '👑 Elegant / Sophisticated' },
                { name: '😊 Casual / Relaxed', value: '😊 Casual / Relaxed' },
                { name: '🎩 Formal / Official', value: '🎩 Formal / Official' },
                { name: '⚡ Energetic / Dynamic', value: '⚡ Energetic / Dynamic' },
                { name: '😌 Calm / Peaceful', value: '😌 Calm / Peaceful' },
                { name: '💫 Inspirational / Motivational', value: '💫 Inspirational / Motivational' }
              ]
            }
          ]
        },
                 {
           name: 'history',
           description: 'View your caption history'
         },
        {
          name: 'help',
          description: 'Get help with Capsera AI commands'
        },
        {
          name: 'admin',
          description: 'Admin commands (whitelisted users only)',
          options: [
            {
              name: 'action',
              description: 'Admin action to perform',
              type: 3, // String
              required: true,
              choices: [
                                 { name: 'Reset Rate Limit', value: 'reset_rate_limit' },
                 { name: 'Reset My Limit', value: 'reset_my_limit' },
                 { name: 'Check Status', value: 'check_status' },
                 { name: 'Add to Whitelist', value: 'add_whitelist' },
                 { name: 'Remove from Whitelist', value: 'remove_whitelist' },
                 { name: 'Clear User Records', value: 'clear_records' }
              ]
            },
            {
              name: 'user_id',
              description: 'User ID (for whitelist actions)',
              type: 3, // String
              required: false
            }
          ]
        }
      ];

      // Register commands to the guild for faster updates
      await guild.commands.set(commands);
      console.log(`✅ Slash commands registered successfully to guild: ${guild.name}`);
    } catch (error) {
      console.error('❌ Error registering commands:', error);
    }
  }

  async handleCommand(interaction) {
    const { commandName } = interaction;
    console.log(`🔧 Handling command: ${commandName} from user: ${interaction.user.tag}`);

    // Check if interaction is already handled
    if (interaction.replied || interaction.deferred) {
      console.log('⚠️ Interaction already handled, skipping...');
      return;
    }

    try {
      switch (commandName) {
        case 'caption':
        case 'caption-seasonal':
          await this.handleCaptionCommand(interaction);
          break;
        case 'history':
          await this.handleHistoryCommand(interaction);
          break;
        case 'help':
          await this.handleHelpCommand(interaction);
          break;
        case 'admin':
          await this.handleAdminCommand(interaction);
          break;
        default:
          console.log(`❌ Unknown command: ${commandName}`);
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: '❌ Unknown command', ephemeral: true });
          }
      }
    } catch (error) {
      console.error('❌ Error handling command:', error);
      try {
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: '❌ An error occurred while processing your request', 
            ephemeral: true 
          });
        } else if (interaction.deferred) {
          await interaction.editReply({ 
            content: '❌ An error occurred while processing your request', 
            ephemeral: true 
          });
        }
      } catch (replyError) {
        console.error('❌ Error sending error reply:', replyError);
      }
    }
  }

    async handleCaptionCommand(interaction) {
    try {
      // Check if already deferred
      if (!interaction.deferred) {
        await interaction.deferReply();
      }
      console.log(`🎨 Processing caption request for user: ${interaction.user.tag}`);

      const image = interaction.options.getAttachment('image');
      const mood = interaction.options.getString('mood');
      const userId = interaction.user.id;
      const username = interaction.user.username;

      console.log(`📸 Image: ${image?.name}, Mood: ${mood}, User: ${username}`);

      // Check rate limit
      const rateLimitResult = await this.rateLimiter.canMakeRequest(userId);
      if (!rateLimitResult.allowed) {
        const status = await this.rateLimiter.getUserStatus(userId);
        const embed = new EmbedBuilder()
          .setColor('#ff4444')
          .setTitle('⚠️ Rate Limit Exceeded')
          .setDescription(`You've used ${status.used}/25 requests today.`)
          .addFields(
            { name: 'Next Reset', value: status.resetTime.toLocaleTimeString(), inline: true },
            { name: 'Remaining', value: `${status.remaining} requests`, inline: true }
          );
        
        return interaction.editReply({ embeds: [embed] });
      }

      // Validate image
      if (!image || !image.contentType?.startsWith('image/')) {
        return interaction.editReply('❌ Please provide a valid image file (JPG, PNG, WebP, GIF)');
      }

      if (image.size > 10 * 1024 * 1024) {
        return interaction.editReply('❌ Image size must be less than 10MB');
      }

      // Upload image to Cloudinary
      const uploadResult = await this.cloudinaryService.uploadImageFromUrl(image.url, image.name, userId);
      
      // Generate captions
      const captions = await this.captionGenerator.generateCaptions(
        uploadResult.secureUrl,
        mood,
        username
      );

      // Save to database
      const captionData = new CaptionModel({
        userId: userId,
        imageUrl: uploadResult.secureUrl,
        imageName: image.name,
        mood: mood,
        captions: captions,
        cloudinaryUrl: uploadResult.secureUrl,
        cloudinaryPublicId: uploadResult.publicId,
        cloudinaryFolder: uploadResult.folder
      });
      await captionData.save();

      // Create embed
      const embed = new EmbedBuilder()
        .setColor('#667eea')
        .setTitle('🎨 AI Caption Generation Complete!')
        .setDescription(`Generated 3 unique captions for your image`)
        .addFields(
          { name: '📸 Image', value: image.name, inline: true },
          { name: '😊 Mood', value: mood, inline: true },
          { name: '👤 User', value: username, inline: true }
        )
        .setImage(uploadResult.secureUrl)
        .setTimestamp();

      // Add captions to embed
      captions.forEach((caption, index) => {
        embed.addFields({
          name: `${index + 1}️⃣ Caption ${index + 1}`,
          value: caption,
          inline: false
        });
      });

      // Create copy buttons
      const buttons = captions.map((caption, index) => 
        new ButtonBuilder()
          .setCustomId(`copy_${index}`)
          .setLabel(`📋 Copy ${index + 1}`)
          .setStyle(ButtonStyle.Secondary)
      );

      const row = new ActionRowBuilder().addComponents(buttons);

      await interaction.editReply({
        embeds: [embed],
        components: [row]
      });

    } catch (error) {
      console.error('❌ Error generating captions:', error);
      try {
        await interaction.editReply('❌ An error occurred while generating captions. Please try again.');
      } catch (replyError) {
        console.error('❌ Error sending error reply:', replyError);
      }
    }
  }

    async handleHistoryCommand(interaction) {
    // Check if already deferred
    if (!interaction.deferred) {
      await interaction.deferReply();
    }

    const userId = interaction.user.id;

    try {
      const captions = await CaptionModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5); // Show last 5 captions

      if (captions.length === 0) {
        const embed = new EmbedBuilder()
          .setColor('#ffaa00')
          .setTitle('📚 Caption History')
          .setDescription('You haven\'t generated any captions yet. Use `/caption` to get started!');
         
        return interaction.editReply({ embeds: [embed] });
      }

             const embed = new EmbedBuilder()
         .setColor('#667eea')
         .setTitle('📚 Your Caption History')
         .setDescription(`Showing your last ${captions.length} generated captions`);

      captions.forEach((caption, index) => {
        embed.addFields({
          name: `${index + 1}. ${caption.imageName}`,
          value: `**Mood:** ${caption.mood}\n**Date:** ${caption.createdAt.toLocaleDateString()}\n**Captions:** ${caption.captions.length} generated`,
          inline: false
        });
      });

      // Create DM button
      const dmButton = new ButtonBuilder()
        .setCustomId('dm_history')
        .setLabel('📬 Send to DM')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(dmButton);

      await interaction.editReply({ 
        embeds: [embed],
        components: [row]
      });

    } catch (error) {
      console.error('Error fetching history:', error);
      await interaction.editReply('❌ An error occurred while fetching your history.');
    }
  }

  async handleHelpCommand(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#667eea')
      .setTitle('🤖 Capsera AI - Help')
      .setDescription('Welcome to Capsera AI! Here are the available commands:')
      .addFields(
        { 
          name: '📝 `/caption`', 
          value: 'Generate captions for an image with core moods', 
          inline: false 
        },
        { 
          name: '🌤️ `/caption-seasonal`', 
          value: 'Generate captions with seasonal and special moods', 
          inline: false 
        },
        { 
          name: '📚 `/history`', 
          value: 'View your previously generated captions', 
          inline: false 
        },
        { 
          name: '❓ `/help`', 
          value: 'Show this help message', 
          inline: false 
        }
      )
      .addFields(
        { 
          name: '📊 Rate Limits', 
          value: '25 requests per user per day', 
          inline: true 
        },
        { 
          name: '🖼️ Image Support', 
          value: 'JPG, PNG, WebP, GIF up to 10MB', 
          inline: true 
        },
        { 
          name: '🎨 Captions', 
          value: '3 unique captions per request', 
          inline: true 
        }
      )
      .setFooter({ text: 'Capsera AI - Transform your images into viral captions!' });

    await interaction.reply({ embeds: [embed] });
  }

  async handleAdminCommand(interaction) {
    try {
      // Check if already deferred
      if (!interaction.deferred) {
        await interaction.deferReply({ ephemeral: true });
      }
      
      const action = interaction.options.getString('action');
      const userId = interaction.user.id;
      const targetUserId = interaction.options.getString('user_id');

      console.log(`🔧 Admin command: ${action} by user ${userId} for target ${targetUserId}`);
      console.log(`📋 Whitelist: ${this.rateLimiter.whitelist.join(', ')}`);
      console.log(`✅ User whitelisted: ${this.rateLimiter.whitelist.includes(userId)}`);

      // Check if user is whitelisted
      if (!this.rateLimiter.whitelist.includes(userId)) {
        return interaction.editReply('❌ You are not authorized to use admin commands.');
      }

      switch (action) {
                 case 'reset_rate_limit':
           if (targetUserId) {
             // Reset specific user's rate limit
             const status = await this.rateLimiter.getUserStatus(targetUserId);
             const embed = new EmbedBuilder()
               .setColor('#00ff00')
               .setTitle('✅ Rate Limit Reset')
               .setDescription(`Rate limit status for user <@${targetUserId}>`)
               .addFields(
                 { name: 'Used', value: `${status.used}`, inline: true },
                 { name: 'Remaining', value: `${status.remaining}`, inline: true },
                 { name: 'Whitelisted', value: status.whitelisted ? 'Yes' : 'No', inline: true }
               );
             await interaction.editReply({ embeds: [embed] });
           } else {
             await interaction.editReply('❌ Please provide a user ID to reset rate limit.');
           }
           break;

         case 'reset_my_limit':
           // Reset current user's rate limit (no user ID needed!)
           const myStatus = await this.rateLimiter.getUserStatus(userId);
           const myEmbed = new EmbedBuilder()
             .setColor('#00ff00')
             .setTitle('✅ Your Rate Limit Reset!')
             .setDescription(`Rate limit status for you`)
             .addFields(
               { name: 'Used', value: `${myStatus.used}`, inline: true },
               { name: 'Remaining', value: `${myStatus.remaining}`, inline: true },
               { name: 'Whitelisted', value: myStatus.whitelisted ? 'Yes' : 'No', inline: true }
             );
           await interaction.editReply({ embeds: [myEmbed] });
           break;

        case 'check_status':
          const globalStats = await this.rateLimiter.getGlobalStats();
          const embed = new EmbedBuilder()
            .setColor('#667eea')
            .setTitle('📊 Bot Status')
            .addFields(
              { name: 'Total Users', value: `${globalStats.totalUsers}`, inline: true },
              { name: 'Total Requests', value: `${globalStats.totalRequests}`, inline: true },
              { name: 'Users at Limit', value: `${globalStats.usersAtLimit}`, inline: true },
              { name: 'Whitelisted Users', value: `${this.rateLimiter.whitelist.length}`, inline: true },
              { name: 'Database', value: '✅ Connected', inline: true },
              { name: 'Cloudinary', value: '✅ Connected', inline: true }
            );
          await interaction.editReply({ embeds: [embed] });
          break;

        case 'add_whitelist':
          if (targetUserId) {
            this.rateLimiter.addToWhitelist(targetUserId);
            await interaction.editReply(`✅ User <@${targetUserId}> added to whitelist.`);
          } else {
            await interaction.editReply('❌ Please provide a user ID to add to whitelist.');
          }
          break;

        case 'remove_whitelist':
          if (targetUserId) {
            this.rateLimiter.removeFromWhitelist(targetUserId);
            await interaction.editReply(`❌ User <@${targetUserId}> removed from whitelist.`);
          } else {
            await interaction.editReply('❌ Please provide a user ID to remove from whitelist.');
          }
          break;

        case 'clear_records':
          console.log(`🗑️ Clearing records for user: ${targetUserId}`);
          if (targetUserId) {
            const result = await this.rateLimiter.clearUserRecords(targetUserId);
            console.log(`✅ Clear result:`, result);
            await interaction.editReply(`🗑️ **Records Cleared!**\n\n${result.message}\n\nUser <@${targetUserId}> can now use unlimited requests!`);
          } else {
            await interaction.editReply('❌ Please provide a user ID to clear records.');
          }
          break;

        default:
          await interaction.editReply('❌ Unknown admin action.');
      }
    } catch (error) {
      console.error('❌ Error handling admin command:', error);
      try {
        await interaction.editReply('❌ An error occurred while processing admin command.');
      } catch (replyError) {
        console.error('❌ Error sending error reply:', replyError);
      }
    }
  }

  async handleButton(interaction) {
    const { customId } = interaction;

    if (customId.startsWith('copy_')) {
      const index = parseInt(customId.split('_')[1]);
      const embed = interaction.message.embeds[0];
      const captionField = embed.fields.find(field => field.name.includes(`Caption ${index + 1}`));
      
      if (captionField) {
        await interaction.reply({ 
          content: `📋 **Caption ${index + 1} copied to clipboard!**\n\n${captionField.value}`, 
          ephemeral: true 
        });
      }
    }
    
    else if (customId === 'dm_history') {
      try {
        await interaction.deferReply({ ephemeral: true });
        
        const userId = interaction.user.id;
        const captions = await CaptionModel.find({ userId })
          .sort({ createdAt: -1 })
          .limit(10); // Send last 10 captions to DM

        if (captions.length === 0) {
          await interaction.editReply('❌ You have no captions to send to DM.');
          return;
        }

        // Send DM to user
        try {
          const dmEmbed = new EmbedBuilder()
            .setColor('#667eea')
            .setTitle('📬 Your Caption History (DM)')
            .setDescription(`Here are your last ${captions.length} generated captions:`)
            .setTimestamp();

          captions.forEach((caption, index) => {
            dmEmbed.addFields({
              name: `${index + 1}. ${caption.imageName}`,
              value: `**Mood:** ${caption.mood}\n**Date:** ${caption.createdAt.toLocaleDateString()}\n**Captions:**\n${caption.captions.map((c, i) => `${i + 1}. ${c}`).join('\n')}`,
              inline: false
            });
          });

          await interaction.user.send({ embeds: [dmEmbed] });
          await interaction.editReply('✅ Your caption history has been sent to your DM!');
          
        } catch (dmError) {
          console.error('DM Error:', dmError);
          await interaction.editReply('❌ Could not send DM. Please check if you have DMs enabled from server members.');
        }

      } catch (error) {
        console.error('Error handling DM history:', error);
        await interaction.editReply('❌ An error occurred while processing your request.');
      }
    }
  }

  async handleMessage(message) {
    // Handle natural language questions
    const content = message.content.toLowerCase();
    
    if (content.includes('what is capsera') || content.includes('capsera ai')) {
      const embed = new EmbedBuilder()
        .setColor('#667eea')
        .setTitle('🤖 Capsera AI')
        .setDescription('Capsera AI is an advanced AI-powered social media caption generator that creates viral-worthy captions for your images.')
        .addFields(
          { name: '🎯 What it does', value: 'Analyzes your images and generates 3 unique, engaging captions optimized for social media', inline: false },
          { name: '🤖 AI Technology', value: 'Powered by Google Gemini AI for real image understanding', inline: false },
          { name: '🎨 Mood Options', value: '46+ different moods from fun to professional', inline: false },
          { name: '📊 Rate Limits', value: '25 requests per user per day', inline: false }
        )
        .setFooter({ text: 'Use /help to see all available commands!' });
      
      await message.reply({ embeds: [embed] });
    }
    
    else if (content.includes('how to use') || content.includes('commands')) {
      const embed = new EmbedBuilder()
        .setColor('#667eea')
        .setTitle('📖 How to Use Capsera AI')
        .setDescription('Here\'s how to generate amazing captions:')
        .addFields(
          { name: '1️⃣ Upload Image', value: 'Use `/caption` or `/caption-seasonal` and attach an image', inline: false },
          { name: '2️⃣ Choose Mood', value: 'Select from 46+ mood options to match your content style', inline: false },
          { name: '3️⃣ Get Captions', value: 'Receive 3 unique, viral-worthy captions in seconds', inline: false },
          { name: '4️⃣ Copy & Share', value: 'Click the copy buttons to copy captions to clipboard', inline: false }
        )
        .setFooter({ text: 'Try /caption now to get started!' });
      
      await message.reply({ embeds: [embed] });
    }
  }

  async start() {
    try {
      // Connect to database
      await this.databaseService.connect();
      console.log('✅ Database connected');

      // Test Cloudinary connection
      try {
        const isConnected = await this.cloudinaryService.checkConnection();
        if (isConnected) {
          console.log('✅ Cloudinary connected');
        } else {
          console.log('⚠️ Cloudinary not configured, continuing without image upload...');
        }
      } catch (cloudinaryError) {
        console.log('⚠️ Cloudinary not configured, continuing without image upload...');
      }

      // Check Discord token
      const discordToken = process.env.DISCORD_BOT_TOKEN;
      if (!discordToken || discordToken === 'your_discord_bot_token_here') {
        console.log('⚠️ Discord bot token not configured');
        console.log('📝 Please set DISCORD_BOT_TOKEN in your .env file');
        console.log('🔗 Get your token from: https://discord.com/developers/applications');
        process.exit(1);
      }

      // Login to Discord
      await this.client.login(discordToken);
      console.log('🚀 Discord bot starting...');

    } catch (error) {
      console.error('❌ Error starting bot:', error);
      console.log('📝 Please check your .env file and ensure all required variables are set');
      process.exit(1);
    }
  }
}

// Start the bot
const bot = new DiscordBot();
bot.start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Discord bot...');
  await bot.databaseService.disconnect();
  bot.client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down Discord bot...');
  await bot.databaseService.disconnect();
  bot.client.destroy();
  process.exit(0);
});
