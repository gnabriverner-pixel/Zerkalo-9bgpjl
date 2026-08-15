/**
 * Meeting of Mirrors — "Встреча зеркал"
 * "Зеркало себя" · The convergence of both lenses.
 *
 * Visual: two Orbs (Gold Code + Purple Myth) animate together at center.
 * Sections:
 *   - Смысловые параллели (semantic parallels)
 *   - Расхождения / Внутренний спор (divergences)
 *   - Один глубокий вопрос для диалога
 * Main CTA: "Обсудить с Альбертом в Telegram"
 *
 * Analytics: meeting_viewed → telegram_continuation_clicked
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
  ScrollView, Linking, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { Orb } from '@/components/brand/Orb';
import { analytics } from '@/services/analytics';
import { useApp } from '@/hooks/useApp';
import { MOCK_PROFILE, buildMirrorProfileFromSession } from '@/services/mirror-data';

const { width: SW } = Dimensions.get('window');

const TELEGRAM_DEEPLINK = 'https://t.me/digitalcodesystem_bot';

// ── Converging orbs animation ─────────────────────────────────────────────────

function ConvergingOrbs() {
  const mythX = useRef(new Animated.Value(-SW * 0.22)).current;
  const codeX = useRef(new Animated.Value(SW * 0.22)).current;
  const mythOpacity = useRef(new Animated.Value(0)).current;
  const codeOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Fade in both orbs
    Animated.parallel([
      Animated.timing(mythOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(codeOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      // Slide toward center
      Animated.parallel([
        Animated.spring(mythX, { toValue: -SW * 0.06, ...Motion.spring.gentle, useNativeDriver: true }),
        Animated.spring(codeX, { toValue: SW * 0.06, ...Motion.spring.gentle, useNativeDriver: true }),
      ]).start(() => {
        // Glow emerges
        Animated.parallel([
          Animated.timing(glowOpacity, { toValue: 0.6, duration: 600, useNativeDriver: true }),
          Animated.spring(glowScale, { toValue: 1.2, ...Motion.spring.bouncy, useNativeDriver: true }),
        ]).start();
      });
    });
  }, []);

  return (
    <View style={orbStyles.root}>
      {/* Central glow */}
      <Animated.View
        style={[
          orbStyles.centerGlow,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
      />

      {/* Myth orb */}
      <Animated.View
        style={[orbStyles.orbWrap, { transform: [{ translateX: mythX }], opacity: mythOpacity }]}
      >
        <Orb color={Colors.mythPrimary} size={96} rotationDuration={16000} />
      </Animated.View>

      {/* Code orb */}
      <Animated.View
        style={[orbStyles.orbWrap, { transform: [{ translateX: codeX }], opacity: codeOpacity }]}
      >
        <Orb color={Colors.gold} size={96} rotationDuration={20000} />
      </Animated.View>
    </View>
  );
}

