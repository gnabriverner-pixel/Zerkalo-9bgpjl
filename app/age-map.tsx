import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { getAgeMap } from '@/services/calculations';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Colors, Spacing, Typography, Radii } from '@/constants/theme';

export default function AgeMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession } = useApp();

  if (!currentSession) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ ...Typography.body, color: Colors.textMuted }}>Сначала выполните расчёт</Text>
      </View>
    );
  }

  const { core, name, dateOfBirth } = currentSession;
  const ageMap = getAgeMap(core);

  // Current age
  const currentYear = 2026;
  const birthYear = core.year;
  const currentAge = currentYear - birthYear;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xxl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={20} color={Colors.textSecondary} />
        </Pressable>
        <View>
          <Text style={styles.pageTitle}>Возрастная карта</Text>
          <Text style={styles.pageSubtitle}>{name} · {dateOfBirth}</Text>
        </View>
      </View>

      <PremiumCard style={styles.currentNote}>
        <Text style={styles.currentAge}>Текущий возраст: {currentAge} лет</Text>
        <Text style={styles.currentYear}>год {currentYear}</Text>
      </PremiumCard>

      <SectionLabel title="Ключевые точки активации" subtitle="Возрастные узлы, связанные с вашим числовым кодом" />

      {ageMap.map((node, i) => {
        const isPast = node.age < currentAge;
        const isCurrent = node.age >= currentAge && node.age <= currentAge + 3;
        const accentColor = isCurrent ? Colors.gold : (isPast ? Colors.textMuted : Colors.textSecondary);

        return (
          <PremiumCard key={i} style={[styles.nodeCard, isCurrent && styles.nodeCardCurrent]}>
            <View style={styles.nodeHeader}>
              <View style={[styles.ageBadge, {
                backgroundColor: isCurrent ? Colors.gold + '20' : Colors.surfaceAlt,
                borderColor: isCurrent ? Colors.gold : Colors.border,
              }]}>
                <Text style={[styles.ageNum, { color: accentColor }]}>{node.age}</Text>
                <Text style={styles.ageLabel}>лет</Text>
              </View>
              <View style={styles.nodeInfo}>
                <Text style={styles.nodeYear}>{node.year} год</Text>
                <Text style={[styles.nodeActivation, isCurrent && { color: Colors.gold }]}>{node.activation}</Text>
              </View>
              {isCurrent ? (
                <View style={styles.nowBadge}><Text style={styles.nowText}>сейчас</Text></View>
              ) : null}
            </View>
            <Text style={styles.nodeMeaning}>{node.meaning}</Text>
            {isCurrent ? (
              <View style={styles.nodeNote}>
                <MaterialIcons name="info-outline" size={14} color={Colors.gold} />
                <Text style={styles.nodeNoteText}>
                  Вы находитесь вблизи этого возрастного узла. Период особенно значим для осознанного движения.
                </Text>
              </View>
            ) : null}
          </PremiumCard>
        );
      })}

      {/* General note */}
      <PremiumCard dark>
        <Text style={styles.noteTitle}>О возрастных узлах</Text>
        <Text style={styles.noteBody}>
          Возрастные узлы показывают не то, что произойдёт автоматически, а то, какие темы становятся особенно
          значимыми в определённые периоды жизни.{'\n\n'}
          Пустоты матрицы не активируются сами по себе — они требуют осознанного внимания. Линии матрицы,
          закрытые к определённому возрасту, говорят о собранной внутренней архитектуре.
        </Text>
      </PremiumCard>

      <DisclaimerBanner compact />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.sm },
  backBtn: { padding: 4, marginTop: 2 },
  pageTitle: { ...Typography.title, color: Colors.textPrimary },
  pageSubtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  currentNote: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.gold + '10',
    borderColor: Colors.gold + '40',
  },
  currentAge: { ...Typography.subheading, color: Colors.textPrimary },
  currentYear: { ...Typography.caption, color: Colors.gold },
  nodeCard: { gap: Spacing.md },
  nodeCardCurrent: {
    borderColor: Colors.gold,
    borderWidth: 1.5,
  },
  nodeHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  ageBadge: {
    width: 56, height: 56, borderRadius: Radii.md,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  ageNum: { fontSize: 22, fontWeight: '700' },
  ageLabel: { ...Typography.caption, color: Colors.textMuted },
  nodeInfo: { flex: 1 },
  nodeYear: { ...Typography.caption, color: Colors.textMuted },
  nodeActivation: { ...Typography.subheading, color: Colors.textPrimary, fontSize: 15, marginTop: 2 },
  nowBadge: {
    backgroundColor: Colors.gold,
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  nowText: { ...Typography.label, color: Colors.surfaceDark, fontSize: 10 },
  nodeMeaning: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  nodeNote: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'flex-start',
    backgroundColor: Colors.gold + '10',
    borderRadius: Radii.sm,
    padding: Spacing.sm,
  },
  nodeNoteText: { ...Typography.caption, color: Colors.gold, flex: 1, lineHeight: 18 },
  noteTitle: { ...Typography.subheading, color: Colors.textLight, marginBottom: Spacing.sm },
  noteBody: { ...Typography.bodySmall, color: Colors.textLightMuted, lineHeight: 22 },
});
