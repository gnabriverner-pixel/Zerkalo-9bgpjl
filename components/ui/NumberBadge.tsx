import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, PLANET_COLORS, PLANET_NAMES, Typography } from '@/constants/theme';

interface NumberBadgeProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPlanet?: boolean;
  showComposite?: number;
}

const SIZES = {
  sm: 36,
  md: 48,
  lg: 60,
  xl: 76,
};

const FONT_SIZES = {
  sm: 16,
  md: 20,
  lg: 26,
  xl: 32,
};

export function NumberBadge({ number, size = 'md', showPlanet, showComposite }: NumberBadgeProps) {
  const dim = SIZES[size];
  const fontSize = FONT_SIZES[size];
  const color = PLANET_COLORS[number] || Colors.gold;
  const planet = PLANET_NAMES[number] || '';

  return (
    <View style={styles.wrap}>
      <View style={[
        styles.circle,
        {
          width: dim, height: dim, borderRadius: dim / 2,
          borderColor: color + '60',
          backgroundColor: color + '12',
        },
      ]}>
        <Text style={[styles.num, { color, fontSize }]}>{number}</Text>
        {showComposite != null && showComposite !== number ? (
          <Text style={[styles.comp, { color: color + 'AA', fontSize: fontSize * 0.4 }]}>
            {showComposite}
          </Text>
        ) : null}
      </View>
      {showPlanet ? (
        <Text style={[styles.planet, { color }]}>{planet}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  circle: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: { fontWeight: '700', lineHeight: undefined },
  comp: { fontWeight: '500' },
  planet: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },
});
