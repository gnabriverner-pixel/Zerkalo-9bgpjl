/**
 * First Mirror — Palace Entry V3
 * THE conversion moment. Recognition before numbers.
 *
 * Order: Recognition headline → Symbolic image → Triptych → Five positions → CTA
 * Analytics: first_mirror_viewed → first_mirror_recognition_seen →
 *            first_mirror_triptych_seen → first_mirror_positions_seen →
 *            first_mirror_completed
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { analytics } from '@/services/analytics';
import {
  MOCK_PROFILE, buildMirrorProfileFromSession, PRICE_CONFIG, type MirrorProfile,
} from '@/services/mirror-data';
import {
  Colors, Spacing, Typography, Radii, Shadows, PLANET_COLORS, PLANET_NAMES,
} from '@/constants/theme';
import { Motion } from '@/constants/motion';

const { width: SW } = Dimensions.get('window');

// ── Triptych card ─────────────────────────────────────────────────────────────

function TriptychCard({
  icon, label, text, color, delay,
}: {
  icon: string; label: string; text: string; color: string; delay: number;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: Motion.slow, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={[tStyles.card, { borderColor: color + '25', opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={[tStyles.iconRow]}>
        <View style={[tStyles.iconBg, { backgroundColor: color + '15' }]}>
          <MaterialIcons name={icon as any} size={18} color={color} />
        </View>
        <Text style={[tStyles.label, { color }]}>{label}</Text>
      </View>
      <Text style={tStyles.text}>{text}</Text>
    </Animated.View>
  );
}

const tStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl, borderWidth: 1,
    padding: Spacing.lg, gap: Spacing.sm,
  },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBg: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  label: { ...Typography.label, letterSpacing: 1.2 },
  text: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
});

// ── Position strip item ───────────────────────────────────────────────────────

function PositionNode({
  label, roleLabel, number, composite, color, delay,
}: {
  label: string; roleLabel: string; number: number; composite: number;
  color: string; delay: number;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;
  const showComp = composite !== number;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, ...Motion.spring.snappy, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={[pStyles.node, { opacity: fade, transform: [{ scale }] }]}>
      <Text style={[pStyles.roleLabel, { color: color + 'BB' }]}>{roleLabel}</Text>
      <View style={[pStyles.circle, { borderColor: color + '55', backgroundColor: color + '0E' }]}>
        <Text style={[pStyles.num, { color }]}>{number}</Text>
        {showComp ? <Text style={[pStyles.comp, { color: color + 'AA' }]}>{composite}</Text> : null}
      </View>
      <Text style={pStyles.label} numberOfLines={2}>{label.replace('Число ', '')}</Text>
    </Animated.View>
  );
}

const pStyles = StyleSheet.create({
  node: { flex: 1, alignItems: 'center', gap: 5 },
  roleLabel: { ...Typography.caption, fontSize: 8, textAlign: 'center', fontStyle: 'italic' },
  circle: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  num: { fontSize: 22, fontWeight: '700', lineHeight: 26 },
  comp: { fontSize: 9, lineHeight: 12 },
  label: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600', fontSize: 9, textAlign: 'center' },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function FirstMirrorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession } = useApp();
  const scrollRef = useRef<ScrollView>(null);

  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(24)).current;
  const [recognitionTracked, setRecognitionTracked] = useState(false);
  const [triptychTracked, setTriptychTracked] = useState(false);
  const [positionsTracked, setPositionsTracked] = useState(false);

  // Build profile from real session or mock
  const profile: MirrorProfile = currentSession
    ? buildMirrorProfileFromSession(
        currentSession.core,
        {
          displayName: currentSession.name,
          dateOfBirth: currentSession.dateOfBirth,
          grammaticalForm: currentSession.gender === 'Женский' ? 'feminine' : 'masculine',
        },
        `session-${currentSession.dateOfBirth}`
      )
    : MOCK_PROFILE;

  const { recognition, positions, identity } = profile;

  useEffect(() => {
    analytics.track('first_mirror_viewed', {
      time_to_value_ms: analytics.timeToValueMs(),
      prototype_mode: profile.provenance.isMockData,
    });

    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: Motion.slow, useNativeDriver: true }),
      Animated.spring(heroSlide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > 100 && !recognitionTracked) {
      analytics.track('first_mirror_recognition_seen');
      setRecognitionTracked(true);
    }
    if (y > 380 && !triptychTracked) {
      analytics.track('first_mirror_triptych_seen');
      setTriptychTracked(true);
    }
    if (y > 700 && !positionsTracked) {
      analytics.track('first_mirror_positions_seen');
      setPositionsTracked(true);
    }
  };

  const handleContinue = () => {
    analytics.track('first_mirror_completed', { source: 'see_full_route' });
    router.push('/living-passport');
  };

  const handleTelegram = () => {
    analytics.track('telegram_continuation_clicked', { source: 'first_mirror' });
    // Prototype: show prototype state
    router.push('/continuation');
  };

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + 100 },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={100}
      >
        {/* ── Hero: Recognition ──────────────────────────────────── */}
        <Animated.View
          style={[styles.heroArea, { opacity: heroFade, transform: [{ translateY: heroSlide }] }]}
        >
          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={18} color={Colors.textDisabled} />
          </Pressable>

          {/* Badge */}
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>ПЕРВОЕ ЗЕРКАЛО</Text>
          </View>

          {/* Identity line */}
          <View style={styles.identRow}>
            {identity.displayName ? (
              <Text style={styles.identName}>{identity.displayName}</Text>
            ) : null}
            <Text style={styles.identDob}>{identity.dateOfBirth}</Text>
          </View>

          {/* Recognition headline — human meaning FIRST */}
          <LinearGradient
            colors={[Colors.surfaceDark, Colors.surface]}
            style={styles.recognitionCard}
          >
            <View style={styles.symbolRow}>
              <View style={styles.symbolIcon}>
                <MaterialIcons name="adjust" size={14} color={Colors.gold} />
              </View>
              <Text style={styles.symbolLabel}>
                {recognition.symbolicImage === 'threshold' ? 'порог' :
                 recognition.symbolicImage === 'route' ? 'маршрут' :
                 recognition.symbolicImage}
              </Text>
            </View>
            <Text style={styles.recognitionText}>{recognition.headline}</Text>
          </LinearGradient>
        </Animated.View>

        {/* ── Triptych: Strength / Tension / Action ─────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLabel}>ТРИ ТОЧКИ</Text>
            <Text style={styles.sectionTitle}>Что это означает прямо сейчас</Text>
          </View>

          <TriptychCard
            icon="brightness-1"
            label="ВАША СИЛА"
            text={recognition.triptych.strength}
            color={Colors.gold}
            delay={120}
          />
          <TriptychCard
            icon="compare-arrows"
            label="ГДЕ ВОЗНИКАЕТ НАПРЯЖЕНИЕ"
            text={recognition.triptych.tension}
            color={Colors.saturn}
            delay={240}
          />
          <TriptychCard
            icon="arrow-forward"
            label="ЧТО ПОПРОБОВАТЬ СЕЙЧАС"
            text={recognition.triptych.action}
            color={Colors.mercury}
            delay={360}
          />
        </View>

        {/* ── Numeric foundation — numbers second ────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLabel}>ЧИСЛОВОЕ ОСНОВАНИЕ</Text>
            <Text style={styles.sectionTitle}>Пять позиций маршрута</Text>
          </View>

          <View style={styles.positionsCard}>
            <View style={styles.positionsRow}>
              {positions.map((pos, i) => (
                <React.Fragment key={pos.key}>
                  <PositionNode
                    label={pos.label}
                    roleLabel={pos.roleLabel}
                    number={pos.finalNumber}
                    composite={pos.compositeNumber}
                    color={pos.planetColor}
                    delay={i * 120}
                  />
                  {i < positions.length - 1 ? (
                    <View style={styles.posConnector} />
                  ) : null}
                </React.Fragment>
              ))}
            </View>

            <View style={styles.positionsFooter}>
              <Text style={styles.positionsNote}>
                Планеты — метафорический язык системы, не астрологический прогноз
              </Text>
              {profile.provenance.isMockData ? (
                <View style={styles.mockBadge}>
                  <Text style={styles.mockBadgeText}>PROTOTYPE · MOCK DATA</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Composite note */}
          <View style={styles.compositeNote}>
            <MaterialIcons name="info-outline" size={12} color={Colors.gold} />
            <Text style={styles.compositeNoteText}>
              Составные числа показывают, как именно формируется итог.{' '}
              {positions.map(p => p.compositeNumber !== p.finalNumber ? `${p.compositeNumber}→${p.finalNumber}` : null).filter(Boolean).join(' · ')}
            </Text>
          </View>
        </View>

        {/* ── Disclaimer ────────────────────────────────────────── */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            Авторская система самоисследования · Альберт Анатольевич Вяземский.{'\n'}
            Не является медицинской, психологической, финансовой или юридической консультацией.
          </Text>
        </View>
      </ScrollView>

      {/* ── Fixed CTA bar ─────────────────────────────────────── */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [styles.primaryCta, pressed && { opacity: 0.88 }]}
          accessibilityLabel="Увидеть весь маршрут"
        >
          <LinearGradient
            colors={[Colors.gold, Colors.goldSoft]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.primaryCtaGrad}
          >
            <Text style={styles.primaryCtaText}>Увидеть весь маршрут</Text>
            <MaterialIcons name="arrow-forward" size={17} color={Colors.background} />
          </LinearGradient>
        </Pressable>

        <Pressable onPress={handleTelegram} style={styles.secondaryCta} hitSlop={6}>
          <MaterialIcons name="send" size={13} color={Colors.textMuted} />
          <Text style={styles.secondaryCtaText}>Задать вопрос в Telegram</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  scrollContent: { gap: 0 },

  // Hero
  heroArea: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    gap: Spacing.md,
  },
  backBtn: { paddingTop: Spacing.md, alignSelf: 'flex-start' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gold },
  badgeText: { ...Typography.label, color: Colors.gold, letterSpacing: 2 },
  identRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm },
  identName: {
    fontSize: 28, fontWeight: '700', color: Colors.textPrimary,
    lineHeight: 34, letterSpacing: -0.3,
  },
  identDob: { ...Typography.bodySmall, color: Colors.textMuted },

  recognitionCard: {
    borderRadius: Radii.xxl, padding: Spacing.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    gap: Spacing.md,
  },
  symbolRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  symbolIcon: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  symbolLabel: {
    ...Typography.label, color: Colors.textDisabled,
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  recognitionText: {
    fontSize: 17, fontWeight: '400', color: Colors.textPrimary,
    lineHeight: 28, letterSpacing: 0.1,
  },

  // Section
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, gap: Spacing.md },
  sectionHead: { gap: 3 },
  sectionLabel: { ...Typography.label, color: Colors.gold, letterSpacing: 1.5 },
  sectionTitle: { ...Typography.heading, color: Colors.textPrimary },

  // Positions
  positionsCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xxl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, gap: Spacing.md,
  },
  positionsRow: { flexDirection: 'row', alignItems: 'flex-start' },
  posConnector: {
    width: 1, height: 40, backgroundColor: Colors.borderLight,
    alignSelf: 'center', marginTop: -10,
  },
  positionsFooter: { gap: 6 },
  positionsNote: {
    ...Typography.caption, color: Colors.textDisabled,
    fontSize: 9, fontStyle: 'italic', textAlign: 'center',
  },
  mockBadge: {
    backgroundColor: Colors.warning + '15', borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.warning + '30',
    paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'center',
  },
  mockBadgeText: { ...Typography.label, color: Colors.warning, fontSize: 8, letterSpacing: 0.8 },

  compositeNote: {
    flexDirection: 'row', gap: 6, alignItems: 'flex-start',
    paddingHorizontal: Spacing.sm,
  },
  compositeNoteText: {
    ...Typography.caption, color: Colors.textMuted, flex: 1,
    lineHeight: 18, fontSize: 11,
  },

  // Disclaimer
  disclaimerBox: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    padding: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  disclaimerText: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', lineHeight: 18, fontSize: 10,
  },

  // Fixed CTA
  ctaBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surfaceDark + 'F0',
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    gap: Spacing.sm, ...Shadows.lg,
  },
  primaryCta: {
    borderRadius: Radii.lg, overflow: 'hidden', ...Shadows.gold,
  },
  primaryCtaGrad: {
    paddingVertical: 17, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: Spacing.sm,
  },
  primaryCtaText: {
    ...Typography.button, color: Colors.background, fontWeight: '700', fontSize: 16,
  },
  secondaryCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 4,
  },
  secondaryCtaText: {
    ...Typography.caption, color: Colors.textMuted,
  },
});
