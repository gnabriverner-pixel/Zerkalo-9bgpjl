import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Colors, Spacing, Typography, Radii, PLANET_COLORS, PLANET_NAMES } from '@/constants/theme';
import { MONEY_POSITIONS, MONEY_DISCLAIMER } from '@/constants/numerology-data';

export default function MoneyCodeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, isPremium, trackEvent } = useApp();

  if (!currentSession) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + Spacing.xl, alignItems: 'center', justifyContent: 'center' }]}>
        <MaterialIcons name="payments" size={44} color={Colors.textMuted} />
        <Text style={{ ...Typography.body, color: Colors.textMuted, marginTop: Spacing.md }}>
          Сначала выполните расчёт
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: Spacing.lg }}>
          <Text style={{ ...Typography.button, color: Colors.gold }}>← Назад</Text>
        </Pressable>
      </View>
    );
  }

  const { money, name, dateOfBirth } = currentSession;
  const formula = `${money.digit1} · ${money.digit2} · ${money.digit3} · ${money.digit4}`;

  const positions = [
    { pos: 1 as const, digit: money.digit1, chain: money.chain1 },
    { pos: 2 as const, digit: money.digit2, chain: money.chain2 },
    { pos: 3 as const, digit: money.digit3, chain: money.chain3, locked: !isPremium },
    { pos: 4 as const, digit: money.digit4, chain: money.chain4, locked: !isPremium },
  ];

  const freePositions = positions.filter(p => !p.locked);
  const lockedPositions = positions.filter(p => p.locked);

  // Financial vector summary
  const d1Planet = PLANET_NAMES[money.digit1] || '';
  const d2Planet = PLANET_NAMES[money.digit2] || '';
  const d3Planet = PLANET_NAMES[money.digit3] || '';
  const d4Planet = PLANET_NAMES[money.digit4] || '';

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
          <Text style={styles.pageTitle}>Денежный код</Text>
          <Text style={styles.pageSubtitle}>{name} · {dateOfBirth}</Text>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerRow}>
        <MaterialIcons name="info-outline" size={14} color={Colors.textMuted} />
        <Text style={styles.disclaimerText}>{MONEY_DISCLAIMER}</Text>
      </View>

      {/* Formula card */}
      <PremiumCard dark>
        <Text style={styles.formulaLabel}>ДЕНЕЖНАЯ ФОРМУЛА</Text>
        <Text style={styles.formulaValue}>{formula}</Text>
        <View style={styles.formulaChains}>
          {positions.map(p => (
            <View key={p.pos} style={styles.formulaChainRow}>
              <Text style={[styles.formulaChainDigit, { color: PLANET_COLORS[p.digit] || Colors.gold }]}>
                {p.digit}
              </Text>
              <Text style={styles.formulaChainCalc}>{p.chain}</Text>
            </View>
          ))}
        </View>
      </PremiumCard>

      {/* Free positions */}
      {freePositions.map(p => {
        const posData = MONEY_POSITIONS[p.pos];
        const color = PLANET_COLORS[p.digit] || Colors.gold;
        const descText = posData.desc[p.digit] || '';
        return (
          <PremiumCard key={p.pos}>
            <View style={styles.posHeader}>
              <View style={[styles.posCircle, { borderColor: color + '60', backgroundColor: color + '10' }]}>
                <Text style={[styles.posDigit, { color }]}>{p.digit}</Text>
              </View>
              <View style={styles.posInfo}>
                <Text style={styles.posTitle}>
                  Позиция {p.pos} · {posData.title}
                </Text>
                <Text style={styles.posSubtitle}>{posData.subtitle}</Text>
                <Text style={[styles.posPlanet, { color }]}>{PLANET_NAMES[p.digit] || ''}</Text>
              </View>
            </View>
            <View style={styles.posDivider} />
            <View style={styles.posChain}>
              <Text style={styles.posChainLabel}>Расчёт:</Text>
              <Text style={styles.posChainText}>{p.chain}</Text>
            </View>
            <Text style={styles.posDesc}>{descText}</Text>
          </PremiumCard>
        );
      })}

      {/* Financial vector (free) */}
      <PremiumCard>
        <SectionLabel title="Финансовый вектор" />
        <Text style={styles.vectorText}>
          {`Денежный поток включается через ${d1Planet} (${money.digit1}).`}
          {'\n'}
          {`Закрепляется через ${d2Planet} (${money.digit2}).`}
          {'\n'}
          {`Потенциал — через ${d3Planet} (${money.digit3}).`}
          {'\n'}
          {`Итоговая ${d4Planet} (${money.digit4}) показывает: масштаб требует системности, дисциплины и долгой дистанции.`}
        </Text>
        <Text style={styles.vectorConclusion}>
          Деньги приходят не просто через труд, а через ценность, которую можно объяснить и встроить в систему.
        </Text>
      </PremiumCard>

      {/* Locked positions */}
      {lockedPositions.length > 0 ? (
        <Pressable
          onPress={() => { trackEvent('paywall_viewed', { source: 'money_locked' }); router.push('/paywall'); }}
          style={styles.lockedBlock}
        >
          <View style={styles.lockedHeader}>
            <MaterialIcons name="lock" size={16} color={Colors.gold} />
            <Text style={styles.lockedTitle}>Позиции 3 и 4 · Потенциал и предел роста</Text>
          </View>
          <Text style={styles.lockedDesc}>
            Где формула может раскрыться сильнее. Что усиливает масштаб. Какие привычки ограничивают денежный результат.
          </Text>
          <View style={styles.lockedCta}>
            <Text style={styles.lockedCtaText}>Открыть полный денежный код — 650 ₽</Text>
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
  pageTitle: { ...Typography.title, color: Colors.textPrimary },
  pageSubtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },

  disclaimerRow: { flexDirection: 'row', gap: Spacing.xs, alignItems: 'flex-start' },
  disclaimerText: { ...Typography.caption, color: Colors.textMuted, flex: 1, lineHeight: 18 },

  formulaLabel: { ...Typography.label, color: Colors.gold, marginBottom: Spacing.sm },
  formulaValue: { fontSize: 28, fontWeight: '700', color: Colors.textLight, letterSpacing: 4, marginBottom: Spacing.md },
  formulaChains: { gap: 6 },
  formulaChainRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  formulaChainDigit: { fontSize: 18, fontWeight: '700', width: 28 },
  formulaChainCalc: { ...Typography.caption, color: Colors.textLightMuted, fontFamily: 'monospace', flex: 1 },

  posHeader: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  posCircle: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  posDigit: { fontSize: 26, fontWeight: '700' },
  posInfo: { flex: 1 },
  posTitle: { ...Typography.subheading, color: Colors.textPrimary, fontSize: 15 },
  posSubtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  posPlanet: { ...Typography.bodySmall, fontWeight: '600', marginTop: 3 },
  posDivider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },
  posChain: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm, alignItems: 'center' },
  posChainLabel: { ...Typography.caption, color: Colors.textMuted },
  posChainText: { ...Typography.caption, color: Colors.textSecondary, fontFamily: 'monospace', flex: 1 },
  posDesc: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24, fontSize: 14 },

  vectorText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 26, fontSize: 14, marginBottom: Spacing.sm },
  vectorConclusion: {
    ...Typography.bodySmall, color: Colors.gold, fontStyle: 'italic',
    borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing.sm,
  },

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
});
