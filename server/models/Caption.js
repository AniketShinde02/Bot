import mongoose from 'mongoose';

// Caption schema
const captionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageName: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    required: true,
    index: true
  },
  captions: [{
    type: String,
    required: true
  }],
  cloudinaryUrl: {
    type: String,
    required: false
  },
  cloudinaryPublicId: {
    type: String,
    required: false
  },
  cloudinaryFolder: {
    type: String,
    required: false
  },
  imageId: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
captionSchema.index({ userId: 1, createdAt: -1 });
captionSchema.index({ mood: 1, createdAt: -1 });
captionSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamp
captionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for formatted date
captionSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for time ago
captionSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
});

// Static method to find user's captions
captionSchema.statics.findByUserId = function(userId, options = {}) {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;
  
  return this.find({ userId })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('-__v');
};

// Static method to find captions by mood
captionSchema.statics.findByMood = function(mood, options = {}) {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;
  
  return this.find({ mood })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('-__v');
};

// Static method to get user statistics
captionSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalCaptions: { $sum: 1 },
        totalImages: { $sum: 1 },
        uniqueMoods: { $addToSet: '$mood' },
        lastUsed: { $max: '$createdAt' },
        firstUsed: { $min: '$createdAt' }
      }
    },
    {
      $project: {
        _id: 0,
        totalCaptions: 1,
        totalImages: 1,
        uniqueMoods: 1,
        moodCount: { $size: '$uniqueMoods' },
        lastUsed: 1,
        firstUsed: 1,
        daysActive: {
          $ceil: {
            $divide: [
              { $subtract: ['$lastUsed', '$firstUsed'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      }
    }
  ]);
};

// Static method to get global statistics
captionSchema.statics.getGlobalStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalCaptions: { $sum: 1 },
        totalUsers: { $addToSet: '$userId' },
        uniqueMoods: { $addToSet: '$mood' },
        lastActivity: { $max: '$createdAt' },
        firstActivity: { $min: '$createdAt' }
      }
    },
    {
      $project: {
        _id: 0,
        totalCaptions: 1,
        totalUsers: { $size: '$totalUsers' },
        uniqueMoods: 1,
        moodCount: { $size: '$uniqueMoods' },
        lastActivity: 1,
        firstActivity: 1,
        daysActive: {
          $ceil: {
            $divide: [
              { $subtract: ['$lastActivity', '$firstActivity'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      }
    }
  ]);
};

// Static method to get mood statistics
captionSchema.statics.getMoodStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 },
        lastUsed: { $max: '$createdAt' }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $project: {
        mood: '$_id',
        count: 1,
        lastUsed: 1,
        _id: 0
      }
    }
  ]);
};

// Static method to search captions
captionSchema.statics.searchCaptions = function(query, options = {}) {
  const { page = 1, limit = 10, userId = null } = options;
  const skip = (page - 1) * limit;
  
  let searchQuery = {
    $or: [
      { imageName: { $regex: query, $options: 'i' } },
      { mood: { $regex: query, $options: 'i' } },
      { captions: { $regex: query, $options: 'i' } }
    ]
  };
  
  if (userId) {
    searchQuery.userId = userId;
  }
  
  return this.find(searchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');
};

// Instance method to get caption count
captionSchema.methods.getCaptionCount = function() {
  return this.captions.length;
};

// Instance method to get first caption
captionSchema.methods.getFirstCaption = function() {
  return this.captions[0] || '';
};

// Instance method to get all captions as text
captionSchema.methods.getAllCaptionsText = function() {
  return this.captions.join('\n\n');
};

// Instance method to check if caption is recent (within 24 hours)
captionSchema.methods.isRecent = function() {
  const now = new Date();
  const diffInHours = (now - this.createdAt) / (1000 * 60 * 60);
  return diffInHours < 24;
};

// Export model
export const CaptionModel = mongoose.model('Caption', captionSchema);

// Export default for easy import
export default CaptionModel;
