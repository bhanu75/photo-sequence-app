import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const Button = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  icon: Icon,
  iconSize = 20,
  style,
  textStyle 
}) => {
  const theme = useTheme();

  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.textPrimary,
    },
    success: {
      backgroundColor: theme.colors.success,
      color: theme.colors.textPrimary,
    },
    danger: {
      backgroundColor: theme.colors.danger,
      color: theme.colors.textPrimary,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.textSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.textSecondary,
    },
  };

  const currentVariant = variants[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: currentVariant.backgroundColor,
          borderWidth: currentVariant.borderWidth,
          borderColor: currentVariant.borderColor,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.color} size="small" />
      ) : (
        <>
          {Icon && <Icon size={iconSize} color={currentVariant.color} style={styles.icon} />}
          <Text
            style={[
              styles.text,
              { color: currentVariant.color },
              theme.typography.button,
              textStyle,
            ]}
          >
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontWeight: '500',
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;
