/**
 * Continuation — Prototype-Safe Premium V3
 * Honest conversion prototype.
 * NO fake payment. NO unlockPremium() called.
 * CTA states are clearly prototype-safe.
 *
 * Shows three product tiers + Personal Myth bridge.
 * Prices from PRICE_CONFIG — never hardcoded in component.
 *
 * Analytics: deep_cta_clicked, continuation_product_selected, telegram_continuation_clicked,
 *            personal_myth_interest_clicked
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated,
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
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';
import { Motion } from '@/constants/motion';

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({
  product, price, isFeatured, onSelect,
}: {
  product: any; price: string; isFeatured?: boolean; onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        prodStyles.card,
        isFeatured && prodStyles.cardFeatured,
        pressed && { opacity: 0.88 },
      ]}
    >
      {isFeatured ? (
        <View style={prodStyles.featuredBadge}>
          <MaterialIcons name="workspace-premium" size={9} color={Colors.background} />
          <Text style={prodStyles.featuredBadgeText}>РЕКОМЕНДУЕМ</Text>
        </View>
      ) : null}
      <View style={prodStyles.head}>
        <View style={{ flex: 1 }}>
          <Text style={[prodStyles.title, isFeatured && prodStyles.titleFeatured]}>
            {product.title}
          </Text>
          <Text style={prodStyles.subtitle}>{product.subtitle}</Text>
        </View>
        <Text style={[prodStyles.price, isFeatured && prodStyles.priceFeatured]}>{price}</Text>
      </View>
      <Text style={prodStyles.desc}>{product.description}</Text>
      <View style={prodStyles.divider} />
      {product.includes.slice(0, 3).map((item: string, i: number) => (
        <View key={i} style={prodStyles.includeRow}>
          <MaterialIcons name="check" size={13} color={isFeatured ? Colors.gold : Colors.textMuted} />
          <Text style={prodStyles.includeText}>{item}</Text>
        </View>
      ))}
      {product.includes.length > 3 ? (
        <Text style={prodStyles.moreItems}>+{product.includes.length - 3} ещё</Text>
      ) : null}
      <View style={[prodStyles.cta, isFeatured && prodStyles.ctaFeatured]}>
        <Text style={[prodStyles.ctaText, isFeatured && prodStyles.ctaTextFeatured]}>
          Открыть путь получения
        </Text>
        <MaterialIcons
          name="arrow-forward" size={14}
          color={isFeatured ? Colors.background : Colors.gold}
        />
      </View>
    </Pressable>
  );
}

const prodStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.xxl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.xl, gap: Spacing.md,
  },
  cardFeatured: {
    borderColor: Colors.border, backgroundColor: Colors.goldTint,
    ...Shadows.gold,
  },
  featuredBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 4,
  },
  featuredBadgeText: { ...Typography.label, color: Colors.background, fontSize: 8 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  title: { ...Typography.subheading, color: Colors.textPrimary },
  titleFeatured: { color: Colors.gold },
  subtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  price: { fontSize: 20, fontWeight: '700', color: Colors.textMuted },
  priceFeatured: { color: Colors.gold },
  desc: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  includeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  includeText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1 },
  moreItems: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic' },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderTopWidth: 1, borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md, marginTop: 4,
  },
  ctaFeatured: {
    backgroundColor: Colors.gold, borderRadius: Radii.lg,
    paddingVertical: 14, borderTopWidth: 0, marginTop: 0,
  },
  ctaText: { ...Typography.button, color: Colors.gold, fontWeight: '600' },
  ctaTextFeatured: { color: Colors.background },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ContinuationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession } = useApp();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

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

  const { continuation, identity, positions } = profile;
  const formulaStr = positions.map(p => p.finalNumber).join('—');

  useEffect(() => {
    analytics.track('deep_preview_viewed');
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: Motion.slow, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleProductSelect = (productId: string) => {
    analytics.track('continuation_product_selected', { product_id: productId });
    // Prototype: no real payment
  };

  const handleTelegram = () => {
    analytics.track('telegram_continuation_clicked', { source: 'continuation' });
    // Prototype: navigate to telegram state
  };

  const handleMyth = () => {
    analytics.track('personal_myth_interest_clicked');
    // Prototype: show prototype state
  };

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        style={{ opacity: fade }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Close */}
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <MaterialIcons name="close" size={22} color={Colors.textMuted} />
          </Pressable>
          <View style={styles.prototypeBadge}>
            <Text style={styles.prototypeBadgeText}>PROTOTYPE · НЕ РЕАЛЬНАЯ ПОКУПКА</Text>
          </View>
        </View>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <Animated.View style={[styles.hero, { transform: [{ translateY: slide }] }]}>
          <View style={styles.heroBadge}>
            <MaterialIcons name="workspace-premium" size={11} color={Colors.background} />
            <Text style={styles.heroBadgeText}>ПРОДОЛЖЕНИЕ МАРШРУТА</Text>
          </View>
          <Text style={styles.heroTitle}>Дом{'\n'}Самопознания</Text>
          <Text style={styles.heroSub}>
            Выберите формат, который подходит вам прямо сейчас
          </Text>

          {/* Formula identity */}
          <LinearGradient
            colors={[Colors.surfaceDark, '#0C0C0A']}
            style={styles.identCard}
          >
            <View style={styles.identRow}>
              {identity.displayName ? <Text style={styles.identName}>{identity.displayName}</Text> : null}
              <Text style={styles.identDob}>{identity.dateOfBirth}</Text>
            </View>
            <Text style={styles.identFormula}>{formulaStr}</Text>
            <Text style={styles.identNote}>
              Все разборы создаются именно для этой формулы
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* ── Products ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ФОРМАТЫ ИССЛЕДОВАНИЯ</Text>

          {continuation.products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              price={PRICE_CONFIG[product.priceConfigKey] || '—'}
              isFeatured={i === 1}
              onSelect={() => handleProductSelect(product.id)}
            />
          ))}
        </View>

        {/* ── Personal Myth Bridge ──────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ЗА ПРЕДЕЛАМИ СХЕМЫ</Text>

          <Pressable onPress={handleMyth} style={styles.mythCard}>
            <LinearGradient
              colors={[Colors.surfaceDark, Colors.surface]}
              style={styles.mythCardGrad}
            >
              <View style={styles.mythIconWrap}>
                <MaterialIcons name="auto-stories" size={22} color={Colors.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mythTitle}>Личный миф</Text>
                <Text style={styles.mythPrice}>{PRICE_CONFIG['personal_myth'] || '—'}</Text>
                <Text style={styles.mythDesc}>
                  У числового маршрута есть ещё одна форма — история, в которой его можно увидеть не как схему, а как личный миф.
                </Text>
                <View style={styles.mythCta}>
                  <Text style={styles.mythCtaText}>Увидеть историю своего маршрута</Text>
                  <MaterialIcons name="arrow-forward" size={13} color={Colors.gold} />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* ── Trust ────────────────────────────────────────────────── */}
        <View style={styles.trust}>
          {[
            { icon: 'verified', text: 'Авторская система · Альберт Вяземский' },
            { icon: 'lock', text: 'Разовая покупка · без подписки' },
            { icon: 'info-outline', text: 'Не является консультацией' },
          ].map((t, i) => (
            <View key={i} style={styles.trustRow}>
              <MaterialIcons name={t.icon as any} size={13} color={Colors.gold} />
              <Text style={styles.trustText}>{t.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          Система «Цифровой Код» носит информационно-развлекательный и самоисследовательский характер.
          Не является медицинской, психологической, финансовой или юридической консультацией.
        </Text>
      </Animated.ScrollView>

      {/* Telegram CTA */}
      <View style={[styles.telegramBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <Pressable onPress={handleTelegram} style={styles.telegramBtn} hitSlop={6}>
          <MaterialIcons name="send" size={14} color={Colors.textSecondary} />
          <Text style={styles.telegramText}>Задать вопрос и выбрать формат в Telegram</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.xl },

  topRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  prototypeBadge: {
    backgroundColor: Colors.warning + '15', borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.warning + '30',
    paddingHorizontal: 8, paddingVertical: 3,
  },
  prototypeBadgeText: { ...Typography.label, color: Colors.warning, fontSize: 8 },

  hero: { gap: Spacing.md },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 5,
  },
  heroBadgeText: { ...Typography.label, color: Colors.background, fontSize: 9 },
  heroTitle: { fontSize: 38, fontWeight: '700', color: Colors.textPrimary, lineHeight: 46, letterSpacing: -0.5 },
  heroSub: { ...Typography.body, color: Colors.textMuted, lineHeight: 24 },

  identCard: {
    borderRadius: Radii.xxl, padding: Spacing.xl, gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  identRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  identName: { ...Typography.title, color: Colors.textPrimary, fontSize: 20 },
  identDob: { ...Typography.caption, color: Colors.textMuted },
  identFormula: { fontSize: 28, fontWeight: '700', color: Colors.gold, letterSpacing: 4 },
  identNote: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic' },

  section: { gap: Spacing.md },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, letterSpacing: 1.2 },

  // Myth bridge
  mythCard: { borderRadius: Radii.xxl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  mythCardGrad: { padding: Spacing.xl, flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  mythIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  mythTitle: { ...Typography.subheading, color: Colors.gold, marginBottom: 2 },
  mythPrice: { ...Typography.label, color: Colors.textMuted, marginBottom: 8 },
  mythDesc: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22, marginBottom: 12 },
  mythCta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  mythCtaText: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  trust: { gap: Spacing.sm },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  trustText: { ...Typography.bodySmall, color: Colors.textSecondary },

  disclaimer: {
    ...Typography.caption, color: Colors.textDisabled,
    lineHeight: 18, textAlign: 'center', fontSize: 10,
  },

  telegramBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surfaceDark + 'F0',
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
  },
  telegramBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, paddingVertical: 8,
  },
  telegramText: { ...Typography.bodySmall, color: Colors.textSecondary },
});
