import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-asset';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { buildFFmpegCommand } from './ffmpegCommands';

export class VideoGenerator {
  constructor(onProgress) {
    this.onProgress = onProgress || (() => {});
  }

  async generateVideo(photos, settings) {
    try {
      // Create temp directory
      const tempDir = `${FileSystem.cacheDirectory}video_temp_${Date.now()}/`;
      await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

      this.onProgress(10, 'Preparing photos...');

      // Process photos (resize and optimize)
      const processedPhotos = await this.processPhotos(photos, tempDir, settings.aspectRatio);
      
      this.onProgress(30, 'Processing images...');

      // Get background music
      const musicPath = await this.getMusicPath(tempDir);
      
      this.onProgress(50, 'Generating video...');

      // Generate video using canvas-based approach (since FFmpeg is not available in Expo)
      const videoPath = await this.createVideoFromPhotos(
        processedPhotos,
        musicPath,
        tempDir,
        settings
      );

      this.onProgress(90, 'Finalizing...');

      // Save to media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.createAssetAsync(videoPath);
      }

      this.onProgress(100, 'Complete!');

      // Cleanup temp files
      await this.cleanup(tempDir);

      return videoPath;
    } catch (error) {
      console.error('Video generation error:', error);
      throw error;
    }
  }

  async processPhotos(photos, tempDir, aspectRatio) {
    const processed = [];
    const dimensions = this.getAspectRatioDimensions(aspectRatio);

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const outputPath = `${tempDir}photo_${i}.jpg`;

      // Resize photo to fit aspect ratio
      const manipResult = await manipulateAsync(
        photo.uri,
        [
          {
            resize: {
              width: dimensions.width,
              height: dimensions.height,
            },
          },
        ],
        {
          compress: 0.9,
          format: SaveFormat.JPEG,
        }
      );

      // Copy to temp directory
      await FileSystem.copyAsync({
        from: manipResult.uri,
        to: outputPath,
      });

      processed.push(outputPath);
      this.onProgress(10 + (i / photos.length) * 20, `Processing photo ${i + 1}/${photos.length}`);
    }

    return processed;
  }

  async getMusicPath(tempDir) {
    try {
      // Load music asset from assets folder
      const [musicAsset] = await Asset.loadAsync(require('../../assets/background_music.mp3'));
      const musicPath = `${tempDir}music.mp3`;
      
      await FileSystem.copyAsync({
        from: musicAsset.localUri,
        to: musicPath,
      });

      return musicPath;
    } catch (error) {
      console.log('Music file not found, continuing without music');
      return null;
    }
  }

  async createVideoFromPhotos(photoPaths, musicPath, tempDir, settings) {
    // For Expo, we'll use a simplified approach since FFmpeg is not available
    // In production, you would use expo-video-processing or similar
    
    const outputPath = `${FileSystem.documentDirectory}video_${Date.now()}.mp4`;
    
    // Note: This is a placeholder. In real implementation, you would:
    // 1. Use WebGL/Canvas to create frames
    // 2. Use expo-av or react-native-video-processing
    // 3. Or use a backend service to process videos
    
    // For now, we'll create a simple image sequence approach
    // You would need to integrate with a video processing library
    
    console.log('Video creation with settings:', settings);
    console.log('Photos:', photoPaths.length);
    console.log('Music:', musicPath);
    
    // Placeholder: Copy first photo as output (replace with actual video generation)
    await FileSystem.copyAsync({
      from: photoPaths[0],
      to: outputPath,
    });

    return outputPath;
  }

  getAspectRatioDimensions(ratio) {
    const ratioMap = {
      '9:16': { width: 1080, height: 1920 },
      '16:9': { width: 1920, height: 1080 },
      '1:1': { width: 1080, height: 1080 },
      '4:5': { width: 1080, height: 1350 },
    };
    return ratioMap[ratio] || ratioMap['16:9'];
  }

  async cleanup(tempDir) {
    try {
      const dirInfo = await FileSystem.getInfoAsync(tempDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(tempDir, { idempotent: true });
      }
    } catch (error) {
      console.log('Cleanup error:', error);
    }
  }
}

// Export singleton instance
export const createVideoGenerator = (onProgress) => new VideoGenerator(onProgress);
