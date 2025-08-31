import express from 'express';
import multer from 'multer';
import { CloudinaryService } from '../services/cloudinaryService.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Initialize Cloudinary service
const cloudinaryService = new CloudinaryService();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Upload image endpoint
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image provided',
        message: 'Please upload an image file'
      });
    }

    const { userId } = req.body;
    const file = req.file;
    
    console.log('📤 Uploading image:', {
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      userId: userId || 'anonymous'
    });

    // Generate unique ID for this upload
    const imageId = uuidv4();
    
    // Upload to Cloudinary
    const uploadResult = await cloudinaryService.uploadImage(
      file.buffer,
      file.originalname,
      userId || 'anonymous',
      imageId
    );

    console.log('✅ Image uploaded successfully:', uploadResult.publicId);

    res.json({
      success: true,
      imageUrl: uploadResult.secureUrl,
      publicId: uploadResult.publicId,
      imageId: imageId,
      folder: uploadResult.folder,
      message: 'Image uploaded successfully!'
    });

  } catch (error) {
    console.error('❌ Image upload error:', error);
    
    if (error.message.includes('Only image files are allowed')) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Please upload a valid image file (JPG, PNG, WebP, GIF)'
      });
    }

    if (error.message.includes('file too large')) {
      return res.status(400).json({
        error: 'File too large',
        message: 'Image size must be less than 10MB'
      });
    }

    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload image. Please try again.'
    });
  }
});

// Delete image endpoint
router.delete('/image/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const { userId } = req.body;

    // Verify ownership (optional - you can implement this based on your needs)
    // const imageInfo = await cloudinaryService.getImageInfo(publicId);
    // if (imageInfo.context?.user_id !== userId) {
    //   return res.status(403).json({
    //     error: 'Unauthorized',
    //     message: 'You can only delete your own images'
    //   });
    // }

    const deleteResult = await cloudinaryService.deleteImage(publicId);

    if (deleteResult) {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(500).json({
        error: 'Delete failed',
        message: 'Failed to delete image'
      });
    }

  } catch (error) {
    console.error('❌ Image deletion error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete image'
    });
  }
});

// Get image info endpoint
router.get('/image/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;

    const imageInfo = await cloudinaryService.getImageInfo(publicId);

    if (!imageInfo) {
      return res.status(404).json({
        error: 'Image not found',
        message: 'The requested image does not exist'
      });
    }

    res.json({
      success: true,
      imageInfo: {
        publicId: imageInfo.public_id,
        secureUrl: imageInfo.secure_url,
        format: imageInfo.format,
        width: imageInfo.width,
        height: imageInfo.height,
        size: imageInfo.bytes,
        createdAt: imageInfo.created_at,
        folder: imageInfo.folder,
        context: imageInfo.context
      }
    });

  } catch (error) {
    console.error('❌ Image info retrieval error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve image information'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Image size must be less than 10MB'
      });
    }
  }
  
  console.error('❌ Upload error:', error);
  res.status(500).json({
    error: 'Upload failed',
    message: 'Failed to process upload. Please try again.'
  });
});

export default router;
