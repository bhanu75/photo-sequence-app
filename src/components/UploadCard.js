import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Upload, Plus } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const UploadCard = ({ onPress, isCompact = false, remaining = 0 }) => {
  const theme = useTheme();

  if (isCompact) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.compactCard, { borderColor: theme.colors.border }]}
      >
        <Plus size={32} color={theme.colors.textSecondary} />
        <Text style={[styles.compactText, { color: theme.colors.textSecondary }]}>
          Add More
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, { borderColor: theme.colors.border }]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.muted }]}>
          <Upload size={40} color={theme.colors.textSecondary} />
        </View>
        
        <Text style={[styles.title, theme.typography.body, { color: theme.colors.textPrimary }]}>
          Drag & drop photos
        </Text>
        
        <Text style={[styles.subtitle, theme.typography.caption, { color: theme.colors.textSecondary }]}>
          or tap to upload (3–5 images)
        </Text>

        <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.badgeText, { color: theme.colors.textPrimary }]}>
            JPG, PNG, WEBP
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  compactCard: {
    width: (require('react-native').Dimensions.get('window').width - 48) / 2,
    height: (require('react-native').Dimensions.get('window').width - 48) / 2,
    margin: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default UploadCard;
