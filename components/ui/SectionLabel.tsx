import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface SectionLabelProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  roman?: string;
}

export function SectionLabel({ title, subtitle, light, roman }: SectionLabelProps) {
  return (
    <View style={styles.container}>
      {roman ? <Text style={[styles.roman, light && styles.lightText]}>{roman}</Text> : null}
      <Text style={[styles.title, light && styles.lightTitle]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, light && styles.lightSubtitle]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  roman: {
    ...Typography.label,
    color: Colors.gold,
    marginBottom: 2,
  },
  title: {
    ...Typography.heading,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  lightText: {
    color: Colors.goldLight,
  },
  lightTitle: {
    color: Colors.textLight,
  },
  lightSubtitle: {
    color: Colors.textLightMuted,
  },
});
