import express from 'express';
import { DatabaseService } from '../services/databaseService.js';
import { CloudinaryService } from '../services/cloudinaryService.js';

const router = express.Router();

// Initialize services
const databaseService = new DatabaseService();
const cloudinaryService = new CloudinaryService();

// Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Detailed health check with service status
router.get('/detailed', async (req, res) => {
  try {
    const healthStatus = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
        cloudinary: 'unknown',
        gemini: 'unknown'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    };

    // Check database connection
    try {
      const dbStatus = await databaseService.checkConnection();
      healthStatus.services.database = dbStatus ? 'connected' : 'disconnected';
    } catch (error) {
      healthStatus.services.database = 'error';
      console.error('Database health check error:', error);
    }

    // Check Cloudinary connection
    try {
      const cloudinaryStatus = await cloudinaryService.checkConnection();
      healthStatus.services.cloudinary = cloudinaryStatus ? 'connected' : 'disconnected';
    } catch (error) {
      healthStatus.services.cloudinary = 'error';
      console.error('Cloudinary health check error:', error);
    }

    // Check Gemini API (basic check)
    try {
      const geminiKeys = process.env.GEMINI_KEYS || process.env.DISCORD_GEMINI_KEYS;
      healthStatus.services.gemini = geminiKeys ? 'configured' : 'not_configured';
    } catch (error) {
      healthStatus.services.gemini = 'error';
      console.error('Gemini health check error:', error);
    }

    // Determine overall status
    const serviceStatuses = Object.values(healthStatus.services);
    if (serviceStatuses.includes('error')) {
      healthStatus.status = 'DEGRADED';
    } else if (serviceStatuses.includes('disconnected') || serviceStatuses.includes('not_configured')) {
      healthStatus.status = 'WARNING';
    }

    res.json(healthStatus);

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error.message
    });
  }
});

// Service-specific health checks
router.get('/database', async (req, res) => {
  try {
    const isConnected = await databaseService.checkConnection();
    res.json({
      service: 'database',
      status: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      service: 'database',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/cloudinary', async (req, res) => {
  try {
    const isConnected = await cloudinaryService.checkConnection();
    res.json({
      service: 'cloudinary',
      status: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      service: 'cloudinary',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/gemini', (req, res) => {
  try {
    const geminiKeys = process.env.GEMINI_KEYS || process.env.DISCORD_GEMINI_KEYS;
    res.json({
      service: 'gemini',
      status: geminiKeys ? 'configured' : 'not_configured',
      keysCount: geminiKeys ? geminiKeys.split(',').length : 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      service: 'gemini',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// System information
router.get('/system', (req, res) => {
  res.json({
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    pid: process.pid,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
    },
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

export default router;
