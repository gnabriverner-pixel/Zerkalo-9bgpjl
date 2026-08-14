/**
 * Threshold — "Зеркало себя" v4 (Product Brief v1)
 * First screen. Does NOT start with a form.
 * Does NOT start with "это не гороскоп".
 *
 * Creates mystery and desire to enter — in 5–10 seconds.
 * Communicates:
 * 1. There's something here to discover about yourself
 * 2. There's an unusual system
 * 3. It starts with date of birth
 *
 * CTA: "Открыть свой код"
 * Secondary: "Узнать, как устроена система" → /world
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { analytics } from '@/services/analytics';
import { Colors, Spacing, Typography, Radii, Shadows, PLANET_COLORS } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { ARCHETYPES } from '@/constants/archetypes-data';

const { width: SW } = Dimensions.get('window');

// ── Orbital sigil — tighter, more mysterious ─────────────────────────────────

function OrbitalSigil({ size }: { size: number }) {
  const rotate = useRef(new Animated.Value(0)).current;
  const rotateReverse = useRef(new Animated.Value(0)).current;
  const appearScale = useRef(new Animated.Value(0.82)).current;
  const appearOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(appearScale, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(appearOpacity, { toValue: 1, duration: 900, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 28000, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.timing(rotateReverse, { toValue: 1, duration: 44000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spinR = rotateReverse.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

  const NINE_DOTS = Object.values(ARCHETYPES).map((a, i) => {
    const angle = (i / 9) * Math.PI * 2 - Math.PI / 2;
    const r = size * 0.42;
    return { color: a.color, x: Math.cos(angle) * r, y: Math.sin(angle) * r };
  });

  return (
    <Animated.View
      style={{
        width: size, height: size,
        transform: [{ scale: appearScale }],
        opacity: appearOpacity,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Outer rotating ring */}
      <Animated.View
        style={{
          position: 'absolute', width: size, height: size, borderRadius: size / 2,
          borderWidth: 1, borderColor: Colors.gold + '18',
          borderStyle: 'dashed',
          transform: [{ rotate: spin }],
        }}
      />
      {/* Mid counter-rotating ring */}
      <Animated.View
        style={{
          position: 'absolute', width: size * 0.72, height: size * 0.72, borderRadius: size * 0.36,
          borderWidth: 1, borderColor: Colors.gold + '22',
          transform: [{ rotate: spinR }],
        }}
      />
      {/* Inner static ring */}
      <View
        style={{
          position: 'absolute', width: size * 0.42, height: size * 0.42, borderRadius: size * 0.21,
          borderWidth: 1.5, borderColor: Colors.gold + '35',
        }}
      />
      {/* Core orb */}
      <View
        style={{
          position: 'absolute', width: size * 0.20, height: size * 0.20, borderRadius: size * 0.10,
          backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.border,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.gold, opacity: 0.4 }} />
      </View>
      {/* Nine dots */}
      {NINE_DOTS.map((d, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: size / 2 + d.x - 7, top: size / 2 + d.y - 7,
            width: 14, height: 14, borderRadius: 7,
            backgroundColor: d.color,
            shadowColor: d.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5, shadowRadius: 5,
          }}
        />
      ))}
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ThresholdScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();

  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    analytics.track('mirror_entry_viewed');

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: Motion.slow, useNativeDriver: true }),
        Animated.spring(contentSlide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
      ]).start();
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    analytics.track('mirror_started', { entry_point: 'threshold' });
    completeOnboarding();
    router.replace('/(tabs)/calculate');
  };

  const handleWorld = () => {
    router.push('/world');
  };

  const sigilSize = Math.min(SW * 0.62, 240);

  return (
    <View style={styles.root}>
      {/* Subtle gradient bg */}
      <LinearGradient
        colors={[Colors.background, '#100E0A', Colors.background]}
        style={StyleSheet.absoluteFillObject}
        locations={[0, 0.45, 1]}
      />

      <View style={{ height: insets.top + Spacing.md }} />

      {/* Orbital sigil — upper half */}
      <View style={styles.sigilArea}>
        <OrbitalSigil size={sigilSize} />
      </View>

      {/* Content — lower half */}
      <Animated.View
        style={[
          styles.content,
          { opacity: contentFade, transform: [{ translateY: contentSlide }] },
        ]}
      >
        {/* Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>ЗЕРКАЛО СЕБЯ</Text>
        </View>

        {/* Headline — mystery + promise */}
        <Text style={styles.headline}>
          В дате рождения есть{'\n'}повторяющийся рисунок
        </Text>

        <Text style={styles.body}>
          Ведическая нумерология связывает числа с девятью планетарными архетипами — символическим языком характера, внутренних противоречий и направления реализации.{'\n\n'}Введите дату рождения и посмотрите, как точно система узнает вас.
        </Text>

        {/* Primary CTA */}
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

        {/* Secondary: learn the system */}
        <Pressable onPress={handleWorld} style={styles.worldLink} hitSlop={8}>
          <MaterialIcons name="language" size={13} color={Colors.textMuted} />
          <Text style={styles.worldLinkText}>Узнать, как устроена система</Text>
        </Pressable>

        {/* Safety */}
        <Text style={styles.safety}>
          Достаточно даты рождения · без регистрации · не является консультацией
        </Text>

        {/* Auth */}
        <Pressable onPress={() => router.push('/auth')} style={styles.authLink} hitSlop={8}>
          <Text style={styles.authLinkText}>Войти в аккаунт</Text>
        </Pressable>
      </Animated.View>

      <View style={{ height: insets.bottom + Spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  sigilArea: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    minHeight: 220,
  },
  content: {
    paddingHorizontal: Spacing.xl, gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
  },
  badgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.gold },
  badgeText: { ...Typography.label, color: Colors.gold, letterSpacing: 2 },
  headline: {
    fontSize: 28, fontWeight: '700', color: Colors.textPrimary,
    lineHeight: 36, letterSpacing: -0.3,
  },
  body: {
    ...Typography.body, color: Colors.textSecondary, lineHeight: 26,
  },
  ctaBtn: { borderRadius: Radii.lg, overflow: 'hidden', ...Shadows.gold },
  ctaBtnGrad: {
    paddingVertical: 18, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: Spacing.sm,
  },
  ctaBtnText: { ...Typography.button, color: Colors.background, fontWeight: '700', fontSize: 16 },
  worldLink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: Spacing.sm,
  },
  worldLinkText: {
    ...Typography.caption, color: Colors.textMuted, textDecorationLine: 'underline',
  },
  safety: {
    ...Typography.caption, color: Colors.textDisabled, textAlign: 'center',
    fontSize: 10, lineHeight: 16,
  },
  authLink: { alignItems: 'center', paddingVertical: 2 },
  authLinkText: {
    ...Typography.caption, color: Colors.textMuted, textDecorationLine: 'underline',
  },
});
