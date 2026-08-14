import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, Typography, Radii, Shadows, PLANET_COLORS } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, isPremium, savedReports } = useApp();

  const hasSession = currentSession !== null;
  const core = currentSession?.core;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Wordmark */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.wordmark}>Зеркало себя</Text>
          <Text style={styles.wordmarkSub}>Ведическая нумерология</Text>
        </View>
        <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.avatarBtn} hitSlop={10}>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={16} color={Colors.textMuted} />
          </View>
        </Pressable>
      </View>

      {/* ── Entry point ─────────────────────────────────────────── */}
      {!hasSession ? (
        <View style={styles.entryGroup}>
          {/* Hero CTA */}
          <Pressable
            onPress={() => router.push('/threshold')}
            style={({ pressed }) => [styles.heroCta, pressed && { opacity: 0.88 }]}
          >
            <LinearGradient
              colors={[Colors.surfaceDark, Colors.surface]}
              style={styles.heroCtaGrad}
            >
              {/* Nine planet dots */}
              <View style={styles.planetRow}>
                {[Colors.venus, Colors.moon, Colors.saturn, Colors.mercury, Colors.sun, Colors.jupiter, Colors.mars, Colors.rahu, Colors.ketu].map((c, i) => (
                  <View key={i} style={[styles.planetDot, { backgroundColor: c }]} />
                ))}
              </View>
              <View style={styles.heroBadge}>
                <View style={styles.heroBadgeDot} />
                <Text style={styles.heroBadgeText}>ЗЕРКАЛО СЕБЯ</Text>
              </View>
              <Text style={styles.heroTitle}>Откройте свой{'\n'}цифровой код</Text>
              <Text style={styles.heroBody}>
                Ведическая нумерология · девять архетипов · ваша персональная карта
              </Text>
              <View style={styles.heroBtn}>
                <Text style={styles.heroBtnText}>Открыть свой код</Text>
                <MaterialIcons name="arrow-forward" size={14} color={Colors.background} />
              </View>
            </LinearGradient>
          </Pressable>

          {/* World / System link */}
          <Pressable
            onPress={() => router.push('/world')}
            style={({ pressed }) => [styles.worldCard, pressed && { opacity: 0.85 }]}
          >
            <MaterialIcons name="language" size={18} color={Colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.worldTitle}>Узнать систему</Text>
              <Text style={styles.worldDesc}>Девять архетипов · как устроена ведическая нумерология</Text>
            </View>
            <MaterialIcons name="chevron-right" size={18} color={Colors.textDisabled} />
          </Pressable>
        </View>
      ) : (
        /* ── Active session ──────────────────────────────────────── */
        <View style={styles.sessionGroup}>
          {/* Quick passport access */}
          <Pressable
            onPress={() => router.push('/first-mirror')}
            style={({ pressed }) => [styles.sessionCard, pressed && { opacity: 0.88 }]}
          >
            <View style={styles.sessionCardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionLabel}>ВАША ФОРМУЛА</Text>
                <Text style={styles.sessionName} numberOfLines={1}>{currentSession.name}</Text>
                <Text style={styles.sessionDob}>{currentSession.dateOfBirth}</Text>
              </View>
              {core ? (
                <View style={[styles.formulaCircle, { borderColor: (PLANET_COLORS[core.resultFinal] || Colors.gold) + '50' }]}>
                  <Text style={[styles.formulaText, { color: PLANET_COLORS[core.resultFinal] || Colors.gold }]}>
                    {core.soulFinal}—{core.expressionFinal}{'\n'}{core.pathFinal}—{core.directionFinal}—{core.resultFinal}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={styles.sessionFooter}>
              <Text style={styles.sessionCta}>Открыть зеркало</Text>
              <MaterialIcons name="arrow-forward" size={13} color={Colors.gold} />
            </View>
          </Pressable>

          {/* Five-number quick strip */}
          {core ? (
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
                    {i > 0 ? <View style={styles.statDivider} /> : null}
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
        </View>
      )}

      {/* ── Journey shortcuts ────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Инструменты</Text>
        <View style={styles.moduleList}>
          {[
            { icon: 'auto-stories', title: 'Живой паспорт', desc: 'Семь залов, полный маршрут', route: '/living-passport', highlight: true },
            { icon: 'fingerprint',  title: 'Мой код',       desc: 'Паспорт · числа · синтез',  route: '/result',          needsSession: true },
            { icon: 'grid-4x4',     title: 'Матрица',       desc: 'Ресурсы и зоны задач',      route: '/matrix-detail',   needsSession: true },
            { icon: 'autorenew',    title: 'Циклы',         desc: 'Личный год и месяцы',        route: '/cycles',          needsSession: true },
            { icon: 'payments',     title: 'Денежный код',  desc: 'Карта реализации',           route: '/money-code',      needsSession: true },
            { icon: 'language',     title: 'Мир системы',   desc: 'Девять архетипов',           route: '/world',           highlight: false },
          ].map((mod, i, arr) => {
            const locked = Boolean(mod.needsSession && !hasSession);
            return (
              <View key={mod.title}>
                <Pressable
                  onPress={() => {
                    if (locked) router.push('/(tabs)/calculate');
                    else router.push(mod.route as any);
                  }}
                  style={({ pressed }) => [styles.modRow, pressed && { backgroundColor: Colors.surfaceElevated }]}
                >
                  <View style={[
                    styles.modIconWrap,
                    locked && styles.modIconLocked,
                    mod.highlight && styles.modIconHighlight,
                  ]}>
                    <MaterialIcons name={mod.icon as any} size={18} color={locked ? Colors.textDisabled : mod.highlight ? Colors.background : Colors.gold} />
                  </View>
                  <View style={styles.modText}>
                    <Text style={[styles.modTitle, locked && { color: Colors.textDisabled }]}>{mod.title}</Text>
                    <Text style={styles.modDesc}>{mod.desc}</Text>
                  </View>
                  <MaterialIcons
                    name={locked ? 'lock-outline' : 'chevron-right'}
                    size={locked ? 14 : 18}
                    color={Colors.textDisabled}
                  />
                </Pressable>
                {i < arr.length - 1 ? <View style={styles.modDivider} /> : null}
              </View>
            );
          })}
        </View>
      </View>

      {/* ── Premium card ─────────────────────────────────────────── */}
      <Pressable
        onPress={() => router.push('/continuation')}
        style={({ pressed }) => [styles.premiumCard, pressed && { opacity: 0.9 }]}
      >
        <View style={styles.premiumTop}>
          <View style={styles.premiumBadge}>
            <MaterialIcons name="workspace-premium" size={10} color={Colors.background} />
            <Text style={styles.premiumBadgeText}>ПРОДОЛЖЕНИЕ</Text>
          </View>
          {!isPremium ? <Text style={styles.premiumPrice}>от 990 ₽</Text> : null}
        </View>
        <Text style={styles.premiumTitle}>Дом Самопознания</Text>
        <Text style={styles.premiumBody}>Матрица · Циклы · Деньги · PDF · Личный миф</Text>
        <View style={styles.premiumFooter}>
          {isPremium ? (
            <View style={styles.premiumRow}>
              <MaterialIcons name="check-circle" size={13} color={Colors.gold} />
              <Text style={styles.premiumRowText}>Доступ открыт</Text>
            </View>
          ) : (
            <View style={styles.premiumRow}>
              <Text style={styles.premiumCta}>Открыть путь получения</Text>
              <MaterialIcons name="arrow-forward" size={13} color={Colors.gold} />
            </View>
          )}
        </View>
      </Pressable>

      {/* Recalculate CTA */}
      {hasSession ? (
        <Pressable
          onPress={() => router.push('/(tabs)/calculate')}
          style={styles.recalcBtn}
        >
          <MaterialIcons name="calculate" size={14} color={Colors.textMuted} />
          <Text style={styles.recalcText}>Рассчитать другую дату</Text>
        </Pressable>
      ) : null}

      {/* Saved */}
      {savedReports.length > 0 ? (
        <Pressable onPress={() => router.push('/(tabs)/saved')} style={styles.savedCard}>
          <MaterialIcons name="bookmark" size={14} color={Colors.gold} />
          <Text style={styles.savedText}>{savedReports.length} разбора сохранено</Text>
          <MaterialIcons name="arrow-forward" size={14} color={Colors.textMuted} />
        </Pressable>
      ) : null}

      <View style={styles.trust}>
        <Text style={styles.trustText}>Авторский инструмент самоисследования</Text>
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

  // Entry group
  entryGroup: { gap: Spacing.sm },

  // Hero CTA
  heroCta: {
    borderRadius: Radii.xxl, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border, ...Shadows.gold,
  },
  heroCtaGrad: { padding: Spacing.xl, gap: Spacing.md },
  planetRow: { flexDirection: 'row', gap: 6 },
  planetDot: { width: 10, height: 10, borderRadius: 5, opacity: 0.7 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gold },
  heroBadgeText: { ...Typography.label, color: Colors.gold, letterSpacing: 2 },
  heroTitle: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, lineHeight: 32 },
  heroBody: { ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22 },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: Spacing.md, paddingVertical: 9,
  },
  heroBtnText: { ...Typography.button, color: Colors.background, fontWeight: '700' },

  // World card
  worldCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.md,
  },
  worldTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  worldDesc: { ...Typography.caption, color: Colors.textMuted },

  // Active session
  sessionGroup: { gap: Spacing.sm },
  sessionCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.xl,
    gap: Spacing.sm, ...Shadows.lg,
  },
  sessionCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  sessionLabel: { ...Typography.label, color: Colors.gold, marginBottom: 4 },
  sessionName: { ...Typography.title, color: Colors.textPrimary, fontSize: 22, marginBottom: 3 },
  sessionDob: { ...Typography.caption, color: Colors.textMuted },
  formulaCircle: {
    width: 76, height: 76, borderRadius: 38, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  formulaText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textAlign: 'center', lineHeight: 16 },
  sessionFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing.sm, marginTop: 2,
  },
  sessionCta: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.borderLight,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm, gap: 1 },
  statFinal: { fontSize: 18, fontWeight: '700' },
  statComp: { fontSize: 9 },
  statLabel: { ...Typography.caption, color: Colors.textMuted, fontSize: 9 },
  statDivider: { width: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },

  // Modules
  section: { gap: Spacing.sm },
  sectionTitle: { ...Typography.bodySmall, color: Colors.textMuted, fontWeight: '600' },
  moduleList: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden',
  },
  modRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md, minHeight: 60,
  },
  modIconWrap: {
    width: 36, height: 36, borderRadius: Radii.sm,
    backgroundColor: Colors.goldGlow, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  modIconLocked: { backgroundColor: Colors.surfaceAlt, borderColor: Colors.borderLight },
  modIconHighlight: { backgroundColor: Colors.gold },
  modText: { flex: 1 },
  modTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  modDesc: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  modDivider: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: Spacing.md },

  // Premium
  premiumCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.xl, gap: Spacing.sm,
  },
  premiumTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 4,
  },
  premiumBadgeText: { ...Typography.label, color: Colors.background, fontSize: 9 },
  premiumPrice: { fontSize: 18, fontWeight: '700', color: Colors.gold },
  premiumTitle: { ...Typography.subheading, color: Colors.textPrimary },
  premiumBody: { ...Typography.caption, color: Colors.textMuted },
  premiumFooter: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing.sm, marginTop: 2 },
  premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  premiumRowText: { ...Typography.caption, color: Colors.gold },
  premiumCta: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  recalcBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: Spacing.sm,
  },
  recalcText: { ...Typography.caption, color: Colors.textMuted },

  savedCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.md,
  },
  savedText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1 },

  trust: { alignItems: 'center', gap: 3 },
  trustText: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'center' },
  trustAuthor: { ...Typography.caption, color: Colors.gold, fontStyle: 'italic', opacity: 0.7 },
});
