import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { Colors, Spacing, Typography, Radii, Shadows, PLANET_COLORS } from '@/constants/theme';
import { SavedReport } from '@/contexts/AppContext';

function EmptyState({ onCalculate }: { onCalculate: () => void }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <MaterialIcons name="bookmark-border" size={36} color={Colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>Пока пусто</Text>
      <Text style={styles.emptyBody}>
        Сделайте расчёт и сохраните разбор — он появится здесь.{'\n'}
        Разборы сохраняются в текущей сессии.
      </Text>
      <Pressable style={styles.emptyBtn} onPress={onCalculate}>
        <Text style={styles.emptyBtnText}>Рассчитать код</Text>
        <MaterialIcons name="arrow-forward" size={16} color={Colors.gold} />
      </Pressable>
    </View>
  );
}

function ReportCard({ report, onOpen, onDelete }: {
  report: SavedReport; onOpen: () => void; onDelete: () => void;
}) {
  const core = report.core;
  const accentColor = core ? (PLANET_COLORS[core.resultFinal] || Colors.gold) : Colors.gold;
  // 5-number formula
  const formula = core
    ? `${core.soulFinal}—${core.expressionFinal}—${core.pathFinal}—${core.directionFinal}—${core.resultFinal}`
    : null;

  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.card, pressed && { opacity: 0.87 }]}>
      <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardName}>{report.name}</Text>
            <Text style={styles.cardDob}>{report.dateOfBirth}</Text>
          </View>
          <View style={styles.cardRight}>
            {formula ? (
              <View style={[styles.formulaBadge, { borderColor: accentColor + '50', backgroundColor: accentColor + '10' }]}>
                <Text style={[styles.formulaText, { color: accentColor }]}>{formula}</Text>
              </View>
            ) : null}
            {report.isPremium ? (
              <View style={styles.premiumBadge}>
                <MaterialIcons name="workspace-premium" size={10} color={Colors.gold} />
                <Text style={styles.premiumBadgeText}>PRO</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardDate}>Сохранено {report.createdAt}</Text>
          <View style={styles.cardActions}>
            <Pressable onPress={onDelete} hitSlop={12} style={styles.deleteBtn}>
              <MaterialIcons name="delete-outline" size={17} color={Colors.textMuted} />
            </Pressable>
            <MaterialIcons name="chevron-right" size={20} color={Colors.border} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { savedReports, deleteReport, runCalculation, user, trackEvent } = useApp();
  const { showAlert } = useAlert();

  const handleOpen = (r: SavedReport) => {
    runCalculation(r.name, r.dateOfBirth);
    trackEvent('report_reopened', { name: r.name });
    router.push('/result');
  };

  const handleDelete = (r: SavedReport) => {
    showAlert(
      'Удалить разбор?',
      `Разбор для «${r.name}» будет удалён без восстановления.`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => deleteReport(r.id) },
      ]
    );
  };

  const isGuest = !user || user.isGuest;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Сохранённые разборы</Text>
        {savedReports.length > 0 ? (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{savedReports.length}</Text>
          </View>
        ) : null}
      </View>

      {isGuest && savedReports.length === 0 ? (
        <View style={styles.guestNotice}>
          <MaterialIcons name="info-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.guestNoticeText}>
            В гостевом режиме разборы сохраняются только в текущей сессии.
          </Text>
          <Pressable onPress={() => router.push('/auth')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Войти</Text>
          </Pressable>
        </View>
      ) : null}

      {savedReports.length === 0 ? (
        <EmptyState onCalculate={() => router.push('/(tabs)/calculate')} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + Spacing.xxl }]}
          showsVerticalScrollIndicator={false}
        >
          {isGuest ? (
            <View style={styles.sessionBanner}>
              <MaterialIcons name="schedule" size={14} color={Colors.textMuted} />
              <Text style={styles.sessionBannerText}>Сохраняется только в текущей сессии</Text>
              <Pressable onPress={() => router.push('/auth')}>
                <Text style={styles.sessionLoginLink}>Войти →</Text>
              </Pressable>
            </View>
          ) : null}
          {savedReports.map(r => (
            <ReportCard key={r.id} report={r} onOpen={() => handleOpen(r)} onDelete={() => handleDelete(r)} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
  },
  title: { ...Typography.title, color: Colors.textPrimary },
  countBadge: {
    backgroundColor: Colors.gold + '20', borderRadius: Radii.full,
    width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
  },
  countText: { ...Typography.label, color: Colors.gold, fontSize: 11 },
  guestNotice: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.md, marginBottom: Spacing.sm,
    backgroundColor: Colors.surfaceAlt, borderRadius: Radii.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderLight,
  },
  guestNoticeText: { ...Typography.caption, color: Colors.textMuted, flex: 1, lineHeight: 18 },
  loginLink: {},
  loginLinkText: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },
  list: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  sessionBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt, borderRadius: Radii.md,
    padding: Spacing.sm, marginBottom: Spacing.sm,
  },
  sessionBannerText: { ...Typography.caption, color: Colors.textMuted, flex: 1 },
  sessionLoginLink: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    flexDirection: 'row', overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.borderLight, ...Shadows.sm,
  },
  cardAccent: { width: 3 },
  cardBody: { flex: 1, padding: Spacing.md, gap: Spacing.sm },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.sm },
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end', gap: 5 },
  cardName: { ...Typography.subheading, color: Colors.textPrimary },
  cardDob: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: 2 },
  formulaBadge: { borderWidth: 1, borderRadius: Radii.sm, paddingHorizontal: 7, paddingVertical: 3 },
  formulaText: { ...Typography.label, fontSize: 10, letterSpacing: 0.5 },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.gold + '15', borderRadius: Radii.full,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  premiumBadgeText: { ...Typography.label, fontSize: 9, color: Colors.gold },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { ...Typography.caption, color: Colors.textMuted },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  deleteBtn: { padding: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xxl, gap: Spacing.md },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  emptyTitle: { ...Typography.heading, color: Colors.textPrimary },
  emptyBody: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.gold + '60', borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: 12, backgroundColor: Colors.gold + '08',
  },
  emptyBtnText: { ...Typography.button, color: Colors.gold },
});
