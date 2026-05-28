import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Pressable, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { MirrorSymbol } from '@/components/brand/MirrorSymbol';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    tag: 'ЗЕРКАЛО СЕБЯ',
    title: 'Увидь свой цифровой код',
    body: 'Персональный разбор по дате рождения.\n\nНе гороскоп, не предсказание — внутренняя архитектура вашей природы.',
  },
  {
    id: 2,
    tag: 'ПЯТЬ ЧИСЕЛ КОДА',
    title: 'Что вы получите',
    body: 'Душа, Выражение, Путь, Направление и Результат.\n\nНе только итоговые цифры — но и цепочки расчёта с составными числами.',
  },
  {
    id: 3,
    tag: 'ГЛУБОКИЙ РАЗБОР',
    title: 'Дом Самопознания',
    body: 'Полный разбор: матрица, личные циклы, денежный код, периоды, зоны напряжения и практический вектор.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goTo = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * width, animated: true });
    setCurrent(i);
  };

  const handleScroll = (e: any) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrent(i);
  };

  const proceed = (toAuth = false) => {
    completeOnboarding();
    if (toAuth) router.replace('/auth');
    else router.replace('/(tabs)/calculate');
  };

  const isLast = current === SLIDES.length - 1;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Mirror symbol hero */}
      <View style={styles.mirrorWrap}>
        <MirrorSymbol size={Math.min(width * 0.6, 240)} showSigils />
        {/* Subtle radial glow behind mirror */}
        <View style={styles.mirrorGlow} pointerEvents="none" />
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.slidesScroll}
      >
        {SLIDES.map(slide => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            <View style={styles.slideTagRow}>
              <View style={styles.slideTag}>
                <Text style={styles.slideTagText}>{slide.tag}</Text>
              </View>
            </View>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideBody}>{slide.body}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <Pressable key={i} onPress={() => goTo(i)} hitSlop={10}>
            <View style={[styles.dot, i === current && styles.dotActive]} />
          </Pressable>
        ))}
      </View>

      {/* CTAs */}
      <View style={[styles.ctas, { paddingBottom: insets.bottom + Spacing.lg }]}>
        {isLast ? (
          <>
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
              onPress={() => proceed(false)}
              accessibilityLabel="Рассчитать свой код"
            >
              <Text style={styles.primaryBtnText}>Рассчитать свой код</Text>
              <MaterialIcons name="arrow-forward" size={18} color={Colors.background} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.75 }]}
              onPress={() => proceed(true)}
            >
              <Text style={styles.secondaryBtnText}>Войти в аккаунт</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
              onPress={() => goTo(current + 1)}
            >
              <Text style={styles.primaryBtnText}>Далее</Text>
              <MaterialIcons name="arrow-forward" size={18} color={Colors.background} />
            </Pressable>
            <Pressable
              style={styles.guestLink}
              onPress={() => proceed(false)}
            >
              <Text style={styles.guestLinkText}>попробовать без регистрации</Text>
            </Pressable>
          </>
        )}

        <Text style={styles.legalText}>
          Информационно-развлекательный характер · не является консультацией
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Mirror hero
  mirrorWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    position: 'relative',
  },
  mirrorGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'transparent',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 60,
  },

  // Slides
  slidesScroll: { flexGrow: 0 },
  slide: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  slideTagRow: { alignItems: 'flex-start' },
  slideTag: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  slideTagText: {
    ...Typography.label,
    color: Colors.gold,
    fontSize: 10,
  },
  slideTitle: {
    ...Typography.title,
    color: Colors.textPrimary,
    fontSize: 24,
  },
  slideBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 26,
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.gold,
  },

  // CTA
  ctas: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radii.lg,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.gold,
  },
  btnPressed: { opacity: 0.88 },
  primaryBtnText: {
    ...Typography.button,
    color: Colors.background,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    borderRadius: Radii.lg,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  secondaryBtnText: {
    ...Typography.button,
    color: Colors.textSecondary,
  },
  guestLink: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  guestLinkText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
  legalText: {
    ...Typography.caption,
    color: Colors.textDisabled,
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontSize: 10,
    opacity: 0.7,
  },
});
