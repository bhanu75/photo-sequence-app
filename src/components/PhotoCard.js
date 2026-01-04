import React, { useRef, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SIZE = (SCREEN_WIDTH - 48) / 2; // 2 columns with padding

const PhotoCard = ({ photo, index, onRemove, isSelected }) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: CARD_SIZE,
          height: CARD_SIZE,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.card, theme.shadows.md]}>
        <Image source={{ uri: photo.uri }} style={styles.image} />
        
        {/* Index Badge */}
        <View style={[styles.indexBadge, { backgroundColor: theme.colors.primary }]}>
          <Animated.Text style={styles.indexText}>{index + 1}</Animated.Text>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <View style={styles.removeIconContainer}>
            <X size={16} color={theme.colors.textPrimary} />
          </View>
        </TouchableOpacity>

        {/* Selection Border */}
        {isSelected && (
          <View style={[styles.selectionBorder, { borderColor: theme.colors.primary }]} />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indexBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  removeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderRadius: 12,
  },
});

export default PhotoCard;
