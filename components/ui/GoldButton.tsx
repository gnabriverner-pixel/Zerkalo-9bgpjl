import React from 'react';
import { ActivityIndicator, Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radii, Spacing, Typography, Shadows } from '@/constants/theme';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: ViewStyle;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}

export function GoldButton({ title, onPress, variant = 'primary', style, disabled, fullWidth, loading }: GoldButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        fullWidth ? styles.fullWidth : null,
        variant === 'primary' ? styles.primary : null,
        variant === 'outline' ? styles.outline : null,
        variant === 'ghost' ? styles.ghost : null,
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.5 },
        style,
      ]}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.background : Colors.gold} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'primary' ? styles.textPrimary : null,
          variant === 'outline' ? styles.textOutline : null,
          variant === 'ghost' ? styles.textGhost : null,
        ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: Colors.gold,
    ...Shadows.gold,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    ...Typography.button,
  },
  textPrimary: {
    color: Colors.background,
    fontWeight: '700',
  },
  textOutline: {
    color: Colors.gold,
  },
  textGhost: {
    color: Colors.textMuted,
  },
});
