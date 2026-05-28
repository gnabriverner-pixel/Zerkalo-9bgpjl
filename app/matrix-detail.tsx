import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Colors, Spacing, Typography, Radii, PLANET_COLORS } from '@/constants/theme';
import { MATRIX_EMPTY_ZONE_TEXTS } from '@/constants/numerology-data';

const FREE_EMPTY_COUNT = 3;

export default function MatrixDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, isPremium, trackEvent } = useApp();

  if (!currentSession) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + Spacing.xl, alignItems: 'center', justifyContent: 'center' }]}>
        <MaterialIcons name="grid-4x4" size={44} color={Colors.textMuted} />
        <Text style={{ ...Typography.body, color: Colors.textMuted, marginTop: Spacing.md }}>
          Сначала выполните расчёт
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: Spacing.lg }}>
          <Text style={{ ...Typography.button, color: Colors.gold }}>← Назад</Text>
        </Pressable>
      </View>
    );
  }

  const { matrix, name, dateOfBirth } = currentSession;

  // Simple matrix grid
  const simpleEmpty = matrix.emptySimple;
  const freeEmpty = simpleEmpty.slice(0, FREE_EMPTY_COUNT);
  const lockedEmpty = simpleEmpty.slice(FREE_EMPTY_COUNT);

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
          <Text style={styles.pageTitle}>Матрица</Text>
          <Text style={styles.pageSubtitle}>{name} · {dateOfBirth}</Text>
        </View>
      </View>

      {/* Simple matrix */}
      <PremiumCard>
        <Text style={styles.cardTitle}>Простая матрица рождения</Text>
        <Text style={styles.cardSub}>По цифрам даты: {matrix.simpleDigits.join(', ')}</Text>

        <View style={styles.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
            const count = matrix.simple[n] || 0;
            const isEmpty = count === 0;
            const color = isEmpty ? Colors.border : (PLANET_COLORS[n] || Colors.gold);
            return (
              <View
                key={n}
                style={[
                  styles.cell,
                  isEmpty
                    ? styles.cellEmpty
                    : [styles.cellFilled, { borderColor: color + '50', backgroundColor: color + '0E' }],
                ]}
              >
                <Text style={[styles.cellNum, { color: isEmpty ? Colors.textMuted : color }]}>
                  {n}
                </Text>
                {!isEmpty ? (
                  <Text style={[styles.cellCount, { color: color + 'CC' }]}>
                    {'●'.repeat(Math.min(count, 5))}
                  </Text>
                ) : (
                  <MaterialIcons name="remove" size={14} color={Colors.border} />
                )}
              </View>
            );
          })}
        </View>
      </PremiumCard>

      {/* Free empty zones */}
      {freeEmpty.length > 0 ? (
        <View style={styles.section}>
          <SectionLabel title="Зоны развития" subtitle="Цифры, которых нет в дате рождения" />
          {freeEmpty.map(n => {
            const zoneData = MATRIX_EMPTY_ZONE_TEXTS[n];
            const color = PLANET_COLORS[n] || Colors.gold;
            return (
              <PremiumCard key={n}>
                <View style={styles.zoneHeader}>
                  <View style={[styles.zoneCircle, { borderColor: color + '50', backgroundColor: color + '10' }]}>
                    <Text style={[styles.zoneNum, { color }]}>{n}</Text>
                  </View>
                  <Text style={styles.zoneTitle}>{zoneData?.title || `Нет ${n}`}</Text>
                </View>
                <Text style={styles.zoneText}>{zoneData?.text || ''}</Text>
              </PremiumCard>
            );
          })}
        </View>
      ) : null}

      {/* Locked remaining zones */}
      {lockedEmpty.length > 0 && !isPremium ? (
        <Pressable
          onPress={() => { trackEvent('paywall_viewed', { source: 'matrix_locked' }); router.push('/paywall'); }}
          style={styles.lockedBlock}
        >
          <View style={styles.lockedHeader}>
            <MaterialIcons name="lock" size={16} color={Colors.gold} />
            <Text style={styles.lockedTitle}>
              Ещё {lockedEmpty.length} {lockedEmpty.length === 1 ? 'зона' : 'зоны'} — в Большом исследовании
            </Text>
          </View>
          <Text style={styles.lockedDesc}>
            Полная детальная матрица · анализ линий и осей · практические ориентиры роста
          </Text>
          <View style={styles.lockedCta}>
            <Text style={styles.lockedCtaText}>Открыть — 565 ₽</Text>
            <MaterialIcons name="arrow-forward" size={14} color={Colors.surfaceDark} />
          </View>
        </Pressable>
      ) : null}

      {/* Detailed matrix — locked */}
      {!isPremium ? (
        <Pressable
          onPress={() => { trackEvent('paywall_viewed', { source: 'detailed_matrix' }); router.push('/paywall'); }}
          style={styles.detailedLocked}
        >
          <MaterialIcons name="grid-on" size={28} color={Colors.gold} />
          <Text style={styles.detailedLockedTitle}>Детальная матрица</Text>
          <Text style={styles.detailedLockedDesc}>
            Включает цифры составных чисел кода. Показывает активации, которые раскрываются с возрастом.
          </Text>
          <Text style={styles.detailedLockedCta}>Открыть в Большом исследовании →</Text>
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
  pageTitle: { ...Typography.title, color: Colors.textPrimary },
  pageSubtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },

  cardTitle: { ...Typography.subheading, color: Colors.textPrimary, marginBottom: 4 },
  cardSub: { ...Typography.caption, color: Colors.textMuted, marginBottom: Spacing.md },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  cell: {
    width: '30%', aspectRatio: 1.2,
    borderRadius: Radii.md, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', gap: 3,
  },
  cellEmpty: { borderColor: Colors.borderLight, backgroundColor: Colors.surfaceAlt },
  cellFilled: {},
  cellNum: { fontSize: 22, fontWeight: '700' },
  cellCount: { fontSize: 8, letterSpacing: 2 },

  section: { gap: Spacing.md },
  zoneHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  zoneCircle: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  zoneNum: { fontSize: 18, fontWeight: '700' },
  zoneTitle: { ...Typography.subheading, color: Colors.textPrimary, flex: 1, fontSize: 15 },
  zoneText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24, fontSize: 14 },

  lockedBlock: {
    backgroundColor: Colors.gold + '06', borderRadius: Radii.xl,
    borderWidth: 1.5, borderColor: Colors.gold + '40', padding: Spacing.lg, gap: Spacing.md,
  },
  lockedHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  lockedTitle: { ...Typography.subheading, color: Colors.gold, flex: 1 },
  lockedDesc: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 20 },
  lockedCta: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.gold, borderRadius: Radii.md,
    paddingHorizontal: Spacing.lg, paddingVertical: 10, alignSelf: 'flex-start',
  },
  lockedCtaText: { ...Typography.label, color: Colors.surfaceDark, fontWeight: '700' },

  detailedLocked: {
    backgroundColor: Colors.surfaceDark, borderRadius: Radii.xl,
    padding: Spacing.xl, alignItems: 'center', gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.gold + '30',
  },
  detailedLockedTitle: { ...Typography.heading, color: Colors.textLight },
  detailedLockedDesc: { ...Typography.body, color: Colors.textLightMuted, textAlign: 'center', lineHeight: 24 },
  detailedLockedCta: { ...Typography.bodySmall, color: Colors.gold, fontWeight: '600' },
});
