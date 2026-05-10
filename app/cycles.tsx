import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/hooks/useApp';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Colors, Spacing, Typography, Radii, PLANET_COLORS } from '@/constants/theme';
import { PERSONAL_YEAR_MEANINGS } from '@/constants/numerology-data';

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const LOCKED_SECTIONS = [
  'Зоны напряжения года',
  'Ключевые месяцы с интерпретацией',
  'Практические ориентиры цикла',
];

export default function CyclesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, isPremium, trackEvent } = useApp();

  if (!currentSession) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + Spacing.xl, alignItems: 'center', justifyContent: 'center' }]}>
        <MaterialIcons name="autorenew" size={44} color={Colors.textMuted} />
        <Text style={{ ...Typography.body, color: Colors.textMuted, marginTop: Spacing.md }}>
          Сначала выполните расчёт
        </Text>
        <Pressable style={styles.backBtn2} onPress={() => router.back()}>
          <Text style={{ ...Typography.button, color: Colors.gold }}>← Назад</Text>
        </Pressable>
      </View>
    );
  }

  const { cycles, name, dateOfBirth } = currentSession;
  const yearMeaning = PERSONAL_YEAR_MEANINGS[cycles.personalYear];
  const monthMeaning = PERSONAL_YEAR_MEANINGS[cycles.personalMonth];
  const yearColor = PLANET_COLORS[cycles.personalYear] || Colors.gold;
  const monthColor = PLANET_COLORS[cycles.personalMonth] || Colors.gold;
  const currentMonthIdx = cycles.currentMonth - 1;

  // Month title uses "Месяц" not "Год"
  const monthTitle = monthMeaning ? monthMeaning.title.replace('Год', 'Месяц') : '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={20} color={Colors.textSecondary} />
        </Pressable>
        <View>
          <Text style={styles.pageTitle}>Циклы</Text>
          <Text style={styles.pageSubtitle}>{name} · {dateOfBirth}</Text>
        </View>
      </View>

      {/* Personal year card */}
      <LinearGradient colors={[Colors.surfaceDark, Colors.surfaceMid]} style={styles.yearCard}>
        <View style={styles.yearHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.yearLabel}>ЛИЧНЫЙ ГОД 2026</Text>
            <Text style={styles.yearTitle}>{yearMeaning?.title || ''}</Text>
          </View>
          <NumberBadge number={cycles.personalYear} size="xl" showPlanet />
        </View>
        {/* Show all 3 chain lines */}
        <View style={styles.yearChainBlock}>
          {cycles.yearChain.split('\n').map((line, i) => (
            <Text key={i} style={styles.yearChainLine}>{line}</Text>
          ))}
        </View>
        {yearMeaning ? (
          <>
            <View style={[styles.yearTheme, { backgroundColor: yearColor + '15', borderColor: yearColor + '30' }]}>
              <Text style={[styles.yearThemeText, { color: yearColor }]}>{yearMeaning.theme}</Text>
            </View>
            <Text style={styles.yearFocus}>{yearMeaning.focus}</Text>
          </>
        ) : null}
      </LinearGradient>

      {/* Personal month card */}
      <PremiumCard>
        <SectionLabel
          title={`Личный месяц · ${MONTH_NAMES[currentMonthIdx]}`}
          subtitle={cycles.monthChain}
        />
        <View style={styles.monthRow}>
          <NumberBadge number={cycles.personalMonth} size="lg" showPlanet />
          <View style={styles.monthInfo}>
            <Text style={styles.monthTitle}>{monthTitle}</Text>
            <Text style={[styles.monthTheme, { color: monthColor }]}>{monthMeaning?.theme}</Text>
            <Text style={styles.monthFocus}>{monthMeaning?.focus}</Text>
          </View>
        </View>
      </PremiumCard>

      {/* Monthly grid */}
      <View style={styles.section}>
        <SectionLabel title="Личные месяцы 2026" />
        <PremiumCard style={styles.monthGrid}>
          {cycles.monthlyBreakdown.map((m, i) => {
            const isCurrent = m.month === cycles.currentMonth;
            const color = PLANET_COLORS[m.personalNumber] || Colors.gold;
            return (
              <View
                key={m.month}
                style={[
                  styles.monthCell,
                  isCurrent && [styles.monthCellActive, { borderColor: color }],
                  i % 3 !== 2 && styles.monthCellBorderRight,
                  i < 9 && styles.monthCellBorderBottom,
                ]}
              >
                <Text style={[styles.monthCellNum, { color: isCurrent ? color : Colors.textSecondary }]}>
                  {m.personalNumber}
                </Text>
                <Text style={styles.monthCellName}>{m.label.slice(0, 3)}</Text>
                {isCurrent ? <View style={[styles.monthDot, { backgroundColor: color }]} /> : null}
              </View>
            );
          })}
        </PremiumCard>
      </View>

      {/* Locked sections */}
      {!isPremium ? (
        <Pressable
          onPress={() => { trackEvent('paywall_viewed', { source: 'cycles_locked' }); router.push('/paywall'); }}
          style={styles.lockedBlock}
        >
          <View style={styles.lockedHeader}>
            <MaterialIcons name="lock" size={16} color={Colors.gold} />
            <Text style={styles.lockedTitle}>Доступно в Большом исследовании</Text>
          </View>
          {LOCKED_SECTIONS.map((s, i) => (
            <View key={i} style={styles.lockedRow}>
              <View style={styles.lockedDot} />
              <Text style={styles.lockedText}>{s}</Text>
            </View>
          ))}
          <View style={styles.lockedCta}>
            <Text style={styles.lockedCtaText}>Открыть — 2 900 ₽</Text>
            <MaterialIcons name="arrow-forward" size={14} color={Colors.surfaceDark} />
          </View>
        </Pressable>
      ) : null}

      <DisclaimerBanner compact />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md, gap: Spacing.lg },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  backBtn: { padding: 4, marginTop: 2 },
  backBtn2: { marginTop: Spacing.lg },
  pageTitle: { ...Typography.title, color: Colors.textPrimary },
  pageSubtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },

  yearCard: { borderRadius: Radii.xl, padding: Spacing.xl, gap: Spacing.md },
  yearHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.md },
  yearLabel: { ...Typography.label, color: Colors.gold, marginBottom: 4 },
  yearTitle: { ...Typography.heading, color: Colors.textLight },
  yearChainBlock: { gap: 3 },
  yearChainLine: { ...Typography.caption, color: Colors.textLightMuted, fontFamily: 'monospace' },
  yearTheme: {
    borderRadius: Radii.sm, borderWidth: 1,
    paddingHorizontal: Spacing.sm, paddingVertical: 5, alignSelf: 'flex-start',
  },
  yearThemeText: { ...Typography.bodySmall, fontWeight: '600' },
  yearFocus: { ...Typography.body, color: Colors.textLightMuted, lineHeight: 24 },

  monthRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  monthInfo: { flex: 1, gap: 4 },
  monthTitle: { ...Typography.subheading, color: Colors.textPrimary },
  monthTheme: { ...Typography.bodySmall, fontWeight: '600' },
  monthFocus: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 20 },

  section: { gap: Spacing.md },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 0, overflow: 'hidden' },
  monthCell: { width: '33.33%', padding: Spacing.md, alignItems: 'center', gap: 4 },
  monthCellActive: { backgroundColor: Colors.gold + '08', borderWidth: 1 },
  monthCellBorderRight: { borderRightWidth: 1, borderRightColor: Colors.borderLight },
  monthCellBorderBottom: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  monthCellNum: { fontSize: 24, fontWeight: '700' },
  monthCellName: { ...Typography.caption, color: Colors.textMuted },
  monthDot: { width: 5, height: 5, borderRadius: 3 },

  lockedBlock: {
    backgroundColor: Colors.gold + '06', borderRadius: Radii.xl,
    borderWidth: 1.5, borderColor: Colors.gold + '40', padding: Spacing.lg, gap: Spacing.md,
  },
  lockedHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  lockedTitle: { ...Typography.subheading, color: Colors.gold },
  lockedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  lockedDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.gold + '60' },
  lockedText: { ...Typography.bodySmall, color: Colors.textSecondary },
  lockedCta: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.gold, borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg, paddingVertical: 10, alignSelf: 'flex-start', marginTop: Spacing.xs,
  },
  lockedCtaText: { ...Typography.label, color: Colors.surfaceDark, fontWeight: '700' },
});
