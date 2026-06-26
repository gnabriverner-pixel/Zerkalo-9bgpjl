import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, Typography, Radii, Shadows, PLANET_COLORS, PLANET_NAMES } from '@/constants/theme';

const MOCK_PRICE = '2 900 ₽';  // ← change price here

const INCLUDES = [
  { icon: 'layers',          text: 'Полный разбор пяти позиций с составными числами' },
  { icon: 'grid-4x4',        text: 'Матрица рождения — простая и детальная' },
  { icon: 'brightness-1',    text: 'Пустые зоны — полный разбор задач роста' },
  { icon: 'autorenew',       text: 'Личный год и ключевые месяцы с интерпретацией' },
  { icon: 'payments',        text: 'Все четыре позиции денежного кода' },
  { icon: 'forum',           text: 'Коммуникационный код и способ взаимодействия' },
  { icon: 'timeline',        text: 'Возрастная карта — точки активации формулы' },
  { icon: 'people',          text: 'Совместимость — вектор двух кодов рядом' },
  { icon: 'alt-route',       text: 'Зоны напряжения и практический вектор развития' },
  { icon: 'picture-as-pdf',  text: 'PDF-разбор — персональный документ навсегда' },
];

const TRUST = [
  { icon: 'verified',        text: 'Авторская система · Альберт Вяземский' },
  { icon: 'lock',            text: 'Разовая покупка · без подписки' },
  { icon: 'bookmark',        text: 'Постоянный доступ к PDF-разбору' },
  { icon: 'info-outline',    text: 'Не является консультацией' },
];

