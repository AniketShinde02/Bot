import mongoose from 'mongoose';

export class DatabaseService {
  constructor() {
    this.isConnected = false;
    this.connection = null;
  }

  // Connect to MongoDB
  async connect() {
    try {
      if (this.isConnected) {
        console.log('✅ Database already connected');
        return;
      }

      const mongoUri = process.env.MONGODB_URI || process.env.DISCORD_MONGODB_URI || 'mongodb://localhost:27017/capsera_discord';
      const dbName = process.env.DB_NAME || process.env.DISCORD_DB_NAME || 'capsera_discord';

      console.log('🔗 Using MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//***:***@'));

      console.log('🔌 Connecting to MongoDB...');
      console.log('📊 Database:', dbName);

      // Connect with optimized options
      this.connection = await mongoose.connect(mongoUri, {
        dbName: dbName,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false
      });

      this.isConnected = true;

      // Set up connection event handlers
      mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected successfully');
      });

      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await this.disconnect();
        process.exit(0);
      });

      console.log('✅ Database service initialized successfully');

    } catch (error) {
      console.error('❌ Database connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  // Check database connection
  async checkConnection() {
    try {
      if (!this.isConnected) {
        return false;
      }

      // Ping the database
      await mongoose.connection.db.admin().ping();
      return true;

    } catch (error) {
      console.error('❌ Database connection check failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  // Disconnect from database
  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        this.isConnected = false;
        console.log('✅ Database disconnected successfully');
      }
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
    }
  }

  // Get database statistics
  async getStats() {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      const stats = await mongoose.connection.db.stats();
      
      return {
        database: stats.db,
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize
      };

    } catch (error) {
      console.error('❌ Failed to get database stats:', error);
      return null;
    }
  }

  // Get collection statistics
  async getCollectionStats(collectionName) {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      const stats = await mongoose.connection.db.collection(collectionName).stats();
      
      return {
        collection: stats.ns,
        count: stats.count,
        size: stats.size,
        avgObjSize: stats.avgObjSize,
        storageSize: stats.storageSize,
        indexes: stats.nindexes,
        totalIndexSize: stats.totalIndexSize
      };

    } catch (error) {
      console.error('❌ Failed to get collection stats:', error);
      return null;
    }
  }

  // List all collections
  async listCollections() {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      const collections = await mongoose.connection.db.listCollections().toArray();
      
      return collections.map(collection => ({
        name: collection.name,
        type: collection.type,
        options: collection.options
      }));

    } catch (error) {
      console.error('❌ Failed to list collections:', error);
      return [];
    }
  }

  // Create index on collection
  async createIndex(collectionName, indexSpec, options = {}) {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      console.log('📊 Creating index:', { collection: collectionName, index: indexSpec });

      const result = await mongoose.connection.db.collection(collectionName).createIndex(indexSpec, options);
      
      console.log('✅ Index created successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Failed to create index:', error);
      throw error;
    }
  }

  // Drop index from collection
  async dropIndex(collectionName, indexName) {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      console.log('🗑️ Dropping index:', { collection: collectionName, index: indexName });

      const result = await mongoose.connection.db.collection(collectionName).dropIndex(indexName);
      
      console.log('✅ Index dropped successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Failed to drop index:', error);
      throw error;
    }
  }

  // List indexes for collection
  async listIndexes(collectionName) {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      const indexes = await mongoose.connection.db.collection(collectionName).indexes();
      
      return indexes.map(index => ({
        name: index.name,
        key: index.key,
        unique: index.unique,
        sparse: index.sparse,
        background: index.background
      }));

    } catch (error) {
      console.error('❌ Failed to list indexes:', error);
      return [];
    }
  }

  // Backup database (basic implementation)
  async backup() {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      console.log('💾 Starting database backup...');

      // This is a basic implementation
      // In production, you'd want to use mongodump or similar tools
      const collections = await this.listCollections();
      const backup = {
        timestamp: new Date().toISOString(),
        database: mongoose.connection.db.databaseName,
        collections: []
      };

      for (const collection of collections) {
        const documents = await mongoose.connection.db.collection(collection.name).find({}).toArray();
        backup.collections.push({
          name: collection.name,
          count: documents.length,
          documents: documents
        });
      }

      console.log('✅ Database backup completed');
      return backup;

    } catch (error) {
      console.error('❌ Database backup failed:', error);
      throw error;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }

  // Health check
  async healthCheck() {
    try {
      const isConnected = await this.checkConnection();
      const stats = isConnected ? await this.getStats() : null;
      
      return {
        status: isConnected ? 'healthy' : 'unhealthy',
        connected: isConnected,
        timestamp: new Date().toISOString(),
        stats: stats
      };

    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        status: 'error',
        connected: false,
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }
}
