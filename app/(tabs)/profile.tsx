import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, isPremium, savedReports, trackEvent } = useApp();
  const { showAlert } = useAlert();

  const isGuest = !user || user.isGuest;
  const isAuth = user && !user.isGuest;

  const handleLogout = () => {
    showAlert('Выйти из аккаунта?', undefined, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти', style: 'destructive', onPress: () => {
          logout();
          router.replace('/onboarding');
        }
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xxl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarOuter}>
          <LinearGradient colors={[Colors.surfaceMid, Colors.surfaceDark]} style={styles.avatarGrad}>
            <Text style={styles.avatarSigil}>✦</Text>
          </LinearGradient>
        </View>
        <Text style={styles.userName}>
          {isGuest ? 'Гостевой режим' : (user?.name || 'Профиль')}
        </Text>
        {isAuth && user?.email ? (
          <Text style={styles.userEmail}>{user.email}</Text>
        ) : null}

        {isGuest ? (
          <View style={styles.guestBlock}>
            <Text style={styles.guestNotice}>
              В гостевом режиме разборы не сохраняются между сессиями
            </Text>
            <Pressable style={styles.authBtn} onPress={() => router.push('/auth')}>
              <MaterialIcons name="login" size={16} color={Colors.surfaceDark} />
              <Text style={styles.authBtnText}>Войти или создать аккаунт</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{savedReports.length}</Text>
          <Text style={styles.statLabel}>Разборов</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: isPremium ? Colors.gold : Colors.textMuted }]}>
            {isPremium ? 'PRO' : 'Free'}
          </Text>
          <Text style={styles.statLabel}>Доступ</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>2026</Text>
          <Text style={styles.statLabel}>Год</Text>
        </View>
      </View>

      {/* Premium block */}
      {!isPremium ? (
        <Pressable
          onPress={() => {
            trackEvent('paywall_viewed', { source: 'profile' });
            router.push('/paywall');
          }}
          style={styles.premiumCard}
        >
          <LinearGradient colors={[Colors.surfaceDark, '#0E0D0A']} style={styles.premiumGrad}>
            <View style={styles.premiumLeft}>
              <View style={styles.premiumBadge}>
                <MaterialIcons name="workspace-premium" size={11} color={Colors.surfaceDark} />
                <Text style={styles.premiumBadgeText}>ГЛУБОКИЙ РАЗБОР</Text>
              </View>
              <Text style={styles.premiumTitle}>22 раздела полного разбора</Text>
              <Text style={styles.premiumDesc}>Матрица · Деньги · Отношения · Циклы</Text>
            </View>
            <View style={styles.premiumRight}>
              <Text style={styles.premiumPrice}>565 ₽</Text>
              <MaterialIcons name="arrow-forward" size={18} color={Colors.gold} />
            </View>
          </LinearGradient>
        </Pressable>
      ) : (
        <View style={styles.premiumActiveCard}>
          <MaterialIcons name="workspace-premium" size={22} color={Colors.gold} />
          <Text style={styles.premiumActiveText}>Глубокий разбор активировано</Text>
          <Pressable onPress={() => router.push('/report')} style={styles.openReportBtn}>
            <Text style={styles.openReportText}>Открыть</Text>
          </Pressable>
        </View>
      )}

      {/* Settings list */}
      <View style={styles.settingsList}>
        {[
          { icon: 'share', label: 'Поделиться приложением', onPress: () => {} },
          { icon: 'help-outline', label: 'Поддержка и вопросы', onPress: () => {} },
          { icon: 'info-outline', label: 'О системе Цифровой Код', onPress: () => {} },
        ].map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <Pressable onPress={item.onPress} style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.7 }]}>
              <View style={styles.settingIcon}>
                <MaterialIcons name={item.icon as any} size={18} color={Colors.gold} />
              </View>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <MaterialIcons name="chevron-right" size={18} color={Colors.border} style={{ marginLeft: 'auto' }} />
            </Pressable>
            {i < arr.length - 1 ? <View style={styles.settingDivider} /> : null}
          </React.Fragment>
        ))}
        {isAuth ? (
          <>
            <View style={styles.settingDivider} />
            <Pressable onPress={handleLogout} style={({ pressed }) => [styles.settingRow, pressed && { opacity: 0.7 }]}>
              <View style={[styles.settingIcon, styles.settingIconDestructive]}>
                <MaterialIcons name="logout" size={18} color={Colors.error} />
              </View>
              <Text style={[styles.settingLabel, { color: Colors.error }]}>Выйти</Text>
              <MaterialIcons name="chevron-right" size={18} color={Colors.border} style={{ marginLeft: 'auto' }} />
            </Pressable>
          </>
        ) : null}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerBlock}>
        <Text style={styles.disclaimerText}>
          Система «Цифровой Код» — авторский инструмент самоисследования и самопознания.
          Все интерпретации носят информационно-развлекательный характер, основаны на авторской системе
          авторской системе Альберта Анатольевича Вяземского.
          Материалы предназначены для личной рефлексии и не являются профессиональной консультацией.
        </Text>
      </View>

      <Text style={styles.version}>
        Система Цифровой Код · v1.0{'\n'}© Альберт Анатольевич Вяземский
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md, gap: Spacing.lg },

  avatarSection: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
  avatarOuter: {
    width: 88, height: 88, borderRadius: 44, overflow: 'hidden',
    borderWidth: 2, borderColor: Colors.gold + '40', marginBottom: Spacing.sm, ...Shadows.md,
  },
  avatarGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarSigil: { fontSize: 32, color: Colors.gold },
  userName: { ...Typography.heading, color: Colors.textPrimary },
  userEmail: { ...Typography.bodySmall, color: Colors.textMuted },
  guestBlock: { alignItems: 'center', gap: Spacing.sm, maxWidth: 300, marginTop: Spacing.xs },
  guestNotice: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  authBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: 12, ...Shadows.gold,
  },
  authBtnText: { ...Typography.button, color: Colors.surfaceDark, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.borderLight, ...Shadows.sm,
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, gap: 3 },
  statDivider: { width: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },
  statValue: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { ...Typography.caption, color: Colors.textMuted },

  premiumCard: { borderRadius: Radii.xl, overflow: 'hidden', ...Shadows.lg },
  premiumGrad: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  premiumLeft: { flex: 1, gap: Spacing.sm },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 4,
  },
  premiumBadgeText: { ...Typography.label, color: Colors.surfaceDark, fontSize: 9, letterSpacing: 0.8 },
  premiumTitle: { ...Typography.subheading, color: Colors.textLight },
  premiumDesc: { ...Typography.caption, color: Colors.textLightMuted, lineHeight: 18 },
  premiumRight: { alignItems: 'center', gap: Spacing.xs },
  premiumPrice: { fontSize: 18, fontWeight: '700', color: Colors.gold },

  premiumActiveCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold + '10', borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.gold + '40', padding: Spacing.md,
  },
  premiumActiveText: { ...Typography.subheading, color: Colors.gold, flex: 1 },
  openReportBtn: {
    backgroundColor: Colors.gold, borderRadius: Radii.md,
    paddingHorizontal: Spacing.md, paddingVertical: 7,
  },
  openReportText: { ...Typography.label, color: Colors.surfaceDark },

  settingsList: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.borderLight,
    overflow: 'hidden', ...Shadows.sm,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, padding: Spacing.md, minHeight: 52,
  },
  settingIcon: {
    width: 32, height: 32, borderRadius: Radii.sm,
    backgroundColor: Colors.gold + '12', alignItems: 'center', justifyContent: 'center',
  },
  settingIconDestructive: { backgroundColor: Colors.error + '12' },
  settingLabel: { ...Typography.body, color: Colors.textPrimary, flex: 1, fontSize: 15 },
  settingDivider: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: Spacing.md },

  disclaimerBlock: {
    backgroundColor: Colors.surfaceAlt, borderRadius: Radii.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderLight,
  },
  disclaimerText: { ...Typography.caption, color: Colors.textMuted, lineHeight: 18, fontStyle: 'italic' },

  version: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, fontStyle: 'italic', opacity: 0.7 },
});
