/**
 * Hub Screen — "Зеркало себя"
 * Root entry point. Two doors. No paywall.
 *
 * Visual: dark cosmic canvas (#090D15), Cormorant Garamond titles,
 * yantric Orb sigil, two equal entry doors with haptic feedback,
 * horizontal archetype carousel (3 teasers + "Open Pantheon").
 *
 * If both lenses completed → "Встреча зеркал открыта" float button.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
  ScrollView, Dimensions, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, Typography, Radii, Shadows, PLANET_COLORS } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { ARCHETYPES } from '@/constants/archetypes-data';
import { Orb } from '@/components/brand/Orb';

const { width: SW } = Dimensions.get('window');

// ── Animated door card ────────────────────────────────────────────────────────

function DoorCard({
  label, title, subtitle, description, icon, color, glow,
  onPress, delay = 0,
}: {
  label: string; title: string; subtitle: string; description: string;
  icon: string; color: string; glow: string; onPress: () => void; delay?: number;
}) {
  const scale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, ...Motion.spring.gentle, useNativeDriver: true }),
      ]).start();
    }, delay);
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.97, ...Motion.spring.tight, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, ...Motion.spring.gentle, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ opacity, transform: [{ scale }, { scale: pressScale }], flex: 1 }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.door, { borderColor: color + '28' }]}
        accessibilityLabel={title}
      >
        {/* Orb */}
        <View style={styles.doorOrbWrap}>
          <Orb color={color} size={72} showRings />
        </View>

        {/* Label chip */}
        <View style={[styles.doorChip, { backgroundColor: color + '12', borderColor: color + '28' }]}>
          <Text style={[styles.doorChipText, { color }]}>{label}</Text>
        </View>

        <Text style={styles.doorTitle}>{title}</Text>
        <Text style={[styles.doorSubtitle, { color }]}>{subtitle}</Text>
        <Text style={styles.doorDesc}>{description}</Text>

        {/* Arrow */}
        <View style={[styles.doorArrow, { backgroundColor: color + '15', borderColor: color + '30' }]}>
          <MaterialIcons name="arrow-forward" size={15} color={color} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── Archetype carousel tile ───────────────────────────────────────────────────

