/**
 * Threshold — Palace Entry V3
 * Single screen. Replaces 3-slide onboarding.
 * Goal: user understands the product in 5–10 seconds and takes one action.
 *
 * Analytics: mirror_entry_viewed → mirror_started
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { analytics } from '@/services/analytics';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';
import { Motion } from '@/constants/motion';

const { width: SW, height: SH } = Dimensions.get('window');

// ── Animated mirror sigil ─────────────────────────────────────────────────────

function MirrorSigil() {
  const rotate = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1, duration: Motion.cinematic,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: 1, duration: Motion.cinematic + 300,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1, duration: 24000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const SIZE = Math.min(SW * 0.56, 220);

  return (
    <Animated.View style={[sigilStyles.root, { transform: [{ scale }], opacity: glow }]}>
      {/* Outer orbit ring */}
      <Animated.View
        style={[
          sigilStyles.orbit,
          { width: SIZE, height: SIZE, borderRadius: SIZE / 2, transform: [{ rotate: rotation }] },
        ]}
      />
      {/* Inner static ring */}
      <View style={[sigilStyles.innerRing, { width: SIZE * 0.76, height: SIZE * 0.76, borderRadius: SIZE * 0.38 }]} />
      {/* Core */}
      <View style={[sigilStyles.core, { width: SIZE * 0.46, height: SIZE * 0.46, borderRadius: SIZE * 0.23 }]}>
        {/* Five planet dots */}
        {['#E8C040', '#A8B8C8', '#6A6A7A', '#5A8A7A', '#C87A8A'].map((color, i) => {
          const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const r = SIZE * 0.27;
          const x = Math.cos(angle) * r + SIZE / 2 - 5;
          const y = Math.sin(angle) * r + SIZE / 2 - 5;
          return (
            <View
              key={i}
              style={[sigilStyles.dot, { backgroundColor: color, left: x, top: y }]}
            />
          );
        })}
        {/* Center */}
        <View style={sigilStyles.centerGlow} />
      </View>
    </Animated.View>
  );
}

const sigilStyles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  orbit: {
    position: 'absolute', borderWidth: 1,
    borderColor: Colors.gold + '22',
    borderStyle: 'dashed',
  },
  innerRing: {
    position: 'absolute', borderWidth: 1.5,
    borderColor: Colors.gold + '35',
  },
  core: {
    position: 'absolute',
    backgroundColor: Colors.goldGlow,
    borderWidth: 1, borderColor: Colors.border,
  },
  dot: {
    position: 'absolute', width: 10, height: 10, borderRadius: 5,
  },
  centerGlow: {
    position: 'absolute', width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.gold, opacity: 0.18,
    alignSelf: 'center', top: '50%', marginTop: -14,
  },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ThresholdScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();

  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    analytics.track('mirror_entry_viewed');

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: Motion.slow, useNativeDriver: true }),
        Animated.spring(contentSlide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
      ]).start();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    analytics.track('mirror_started');
    completeOnboarding();
    router.replace('/(tabs)/calculate');
  };

  return (
    <View style={styles.root}>
      {/* Background gradient */}
      <LinearGradient
        colors={[Colors.background, '#0F0D09', Colors.background]}
        style={StyleSheet.absoluteFillObject}
        locations={[0, 0.5, 1]}
      />

      {/* Top safe area */}
      <View style={{ height: insets.top }} />

      {/* Sigil — top half */}
      <View style={styles.sigilArea}>
        <MirrorSigil />
        <View style={styles.sigilGlowHalo} pointerEvents="none" />
      </View>

      {/* Content — bottom half */}
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

        {/* Main phrase */}
        <Text style={styles.headline}>
          В дате рождения есть{'\n'}повторяющийся маршрут
        </Text>

        <Text style={styles.body}>
          Как вы чувствуете, действуете, теряете силу — и к чему в итоге приходите.{'\n\n'}
          Сначала покажем один рисунок. Числа объясним потом.
        </Text>

        {/* Primary CTA */}
        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.88 }]}
          accessibilityLabel="Открыть первое зеркало"
        >
          <LinearGradient
            colors={[Colors.gold, Colors.goldSoft]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaBtnGrad}
          >
            <Text style={styles.ctaBtnText}>Открыть первое зеркало</Text>
            <MaterialIcons name="arrow-forward" size={18} color={Colors.background} />
          </LinearGradient>
        </Pressable>

        {/* Safety line */}
        <Text style={styles.safety}>
          Достаточно даты рождения · без регистрации · не является консультацией
        </Text>

        {/* Subtle auth link */}
        <Pressable onPress={() => router.push('/auth')} style={styles.authLink} hitSlop={8}>
          <Text style={styles.authLinkText}>Войти в аккаунт</Text>
        </Pressable>
      </Animated.View>

      {/* Bottom safe area */}
      <View style={{ height: insets.bottom + Spacing.md }} />
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
    position: 'relative', minHeight: 240,
  },
  sigilGlowHalo: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'transparent',
    ...Shadows.goldLg,
    shadowOpacity: 0.08,
  },

  content: {
    paddingHorizontal: Spacing.xl, gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    alignSelf: 'flex-start', marginBottom: 4,
  },
  badgeDot: {
    width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.gold,
  },
  badgeText: {
    ...Typography.label, color: Colors.gold, letterSpacing: 2,
  },

  headline: {
    fontSize: 28, fontWeight: '700', color: Colors.textPrimary,
    lineHeight: 36, letterSpacing: -0.3,
  },

  body: {
    ...Typography.body, color: Colors.textSecondary,
    lineHeight: 26, marginBottom: 4,
  },

  ctaBtn: {
    borderRadius: Radii.lg, overflow: 'hidden',
    ...Shadows.gold, marginTop: Spacing.xs,
  },
  ctaBtnGrad: {
    paddingVertical: 18, paddingHorizontal: Spacing.xl,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: Spacing.sm,
  },
  ctaBtnText: {
    ...Typography.button, color: Colors.background,
    fontWeight: '700', fontSize: 16,
  },

  safety: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', fontSize: 10, lineHeight: 16,
  },

  authLink: { alignItems: 'center', paddingVertical: Spacing.xs },
  authLinkText: {
    ...Typography.caption, color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