const orbStyles = StyleSheet.create({
  root: {
    height: 130, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  orbWrap: { position: 'absolute' },
  centerGlow: {
    position: 'absolute',
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.gold,
    opacity: 0,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 40,
  },
});

// ── Mock meeting content ──────────────────────────────────────────────────────

const MOCK_PARALLELS = [
  {
    id: 'p1',
    theme: 'Стремление к качеству',
    myth: 'Человек ищет качество как способ быть, а не как достижение',
    code: 'Венера в Числе Души — внутренняя природа стремится к красоте и гармонии',
    color: Colors.venus,
  },
  {
    id: 'p2',
    theme: 'Напряжение как вестник',
    myth: 'Внутреннее напряжение оказывается не врагом, а приглашением',
    code: 'Луна в Выражении создаёт чуткость, которая требует признания',
    color: Colors.moon,
  },
  {
    id: 'p3',
    theme: 'Путь через реализацию',
    myth: 'Момент живости связан с созданием и передачей',
    code: 'Меркурий в Направлении указывает на реализацию через речь и обмен',
    color: Colors.mercury,
  },
];

const MOCK_DIVERGENCES = [
  {
    id: 'd1',
    theme: 'Скорость',
    myth: 'История говорит: начните сейчас, с образом',
    code: 'Сатурн говорит: строительство медленное, результат долгий',
    tension: 'Желание немедленного и реальность системного',
  },
];

const DEEP_QUESTION = 'Если ваше напряжение и ваша формула говорят об одном и том же — что именно они оба пытаются донести до вас прямо сейчас?';

// ── Main ─────────────────────────────────────────────────────────────────────

export default function MeetingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession } = useApp();

  const profile = currentSession
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

  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    analytics.track('meeting_viewed');
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(contentSlide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
      ]).start();
    }, 600); // Let orbs animate first
  }, []);

  const handleTelegram = () => {
    analytics.track('telegram_continuation_clicked', { source: 'meeting' });
    Linking.openURL(TELEGRAM_DEEPLINK);
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={18} color={Colors.textMuted} />
        </Pressable>
        <Text style={styles.headerTitle}>Встреча зеркал</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
      >
        {/* Converging Orbs animation */}
        <ConvergingOrbs />

        {/* Frame text */}
        <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
          <View style={styles.frameCard}>
            <Text style={styles.frameText}>
              Эти две версии появились независимо.{'\n'}
              Одна — из даты, другая — из образов.{'\n'}
              Они подсвечивают главное.
            </Text>
          </View>

          {/* ── Смысловые параллели ──────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionEmoji}>✨</Text>
              <Text style={styles.sectionTitle}>Смысловые параллели</Text>
            </View>
            <Text style={styles.sectionSub}>Где история и код говорят одно и то же</Text>

            {MOCK_PARALLELS.map(p => (
              <View key={p.id} style={[styles.parallelCard, { borderColor: p.color + '28' }]}>
                <View style={[styles.parallelTheme, { backgroundColor: p.color + '12', borderColor: p.color + '25' }]}>
                  <Text style={[styles.parallelThemeText, { color: p.color }]}>{p.theme}</Text>
                </View>
                <View style={styles.parallelRow}>
                  <View style={[styles.parallelLens, { borderColor: Colors.mythDim }]}>
                    <Text style={[styles.parallelLensTag, { color: Colors.mythPrimary }]}>МИФ</Text>
                    <Text style={styles.parallelLensText}>{p.myth}</Text>
                  </View>
                  <View style={[styles.parallelLens, { borderColor: Colors.border }]}>
                    <Text style={[styles.parallelLensTag, { color: Colors.gold }]}>КОД</Text>
                    <Text style={styles.parallelLensText}>{p.code}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* ── Расхождения ───────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionEmoji}>⚖️</Text>
              <Text style={styles.sectionTitle}>Расхождения</Text>
            </View>
            <Text style={styles.sectionSub}>Внутренний спор, который стоит услышать</Text>

            {MOCK_DIVERGENCES.map(d => (
              <View key={d.id} style={[styles.divergenceCard, { borderColor: Colors.saturn + '25' }]}>
                <Text style={[styles.divergenceTheme, { color: Colors.saturn }]}>{d.theme}</Text>
                <View style={styles.divergenceRow}>
                  <Text style={styles.divergenceLine}>«{d.myth}»</Text>
                  <MaterialIcons name="compare-arrows" size={14} color={Colors.textDisabled} />
                  <Text style={styles.divergenceLine}>«{d.code}»</Text>
                </View>
                <View style={styles.tensionBox}>
                  <Text style={styles.tensionText}>{d.tension}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Deep question ─────────────────────────────── */}
          <View style={[styles.section]}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionEmoji}>🪞</Text>
              <Text style={styles.sectionTitle}>Один вопрос для диалога</Text>
            </View>
            <View style={[styles.deepQuestionCard, { borderColor: Colors.gold + '28' }]}>
              <Text style={styles.deepQuestionText}>{DEEP_QUESTION}</Text>
            </View>
          </View>

          {/* ── Telegram CTA ─────────────────────────────── */}
          <Pressable
            onPress={handleTelegram}
            style={({ pressed }) => [styles.telegramCta, pressed && { opacity: 0.88 }]}
            accessibilityLabel="Обсудить с Альбертом в Telegram"
          >
            <LinearGradient
              colors={[Colors.mythPrimary, '#6A4A8A']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.telegramCtaGrad}
            >
              <MaterialIcons name="send" size={18} color={Colors.textPrimary} />
              <Text style={styles.telegramCtaText}>Обсудить с Альбертом в Telegram</Text>
            </LinearGradient>
          </Pressable>

          <Text style={styles.telegramNote}>
            Альберт знает вашу карту и готов к диалогу о том, что вы увидели
          </Text>

          {/* Prototype note */}
          <View style={styles.protoNote}>
            <MaterialIcons name="info-outline" size={12} color={Colors.textDisabled} />
            <Text style={styles.protoNoteText}>
              Секция «Смысловые параллели» и «Встреча зеркал» — прототип. В канонической версии связи строятся из реальных ответов и рассчитанной формулы.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm,
    backgroundColor: Colors.surfaceDark + 'F0',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  headerTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.xl, paddingTop: Spacing.md },

  frameCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg,
  },
  frameText: {
    fontSize: 18, fontWeight: '400', color: Colors.textSecondary,
    lineHeight: 28, textAlign: 'center', fontFamily: 'serif',
    fontStyle: 'italic',
  },

  section: { gap: Spacing.md },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionEmoji: { fontSize: 18 },
  sectionTitle: { ...Typography.heading, color: Colors.textPrimary },
  sectionSub: { ...Typography.caption, color: Colors.textMuted },

  // Parallels
  parallelCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl, borderWidth: 1,
    padding: Spacing.md, gap: Spacing.sm,
  },
  parallelTheme: {
    alignSelf: 'flex-start', borderRadius: Radii.full, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  parallelThemeText: { ...Typography.label, fontSize: 10 },
  parallelRow: { flexDirection: 'row', gap: Spacing.sm },
  parallelLens: {
    flex: 1, borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 4,
  },
  parallelLensTag: { ...Typography.label, fontSize: 9, letterSpacing: 1 },
  parallelLensText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },

  // Divergences
  divergenceCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl, borderWidth: 1,
    padding: Spacing.md, gap: Spacing.sm,
  },
  divergenceTheme: { ...Typography.label, letterSpacing: 1 },
  divergenceRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap',
  },
  divergenceLine: { ...Typography.caption, color: Colors.textMuted, flex: 1, fontStyle: 'italic' },
  tensionBox: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.sm,
    padding: Spacing.sm,
  },
  tensionText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },

  // Deep question
  deepQuestionCard: {
    borderWidth: 1, borderRadius: Radii.xl, padding: Spacing.xl,
    backgroundColor: Colors.goldGlow,
  },
  deepQuestionText: {
    fontSize: 18, fontWeight: '400', color: Colors.textPrimary,
    lineHeight: 28, textAlign: 'center', fontFamily: 'serif',
    fontStyle: 'italic',
  },

  // Telegram
  telegramCta: { borderRadius: Radii.lg, overflow: 'hidden', ...Shadows.myth },
  telegramCtaGrad: {
    paddingVertical: 17, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: Spacing.sm,
  },
  telegramCtaText: { ...Typography.button, color: Colors.textPrimary, fontWeight: '700', fontSize: 16 },
  telegramNote: {
    ...Typography.caption, color: Colors.textMuted,
    textAlign: 'center', lineHeight: 18, fontStyle: 'italic',
  },

  protoNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated, borderRadius: Radii.lg,
    padding: Spacing.md,
  },
  protoNoteText: {
    ...Typography.caption, color: Colors.textDisabled, flex: 1, lineHeight: 17,
  },
});
