import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors, Radii, Spacing } from '@/constants/theme';

interface PremiumCardProps {
  children: React.ReactNode;
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PremiumCard({ children, dark = false, style }: PremiumCardProps) {
  return (
    <View style={[styles.card, dark ? styles.cardDark : styles.cardLight, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  cardLight: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderLight,
  },
  cardDark: {
    backgroundColor: Colors.surfaceMid,
    borderColor: Colors.border,
  },
});
