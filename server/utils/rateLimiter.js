import { CaptionModel } from '../models/Caption.js';

class RateLimiter {
  constructor() {
    this.cache = new Map();
    this.defaultLimit = 25; // Default daily limit
    this.resetTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // Whitelist of user IDs that bypass rate limits
    this.whitelist = [
      '1411597717360214018', // Aniket's user ID from the Discord chat
      '1310471160072241172', // Aniket's current user ID
      // Add more user IDs here as needed
    ];
  }

  // Check if user can make a request
  async canMakeRequest(userId, limit = this.defaultLimit) {
    try {
      // Check if user is whitelisted - COMPLETELY BYPASS ALL CHECKS
      if (this.whitelist.includes(userId)) {
        console.log(`✅ User ${userId} is whitelisted - COMPLETELY BYPASSING rate limits`);
        return {
          allowed: true,
          remaining: 999999, // Unlimited
          limit: 999999,
          resetTime: new Date(Date.now() + this.resetTime),
          todayRequests: 0,
          whitelisted: true
        };
      }

      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay.getTime() + this.resetTime);

      // Count user's requests for today
      const todayRequests = await CaptionModel.countDocuments({
        userId: userId,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });

      const remaining = Math.max(0, limit - todayRequests);
      const allowed = remaining > 0;

      // Calculate reset time (next day at midnight)
      const resetTime = new Date(startOfDay.getTime() + this.resetTime);

      return {
        allowed,
        remaining,
        limit,
        resetTime,
        todayRequests,
        whitelisted: false
      };

    } catch (error) {
      console.error('❌ Rate limiter error:', error);
      // Default to allowing the request if there's an error
      return {
        allowed: true,
        remaining: limit,
        limit,
        resetTime: new Date(Date.now() + this.resetTime),
        todayRequests: 0
      };
    }
  }

  // Get user's rate limit status
  async getUserStatus(userId, limit = this.defaultLimit) {
    try {
      // Check if user is whitelisted
      if (this.whitelist.includes(userId)) {
        return {
          userId,
          used: 0,
          remaining: 999999,
          limit: 999999,
          resetTime: new Date(Date.now() + this.resetTime),
          percentageUsed: 0,
          isLimited: false,
          whitelisted: true
        };
      }

      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay.getTime() + this.resetTime);

      // Count user's requests for today
      const todayRequests = await CaptionModel.countDocuments({
        userId: userId,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      });

      const remaining = Math.max(0, limit - todayRequests);
      const used = todayRequests;
      const resetTime = new Date(startOfDay.getTime() + this.resetTime);

      return {
        userId,
        used,
        remaining,
        limit,
        resetTime,
        percentageUsed: Math.round((used / limit) * 100),
        isLimited: remaining === 0,
        whitelisted: false
      };

    } catch (error) {
      console.error('❌ Rate limiter status error:', error);
      return {
        userId,
        used: 0,
        remaining: limit,
        limit,
        resetTime: new Date(Date.now() + this.resetTime),
        percentageUsed: 0,
        isLimited: false
      };
    }
  }

  // Get user's request history
  async getUserHistory(userId, days = 7) {
    try {
      const now = new Date();
      const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

      const history = await CaptionModel.aggregate([
        {
          $match: {
            userId: userId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      return history.map(item => ({
        date: new Date(item._id.year, item._id.month - 1, item._id.day),
        count: item.count
      }));

    } catch (error) {
      console.error('❌ Rate limiter history error:', error);
      return [];
    }
  }

  // Reset user's rate limit (admin function)
  async resetUserLimit(userId) {
    try {
      console.log(`🔄 Resetting rate limit for user: ${userId}`);
      
      // For whitelisted users, just return unlimited status
      if (this.whitelist.includes(userId)) {
        console.log(`✅ User ${userId} is whitelisted - no reset needed`);
        return {
          userId,
          used: 0,
          remaining: 999999,
          limit: 999999,
          resetTime: new Date(Date.now() + this.resetTime),
          percentageUsed: 0,
          isLimited: false,
          whitelisted: true
        };
      }
      
      // For non-whitelisted users, return current status
      return await this.getUserStatus(userId);
    } catch (error) {
      console.error('❌ Rate limiter reset error:', error);
      throw error;
    }
  }

  // Add user to whitelist
  addToWhitelist(userId) {
    if (!this.whitelist.includes(userId)) {
      this.whitelist.push(userId);
      console.log(`✅ User ${userId} added to rate limit whitelist`);
    }
    return this.whitelist;
  }

  // Remove user from whitelist
  removeFromWhitelist(userId) {
    const index = this.whitelist.indexOf(userId);
    if (index > -1) {
      this.whitelist.splice(index, 1);
      console.log(`❌ User ${userId} removed from rate limit whitelist`);
    }
    return this.whitelist;
  }

  // Get whitelist
  getWhitelist() {
    return this.whitelist;
  }

  // Clear all records for a user (admin function)
  async clearUserRecords(userId) {
    try {
      console.log(`🗑️ Clearing all records for user: ${userId}`);
      
      // Delete all caption records for this user from database
      const deletedCount = await CaptionModel.deleteMany({ userId: userId });
      console.log(`✅ Deleted ${deletedCount.deletedCount} records for user ${userId}`);
      
      return {
        userId,
        deletedCount: deletedCount.deletedCount,
        message: `Cleared ${deletedCount.deletedCount} records for user ${userId}`
      };
    } catch (error) {
      console.error('❌ Error clearing user records:', error);
      throw error;
    }
  }

  // Get global rate limit statistics
  async getGlobalStats() {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay.getTime() + this.resetTime);

      const stats = await CaptionModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay
            }
          }
        },
        {
          $group: {
            _id: '$userId',
            requestCount: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            totalRequests: { $sum: '$requestCount' },
            averageRequestsPerUser: { $avg: '$requestCount' },
            maxRequestsByUser: { $max: '$requestCount' },
            usersAtLimit: {
              $sum: {
                $cond: [{ $gte: ['$requestCount', this.defaultLimit] }, 1, 0]
              }
            }
          }
        }
      ]);

      return stats[0] || {
        totalUsers: 0,
        totalRequests: 0,
        averageRequestsPerUser: 0,
        maxRequestsByUser: 0,
        usersAtLimit: 0
      };

    } catch (error) {
      console.error('❌ Rate limiter global stats error:', error);
      return {
        totalUsers: 0,
        totalRequests: 0,
        averageRequestsPerUser: 0,
        maxRequestsByUser: 0,
        usersAtLimit: 0
      };
    }
  }

  // Check if user is approaching limit (warning threshold)
  async isApproachingLimit(userId, limit = this.defaultLimit, threshold = 0.8) {
    try {
      const status = await this.getUserStatus(userId, limit);
      return status.percentageUsed >= (threshold * 100);
    } catch (error) {
      console.error('❌ Rate limiter threshold check error:', error);
      return false;
    }
  }

  // Get time until reset
  getTimeUntilReset(resetTime) {
    const now = new Date();
    const timeDiff = resetTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  // Format reset time for display
  formatResetTime(resetTime) {
    const { hours, minutes, seconds } = this.getTimeUntilReset(resetTime);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Clear cache (useful for testing)
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Export class for testing
export { RateLimiter };
