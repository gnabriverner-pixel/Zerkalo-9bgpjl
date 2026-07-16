/**
 * Reveal Sequence — Palace Entry V3
 * Cinematic 3–5 second sequence between date entry and First Mirror.
 * NOT a spinner. A moment of anticipation that becomes part of the product.
 *
 * Analytics: reveal_started → reveal_completed
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { analytics } from '@/services/analytics';
import { Colors, Spacing, Typography, PLANET_COLORS } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { useApp } from '@/hooks/useApp';

const { width: SW } = Dimensions.get('window');

const REVEAL_STEPS = [
  'Собираем пять позиций в один маршрут',
  'Ищем повторяющуюся внутреннюю тему',
  'Проявляем первое зеркало',
];

const PLANET_DOTS = [
  PLANET_COLORS[6] || '#C87A8A',  // Венера — Душа
  PLANET_COLORS[2] || '#A8B8C8',  // Луна — Выражение
  PLANET_COLORS[8] || '#6A6A7A',  // Сатурн — Путь
  PLANET_COLORS[5] || '#5A8A7A',  // Меркурий — Направление
  PLANET_COLORS[1] || '#E8C040',  // Солнце — Результат
];

// ── Animated constellation dot ─────────────────────────────────────────────

function ConstellationDot({
  color, delay, index, totalProgress,
}: {
  color: string; delay: number; index: number; totalProgress: Animated.Value;
}) {
  const dotFade = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(dotFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(dotScale, { toValue: 1, ...Motion.spring.bouncy, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const SIZE = 16;
  const angle = (index / 5) * Math.PI * 2 - Math.PI / 2;
  const RADIUS = Math.min(SW * 0.25, 90);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: '50%' as any,
        top: '50%' as any,
        marginLeft: Math.cos(angle) * RADIUS - SIZE / 2,
        marginTop: Math.sin(angle) * RADIUS - SIZE / 2,
        width: SIZE, height: SIZE, borderRadius: SIZE / 2,
        backgroundColor: color,
        opacity: dotFade,
        transform: [{ scale: dotScale }],
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 4,
      }}
    />
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function RevealScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession } = useApp();

  const [stepIndex, setStepIndex] = useState(0);
  const progressFade = useRef(new Animated.Value(0)).current;
  const containerFade = useRef(new Animated.Value(0)).current;
  const totalProgress = useRef(new Animated.Value(0)).current;
  const nameFade = useRef(new Animated.Value(0)).current;
  const lineFade = useRef(new Animated.Value(0)).current;

  const name = currentSession?.name;

  useEffect(() => {
    analytics.track('reveal_started');

    // Fade in container
    Animated.timing(containerFade, {
      toValue: 1, duration: 500, useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(totalProgress, {
      toValue: 1, duration: 3800, useNativeDriver: false,
    }).start();

    // Step labels
    const stepTimers = REVEAL_STEPS.map((_, i) => {
      return setTimeout(() => {
        Animated.timing(progressFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
          setStepIndex(i);
          Animated.timing(progressFade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
        });
      }, i * 1300);
    });

    // Name fade in
    const nameTimer = setTimeout(() => {
      Animated.timing(nameFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }, 800);

    // Connection line fade
    const lineTimer = setTimeout(() => {
      Animated.timing(lineFade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }, 2200);

    // Navigate after reveal
    const navTimer = setTimeout(() => {
      analytics.track('reveal_completed');
      router.replace('/first-mirror');
    }, 4200);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearTimeout(nameTimer);
      clearTimeout(lineTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const progressWidth = totalProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SW - Spacing.xl * 2],
  });

  return (
    <Animated.View style={[styles.root, { opacity: containerFade }]}>
      {/* Constellation */}
      <View style={[styles.constellation, { paddingTop: insets.top + 48 }]}>
        <View style={styles.constellationField}>
          {PLANET_DOTS.map((color, i) => (
            <ConstellationDot
              key={i}
              color={color}
              delay={i * 380}
              index={i}
              totalProgress={totalProgress}
            />
          ))}

          {/* Connection lines — appear after dots */}
          <Animated.View style={[styles.lineH, { opacity: lineFade }]} />
          <Animated.View style={[styles.lineV, { opacity: lineFade }]} />

          {/* Center pulse */}
          <View style={styles.centerPulse} />
        </View>

        {/* Name */}
        {name ? (
          <Animated.Text style={[styles.nameText, { opacity: nameFade }]}>
            {name}
          </Animated.Text>
        ) : null}
      </View>

      {/* Step text */}
      <Animated.View style={[styles.stepArea, { opacity: progressFade }]}>
        <Text style={styles.stepText}>{REVEAL_STEPS[stepIndex]}</Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { marginBottom: insets.bottom + Spacing.xxl }]}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'space-between',
  },

  constellation: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    width: '100%',
  },
  constellationField: {
    width: 220, height: 220,
    position: 'relative', alignItems: 'center', justifyContent: 'center',
  },
  lineH: {
    position: 'absolute', width: 160, height: 1,
    backgroundColor: Colors.gold + '20', top: '50%',
  },
  lineV: {
    position: 'absolute', width: 1, height: 160,
    backgroundColor: Colors.gold + '20', left: '50%',
  },
  centerPulse: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.gold + '25',
    borderWidth: 1, borderColor: Colors.border,
  },

  nameText: {
    marginTop: Spacing.xl,
    fontSize: 22, fontWeight: '600',
    color: Colors.textPrimary, letterSpacing: 0.5,
  },

  stepArea: {
    paddingHorizontal: Spacing.xl, alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  stepText: {
    ...Typography.bodySmall, color: Colors.textMuted,
    textAlign: 'center', fontStyle: 'italic', lineHeight: 22,
  },

  progressTrack: {
    width: SW - Spacing.xl * 2, height: 2,
    backgroundColor: Colors.borderLight,
    borderRadius: 1, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: Colors.gold,
    borderRadius: 1,
  },
});
