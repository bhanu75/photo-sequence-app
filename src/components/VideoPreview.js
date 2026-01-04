import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VideoPreview = ({ videoUri, onDownload, onShare, onCreateNew }) => {
  const theme = useTheme();
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  const togglePlayback = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const replayVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.replayAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, theme.typography.sectionTitle]}>
        🎉 Video Ready
      </Text>
      <Text style={[styles.subtitle, theme.typography.caption, { color: theme.colors.textSecondary }]}>
        Your video has been created successfully
      </Text>

      <View style={[styles.videoContainer, theme.shadows.lg]}>
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={false}
          onPlaybackStatusUpdate={setStatus}
        />
        
        {/* Play/Pause Overlay */}
        {!status.isPlaying && (
          <TouchableOpacity
            style={styles.playOverlay}
            onPress={togglePlayback}
            activeOpacity={0.8}
          >
            <View style={[styles.playButton, { backgroundColor: theme.colors.primary }]}>
              <Play size={32} color={theme.colors.textPrimary} fill="#FFF" />
            </View>
          </TouchableOpacity>
        )}

        {/* Video Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={replayVideo} style={styles.controlButton}>
            <RotateCcw size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayback} style={styles.controlButton}>
            {status.isPlaying ? (
              <Pause size={20} color={theme.colors.textPrimary} />
            ) : (
              <Play size={20} color={theme.colors.textPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
          onPress={onDownload}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>✅ Download Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}
          onPress={onCreateNew}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            ⬅ Create Another
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  videoContainer: {
    width: SCREEN_WIDTH - 32,
    height: (SCREEN_WIDTH - 32) * (16 / 9),
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 20,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
  },
});

export default VideoPreview;
