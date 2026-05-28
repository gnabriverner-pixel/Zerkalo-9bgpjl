import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';
import { PRODUCT } from '@/constants/product';

const INCLUDES = [
  'Детальная цепочка расчёта с составными числами',
  'Число Души · Выражения · Пути · Направления · Результата',
  'Составные числа и их методологический смысл',
  'Простая и детальная матрица рождения',
  'Пустые зоны — полный разбор задач роста',
  'Личный год и ключевые месяцы с интерпретацией',
  'Денежный код — все четыре позиции',
  'Зоны напряжения и практический вектор',
  'Практический план',
  'PDF-отчёт для сохранения',
];

const TRUST = [
  { icon: 'verified', text: PRODUCT.authorLine },
  { icon: 'lock', text: 'Разовая покупка · без подписки' },
  { icon: 'bookmark', text: 'Постоянный доступ к отчёту в аккаунте' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, unlockPremium, trackEvent } = useApp();

  const core = currentSession?.core;
  const name = currentSession?.name;

  const formulaStr = core
    ? `${core.soulFinal}—${core.expressionFinal}—${core.pathFinal}—${core.directionFinal}—${core.resultFinal}`
    : '···—···—···—···—···';
  const compositeStr = core
    ? `${core.expressionComposite} / ${core.pathComposite} / ${core.directionComposite} / ${core.resultComposite}`
    : '—';

  const handlePurchase = () => {
    trackEvent('purchase_cta_clicked', { product: 'big_report' });
    trackEvent('purchase_started');
    unlockPremium();
    router.back();
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Close */}
        <Pressable onPress={() => router.back()} style={styles.closeBtn} hitSlop={12}>
          <MaterialIcons name="close" size={22} color={Colors.textMuted} />
        </Pressable>

        {/* Hero */}
        <View style={styles.hero}>
          {/* Badge */}
          <View style={styles.heroBadge}>
            <MaterialIcons name="workspace-premium" size={12} color={Colors.background} />
            <Text style={styles.heroBadgeText}>ГЛУБОКИЙ РАЗБОР</Text>
          </View>

          <Text style={styles.heroTitle}>Зеркало{'\n'}себя</Text>
          <Text style={styles.heroSubtitle}>Персональный PDF-разбор вашей формулы</Text>

          {core ? (
            <View style={styles.formulaBox}>
              {name ? <Text style={styles.formulaBoxName}>{name}</Text> : null}
              <Text style={styles.formulaBoxLabel}>Ваша формула</Text>
              <Text style={styles.formulaBoxValue}>{formulaStr}</Text>
              <Text style={styles.formulaBoxComposites}>составные: {compositeStr}</Text>
              <View style={styles.formulaBoxNote}>
                <MaterialIcons name="info-outline" size={12} color={Colors.gold} style={{ marginTop: 1 }} />
                <Text style={styles.formulaBoxNoteText}>
                  Раскрываем не только итоговые числа, но и составные — они показывают, как именно формируется ваш код.
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* What's included */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ЧТО ВХОДИТ · 22 РАЗДЕЛА</Text>
          <View style={styles.includesList}>
            {INCLUDES.map((item, i) => (
              <View key={i} style={styles.includeRow}>
                <View style={styles.includeDot} />
                <Text style={styles.includeText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trust signals */}
        <View style={styles.trustBlock}>
          {TRUST.map((t, i) => (
            <View key={i} style={styles.trustRow}>
              <MaterialIcons name={t.icon as any} size={15} color={Colors.gold} />
              <Text style={styles.trustText}>{t.text}</Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Система «Цифровой Код» носит информационно-развлекательный и самоисследовательский характер. Не является медицинской, психологической, финансовой или юридической консультацией.
        </Text>
      </ScrollView>

      {/* Fixed CTA */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          onPress={handlePurchase}
          style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.88 }]}
          accessibilityLabel={`Открыть за ${PRODUCT.deepReportPriceLabel}`}
        >
          <Text style={styles.ctaBtnText}>Открыть за {PRODUCT.deepReportPriceLabel}</Text>
        </Pressable>
        <Text style={styles.ctaSub}>
          Разовая покупка · без подписки · не является консультацией
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.xl },

  closeBtn: { alignSelf: 'flex-end', padding: 4 },

  // Hero
  hero: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.gold,
    alignSelf: 'flex-start',
    borderRadius: Radii.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgeText: {
    ...Typography.label,
    color: Colors.background,
    fontSize: 9,
    letterSpacing: 0.8,
  },
  heroTitle: {
    ...Typography.display,
    color: Colors.textPrimary,
    fontSize: 36,
    lineHeight: 44,
  },
  heroSubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
  },

  // Formula box
  formulaBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  formulaBoxName: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic' },
  formulaBoxLabel: { ...Typography.label, color: Colors.gold },
  formulaBoxValue: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 3 },
  formulaBoxComposites: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic' },
  formulaBoxNote: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginTop: 4 },
  formulaBoxNoteText: { ...Typography.caption, color: Colors.textSecondary, flex: 1, lineHeight: 18 },

  // Includes
  section: { gap: Spacing.md },
  sectionLabel: { ...Typography.label, color: Colors.textMuted },
  includesList: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  includeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  includeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.gold, marginTop: 8 },
  includeText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1, lineHeight: 22 },

  // Trust
  trustBlock: { gap: Spacing.sm },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  trustText: { ...Typography.bodySmall, color: Colors.textSecondary },

  disclaimer: {
    ...Typography.caption,
    color: Colors.textDisabled,
    lineHeight: 18,
    textAlign: 'center',
    fontSize: 10,
  },

  // CTA bar
  ctaBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  ctaBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radii.lg,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    ...Shadows.gold,
  },
  ctaBtnText: {
    ...Typography.button,
    color: Colors.background,
    fontWeight: '700',
    fontSize: 16,
  },
  ctaSub: {
    ...Typography.caption,
    color: Colors.textDisabled,
    textAlign: 'center',
    fontSize: 10,
  },
});