function ArchetypeTeaserTile({
  number, planet, name, color, onPress,
}: { number: number; planet: string; name: string; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.teaserTile, { borderColor: color + '28' }, pressed && { opacity: 0.8 }]}
    >
      <Orb color={color} size={48} showRings={false} />
      <Text style={[styles.teaserNum, { color }]}>{number}</Text>
      <Text style={[styles.teaserPlanet, { color }]}>{planet}</Text>
      <Text style={styles.teaserName} numberOfLines={1}>{name.replace('Путь ', '')}</Text>
    </Pressable>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function HubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, isOnboarded } = useApp();

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;

  // Track which lenses have been visited
  const [mythVisited, setMythVisited] = useState(false);
  const codeCompleted = currentSession !== null;
  const bothCompleted = mythVisited && codeCompleted;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();
  }, []);

  const goToMyth = async () => {
    if (Platform.OS !== 'web') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMythVisited(true);
    router.push('/myth');
  };

  const goToCode = async () => {
    if (Platform.OS !== 'web') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/calculate');
  };

  const goToMeeting = async () => {
    if (Platform.OS !== 'web') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/meeting');
  };

  const goToPantheon = () => {
    router.push('/world');
  };

  // Three featured archetypes for the carousel
  const teaserNums = [1, 6, 8];
  const teaserArchetypes = teaserNums.map(n => ARCHETYPES[n]).filter(Boolean);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + (bothCompleted ? 120 : 48) },
        ]}
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <Animated.View
          style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}
        >
          {/* Central Orb sigil — composite of gold + myth */}
          <View style={styles.headerOrbWrap}>
            <View style={styles.headerOrbInner}>
              <Orb color={Colors.gold} size={96} rotationDuration={24000} />
            </View>
            <View style={styles.headerOrbMyth} pointerEvents="none">
              <Orb color={Colors.mythPrimary} size={64} rotationDuration={36000} />
            </View>
          </View>

          {/* Wordmark — editorial serif style */}
          <View style={styles.wordmarkWrap}>
            <Text style={styles.wordmark}>Зеркало себя</Text>
            <View style={styles.wordmarkBadge}>
              <View style={styles.wordmarkDot} />
              <Text style={styles.wordmarkBadgeText}>ИНТЕРАКТИВНОЕ ЗЕРКАЛО ЧЕЛОВЕКА</Text>
            </View>
          </View>

          <Text style={styles.tagline}>
            Есть разные способы посмотреть на себя.{'\n'}Начните с того, который сейчас ближе.
          </Text>
        </Animated.View>

        {/* ── Two Doors ─────────────────────────────────────── */}
        <View style={styles.doors}>
          <DoorCard
            label="ДВЕРЬ I"
            title="Личный миф"
            subtitle="Сказка про тебя"
            description="4 образных вопроса. Литературная история, рождающаяся из ваших символов."
            icon="auto-stories"
            color={Colors.mythPrimary}
            glow={Colors.mythGlow}
            onPress={goToMyth}
            delay={200}
          />
          <DoorCard
            label="ДВЕРЬ II"
            title="Цифровой код"
            subtitle="Паспорт природы"
            description="Только дата рождения. 5 ключей вашей природы и практики дня."
            icon="fingerprint"
            color={Colors.gold}
            glow={Colors.goldGlow}
            onPress={goToCode}
            delay={350}
          />
        </View>

        {/* Status chips */}
        <View style={styles.statusRow}>
          <View style={[styles.statusChip, mythVisited && styles.statusChipDone]}>
            <MaterialIcons
              name={mythVisited ? 'check-circle' : 'radio-button-unchecked'}
              size={12}
              color={mythVisited ? Colors.mythPrimary : Colors.textDisabled}
            />
            <Text style={[styles.statusChipText, mythVisited && { color: Colors.mythPrimary }]}>Личный миф</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={[styles.statusChip, codeCompleted && styles.statusChipDoneGold]}>
            <MaterialIcons
              name={codeCompleted ? 'check-circle' : 'radio-button-unchecked'}
              size={12}
              color={codeCompleted ? Colors.gold : Colors.textDisabled}
            />
            <Text style={[styles.statusChipText, codeCompleted && { color: Colors.gold }]}>Цифровой код</Text>
          </View>
        </View>

        {/* ── Archetype Pantheon carousel ──────────────────── */}
        <View style={styles.pantheonSection}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLabel}>ПАНТЕОН 9 СИЛ</Text>
            <Text style={styles.sectionTitle}>Ведические архетипы</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.teaserRow}
          >
            {teaserArchetypes.map(a => (
              <ArchetypeTeaserTile
                key={a.number}
                number={a.number}
                planet={a.planet}
                name={a.name}
                color={a.color}
                onPress={goToPantheon}
              />
            ))}
            {/* "Open full pantheon" tile */}
            <Pressable
              onPress={goToPantheon}
              style={({ pressed }) => [styles.pantheonCta, pressed && { opacity: 0.82 }]}
            >
              <MaterialIcons name="language" size={22} color={Colors.gold} />
              <Text style={styles.pantheonCtaText}>Открыть весь{'\n'}Пантеон 9 сил</Text>
              <MaterialIcons name="arrow-forward" size={13} color={Colors.gold + 'AA'} />
            </Pressable>
          </ScrollView>
        </View>

        {/* If code already computed — quick return card */}
        {codeCompleted && currentSession ? (
          <Pressable
            onPress={() => router.push('/living-passport')}
            style={({ pressed }) => [styles.returnCard, pressed && { opacity: 0.88 }]}
          >
            <View style={styles.returnCardInner}>
              <View style={[styles.returnOrb, { borderColor: Colors.gold + '30' }]}>
                <Text style={[styles.returnOrbText, { color: Colors.gold }]}>
                  {currentSession.core.soulFinal}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.returnLabel}>ВАША КАРТА</Text>
                <Text style={styles.returnName}>{currentSession.name}</Text>
                <Text style={styles.returnDob}>{currentSession.dateOfBirth}</Text>
              </View>
              <View style={[styles.returnArrow, { backgroundColor: Colors.gold + '15' }]}>
                <MaterialIcons name="arrow-forward" size={14} color={Colors.gold} />
              </View>
            </View>
          </Pressable>
        ) : null}

        {/* Footer trust */}
        <View style={styles.trust}>
          <Text style={styles.trustText}>Авторская система самоисследования</Text>
          <Text style={styles.trustAuthor}>Альберт Анатольевич Вяземский</Text>
        </View>
      </ScrollView>

      {/* ── Floating "Встреча зеркал" CTA — only when both completed ── */}
      {bothCompleted ? (
        <Animated.View style={[styles.meetingFloat, { bottom: insets.bottom + Spacing.lg }]}>
          <Pressable
            onPress={goToMeeting}
            style={({ pressed }) => [styles.meetingBtn, pressed && { opacity: 0.9 }]}
          >
            <LinearGradient
              colors={[Colors.mythPrimary, Colors.gold]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.meetingBtnGrad}
            >
              <View style={styles.meetingBtnOrbs}>
                <View style={[styles.meetingMiniOrb, { backgroundColor: Colors.mythPrimary }]} />
                <View style={[styles.meetingMiniOrb, { backgroundColor: Colors.gold, marginLeft: -6 }]} />
              </View>
              <Text style={styles.meetingBtnText}>Встреча зеркал открыта</Text>
              <MaterialIcons name="arrow-forward" size={16} color={Colors.background} />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { gap: Spacing.xl, paddingHorizontal: Spacing.lg },

  // Header
  header: { alignItems: 'center', gap: Spacing.lg, paddingTop: Spacing.sm },
  headerOrbWrap: {
    width: 120, height: 120, position: 'relative',
    alignItems: 'center', justifyContent: 'center',
  },
  headerOrbInner: { position: 'absolute' },
  headerOrbMyth: {
    position: 'absolute', right: -8, bottom: -8,
  },
  wordmarkWrap: { alignItems: 'center', gap: 6 },
  wordmark: {
    fontSize: 34, fontWeight: '300', color: Colors.textPrimary,
    letterSpacing: 1.2, fontFamily: 'serif',
    textAlign: 'center',
  },
  wordmarkBadge: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  wordmarkDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.gold },
  wordmarkBadgeText: {
    ...Typography.label, color: Colors.gold, letterSpacing: 2, fontSize: 9,
  },
  tagline: {
    ...Typography.bodySmall, color: Colors.textMuted,
    textAlign: 'center', lineHeight: 22,
  },

  // Doors
  doors: { flexDirection: 'row', gap: Spacing.sm },
  door: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, padding: Spacing.lg, gap: Spacing.sm,
    minHeight: 240,
  },
  doorOrbWrap: { marginBottom: 4 },
  doorChip: {
    alignSelf: 'flex-start', borderRadius: Radii.full, borderWidth: 1,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  doorChipText: { ...Typography.label, fontSize: 8, letterSpacing: 1.5 },
  doorTitle: {
    fontSize: 18, fontWeight: '700', color: Colors.textPrimary,
    lineHeight: 22, letterSpacing: -0.2, fontFamily: 'serif',
  },
  doorSubtitle: { ...Typography.caption, fontWeight: '600', letterSpacing: 0.5 },
  doorDesc: { ...Typography.caption, color: Colors.textMuted, lineHeight: 17, flex: 1 },
  doorArrow: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start',
    marginTop: 4,
  },

  // Status
  statusRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.md, marginTop: -Spacing.sm,
  },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusChipDone: {},
  statusChipDoneGold: {},
  statusChipText: { ...Typography.caption, color: Colors.textDisabled, fontSize: 11 },
  statusDivider: { width: 1, height: 14, backgroundColor: Colors.borderLight },

  // Pantheon
  pantheonSection: { gap: Spacing.md },
  sectionHead: { gap: 3 },
  sectionLabel: { ...Typography.label, color: Colors.gold, letterSpacing: 2 },
  sectionTitle: { ...Typography.heading, color: Colors.textPrimary },
  teaserRow: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  teaserTile: {
    width: 90, backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, padding: Spacing.sm, gap: 4, alignItems: 'center',
  },
  teaserNum: { fontSize: 16, fontWeight: '700' },
  teaserPlanet: { ...Typography.label, fontSize: 9, letterSpacing: 1 },
  teaserName: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', fontSize: 10 },
  pantheonCta: {
    width: 90, backgroundColor: Colors.surfaceMid, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm,
    gap: 6, alignItems: 'center', justifyContent: 'center', minHeight: 110,
  },
  pantheonCtaText: {
    ...Typography.caption, color: Colors.gold, textAlign: 'center', lineHeight: 16,
  },

  // Return card
  returnCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border,
  },
  returnCardInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  returnOrb: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.goldGlow,
  },
  returnOrbText: { fontSize: 20, fontWeight: '700' },
  returnLabel: { ...Typography.label, color: Colors.gold, fontSize: 9, marginBottom: 2 },
  returnName: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  returnDob: { ...Typography.caption, color: Colors.textMuted },
  returnArrow: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },

  // Trust
  trust: { alignItems: 'center', gap: 3 },
  trustText: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'center', fontSize: 10 },
  trustAuthor: { ...Typography.caption, color: Colors.gold, fontStyle: 'italic', opacity: 0.6 },

  // Meeting float
  meetingFloat: {
    position: 'absolute', left: Spacing.lg, right: Spacing.lg,
    ...Shadows.myth,
  },
  meetingBtn: { borderRadius: Radii.xl, overflow: 'hidden' },
  meetingBtnGrad: {
    paddingVertical: 16, paddingHorizontal: Spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    justifyContent: 'center',
  },
  meetingBtnOrbs: { flexDirection: 'row', marginRight: 4 },
  meetingMiniOrb: { width: 16, height: 16, borderRadius: 8, opacity: 0.7 },
  meetingBtnText: {
    ...Typography.button, color: Colors.background, fontWeight: '700', fontSize: 15,
  },
});
