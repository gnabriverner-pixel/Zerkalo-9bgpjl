import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MatrixData } from '@/services/calculations';
import { Colors, Typography, Radii, PLANET_COLORS } from '@/constants/theme';

interface MatrixGridProps {
  matrix: MatrixData;
  mode?: 'simple' | 'detailed';
  dark?: boolean;
}

const MATRIX_LAYOUT = [
  [3, 6, 9],
  [2, 5, 8],
  [1, 4, 7],
];

export function MatrixGrid({ matrix, mode = 'simple', dark }: MatrixGridProps) {
  const data = mode === 'simple' ? matrix.simple : matrix.detailed;
  const empty = mode === 'simple' ? matrix.emptySimple : matrix.emptyDetailed;

  const renderCell = (digit: number) => {
    const count = data[digit] || 0;
    const isEmpty = count === 0;
    const color = PLANET_COLORS[digit] || Colors.gold;
    const dots = Array(count).fill(0);

    return (
      <View
        key={digit}
        style={[
          styles.cell,
          !isEmpty && { borderColor: color + '40', backgroundColor: color + '10' },
          isEmpty && (dark ? styles.emptyCellDark : styles.emptyCell),
        ]}
      >
        <Text style={[
          styles.digitLabel,
          { color: isEmpty ? Colors.textMuted : color },
          dark && isEmpty && { color: 'rgba(255,255,255,0.2)' },
        ]}>
          {digit}
        </Text>
        {!isEmpty ? (
          <View style={styles.dotsRow}>
            {dots.map((_, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: color }]} />
            ))}
          </View>
        ) : null}
        {!isEmpty ? (
          <Text style={[styles.countText, { color }]}>{count}×</Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.grid}>
      {MATRIX_LAYOUT.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map(digit => renderCell(digit))}
        </View>
      ))}
      {empty.length > 0 ? (
        <View style={styles.emptyNote}>
          <Text style={[styles.emptyNoteText, dark && { color: Colors.textLightMuted }]}>
            Пустоты: {empty.join(', ')} — зоны осознанного развития
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    minHeight: 72,
  },
  emptyCell: {
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceAlt,
    opacity: 0.5,
  },
  emptyCellDark: {
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    opacity: 0.6,
  },
  digitLabel: {
    ...Typography.label,
    fontSize: 10,
    position: 'absolute',
    top: 4,
    left: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  countText: {
    ...Typography.caption,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyNote: {
    marginTop: 8,
    alignItems: 'center',
  },
  emptyNoteText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
