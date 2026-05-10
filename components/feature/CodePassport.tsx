import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CoreNumbers } from '@/services/calculations';
import { Colors, Spacing, Typography, Radii, PLANET_NAMES, PLANET_COLORS } from '@/constants/theme';
import { NUMBER_LABELS } from '@/constants/numerology-data';

interface Props {
  core: CoreNumbers;
  name?: string;
  dark?: boolean;
}

export function CodePassport({ core, name, dark }: Props) {
  const bg = dark ? Colors.surfaceDark : Colors.surface;
  const textColor = dark ? Colors.textLight : Colors.textPrimary;
  const subtextColor = dark ? Colors.textLightMuted : Colors.textMuted;

  const rows = [
    { label: NUMBER_LABELS.soul, final: core.soulFinal, composite: core.soulComposite },
    { label: NUMBER_LABELS.expression, final: core.expressionFinal, composite: core.expressionComposite },
    { label: NUMBER_LABELS.path, final: core.pathFinal, composite: core.pathComposite },
    { label: NUMBER_LABELS.direction, final: core.directionFinal, composite: core.directionComposite },
    { label: NUMBER_LABELS.result, final: core.resultFinal, composite: core.resultComposite },
  ];

  const formula = rows.map(r => r.final).join('—');
  const resultColor = PLANET_COLORS[core.resultFinal] || Colors.gold;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {name ? <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>{name}</Text> : null}

      <View style={[styles.formulaRow, { borderColor: resultColor + '40' }]}>
        <Text style={[styles.formula, { color: resultColor }]}>{formula}</Text>
      </View>
      <Text style={[styles.formulaLabels, { color: subtextColor }]}>
        Душа · Выражение · Путь · Направление · Результат
      </Text>

      <View style={styles.grid}>
        {rows.map(r => {
          const color = PLANET_COLORS[r.final] || Colors.gold;
          const showComp = r.composite !== r.final;
          return (
            <View key={r.label} style={[styles.cell, { borderColor: color + '40', backgroundColor: color + '0C' }]}>
              <Text style={[styles.cellFinal, { color }]}>{r.final}</Text>
              {showComp ? (
                <Text style={[styles.cellComp, { color: color + 'AA' }]}>{r.composite}</Text>
              ) : null}
              <Text style={[styles.cellLabel, { color: subtextColor }]} numberOfLines={2}>
                {r.label.replace('Число ', '')}
              </Text>
              <Text style={[styles.cellPlanet, { color }]} numberOfLines={1}>
                {PLANET_NAMES[r.final] || ''}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  name: { ...Typography.heading, marginBottom: Spacing.xs },
  formulaRow: {
    alignSelf: 'flex-start',
    borderWidth: 1, borderRadius: Radii.md,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  formula: { fontSize: 22, fontWeight: '700', letterSpacing: 3 },
  formulaLabels: { ...Typography.label, fontSize: 9, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', gap: Spacing.sm },
  cell: {
    flex: 1, borderWidth: 1, borderRadius: Radii.md,
    paddingVertical: Spacing.sm, paddingHorizontal: 4,
    alignItems: 'center', gap: 2,
  },
  cellFinal: { fontSize: 22, fontWeight: '700', lineHeight: 26 },
  cellComp: { fontSize: 10, fontWeight: '500', lineHeight: 12 },
  cellLabel: { ...Typography.caption, textAlign: 'center', fontSize: 9, lineHeight: 12 },
  cellPlanet: { fontSize: 9, fontWeight: '600', textAlign: 'center', lineHeight: 12 },
});
