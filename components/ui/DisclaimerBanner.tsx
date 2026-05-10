import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '@/constants/theme';

const DISCLAIMER_FULL =
  'Система «Цифровой Код» носит информационно-развлекательный и самоисследовательский характер. Не является медицинской, психологической, финансовой или юридической консультацией.';

const DISCLAIMER_COMPACT =
  'Информационно-развлекательный характер · не является консультацией';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      {!compact ? (
        <MaterialIcons name="info-outline" size={14} color={Colors.textDisabled} style={{ marginTop: 1 }} />
      ) : null}
      <Text style={[styles.text, compact && styles.textCompact]}>
        {compact ? DISCLAIMER_COMPACT : DISCLAIMER_FULL}
      </Text>
    </View>
  );
}

export const DISCLAIMER = DISCLAIMER_FULL;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'flex-start',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  compact: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    paddingVertical: Spacing.xs,
    justifyContent: 'center',
  },
  text: {
    ...Typography.caption,
    color: Colors.textDisabled,
    flex: 1,
    lineHeight: 18,
    fontSize: 11,
  },
  textCompact: {
    textAlign: 'center',
    flex: 0,
    fontSize: 10,
  },
});