const { width: SW } = Dimensions.get('window');

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, unlockPremium, trackEvent } = useApp();
  const fade = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,    { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const core = currentSession?.core;
  const name = currentSession?.name;
  const dob  = currentSession?.dateOfBirth;

  const finals = core
    ? [core.soulFinal, core.expressionFinal, core.pathFinal, core.directionFinal, core.resultFinal]
    : [];
  const compositeStr = core
    ? `${core.expressionComposite} / ${core.pathComposite} / ${core.directionComposite} / ${core.resultComposite}`
    : '—';
  const formulaStr = core
    ? `${core.soulFinal}—${core.expressionFinal}—${core.pathFinal}—${core.directionFinal}—${core.resultFinal}`
    : null;
  const formulaColor = core ? (PLANET_COLORS[core.resultFinal] || Colors.gold) : Colors.gold;

  const handlePurchase = () => {
    trackEvent('purchase_cta_clicked', { product: 'big_report' });
    unlockPremium();
    router.back();
  };

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        style={{ opacity: fade }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + 130 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Close */}
        <Pressable onPress={() => router.back()} style={styles.closeBtn} hitSlop={12}>
          <MaterialIcons name="close" size={22} color={Colors.textMuted} />
        </Pressable>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <Animated.View style={[styles.hero, { transform: [{ translateY: slideUp }] }]}>
          <View style={styles.heroBadge}>
            <MaterialIcons name="workspace-premium" size={11} color={Colors.background} />
            <Text style={styles.heroBadgeText}>БОЛЬШОЕ ИССЛЕДОВАНИЕ</Text>
          </View>

          <Text style={styles.heroTitle}>Дом{'\n'}Самопознания</Text>
          <Text style={styles.heroSub}>Персональный PDF-разбор вашей формулы — 22 раздела в глубину</Text>

          {/* Formula identity card */}
          {core ? (
            <LinearGradient
              colors={[Colors.surfaceDark, '#0C0C0A']}
              style={styles.identCard}
            >
              <View style={styles.identTop}>
                {name ? <Text style={styles.identName}>{name}</Text> : null}
                {dob ? <Text style={styles.identDob}>{dob}</Text> : null}
              </View>

              {/* Five nodes */}
              <View style={styles.identFormulaRow}>
                {finals.map((n, i) => {
                  const color = PLANET_COLORS[n] || Colors.gold;
                  return (
                    <React.Fragment key={i}>
                      <View style={[styles.identNode, { borderColor: color + '50', backgroundColor: color + '0D' }]}>
                        <Text style={[styles.identNodeNum, { color }]}>{n}</Text>
                        <Text style={[styles.identNodePlanet, { color: color + 'AA' }]}>
                          {PLANET_NAMES[n]?.slice(0, 3)}
                        </Text>
                      </View>
                      {i < finals.length - 1 ? (
                        <View style={[styles.identConnector, { backgroundColor: Colors.borderLight }]} />
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </View>

              <View style={styles.identMeta}>
                <Text style={styles.identMetaLabel}>составные</Text>
                <Text style={styles.identMetaValue}>{compositeStr}</Text>
              </View>

              <View style={[styles.identNote, { borderColor: formulaColor + '20' }]}>
                <MaterialIcons name="info-outline" size={11} color={Colors.gold} style={{ marginTop: 1 }} />
                <Text style={styles.identNoteText}>
                  Разбор раскрывает не только итоговые числа, но и составные — они показывают, как именно формируется код.
                </Text>
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.identPlaceholder}>
              <Text style={styles.identPlaceholderText}>
                Рассчитайте свой код для персонального разбора
              </Text>
            </View>
          )}
        </Animated.View>

        {/* ── What's included ──────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ЧТО ВХОДИТ · 22 РАЗДЕЛА</Text>
          <View style={styles.includesList}>
            {INCLUDES.map((item, i) => (
              <View key={i} style={[styles.includeRow, i > 0 && styles.includeRowBorder]}>
                <View style={styles.includeIconWrap}>
                  <MaterialIcons name={item.icon as any} size={15} color={Colors.gold} />
                </View>
                <Text style={styles.includeText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Trust signals ─────────────────────────────────────────── */}
        <View style={styles.trustGrid}>
          {TRUST.map((t, i) => (
            <View key={i} style={styles.trustItem}>
              <MaterialIcons name={t.icon as any} size={14} color={Colors.gold} />
              <Text style={styles.trustText}>{t.text}</Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Система «Цифровой Код» носит информационно-развлекательный и самоисследовательский характер.
          Не является медицинской, психологической, финансовой или юридической консультацией.
        </Text>
      </Animated.ScrollView>

      {/* ── Fixed CTA ─────────────────────────────────────────────── */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          onPress={handlePurchase}
          style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.88 }]}
          accessibilityLabel={`Открыть за ${MOCK_PRICE}`}
        >
          <LinearGradient
            colors={[Colors.gold, Colors.goldSoft]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaBtnGrad}
          >
            <Text style={styles.ctaBtnText}>Открыть за {MOCK_PRICE}</Text>
            <MaterialIcons name="arrow-forward" size={18} color={Colors.background} />
          </LinearGradient>
        </Pressable>
        <Text style={styles.ctaSub}>Разовая покупка · без подписки · не является консультацией</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.xl },

  closeBtn: { alignSelf: 'flex-end', padding: 4 },

  // Hero
  hero: { gap: Spacing.md },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroBadgeText: { ...Typography.label, color: Colors.background, fontSize: 9, letterSpacing: 0.8 },
  heroTitle: { ...Typography.display, color: Colors.textPrimary, fontSize: 38, lineHeight: 46 },
  heroSub: { ...Typography.body, color: Colors.textMuted, lineHeight: 24 },

  // Identity card
  identCard: {
    borderRadius: Radii.xxl, padding: Spacing.xl, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  identTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  identName: { ...Typography.title, color: Colors.textPrimary, fontSize: 22 },
  identDob: { ...Typography.caption, color: Colors.textMuted },
  identFormulaRow: { flexDirection: 'row', alignItems: 'center' },
  identNode: {
    flex: 1, paddingVertical: 10, borderWidth: 1, borderRadius: Radii.md,
    alignItems: 'center', gap: 2,
  },
  identNodeNum: { fontSize: 22, fontWeight: '700', lineHeight: 26 },
  identNodePlanet: { fontSize: 9, fontWeight: '500' },
  identConnector: { width: 6, height: 1, alignSelf: 'center' },
  identMeta: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  identMetaLabel: { ...Typography.label, color: Colors.textDisabled },
  identMetaValue: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic' },
  identNote: {
    flexDirection: 'row', gap: 6, alignItems: 'flex-start',
    borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm,
    backgroundColor: Colors.goldTint,
  },
  identNoteText: { ...Typography.caption, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
  identPlaceholder: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, alignItems: 'center',
  },
  identPlaceholderText: { ...Typography.bodySmall, color: Colors.textMuted, textAlign: 'center' },

  // Includes
  section: { gap: Spacing.md },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, letterSpacing: 1.2 },
  includesList: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.borderLight,
  },
  includeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 10 },
  includeRowBorder: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  includeIconWrap: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  includeText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1, lineHeight: 20 },

  // Trust
  trustGrid: { gap: Spacing.sm },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  trustText: { ...Typography.bodySmall, color: Colors.textSecondary },

  disclaimer: {
    ...Typography.caption, color: Colors.textDisabled,
    lineHeight: 18, textAlign: 'center', fontSize: 10,
  },

  // CTA
  ctaBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surfaceDark,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.xs,
    ...Shadows.lg,
  },
  ctaBtn: { borderRadius: Radii.lg, overflow: 'hidden', ...Shadows.gold },
  ctaBtnGrad: {
    paddingVertical: 18, paddingHorizontal: Spacing.xl,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: Spacing.sm,
  },
  ctaBtnText: { ...Typography.button, color: Colors.background, fontWeight: '700', fontSize: 17 },
  ctaSub: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'center', fontSize: 10 },
});
