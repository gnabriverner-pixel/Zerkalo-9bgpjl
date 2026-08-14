/**
 * World — "Зеркало себя"
 * The entry into the symbolic world BEFORE date entry.
 *
 * Structure:
 * 1. Hero: Create mystery and desire to enter
 * 2. System explanation: honest, non-defensive
 * 3. Nine archetypes preview (scrollable)
 * 4. CTA: "Открыть свой код"
 *
 * Analytics: mirror_entry_viewed → mirror_world_archetype_tapped → mirror_started
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { analytics } from '@/services/analytics';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { ARCHETYPES, ARCHETYPE_WORLD_INTRO, SYSTEM_EXPLANATION } from '@/constants/archetypes-data';

const { width: SW } = Dimensions.get('window');

// ── Rotating mirror sigil ─────────────────────────────────────────────────────

function MirrorSigil({ size = 200 }: { size?: number }) {
  const rotate = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 32000, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 3000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.97, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const PLANET_POSITIONS = Object.values(ARCHETYPES).map((a, i) => {
    const angle = (i / 9) * Math.PI * 2 - Math.PI / 2;
    const r = size * 0.38;
    return {
      color: a.color,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
    };
  });

  return (
    <Animated.View style={[sigilStyles.root, { width: size, height: size, transform: [{ scale: pulse }] }]}>
      {/* Outer dashed ring */}
      <Animated.View style={[sigilStyles.outerRing, { width: size, height: size, borderRadius: size / 2, transform: [{ rotate: spin }] }]} />
      {/* Static inner ring */}
      <View style={[sigilStyles.innerRing, { width: size * 0.68, height: size * 0.68, borderRadius: size * 0.34 }]} />
      {/* Core */}
      <View style={[sigilStyles.core, { width: size * 0.36, height: size * 0.36, borderRadius: size * 0.18 }]}>
        <View style={sigilStyles.coreGlow} />
      </View>
      {/* Nine planet dots */}
      {PLANET_POSITIONS.map((p, i) => (
        <View
          key={i}
          style={[
            sigilStyles.dot,
            {
              backgroundColor: p.color,
              left: size / 2 + p.x - 6,
              top: size / 2 + p.y - 6,
              shadowColor: p.color,
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

const sigilStyles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  outerRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: Colors.gold + '20',
    borderStyle: 'dashed',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: Colors.gold + '30',
  },
  core: {
    position: 'absolute',
    backgroundColor: Colors.goldGlow,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreGlow: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.gold,
    opacity: 0.15,
  },
  dot: {
    position: 'absolute',
    width: 12, height: 12, borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 6, elevation: 2,
  },
});

// ── Archetype tile ────────────────────────────────────────────────────────────

function ArchetypeTile({
  archetype, onPress,
}: {
  archetype: (typeof ARCHETYPES)[number];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        tileStyles.root,
        { borderColor: archetype.color + '28' },
        pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
      ]}
    >
      <View style={[tileStyles.numCircle, { borderColor: archetype.color + '50', backgroundColor: archetype.color + '0E' }]}>
        <Text style={[tileStyles.num, { color: archetype.color }]}>{archetype.number}</Text>
      </View>
      <Text style={[tileStyles.planet, { color: archetype.color }]}>{archetype.planet}</Text>
      <Text style={tileStyles.name}>{archetype.name.replace('Путь ', '')}</Text>
      <Text style={tileStyles.core} numberOfLines={2}>{archetype.humanCore}</Text>
    </Pressable>
  );
}

const tileStyles = StyleSheet.create({
  root: {
    width: (SW - Spacing.lg * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl, borderWidth: 1,
    padding: Spacing.md, gap: Spacing.sm,
  },
  numCircle: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start',
  },
  num: { fontSize: 20, fontWeight: '700' },
  planet: { ...Typography.label, letterSpacing: 1, fontSize: 10 },
  name: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  core: { ...Typography.caption, color: Colors.textMuted, lineHeight: 17 },
});

// ── Archetype modal ───────────────────────────────────────────────────────────

function ArchetypeModal({
  archetype, onClose,
}: {
  archetype: (typeof ARCHETYPES)[number] | null;
  onClose: () => void;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (archetype) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
      ]).start();
    } else {
      fade.setValue(0);
      slide.setValue(40);
    }
  }, [archetype]);

  if (!archetype) return null;

  return (
    <Animated.View style={[modalStyles.overlay, { opacity: fade }]}>
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      <Animated.View style={[modalStyles.sheet, { transform: [{ translateY: slide }] }]}>
        <View style={modalStyles.handle} />

        {/* Header */}
        <View style={modalStyles.head}>
          <View style={[modalStyles.numCircle, { borderColor: archetype.color + '55', backgroundColor: archetype.color + '10' }]}>
            <Text style={[modalStyles.num, { color: archetype.color }]}>{archetype.number}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[modalStyles.planet, { color: archetype.color }]}>{archetype.planet} · {archetype.planetSanskrit}</Text>
            <Text style={modalStyles.name}>{archetype.name}</Text>
          </View>
          <Pressable onPress={onClose} hitSlop={12}>
            <MaterialIcons name="close" size={20} color={Colors.textMuted} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={modalStyles.scroll}>
          {/* Human core */}
          <View style={[modalStyles.block, { borderColor: archetype.color + '22', backgroundColor: archetype.color + '06' }]}>
            <Text style={modalStyles.blockText}>{archetype.humanCore}</Text>
          </View>

          {/* Presence */}
          <View style={modalStyles.row}>
            <Text style={[modalStyles.rowLabel, { color: archetype.color }]}>Присутствие</Text>
            <Text style={modalStyles.rowText}>{archetype.presence}</Text>
          </View>

          <View style={modalStyles.divider} />

          {/* Light & Shadow */}
          <View style={modalStyles.lsRow}>
            <View style={[modalStyles.lsBox, { borderColor: archetype.color + '28', backgroundColor: archetype.color + '08' }]}>
              <Text style={[modalStyles.lsLabel, { color: archetype.color }]}>Свет</Text>
              <Text style={modalStyles.lsText}>{archetype.light}</Text>
            </View>
            <View style={[modalStyles.lsBox, { borderColor: Colors.borderLight }]}>
              <Text style={[modalStyles.lsLabel, { color: Colors.textMuted }]}>Тень</Text>
              <Text style={modalStyles.lsText}>{archetype.shadow}</Text>
            </View>
          </View>

          {/* Action */}
          <View style={modalStyles.row}>
            <Text style={[modalStyles.rowLabel, { color: archetype.color }]}>Как действует</Text>
            <Text style={modalStyles.rowText}>{archetype.actionStyle}</Text>
          </View>

          <View style={modalStyles.divider} />

          {/* Myth */}
          <View style={modalStyles.row}>
            <Text style={modalStyles.mythLabel}>История архетипа</Text>
            <Text style={modalStyles.mythText}>{archetype.mythContext}</Text>
          </View>

          {/* Question */}
          <View style={[modalStyles.questionBox, { borderColor: archetype.color + '30' }]}>
            <MaterialIcons name="help-outline" size={14} color={archetype.color} />
            <Text style={modalStyles.questionText}>{archetype.questionForUser}</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  sheet: {
    backgroundColor: Colors.surfaceDark,
    borderTopLeftRadius: Radii.xxl,
    borderTopRightRadius: Radii.xxl,
    borderWidth: 1, borderColor: Colors.borderLight,
    maxHeight: '80%',
    padding: Spacing.lg, paddingBottom: 0,
    gap: Spacing.md,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
  },
  scroll: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  numCircle: {
    width: 54, height: 54, borderRadius: 27, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  num: { fontSize: 24, fontWeight: '700' },
  planet: { ...Typography.label, letterSpacing: 1 },
  name: { ...Typography.subheading, color: Colors.textPrimary, marginTop: 2 },
  block: {
    borderRadius: Radii.xl, borderWidth: 1,
    padding: Spacing.md,
  },
  blockText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 26 },
  row: { gap: 6 },
  rowLabel: { ...Typography.label, letterSpacing: 1 },
  rowText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  lsRow: { flexDirection: 'row', gap: Spacing.sm },
  lsBox: { flex: 1, borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 4 },
  lsLabel: { ...Typography.label, fontSize: 10 },
  lsText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },
  mythLabel: { ...Typography.label, color: Colors.textMuted, letterSpacing: 1 },
  mythText: { ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22, fontStyle: 'italic' },
  questionBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    borderWidth: 1, borderRadius: Radii.xl, padding: Spacing.md,
  },
  questionText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22, flex: 1 },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function WorldScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const [selectedArchetype, setSelectedArchetype] = useState<(typeof ARCHETYPES)[number] | null>(null);

  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    analytics.track('mirror_entry_viewed');
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: Motion.slow + 100, useNativeDriver: true }),
      Animated.spring(heroSlide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleArchetypeTap = (a: (typeof ARCHETYPES)[number]) => {
    analytics.track('mirror_world_archetype_tapped', { archetype_number: a.number });
    setSelectedArchetype(a);
  };

  const handleStart = () => {
    analytics.track('mirror_started', { entry_point: 'world_screen' });
    completeOnboarding();
    router.replace('/(tabs)/calculate');
  };

  const sigilSize = Math.min(SW * 0.58, 230);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* ── Hero ─────────────────────────────────────────────── */}
        <Animated.View style={[styles.hero, { opacity: heroFade, transform: [{ translateY: heroSlide }] }]}>
          {/* Back link (to original threshold/onboarding) */}
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={18} color={Colors.textDisabled} />
          </Pressable>

          {/* Sigil */}
          <View style={styles.sigilWrap}>
            <MirrorSigil size={sigilSize} />
            <View style={[styles.sigilGlow, { width: sigilSize * 1.4, height: sigilSize * 1.4, borderRadius: sigilSize * 0.7 }]} pointerEvents="none" />
          </View>

          {/* Hero copy */}
          <View style={styles.heroCopy}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>ЗЕРКАЛО СЕБЯ</Text>
            </View>
            <Text style={styles.headline}>У каждого человека{'\n'}есть свой цифровой{'\n'}рисунок</Text>
            <Text style={styles.subhead}>
              В ведической нумерологии числа даты рождения связаны с девятью планетарными архетипами — силами, через которые можно по-новому увидеть характер, внутренние противоречия и направление реализации.
            </Text>
            <Text style={styles.subhead2}>
              Откройте свой код и посмотрите, насколько точно он узнает вас.
            </Text>
          </View>
        </Animated.View>

        {/* ── System explanation ───────────────────────────────── */}
        <View style={styles.systemBox}>
          <Text style={styles.sectionLabel}>КАК РАБОТАЕТ СИСТЕМА</Text>
          <View style={styles.systemCard}>
            {[
              { q: 'Что это?', a: SYSTEM_EXPLANATION.whatIs },
              { q: 'Как устроено?', a: SYSTEM_EXPLANATION.howItWorks },
              { q: 'Почему дата рождения?', a: SYSTEM_EXPLANATION.whyDOB },
            ].map((item, i) => (
              <View key={i} style={[styles.systemRow, i > 0 && styles.systemRowBorder]}>
                <Text style={styles.systemQ}>{item.q}</Text>
                <Text style={styles.systemA}>{item.a}</Text>
              </View>
            ))}
            <View style={[styles.systemRow, styles.systemRowBorder, styles.systemLastRow]}>
              <MaterialIcons name="info-outline" size={13} color={Colors.gold} />
              <Text style={styles.systemLastText}>{SYSTEM_EXPLANATION.lastWord}</Text>
            </View>
          </View>
        </View>

        {/* ── Nine archetypes ──────────────────────────────────── */}
        <View style={styles.archetypesSection}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLabel}>ДЕВЯТЬ АРХЕТИПОВ</Text>
            <Text style={styles.sectionTitle}>Нажмите, чтобы узнать больше</Text>
          </View>
          <View style={styles.tilesGrid}>
            {Object.values(ARCHETYPES).map(a => (
              <ArchetypeTile
                key={a.number}
                archetype={a}
                onPress={() => handleArchetypeTap(a)}
              />
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Ведическая нумерология — это символическая система интерпретации. Не является медицинской, психологической, финансовой или юридической консультацией. Носит информационно-развлекательный характер.
        </Text>
      </ScrollView>

      {/* Fixed CTA */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.88 }]}
          accessibilityLabel="Открыть свой код"
        >
          <LinearGradient
            colors={[Colors.gold, Colors.goldSoft]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaBtnGrad}
          >
            <Text style={styles.ctaBtnText}>Открыть свой код</Text>
            <MaterialIcons name="arrow-forward" size={18} color={Colors.background} />
          </LinearGradient>
        </Pressable>
        <Text style={styles.ctaNote}>Достаточно даты рождения · без регистрации</Text>
      </View>

      {/* Archetype modal */}
      <ArchetypeModal archetype={selectedArchetype} onClose={() => setSelectedArchetype(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { gap: 0 },

  // Hero
  hero: {
    backgroundColor: Colors.surfaceDark,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.lg,
  },
  backBtn: { paddingTop: Spacing.sm, alignSelf: 'flex-start' },
  sigilWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, position: 'relative' },
  sigilGlow: {
    position: 'absolute',
    backgroundColor: 'transparent',
    shadowColor: Colors.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06, shadowRadius: 60,
  },
  heroCopy: { gap: Spacing.md },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
  badgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.gold },
  badgeText: { ...Typography.label, color: Colors.gold, letterSpacing: 2 },
  headline: {
    fontSize: 32, fontWeight: '700', color: Colors.textPrimary,
    lineHeight: 40, letterSpacing: -0.5,
  },
  subhead: { ...Typography.body, color: Colors.textSecondary, lineHeight: 26 },
  subhead2: {
    ...Typography.body, color: Colors.textPrimary, fontWeight: '500',
    lineHeight: 26, fontStyle: 'italic',
  },

  // System
  systemBox: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, gap: Spacing.md },
  sectionLabel: { ...Typography.label, color: Colors.gold, letterSpacing: 1.5 },
  systemCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden',
  },
  systemRow: { padding: Spacing.md, gap: 6 },
  systemRowBorder: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  systemQ: { ...Typography.label, color: Colors.gold, letterSpacing: 0.8 },
  systemA: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  systemLastRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  systemLastText: { ...Typography.bodySmall, color: Colors.textMuted, flex: 1, fontStyle: 'italic' },

  // Archetypes
  archetypesSection: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, gap: Spacing.md },
  sectionHead: { gap: 4 },
  sectionTitle: { ...Typography.heading, color: Colors.textPrimary },
  tilesGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  // Disclaimer
  disclaimer: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', lineHeight: 18, fontSize: 10,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
  },

  // CTA
  ctaBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surfaceDark + 'F5',
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    gap: Spacing.xs, ...Shadows.lg,
  },
  ctaBtn: { borderRadius: Radii.lg, overflow: 'hidden', ...Shadows.gold },
  ctaBtnGrad: {
    paddingVertical: 17, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: Spacing.sm,
  },
  ctaBtnText: { ...Typography.button, color: Colors.background, fontWeight: '700', fontSize: 16 },
  ctaNote: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', fontSize: 10,
  },
});
