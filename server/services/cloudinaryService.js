import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

export class CloudinaryService {
  constructor() {
    this.initialized = false;
    this.initialize();
  }

  // Initialize Cloudinary configuration
  initialize() {
    if (this.initialized) return;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    this.initialized = true;
    console.log('✅ Cloudinary service initialized');
  }

  // Check Cloudinary connection
  async checkConnection() {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      // Try to get account info to test connection
      const result = await cloudinary.api.ping();
      return result.status === 'ok';
    } catch (error) {
      console.error('❌ Cloudinary connection check failed:', error);
      return false;
    }
  }

  // Upload image with buffer data
  async uploadImage(buffer, originalName, userId, imageId = null) {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      const uploadId = imageId || uuidv4();
      console.log('☁️ Uploading image to Cloudinary:', {
        originalName,
        userId: userId || 'anonymous',
        uploadId
      });

      // Generate folder structure
      const folder = `web_app/${userId || 'anonymous'}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`;
      const publicId = `${uploadId}_${originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Convert buffer to base64 string
      const base64Data = buffer.toString('base64');
      const dataURI = `data:image/png;base64,${base64Data}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: folder,
        public_id: publicId,
        resource_type: 'auto',
        overwrite: false,
        unique_filename: false,
        use_filename: false,
        discard_original_filename: true,
        tags: ['web_app', 'capsera', userId || 'anonymous', uploadId],
        context: {
          caption: `Web App Upload - ${originalName}`,
          user_id: userId || 'anonymous',
          source: 'web_app',
          image_id: uploadId
        }
      });

      console.log('✅ Image uploaded to Cloudinary successfully');
      console.log('📁 Folder:', result.folder);
      console.log('🆔 Public ID:', result.public_id);
      console.log('🔗 URL:', result.secure_url);

      return {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        folder: result.folder || folder,
        imageId: uploadId,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes
      };

    } catch (error) {
      console.error('❌ Failed to upload image to Cloudinary:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  // Upload image from URL
  async uploadImageFromUrl(imageUrl, originalName, userId, imageId = null) {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      const uploadId = imageId || uuidv4();
      console.log('☁️ Uploading image from URL to Cloudinary:', {
        imageUrl,
        originalName,
        userId: userId || 'anonymous',
        uploadId
      });

      // Generate folder structure
      const folder = `web_app/${userId || 'anonymous'}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`;
      const publicId = `${uploadId}_${originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: folder,
        public_id: publicId,
        resource_type: 'auto',
        overwrite: false,
        unique_filename: false,
        use_filename: false,
        discard_original_filename: true,
        tags: ['web_app', 'capsera', userId || 'anonymous', uploadId],
        context: {
          caption: `Web App Upload - ${originalName}`,
          user_id: userId || 'anonymous',
          source: 'web_app',
          image_id: uploadId
        }
      });

      console.log('✅ Image uploaded to Cloudinary successfully');
      console.log('📁 Folder:', result.folder);
      console.log('🆔 Public ID:', result.public_id);
      console.log('🔗 URL:', result.secure_url);

      return {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        folder: result.folder || folder,
        imageId: uploadId,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes
      };

    } catch (error) {
      console.error('❌ Failed to upload image from URL to Cloudinary:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  // Delete image from Cloudinary
  async deleteImage(publicId) {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      console.log('🗑️ Deleting image from Cloudinary:', publicId);

      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        console.log('✅ Image deleted from Cloudinary successfully');
        return true;
      } else {
        console.log('⚠️ Image deletion result:', result.result);
        return false;
      }

    } catch (error) {
      console.error('❌ Failed to delete image from Cloudinary:', error);
      return false;
    }
  }

  // Get image information
  async getImageInfo(publicId) {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      console.log('📋 Getting image info from Cloudinary:', publicId);

      const result = await cloudinary.api.resource(publicId);
      
      console.log('✅ Image info retrieved successfully');
      return result;

    } catch (error) {
      console.error('❌ Failed to get image info from Cloudinary:', error);
      return null;
    }
  }

  // Transform image URL with options
  getTransformedUrl(publicId, options = {}) {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      const defaultOptions = {
        width: 800,
        height: 600,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
      };

      const transformOptions = { ...defaultOptions, ...options };
      
      return cloudinary.url(publicId, {
        transformation: [transformOptions]
      });

    } catch (error) {
      console.error('❌ Failed to generate transformed URL:', error);
      return null;
    }
  }

  // Get user's images
  async getUserImages(userId, options = {}) {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      const defaultOptions = {
        max_results: 50,
        type: 'upload',
        prefix: `web_app/${userId}/`
      };

      const searchOptions = { ...defaultOptions, ...options };

      console.log('🔍 Searching for user images:', userId);

      const result = await cloudinary.api.resources(searchOptions);
      
      console.log(`✅ Found ${result.resources.length} images for user`);
      return result.resources;

    } catch (error) {
      console.error('❌ Failed to get user images:', error);
      return [];
    }
  }

  // Create folder structure
  async createFolder(folderPath) {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      console.log('📁 Creating Cloudinary folder:', folderPath);

      // Cloudinary doesn't have a direct folder creation API
      // Folders are created automatically when images are uploaded
      // This is just a placeholder for future implementation
      
      return true;

    } catch (error) {
      console.error('❌ Failed to create folder:', error);
      return false;
    }
  }

  // Get folder contents
  async getFolderContents(folderPath, options = {}) {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      const defaultOptions = {
        max_results: 50,
        type: 'upload',
        prefix: folderPath
      };

      const searchOptions = { ...defaultOptions, ...options };

      console.log('📁 Getting folder contents:', folderPath);

      const result = await cloudinary.api.resources(searchOptions);
      
      console.log(`✅ Found ${result.resources.length} items in folder`);
      return result.resources;

    } catch (error) {
      console.error('❌ Failed to get folder contents:', error);
      return [];
    }
  }

  // Generate signed upload URL (for client-side uploads)
  generateUploadSignature(params = {}) {
    try {
      if (!this.initialized) {
        this.initialize();
      }

      const timestamp = Math.round(new Date().getTime() / 1000);
      
      const defaultParams = {
        timestamp: timestamp,
        folder: 'web_app/unsigned',
        resource_type: 'image'
      };

      const uploadParams = { ...defaultParams, ...params };

      const signature = cloudinary.utils.api_sign_request(
        uploadParams,
        process.env.CLOUDINARY_API_SECRET
      );

      return {
        signature,
        timestamp,
        params: uploadParams
      };

    } catch (error) {
      console.error('❌ Failed to generate upload signature:', error);
      return null;
    }
  }
}
