import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, Typography, Radii, Shadows, PLANET_COLORS } from '@/constants/theme';
import { NUMBER_LABELS } from '@/constants/numerology-data';

interface Module {
  icon: string;
  title: string;
  desc: string;
  route: string;
  needsSession?: boolean;
}

const MODULES: Module[] = [
  { icon: 'fingerprint', title: 'Мой код', desc: 'Пять чисел. Структура и паспорт.', route: '/result', needsSession: true },
  { icon: 'style', title: 'Визуальный паспорт', desc: 'Карта чисел, синтез, практики, деньги.', route: '/visual-passport', needsSession: false },
  { icon: 'grid-4x4', title: 'Матрица', desc: 'Простая и детальная. Зоны развития.', route: '/matrix-detail', needsSession: true },
  { icon: 'autorenew', title: 'Циклы', desc: 'Личный год, месяцы, ключевые периоды.', route: '/cycles', needsSession: true },
  { icon: 'payments', title: 'Денежный код', desc: 'Финансовая формула и жизненный вектор.', route: '/money-code', needsSession: true },
  { icon: 'timeline', title: 'Возрастная карта', desc: 'Ключевые точки активации кода.', route: '/age-map', needsSession: true },
  { icon: 'people-outline', title: 'Совместимость', desc: 'Вектор взаимодействия двух кодов.', route: '/compatibility' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, currentSession, isPremium, savedReports } = useApp();

  const hasSession = currentSession !== null;
  const core = currentSession?.core;
  const formula = core
    ? `${core.soulFinal}—${core.expressionFinal}—${core.pathFinal}—${core.directionFinal}—${core.resultFinal}`
    : '';
  const compositeStr = core
    ? `${core.expressionComposite} / ${core.pathComposite} / ${core.directionComposite} / ${core.resultComposite}`
    : '';

  const navigateModule = (mod: Module) => {
    if (mod.needsSession && !hasSession) router.push('/(tabs)/calculate');
    else router.push(mod.route as any);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.wordmark}>Зеркало себя</Text>
          <Text style={styles.wordmarkSub}>Система Цифрового Кода</Text>
        </View>
        <Pressable
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.avatarBtn}
          hitSlop={10}
          accessibilityLabel="Профиль"
        >
          <View style={[styles.avatarCircle, user && !user.isGuest ? styles.avatarCircleAuth : {}]}>
            <MaterialIcons name="person" size={16} color={user && !user.isGuest ? Colors.gold : Colors.textMuted} />
          </View>
        </Pressable>
      </View>

      {/* Hero CTA or active session */}
      {hasSession && core ? (
        <Pressable
          onPress={() => router.push('/result')}
          style={({ pressed }) => [styles.sessionCard, pressed && { opacity: 0.88 }]}
        >
          <View style={styles.sessionCardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionCardLabel}>ВАША ФОРМУЛА</Text>
              <Text style={styles.sessionCardName} numberOfLines={1}>{currentSession.name}</Text>
              <Text style={styles.sessionCardDob}>{currentSession.dateOfBirth}</Text>
            </View>
            {/* Formula display */}
            <View style={[styles.sessionFormulaCircle, { borderColor: (PLANET_COLORS[core.resultFinal] || Colors.gold) + '50' }]}>
              <Text style={[styles.sessionFormulaText, { color: PLANET_COLORS[core.resultFinal] || Colors.gold }]}>
                {core.soulFinal}—{core.expressionFinal}{'\n'}{core.pathFinal}—{core.directionFinal}—{core.resultFinal}
              </Text>
            </View>
          </View>
          <Text style={styles.sessionComposites}>составные: {compositeStr}</Text>
          <View style={styles.sessionCardFooter}>
            <Text style={styles.sessionCardCta}>Открыть разбор</Text>
            <MaterialIcons name="arrow-forward" size={14} color={Colors.gold} />
          </View>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => router.push('/(tabs)/calculate')}
          style={({ pressed }) => [styles.heroCta, pressed && { opacity: 0.88 }]}
        >
          {/* Decorative sigil row */}
          <View style={styles.heroSigilRow}>
            {[Colors.sun, Colors.mercury, Colors.venus, Colors.moon, Colors.mars].map((c, i) => (
              <View key={i} style={[styles.heroSigilDot, { backgroundColor: c }]} />
            ))}
          </View>
          <Text style={styles.heroTitle}>Рассчитать свой код</Text>
          <Text style={styles.heroBody}>
            Введите дату рождения — получите персональный числовой паспорт
          </Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Бесплатно · 30 секунд</Text>
          </View>
        </Pressable>
      )}

      {/* Quick stats if session exists */}
      {hasSession && core ? (
        <View style={styles.statsRow}>
          {[
            { label: 'Душа', final: core.soulFinal, comp: core.soulComposite },
            { label: 'Выраж.', final: core.expressionFinal, comp: core.expressionComposite },
            { label: 'Путь', final: core.pathFinal, comp: core.pathComposite },
            { label: 'Напр.', final: core.directionFinal, comp: core.directionComposite },
            { label: 'Рез.', final: core.resultFinal, comp: core.resultComposite },
          ].map((n, i) => {
            const color = PLANET_COLORS[n.final] || Colors.gold;
            const showComp = n.comp !== n.final;
            return (
              <React.Fragment key={n.label}>
                {i > 0 ? <View style={styles.statsDivider} /> : null}
                <View style={styles.stat}>
                  <Text style={[styles.statFinal, { color }]}>{n.final}</Text>
                  {showComp ? <Text style={[styles.statComp, { color: color + 'AA' }]}>{n.comp}</Text> : null}
                  <Text style={styles.statLabel}>{n.label}</Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      ) : null}

      {/* Modules */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Инструменты</Text>
          {!hasSession ? <Text style={styles.sectionHint}>Нужна дата рождения</Text> : null}
        </View>
        <View style={styles.moduleList}>
          {MODULES.map((mod, i) => {
            const locked = Boolean(mod.needsSession && !hasSession);
            return (
              <View key={mod.title}>
                <Pressable
                  onPress={() => navigateModule(mod)}
                  style={({ pressed }) => [styles.modRow, pressed && { backgroundColor: Colors.surfaceElevated }]}
                >
                  <View style={[styles.modIconWrap, locked && styles.modIconWrapLocked]}>
                    <MaterialIcons name={mod.icon as any} size={18} color={locked ? Colors.textDisabled : Colors.gold} />
                  </View>
                  <View style={styles.modText}>
                    <Text style={[styles.modTitle, locked && { color: Colors.textDisabled }]}>{mod.title}</Text>
                    <Text style={styles.modDesc}>{mod.desc}</Text>
                  </View>
                  <MaterialIcons
                    name={locked ? 'lock-outline' : 'chevron-right'}
                    size={locked ? 15 : 18}
                    color={Colors.textDisabled}
                  />
                </Pressable>
                {i < MODULES.length - 1 ? <View style={styles.modDivider} /> : null}
              </View>
            );
          })}
        </View>
      </View>

      {/* Premium block */}
      <Pressable
        onPress={() => router.push(isPremium ? '/report' : '/paywall')}
        style={({ pressed }) => [styles.premiumCard, pressed && { opacity: 0.9 }]}
      >
        <View style={styles.premiumCardTop}>
          <View style={styles.premiumBadge}>
            <MaterialIcons name="workspace-premium" size={11} color={Colors.background} />
            <Text style={styles.premiumBadgeText}>БОЛЬШОЕ ИССЛЕДОВАНИЕ</Text>
          </View>
          {isPremium ? null : (
            <View style={styles.premiumPriceBlock}>
              <Text style={styles.premiumPrice}>2 900 ₽</Text>
            </View>
          )}
        </View>
        <Text style={styles.premiumTitle}>Дом Самопознания</Text>
        <Text style={styles.premiumBody}>
          Матрица · Циклы · Деньги · Отношения · Практический план
        </Text>
        <View style={styles.premiumFooter}>
          {isPremium
            ? (
              <View style={styles.premiumFooterRow}>
                <MaterialIcons name="check-circle" size={14} color={Colors.gold} />
                <Text style={styles.premiumFooterText}>Доступ открыт</Text>
              </View>
            )
            : (
              <View style={styles.premiumFooterRow}>
                <Text style={styles.premiumCta}>Открыть исследование</Text>
                <MaterialIcons name="arrow-forward" size={14} color={Colors.gold} />
              </View>
            )}
        </View>
      </Pressable>

      {/* Saved shortcut */}
      {savedReports.length > 0 ? (
        <Pressable
          onPress={() => router.push('/(tabs)/saved')}
          style={({ pressed }) => [styles.savedCard, pressed && { opacity: 0.85 }]}
        >
          <View style={styles.savedLeft}>
            <MaterialIcons name="bookmark" size={16} color={Colors.gold} />
            <Text style={styles.savedText}>
              {savedReports.length} {savedReports.length === 1 ? 'разбор' : 'разбора'} сохранено
            </Text>
          </View>
          <MaterialIcons name="arrow-forward" size={16} color={Colors.textMuted} />
        </Pressable>
      ) : null}

      {/* Trust footer */}
      <View style={styles.trust}>
        <Text style={styles.trustText}>
          Авторский инструмент самоисследования
        </Text>
        <Text style={styles.trustAuthor}>Альберт Анатольевич Вяземский</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.lg },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordmark: { ...Typography.subheading, color: Colors.textPrimary },
  wordmarkSub: { ...Typography.caption, color: Colors.gold, fontStyle: 'italic', marginTop: 1 },
  avatarBtn: {},
  avatarCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarCircleAuth: { borderColor: Colors.border, backgroundColor: Colors.goldTint },

  // Session hero
  sessionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl, padding: Spacing.xl,
    borderWidth: 1, borderColor: Colors.border,
    gap: Spacing.sm, ...Shadows.lg,
  },
  sessionCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  sessionCardLabel: { ...Typography.label, color: Colors.gold, marginBottom: 4 },
  sessionCardName: { ...Typography.title, color: Colors.textPrimary, fontSize: 22, marginBottom: 3 },
  sessionCardDob: { ...Typography.caption, color: Colors.textMuted },
  sessionFormulaCircle: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  sessionFormulaText: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textAlign: 'center', lineHeight: 16 },
  sessionComposites: { ...Typography.caption, color: Colors.textDisabled, fontStyle: 'italic', fontSize: 10 },
  sessionCardFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing.sm, marginTop: 2 },
  sessionCardCta: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  // Blank hero CTA
  heroCta: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border,
    gap: Spacing.md, ...Shadows.lg,
  },
  heroSigilRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  heroSigilDot: { width: 9, height: 9, borderRadius: 5, opacity: 0.7 },
  heroTitle: { ...Typography.heading, color: Colors.textPrimary, fontSize: 22 },
  heroBody: { ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: Spacing.sm, paddingVertical: 5,
  },
  heroBadgeText: { ...Typography.label, color: Colors.background, fontSize: 10 },

  // Quick stats
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.borderLight,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm, gap: 1 },
  statFinal: { fontSize: 20, fontWeight: '700' },
  statComp: { fontSize: 9, fontWeight: '500' },
  statLabel: { ...Typography.caption, color: Colors.textMuted, fontSize: 9 },
  statsDivider: { width: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },

  // Modules
  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.bodySmall, color: Colors.textMuted, fontWeight: '600' },
  sectionHint: { ...Typography.caption, color: Colors.textDisabled },
  moduleList: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden',
  },
  modRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md, minHeight: 62,
  },
  modIconWrap: {
    width: 36, height: 36, borderRadius: Radii.sm,
    backgroundColor: Colors.goldGlow, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  modIconWrapLocked: { backgroundColor: Colors.surfaceAlt, borderColor: Colors.borderLight },
  modText: { flex: 1 },
  modTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  modDesc: { ...Typography.caption, color: Colors.textMuted, marginTop: 2, lineHeight: 16 },
  modDivider: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: Spacing.md },

  // Premium card
  premiumCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.xl, gap: Spacing.sm, ...Shadows.md,
  },
  premiumCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 4,
  },
  premiumBadgeText: { ...Typography.label, color: Colors.background, fontSize: 9, letterSpacing: 0.8 },
  premiumPriceBlock: {},
  premiumPrice: { fontSize: 20, fontWeight: '700', color: Colors.gold },
  premiumTitle: { ...Typography.subheading, color: Colors.textPrimary },
  premiumBody: { ...Typography.caption, color: Colors.textMuted, lineHeight: 18 },
  premiumFooter: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing.sm, marginTop: 2 },
  premiumFooterRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  premiumFooterText: { ...Typography.caption, color: Colors.gold },
  premiumCta: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  // Saved
  savedCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.md, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  savedLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  savedText: { ...Typography.bodySmall, color: Colors.textSecondary },

  trust: { alignItems: 'center', gap: 3, paddingTop: Spacing.xs },
  trustText: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'center' },
  trustAuthor: { ...Typography.caption, color: Colors.gold, fontStyle: 'italic', opacity: 0.7 },
});
