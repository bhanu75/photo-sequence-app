import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../contexts/ThemeContext';
import { transitions, durations, aspectRatios } from '../constants/theme';
import { createVideoGenerator } from '../utils/videoGenerator';

// Components
import Button from '../components/Button';
import PhotoCard from '../components/PhotoCard';
import UploadCard from '../components/UploadCard';
import ProgressBar from '../components/ProgressBar';
import VideoPreview from '../components/VideoPreview';
import Dropdown from '../components/Dropdown';

const PhotoSequenceVideoScreen = () => {
  const theme = useTheme();
  
  // State
  const [photos, setPhotos] = useState([]);
  const [settings, setSettings] = useState({
    transition: 'dissolve',
    duration: 0.8,
    aspectRatio: '16:9',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [videoUri, setVideoUri] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Photo selection
  const selectPhotos = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access to continue.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: 5 - photos.length,
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.map((asset, index) => ({
          id: Date.now() + index,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        }));
        
        const updatedPhotos = [...photos, ...newPhotos].slice(0, 5);
        setPhotos(updatedPhotos);
        setVideoUri(null);
      }
    } catch (error) {
      console.error('Photo selection error:', error);
      Alert.alert('Error', 'Failed to select photos. Please try again.');
    }
  };

  // Remove photo
  const removePhoto = (id) => {
    setPhotos(photos.filter(p => p.id !== id));
    setVideoUri(null);
  };

  // Generate video
  const generateVideo = async () => {
    if (photos.length < 3) {
      Alert.alert('Minimum Photos Required', 'Please select at least 3 photos to create a video.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProgressMessage('Starting...');

    try {
      const generator = createVideoGenerator((prog, msg) => {
        setProgress(prog);
        setProgressMessage(msg);
      });

      const outputPath = await generator.generateVideo(photos, settings);
      
      setVideoUri(outputPath);
      Alert.alert('Success', 'Your video is ready!');
      
    } catch (error) {
      console.error('Video generation error:', error);
      Alert.alert('Error', 'Failed to generate video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download video
  const downloadVideo = async () => {
    if (!videoUri) return;
    
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(videoUri, {
          dialogTitle: 'Save Video',
          mimeType: 'video/mp4',
        });
      } else {
        Alert.alert('Success', 'Video saved to your device!');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download video.');
    }
  };

  // Share video
  const shareVideo = async () => {
    if (!videoUri) return;
    
    try {
      await Sharing.shareAsync(videoUri, {
        dialogTitle: 'Share Video',
        mimeType: 'video/mp4',
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share video.');
    }
  };

  // Reset and create new video
  const createNewVideo = () => {
    setPhotos([]);
    setVideoUri(null);
    setProgress(0);
    setShowSettings(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, theme.typography.pageTitle]}>
            Photo Video Maker
          </Text>
          <Text style={[styles.subtitle, theme.typography.caption, { color: theme.colors.textSecondary }]}>
            Create smooth photo videos
          </Text>
        </View>

        {/* Photo Selection Area */}
        {photos.length === 0 ? (
          <UploadCard onPress={selectPhotos} />
        ) : (
          <>
            {/* Photo Grid */}
            <View style={styles.photoGrid}>
              {photos.map((photo, index) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onRemove={() => removePhoto(photo.id)}
                />
              ))}
              
              {photos.length < 5 && (
                <View style={styles.uploadCompactContainer}>
                  <UploadCard 
                    onPress={selectPhotos} 
                    isCompact 
                    remaining={5 - photos.length}
                  />
                </View>
              )}
            </View>

            {/* Reorder Hint */}
            <Text style={[styles.hint, theme.typography.caption, { color: theme.colors.textSecondary }]}>
              Drag to reorder photos
            </Text>

            {/* Settings Section */}
            {photos.length >= 3 && !isProcessing && !videoUri && (
              <View style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.settingsTitle, theme.typography.sectionTitle]}>
                  Video Settings
                </Text>
                
                <Dropdown
                  label="Transition"
                  value={settings.transition}
                  options={transitions}
                  onSelect={(value) => setSettings({ ...settings, transition: value })}
                />
                
                <Dropdown
                  label="Duration"
                  value={settings.duration}
                  options={durations}
                  onSelect={(value) => setSettings({ ...settings, duration: value })}
                />
                
                <Dropdown
                  label="Aspect Ratio"
                  value={settings.aspectRatio}
                  options={aspectRatios}
                  onSelect={(value) => setSettings({ ...settings, aspectRatio: value })}
                />
              </View>
            )}

            {/* Minimum Photos Info */}
            {photos.length > 0 && photos.length < 3 && (
              <View style={[styles.infoCard, { backgroundColor: theme.colors.muted }]}>
                <Text style={[styles.infoText, { color: theme.colors.textPrimary }]}>
                  ℹ️ Add {3 - photos.length} more photo{3 - photos.length > 1 ? 's' : ''} to create video
                </Text>
              </View>
            )}

            {/* Generate Button */}
            {photos.length >= 3 && !videoUri && (
              <View style={styles.buttonContainer}>
                <Button
                  onPress={generateVideo}
                  disabled={isProcessing}
                  loading={isProcessing}
                  variant="primary"
                  style={styles.generateButton}
                >
                  {isProcessing ? 'Generating...' : 'Generate Video'}
                </Button>
              </View>
            )}
          </>
        )}

        {/* Progress Bar */}
        {isProcessing && (
          <ProgressBar progress={progress} message={progressMessage} />
        )}

        {/* Video Preview */}
        {videoUri && (
          <VideoPreview
            videoUri={videoUri}
            onDownload={downloadVideo}
            onShare={shareVideo}
            onCreateNew={createNewVideo}
          />
        )}

        {/* Features Info */}
        <View style={[styles.featuresCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.featuresTitle, theme.typography.sectionTitle]}>
            Features
          </Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={[styles.featureText, theme.typography.body, { color: theme.colors.textSecondary }]}>
              Smooth dissolve transitions
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={[styles.featureText, theme.typography.body, { color: theme.colors.textSecondary }]}>
              Dynamic slide effects
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={[styles.featureText, theme.typography.body, { color: theme.colors.textSecondary }]}>
              Background music included
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={[styles.featureText, theme.typography.body, { color: theme.colors.textSecondary }]}>
              HD quality export
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginTop: 4,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  uploadCompactContainer: {
    padding: 6,
  },
  hint: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  settingsTitle: {
    marginBottom: 20,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  generateButton: {
    width: '100%',
  },
  featuresCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
  },
  featuresTitle: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    color: '#22C55E',
    fontSize: 18,
    marginRight: 12,
    fontWeight: '700',
  },
  featureText: {
    flex: 1,
  },
});

export default PhotoSequenceVideoScreen;
