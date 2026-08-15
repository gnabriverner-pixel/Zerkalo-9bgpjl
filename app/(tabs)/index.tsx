/**
 * Home Tab — "Зеркало себя"
 * Quick-access hub inside tab navigation.
 * Displays current session summary or CTA to start.
 */

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
import { Orb } from '@/components/brand/Orb';

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

      {/* Entry or session card */}
      {!hasSession ? (
        <Pressable
          onPress={() => router.push('/index')}
          style={({ pressed }) => [styles.heroCta, pressed && { opacity: 0.88 }]}
        >
          <LinearGradient colors={[Colors.surfaceDark, Colors.surface]} style={styles.heroCtaGrad}>
            <View style={styles.heroOrbRow}>
              <Orb color={Colors.gold} size={64} rotationDuration={20000} />
              <Orb color={Colors.mythPrimary} size={48} rotationDuration={28000} />
            </View>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>ЗЕРКАЛО СЕБЯ</Text>
            </View>
            <Text style={styles.heroTitle}>Два зеркала{'\n'}одного человека</Text>
            <Text style={styles.heroBody}>
              Личный миф · Цифровой код · Встреча зеркал
            </Text>
            <View style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Открыть свой код</Text>
              <MaterialIcons name="arrow-forward" size={14} color={Colors.background} />
            </View>
          </LinearGradient>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => router.push('/living-passport')}
          style={({ pressed }) => [styles.sessionCard, pressed && { opacity: 0.88 }]}
        >
          <View style={styles.sessionCardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionLabel}>ВАША ФОРМУЛА</Text>
              <Text style={styles.sessionName} numberOfLines={1}>{currentSession.name}</Text>
              <Text style={styles.sessionDob}>{currentSession.dateOfBirth}</Text>
            </View>
            {core ? (
              <Orb
                color={PLANET_COLORS[core.resultFinal] || Colors.gold}
                size={64}
                rotationDuration={20000}
              />
            ) : null}
          </View>
          {core ? (
            <View style={styles.statsRow}>
              {[
                { label: 'Душа', final: core.soulFinal },
                { label: 'Выраж.', final: core.expressionFinal },
                { label: 'Путь', final: core.pathFinal },
                { label: 'Напр.', final: core.directionFinal },
                { label: 'Рез.', final: core.resultFinal },
              ].map((n, i) => {
                const color = PLANET_COLORS[n.final] || Colors.gold;
                return (
                  <React.Fragment key={n.label}>
                    {i > 0 ? <View style={styles.statDivider} /> : null}
                    <View style={styles.stat}>
                      <Text style={[styles.statFinal, { color }]}>{n.final}</Text>
                      <Text style={styles.statLabel}>{n.label}</Text>
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          ) : null}
          <View style={styles.sessionFooter}>
            <Text style={styles.sessionCta}>Открыть живой паспорт</Text>
            <MaterialIcons name="arrow-forward" size={13} color={Colors.gold} />
          </View>
        </Pressable>
      )}

      {/* Module list */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Инструменты</Text>
        <View style={styles.moduleList}>
          {[
            { icon: 'auto-stories', title: 'Личный миф', desc: '4 образных вопроса · история', route: '/myth', color: Colors.mythPrimary },
            { icon: 'fingerprint',  title: 'Живой паспорт', desc: '7 залов · полный маршрут', route: '/living-passport', color: Colors.gold, needsSession: true },
            { icon: 'language',     title: 'Пантеон 9 сил', desc: 'Ведические архетипы', route: '/world', color: Colors.textMuted },
            { icon: 'grid-4x4',    title: 'Матрица',         desc: 'Ресурсы и зоны задач', route: '/matrix-detail', color: Colors.textMuted, needsSession: true },
            { icon: 'autorenew',   title: 'Циклы',           desc: 'Личный год и месяцы', route: '/cycles', color: Colors.textMuted, needsSession: true },
            { icon: 'payments',    title: 'Денежный код',    desc: 'Карта реализации', route: '/money-code', color: Colors.textMuted, needsSession: true },
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
                  <View style={[styles.modIconWrap, { backgroundColor: (mod.color || Colors.gold) + '15', borderColor: (mod.color || Colors.gold) + '28' }]}>
                    <MaterialIcons name={mod.icon as any} size={18} color={locked ? Colors.textDisabled : (mod.color || Colors.gold)} />
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

      {/* Premium */}
      <Pressable
        onPress={() => router.push('/continuation')}
        style={({ pressed }) => [styles.premiumCard, pressed && { opacity: 0.9 }]}
      >
        <View style={styles.premiumTop}>
          <View style={styles.premiumBadge}>
            <MaterialIcons name="workspace-premium" size={10} color={Colors.background} />
            <Text style={styles.premiumBadgeText}>ПРОДОЛЖЕНИЕ</Text>
          </View>
        </View>
        <Text style={styles.premiumTitle}>Большое исследование</Text>
        <Text style={styles.premiumBody}>Матрица · Циклы · Деньги · PDF · Личный миф</Text>
        <View style={styles.premiumFooter}>
          <View style={styles.premiumRow}>
            <Text style={styles.premiumCta}>Открыть путь получения</Text>
            <MaterialIcons name="arrow-forward" size={13} color={Colors.gold} />
          </View>
        </View>
      </Pressable>

      {hasSession ? (
        <Pressable onPress={() => router.push('/(tabs)/calculate')} style={styles.recalcBtn}>
          <MaterialIcons name="calculate" size={14} color={Colors.textMuted} />
          <Text style={styles.recalcText}>Рассчитать другую дату</Text>
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
  wordmark: {
    fontSize: 22, fontWeight: '300', color: Colors.textPrimary,
    letterSpacing: 1, fontFamily: 'serif',
  },
  wordmarkSub: { ...Typography.caption, color: Colors.gold, fontStyle: 'italic', marginTop: 1 },
  avatarBtn: {},
  avatarCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },

  heroCta: {
    borderRadius: Radii.xxl, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.border, ...Shadows.gold,
  },
  heroCtaGrad: { padding: Spacing.xl, gap: Spacing.md },
  heroOrbRow: { flexDirection: 'row', gap: Spacing.sm },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gold },
  heroBadgeText: { ...Typography.label, color: Colors.gold, letterSpacing: 2 },
  heroTitle: {
    fontSize: 24, fontWeight: '400', color: Colors.textPrimary,
    lineHeight: 32, fontFamily: 'serif',
  },
  heroBody: { ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22 },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: Spacing.md, paddingVertical: 9,
  },
  heroBtnText: { ...Typography.button, color: Colors.background, fontWeight: '700' },

  sessionCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.xl, gap: Spacing.sm, ...Shadows.lg,
  },
  sessionCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  sessionLabel: { ...Typography.label, color: Colors.gold, marginBottom: 4 },
  sessionName: { ...Typography.title, color: Colors.textPrimary, fontSize: 22, marginBottom: 3 },
  sessionDob: { ...Typography.caption, color: Colors.textMuted },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.surfaceMid,
    borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.borderLight,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm, gap: 1 },
  statFinal: { fontSize: 18, fontWeight: '700' },
  statLabel: { ...Typography.caption, color: Colors.textMuted, fontSize: 9 },
  statDivider: { width: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },
  sessionFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing.sm, marginTop: 2,
  },
  sessionCta: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  section: { gap: Spacing.sm },
  sectionTitle: { ...Typography.bodySmall, color: Colors.textMuted, fontWeight: '600' },
  moduleList: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden',
  },
  modRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md, minHeight: 58,
  },
  modIconWrap: {
    width: 36, height: 36, borderRadius: Radii.sm,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  modText: { flex: 1 },
  modTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  modDesc: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  modDivider: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: Spacing.md },

  premiumCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.xl, gap: Spacing.sm,
  },
  premiumTop: { flexDirection: 'row' },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 4,
  },
  premiumBadgeText: { ...Typography.label, color: Colors.background, fontSize: 9 },
  premiumTitle: { ...Typography.subheading, color: Colors.textPrimary },
  premiumBody: { ...Typography.caption, color: Colors.textMuted },
  premiumFooter: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing.sm, marginTop: 2 },
  premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  premiumCta: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  recalcBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: Spacing.sm,
  },
  recalcText: { ...Typography.caption, color: Colors.textMuted },

  trust: { alignItems: 'center', gap: 3 },
  trustText: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'center' },
  trustAuthor: { ...Typography.caption, color: Colors.gold, fontStyle: 'italic', opacity: 0.7 },
});
