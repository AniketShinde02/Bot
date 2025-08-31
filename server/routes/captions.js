import express from 'express';
import { CaptionGenerator } from '../services/captionGenerator.js';
import { CaptionModel } from '../models/Caption.js';
import { rateLimiter } from '../utils/rateLimiter.js';

const router = express.Router();

// Initialize caption generator
const captionGenerator = new CaptionGenerator();

// Generate captions endpoint
router.post('/generate', async (req, res) => {
  try {
    const { imageUrl, mood, userId, imageName } = req.body;

    // Validate required fields
    if (!imageUrl || !mood) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Image URL and mood are required'
      });
    }

    // Check rate limit
    const rateLimitCheck = await rateLimiter.canMakeRequest(userId || req.ip, 25);
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `You've used all 25 requests today. Reset time: ${rateLimitCheck.resetTime.toLocaleTimeString()}`,
        remaining: rateLimitCheck.remaining,
        resetTime: rateLimitCheck.resetTime
      });
    }

    console.log('🎯 Generating captions for:', { mood, imageName, userId });

    // Generate captions using AI
    const captions = await captionGenerator.generateCaptions(imageUrl, mood, userId || 'anonymous');

    if (!captions || captions.length === 0) {
      return res.status(500).json({
        error: 'Failed to generate captions',
        message: 'AI generation failed. Please try again.'
      });
    }

    // Save to database
    const captionData = {
      userId: userId || req.ip,
      imageUrl,
      imageName: imageName || 'uploaded_image',
      mood,
      captions,
      createdAt: new Date()
    };

    const savedCaption = await CaptionModel.create(captionData);

    console.log('✅ Captions generated and saved successfully');

    res.json({
      success: true,
      captions,
      imageId: savedCaption._id,
      remaining: rateLimitCheck.remaining,
      message: 'Captions generated successfully!'
    });

  } catch (error) {
    console.error('❌ Caption generation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate captions. Please try again.'
    });
  }
});

// Get user's caption history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const captions = await CaptionModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await CaptionModel.countDocuments({ userId });

    res.json({
      success: true,
      captions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('❌ History retrieval error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve caption history'
    });
  }
});

// Get caption by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const caption = await CaptionModel.findById(id).select('-__v');

    if (!caption) {
      return res.status(404).json({
        error: 'Caption not found',
        message: 'The requested caption does not exist'
      });
    }

    res.json({
      success: true,
      caption
    });

  } catch (error) {
    console.error('❌ Caption retrieval error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve caption'
    });
  }
});

// Delete caption
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const caption = await CaptionModel.findById(id);

    if (!caption) {
      return res.status(404).json({
        error: 'Caption not found',
        message: 'The requested caption does not exist'
      });
    }

    // Check if user owns this caption
    if (caption.userId !== userId) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'You can only delete your own captions'
      });
    }

    await CaptionModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Caption deleted successfully'
    });

  } catch (error) {
    console.error('❌ Caption deletion error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete caption'
    });
  }
});

// Get available moods
router.get('/moods/available', (req, res) => {
  const coreMoods = [
    { name: '😜 Fun / Playful', value: '😜 Fun / Playful' },
    { name: '🎭 Creative / Artistic', value: '🎭 Creative / Artistic' },
    { name: '💼 Professional / Business', value: '💼 Professional / Business' },
    { name: '❤️ Romantic / Emotional', value: '❤️ Romantic / Emotional' },
    { name: '🤖 Tech / Modern', value: '🤖 Tech / Modern' },
    { name: '🌍 Travel / Adventure', value: '🌍 Travel / Adventure' },
    { name: '🍔 Food / Lifestyle', value: '🍔 Food / Lifestyle' },
    { name: '🎵 Music / Entertainment', value: '🎵 Music / Entertainment' },
    { name: '🏃‍♂️ Fitness / Health', value: '🏃‍♂️ Fitness / Health' },
    { name: '🎨 Fashion / Style', value: '🎨 Fashion / Style' },
    { name: '🏠 Home / Interior', value: '🏠 Home / Interior' },
    { name: '🐾 Pet / Animal', value: '🐾 Pet / Animal' },
    { name: '🌱 Nature / Environment', value: '🌱 Nature / Environment' },
    { name: '🎮 Gaming / Entertainment', value: '🎮 Gaming / Entertainment' },
    { name: '📚 Education / Learning', value: '📚 Education / Learning' },
    { name: '🎪 Party / Celebration', value: '🎪 Party / Celebration' },
    { name: '🧘‍♀️ Wellness / Mindfulness', value: '🧘‍♀️ Wellness / Mindfulness' },
    { name: '🚗 Automotive / Transport', value: '🚗 Automotive / Transport' },
    { name: '🏢 Architecture / Design', value: '🏢 Architecture / Design' },
    { name: '📱 Social Media / Viral', value: '📱 Social Media / Viral' },
    { name: '🎬 Movie / TV Show', value: '🎬 Movie / TV Show' },
    { name: '🏈 Sports / Athletics', value: '🏈 Sports / Athletics' },
    { name: '✈️ Aviation / Flight', value: '✈️ Aviation / Flight' },
    { name: '🚢 Marine / Ocean', value: '🚢 Marine / Ocean' },
    { name: '🏔️ Mountain / Hiking', value: '🏔️ Mountain / Hiking' }
  ];

  const seasonalMoods = [
    { name: '🏖️ Beach / Summer', value: '🏖️ Beach / Summer' },
    { name: '❄️ Winter / Snow', value: '❄️ Winter / Snow' },
    { name: '🍂 Autumn / Fall', value: '🍂 Autumn / Fall' },
    { name: '🌸 Spring / Bloom', value: '🌸 Spring / Bloom' },
    { name: '🎄 Holiday / Christmas', value: '🎄 Holiday / Christmas' },
    { name: '🎉 Celebration / Party', value: '🎉 Celebration / Party' },
    { name: '🕯️ Cozy / Warm', value: '🕯️ Cozy / Warm' },
    { name: '🗺️ Adventure / Explore', value: '🗺️ Adventure / Explore' },
    { name: '✨ Mystical / Magical', value: '✨ Mystical / Magical' },
    { name: '📷 Vintage / Retro', value: '📷 Vintage / Retro' },
    { name: '🚀 Modern / Futuristic', value: '🚀 Modern / Futuristic' },
    { name: '🎨 Artistic / Creative', value: '🎨 Artistic / Creative' },
    { name: '⚪ Minimalist / Simple', value: '⚪ Minimalist / Simple' },
    { name: '💪 Bold / Strong', value: '💪 Bold / Strong' },
    { name: '👑 Elegant / Sophisticated', value: '👑 Elegant / Sophisticated' },
    { name: '😊 Casual / Relaxed', value: '😊 Casual / Relaxed' },
    { name: '🎯 Formal / Professional', value: '🎯 Formal / Professional' },
    { name: '⚡ Energetic / Dynamic', value: '⚡ Energetic / Dynamic' },
    { name: '🧘‍♀️ Calm / Peaceful', value: '🧘‍♀️ Calm / Peaceful' },
    { name: '💡 Inspirational / Motivational', value: '💡 Inspirational / Motivational' },
    { name: '🌟 Special / Unique', value: '🌟 Special / Unique' },
    { name: '🎭 Themed / Costume', value: '🎭 Themed / Costume' }
  ];

  res.json({
    success: true,
    moods: {
      core: coreMoods,
      seasonal: seasonalMoods,
      total: coreMoods.length + seasonalMoods.length
    }
  });
});

export default router;
