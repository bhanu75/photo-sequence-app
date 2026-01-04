import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const ProgressBar = ({ progress = 0, message = 'Processing...' }) => {
  const theme = useTheme();
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, theme.shadows.sm]}>
      <View style={styles.header}>
        <Text style={[styles.message, { color: theme.colors.textPrimary }]}>
          {message}
        </Text>
        <Text style={[styles.percentage, { color: theme.colors.primary }]}>
          {Math.round(progress)}%
        </Text>
      </View>
      
      <View style={[styles.track, { backgroundColor: theme.colors.muted }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: theme.colors.primary,
              width: animatedWidth,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 15,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ProgressBar;
