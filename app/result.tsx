import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { Colors, Spacing, Typography, Radii, PLANET_COLORS, PLANET_NAMES } from '@/constants/theme';
import {
  NUMBER_LABELS, NUMBER_INTERNAL_LABELS, NUMBER_DETAILED,
  NUMBER_POSITION_ESSENCE, EXPRESSION_DETAILED, PLANET_DISCLAIMER,
} from '@/constants/numerology-data';

type Tab = 'passport' | 'numbers' | 'synthesis' | 'depth';

const TABS: { id: Tab; label: string; locked?: boolean }[] = [
  { id: 'passport', label: 'Паспорт' },
  { id: 'numbers', label: 'Числа' },
  { id: 'synthesis', label: 'Синтез' },
  { id: 'depth', label: '★ Глубина', locked: true },
];

// ── Reusable sub-components ─────────────────────────────────────────────────

function SectionTitle({ text }: { text: string }) {
  return <Text style={sectionStyles.title}>{text}</Text>;
}

function DarkCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[cardStyles.root, style]}>{children}</View>;
}

function ChainText({ text }: { text: string }) {
  return <Text style={sectionStyles.chainText}>{text}</Text>;
}

function LockedCard({ title, subtitle, onPress }: { title: string; subtitle?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={lockedStyles.card}>
      <View style={lockedStyles.inner}>
        <MaterialIcons name="lock" size={16} color={Colors.gold} />
        <View style={{ flex: 1 }}>
          <Text style={lockedStyles.title}>{title}</Text>
          {subtitle ? <Text style={lockedStyles.subtitle}>{subtitle}</Text> : null}
        </View>
        <MaterialIcons name="chevron-right" size={18} color={Colors.gold} />
      </View>
    </Pressable>
  );
}

// ── Main screen ─────────────────────────────────────────────────────────────

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, saveCurrentReport, isPremium, trackEvent } = useApp();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<Tab>('passport');
  const [saved, setSaved] = useState(false);

  React.useEffect(() => { trackEvent('result_viewed'); }, [trackEvent]);

  if (!currentSession) {
    return (
      <View style={[styles.noData, { paddingTop: insets.top + Spacing.xxl }]}>
        <MaterialIcons name="calculate" size={48} color={Colors.textMuted} />
        <Text style={styles.noDataTitle}>Нет данных</Text>
        <Pressable
          onPress={() => router.replace('/(tabs)/calculate')}
          style={styles.noDataBtn}
        >
          <Text style={styles.noDataBtnText}>Рассчитать код</Text>
        </Pressable>
      </View>
    );
  }

  const { core, name, dateOfBirth, placeOfBirth, gender } = currentSession;

  const handleSave = () => {
    if (saved) return;
    saveCurrentReport();
    setSaved(true);
    showAlert('Сохранено', `Разбор для «${name}» добавлен в сохранённые`);
  };

  const formula = `${core.soulFinal}—${core.expressionFinal}—${core.pathFinal}—${core.directionFinal}—${core.resultFinal}`;
  const compositeStr = `${core.expressionComposite} / ${core.pathComposite} / ${core.directionComposite} / ${core.resultComposite}`;
  const formulaColor = PLANET_COLORS[core.resultFinal] || Colors.gold;

  const numberRows = [
    { key: 'soul', label: NUMBER_LABELS.soul, internalLabel: NUMBER_INTERNAL_LABELS.soul, desc: 'Внутренняя природа', final: core.soulFinal, composite: core.soulComposite, chain: core.soulChain, position: 'soul' as const, isExpression: false },
    { key: 'expression', label: NUMBER_LABELS.expression, internalLabel: NUMBER_INTERNAL_LABELS.expression, desc: 'Способ проявления', final: core.expressionFinal, composite: core.expressionComposite, chain: core.expressionChain, position: 'expression' as const, isExpression: true },
    { key: 'path', label: NUMBER_LABELS.path, internalLabel: NUMBER_INTERNAL_LABELS.path, desc: 'Движение в мире', final: core.pathFinal, composite: core.pathComposite, chain: core.pathChain, position: 'path' as const, isExpression: false },
    { key: 'direction', label: NUMBER_LABELS.direction, internalLabel: NUMBER_INTERNAL_LABELS.direction, desc: 'Форма раскрытия', final: core.directionFinal, composite: core.directionComposite, chain: core.directionChain, position: 'direction' as const, isExpression: false },
    { key: 'result', label: NUMBER_LABELS.result, internalLabel: NUMBER_INTERNAL_LABELS.result, desc: 'Зрелый итог', final: core.resultFinal, composite: core.resultComposite, chain: core.resultChain, position: 'result' as const, isExpression: false },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top, paddingBottom: insets.bottom + 72 }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* ── Result header ── */}
      <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
              <MaterialIcons name="arrow-back" size={20} color={Colors.textMuted} />
            </Pressable>
            <Pressable onPress={handleSave} style={styles.saveBtn} hitSlop={10}>
              <MaterialIcons name={saved ? 'bookmark' : 'bookmark-border'} size={20} color={saved ? Colors.gold : Colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.headerBody}>
            <Text style={styles.headerLabel}>ЦИФРОВОЙ КОД</Text>
            <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
            <Text style={styles.headerMeta}>
              {dateOfBirth}
              {placeOfBirth ? ` · ${placeOfBirth}` : ''}
              {gender && gender !== 'Не указывать' ? ` · ${gender}` : ''}
            </Text>
          </View>

          {/* Formula display */}
          <View style={styles.formulaArea}>
            <Text style={[styles.formulaNumbers, { color: formulaColor }]}>{formula}</Text>
            <Text style={styles.compositeRow}>составные: {compositeStr}</Text>
            <Text style={styles.formulaLabels}>
              Душа · Выражение · Путь · Направление · Результат
            </Text>
            <Text style={styles.planetDisclaimer}>{PLANET_DISCLAIMER}</Text>
          </View>
        </View>

        {/* ── Tabs (sticky) ── */}
        <View style={styles.tabsWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
            {TABS.map(t => {
              const isActive = activeTab === t.id;
              const isLocked = t.locked && !isPremium;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => {
                    if (isLocked) { trackEvent('paywall_viewed', { source: 'result_tab' }); router.push('/paywall'); return; }
                    setActiveTab(t.id);
                  }}
                  style={[styles.tab, isActive && styles.tabActive]}
                >
                  {isLocked ? <MaterialIcons name="lock" size={10} color={Colors.gold} style={{ marginRight: 3 }} /> : null}
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Tab body ── */}
        <View style={styles.tabBody}>

          {/* PASSPORT */}
          {activeTab === 'passport' ? (
            <View style={styles.section}>
              <DarkCard>
                <Text style={styles.cardTitle}>Цифровой паспорт</Text>
                {numberRows.map((r, idx) => {
                  const color = PLANET_COLORS[r.final] || Colors.gold;
                  const showComp = r.composite !== r.final;
                  return (
                    <View key={r.key} style={[styles.passportRow, idx > 0 && styles.passportRowBorder]}>
                      <View style={[styles.numberCircle, { borderColor: color + '50', backgroundColor: color + '12' }]}>
                        <Text style={[styles.numberFinal, { color }]}>{r.final}</Text>
                        {showComp ? <Text style={[styles.numberComp, { color: color + 'AA' }]}>{r.composite}</Text> : null}
                      </View>
                      <View style={styles.passportInfo}>
                        <Text style={styles.passportLabel}>{r.label}</Text>
                        <Text style={styles.passportInternal}>{r.internalLabel}</Text>
                        <Text style={[styles.passportPlanet, { color }]}>{PLANET_NAMES[r.final]}</Text>
                      </View>
                      {r.isExpression ? (
                        <View style={styles.authorTag}>
                          <Text style={styles.authorTagText}>авт.</Text>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </DarkCard>

              {/* Chains */}
              <DarkCard>
                <Text style={styles.cardTitle}>Цепочки расчёта</Text>
                {numberRows.map(r => {
                  const color = PLANET_COLORS[r.final] || Colors.gold;
                  const showComp = r.composite !== r.final;
                  return (
                    <View key={r.key} style={styles.chainRow}>
                      <View style={styles.chainLeft}>
                        <Text style={styles.chainLabel}>{r.label}</Text>
                        <ChainText text={r.chain} />
                      </View>
                      <View style={[styles.chainBadge, { borderColor: color + '50' }]}>
                        <Text style={[styles.chainBadgeText, { color }]}>
                          {showComp ? `${r.composite}→${r.final}` : String(r.final)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </DarkCard>

              {/* Module quick access */}
              <View style={styles.quickRow}>
                {[
                  { icon: 'grid-4x4', label: 'Матрица', route: '/matrix-detail', event: 'matrix_opened' },
                  { icon: 'autorenew', label: 'Циклы', route: '/cycles', event: 'cycles_opened' },
                  { icon: 'payments', label: 'Деньги', route: '/money-code', event: 'money_opened' },
                ].map(m => (
                  <Pressable
                    key={m.label}
                    style={({ pressed }) => [styles.quickBtn, pressed && { opacity: 0.75 }]}
                    onPress={() => { trackEvent(m.event); router.push(m.route as any); }}
                  >
                    <MaterialIcons name={m.icon as any} size={20} color={Colors.gold} />
                    <Text style={styles.quickBtnText}>{m.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* NUMBERS */}
          {activeTab === 'numbers' ? (
            <View style={styles.section}>
              {numberRows.map(r => {
                const data = NUMBER_DETAILED[r.final];
                const exprData = r.isExpression ? EXPRESSION_DETAILED[r.final] : null;
                const color = PLANET_COLORS[r.final] || Colors.gold;
                const posEssence = NUMBER_POSITION_ESSENCE[r.position]?.[r.final];
                const showComp = r.composite !== r.final;
                return (
                  <DarkCard key={r.key}>
                    <View style={styles.numHeader}>
                      <View style={[styles.numCircle, { borderColor: color + '60', backgroundColor: color + '10' }]}>
                        <Text style={[styles.numFinal, { color }]}>{r.final}</Text>
                        {showComp ? <Text style={[styles.numCompSub, { color: color + 'AA' }]}>{r.composite}</Text> : null}
                      </View>
                      <View style={styles.numTitleBlock}>
                        <View style={styles.numLabelRow}>
                          <Text style={styles.numLabel}>{r.label}</Text>
                          {r.isExpression ? (
                            <View style={styles.authorChip}>
                              <Text style={styles.authorChipText}>авторское</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.numInternal}>{r.internalLabel}</Text>
                        <Text style={[styles.numPlanet, { color }]}>{PLANET_NAMES[r.final]} · {r.desc}</Text>
                      </View>
                    </View>

                    <View style={styles.numChainBox}>
                      <Text style={styles.numChainLabel}>Расчёт</Text>
                      <ChainText text={r.chain} />
                    </View>

                    <View style={styles.numDivider} />
                    {posEssence ? <Text style={styles.numEssence}>{posEssence}</Text> : null}

                    <View style={styles.lsRow}>
                      <View style={[styles.lsBox, { borderColor: color + '30', backgroundColor: color + '0A' }]}>
                        <Text style={[styles.lsTag, { color }]}>Свет</Text>
                        <Text style={styles.lsText}>{exprData ? exprData.light : data?.light}</Text>
                      </View>
                      <View style={[styles.lsBox, { borderColor: Colors.borderLight, backgroundColor: Colors.surfaceAlt }]}>
                        <Text style={[styles.lsTag, { color: Colors.textMuted }]}>Напряжение</Text>
                        <Text style={styles.lsText}>{exprData ? exprData.shadow : data?.shadow}</Text>
                      </View>
                    </View>

                    <View style={styles.orientBox}>
                      <Text style={styles.orientLabel}>Практический ориентир</Text>
                      <Text style={styles.orientText}>
                        {exprData ? exprData.practicalOrientation : data?.practicalOrientation}
                      </Text>
                    </View>

                    {r.isExpression ? (
                      <Text style={styles.exprNote}>
                        * Авторское расширение системы — показывает способ проявления внутренней природы в мире. Не является астрологическим прогнозом.
                      </Text>
                    ) : null}
                  </DarkCard>
                );
              })}
            </View>
          ) : null}

          {/* SYNTHESIS */}
          {activeTab === 'synthesis' ? (
            <View style={styles.section}>
              <SectionTitle text="Ключевой вектор" />
              <DarkCard style={styles.vectorCard}>
                {[
                  { pos: 'soul', num: core.soulFinal, label: NUMBER_LABELS.soul },
                  { pos: 'expression', num: core.expressionFinal, label: NUMBER_LABELS.expression },
                  { pos: 'path', num: core.pathFinal, label: NUMBER_LABELS.path },
                  { pos: 'direction', num: core.directionFinal, label: NUMBER_LABELS.direction },
                  { pos: 'result', num: core.resultFinal, label: NUMBER_LABELS.result },
                ].map((v, i) => {
                  const essence = NUMBER_POSITION_ESSENCE[v.pos as keyof typeof NUMBER_POSITION_ESSENCE]?.[v.num];
                  const color = PLANET_COLORS[v.num] || Colors.gold;
                  return (
                    <View key={v.pos} style={[styles.vectorRow, i > 0 && styles.vectorRowBorder]}>
                      <View style={[styles.vectorDot, { backgroundColor: color }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.vectorPlanet, { color }]}>
                          {PLANET_NAMES[v.num]} · {v.label}
                        </Text>
                        {essence ? <Text style={styles.vectorEssence}>{essence}</Text> : null}
                      </View>
                    </View>
                  );
                })}
              </DarkCard>

              <SectionTitle text="Сильные стороны" />
              <DarkCard>
                {[
                  `Природа ${PLANET_NAMES[core.soulFinal]} в основе — внутренний стержень и опора`,
                  `Выражение через ${PLANET_NAMES[core.expressionFinal]} (${core.expressionComposite}→${core.expressionFinal}) — способ проявления, который работает`,
                  `${NUMBER_LABELS.direction} через ${PLANET_NAMES[core.directionFinal]} (${core.directionComposite}→${core.directionFinal}) — подлинная, а не случайная`,
                ].map((s, i) => (
                  <View key={i} style={[styles.bullet, i > 0 && styles.bulletDivider]}>
                    <View style={[styles.bulletDot, { backgroundColor: Colors.gold }]} />
                    <Text style={styles.bulletText}>{s}</Text>
                  </View>
                ))}
              </DarkCard>

              <LockedCard
                title="Зоны напряжения · Практические ориентиры · Вектор развития"
                subtitle="Открывается в Большом исследовании"
                onPress={() => { trackEvent('paywall_viewed', { source: 'synthesis' }); router.push('/paywall'); }}
              />
            </View>
          ) : null}
        </View>

        {/* ── Upsell ── */}
        <Pressable
          onPress={() => { trackEvent('paywall_viewed', { source: 'result_upsell' }); router.push(isPremium ? '/report' : '/paywall'); }}
          style={({ pressed }) => [styles.upsell, pressed && { opacity: 0.9 }]}
        >
          <View style={styles.upsellInner}>
            <MaterialIcons name="workspace-premium" size={24} color={Colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upsellTitle}>Глубокий разбор</Text>
              <Text style={styles.upsellDesc}>
                Составные {core.expressionComposite}/{core.pathComposite}/{core.directionComposite}/{core.resultComposite} · матрица · циклы · деньги
              </Text>
            </View>
            <View style={styles.upsellPrice}>
              {isPremium
                ? <MaterialIcons name="check-circle" size={22} color={Colors.gold} />
                : <Text style={styles.upsellPriceText}>650 ₽</Text>}
            </View>
          </View>
        </Pressable>

        <Text style={styles.legal}>
          Система «Цифровой Код» носит информационно-развлекательный и самоисследовательский характер. Не является медицинской, психологической, финансовой или юридической консультацией.
        </Text>
      </ScrollView>

      {/* Fixed bottom bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 4 }]}>
        {[
          { icon: saved ? 'bookmark' : 'bookmark-border', label: saved ? 'Сохранено' : 'Сохранить', onPress: handleSave, active: saved },
          { icon: 'grid-4x4', label: 'Матрица', onPress: () => { trackEvent('matrix_opened'); router.push('/matrix-detail'); }, active: false },
          { icon: 'autorenew', label: 'Циклы', onPress: () => { trackEvent('cycles_opened'); router.push('/cycles'); }, active: false },
          { icon: 'payments', label: 'Деньги', onPress: () => { trackEvent('money_opened'); router.push('/money-code'); }, active: false },
        ].map(a => (
          <Pressable key={a.label} onPress={a.onPress} style={styles.actionBtn}>
            <MaterialIcons name={a.icon as any} size={18} color={a.active ? Colors.gold : Colors.textMuted} />
            <Text style={[styles.actionBtnText, a.active && { color: Colors.gold }]}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ── Sub-styles ───────────────────────────────────────────────────────────────

const sectionStyles = StyleSheet.create({
  title: { ...Typography.subheading, color: Colors.textSecondary, marginBottom: Spacing.xs, marginTop: Spacing.sm },
  chainText: { ...Typography.mono, color: Colors.textMuted },
});

const cardStyles = StyleSheet.create({
  root: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
  },
});

const lockedStyles = StyleSheet.create({
  card: {
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.goldTint,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  title: { ...Typography.bodySmall, color: Colors.gold, fontWeight: '600' },
  subtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
});

// ── Main styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { gap: 0 },
  content: { gap: 0 },

  noData: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg, backgroundColor: Colors.background },
  noDataTitle: { ...Typography.heading, color: Colors.textSecondary },
  noDataBtn: {
    backgroundColor: Colors.gold, borderRadius: Radii.lg,
    paddingHorizontal: Spacing.xl, paddingVertical: 14,
  },
  noDataBtnText: { ...Typography.button, color: Colors.background, fontWeight: '700' },

  // Header
  header: { backgroundColor: Colors.surfaceDark, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl, gap: Spacing.sm },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md },
  backBtn: { padding: 4 },
  saveBtn: { padding: 4 },
  headerBody: { gap: 3 },
  headerLabel: { ...Typography.label, color: Colors.gold },
  headerName: { ...Typography.display, color: Colors.textPrimary, fontSize: 28 },
  headerMeta: { ...Typography.caption, color: Colors.textMuted },

  formulaArea: { marginTop: Spacing.sm, gap: 4 },
  formulaNumbers: { fontSize: 28, fontWeight: '700', letterSpacing: 4 },
  formulaLabels: { ...Typography.label, color: Colors.textDisabled, fontSize: 9, letterSpacing: 0.8 },
  compositeRow: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic', fontSize: 11 },
  planetDisclaimer: { ...Typography.caption, color: Colors.textDisabled, fontSize: 9, fontStyle: 'italic', lineHeight: 13, opacity: 0.8 },

  // Tabs
  tabsWrap: {
    backgroundColor: Colors.surfaceDark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm, gap: Spacing.sm },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabActive: { borderColor: Colors.border, backgroundColor: Colors.goldTint },
  tabText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '500' },
  tabTextActive: { color: Colors.gold, fontWeight: '600' },

  tabBody: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  section: { gap: Spacing.md, paddingBottom: Spacing.lg },

  cardTitle: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.xs },

  // Passport rows
  passportRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 10 },
  passportRowBorder: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  numberCircle: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  numberFinal: { fontSize: 22, fontWeight: '700', lineHeight: 26 },
  numberComp: { fontSize: 10, lineHeight: 12 },
  passportInfo: { flex: 1 },
  passportLabel: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  passportInternal: { ...Typography.caption, color: Colors.textMuted, marginTop: 1 },
  passportPlanet: { ...Typography.caption, fontWeight: '600', marginTop: 2 },
  authorTag: {
    backgroundColor: Colors.goldTint, borderRadius: Radii.full,
    paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.border,
  },
  authorTagText: { ...Typography.caption, color: Colors.gold, fontSize: 9 },

  // Chain rows
  chainRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, paddingVertical: 6 },
  chainLeft: { flex: 1 },
  chainLabel: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600', marginBottom: 2 },
  chainBadge: { borderWidth: 1, borderRadius: Radii.sm, paddingHorizontal: 7, paddingVertical: 3 },
  chainBadgeText: { ...Typography.label, fontSize: 10 },

  // Module quick buttons
  quickRow: { flexDirection: 'row', gap: Spacing.sm },
  quickBtn: {
    flex: 1, alignItems: 'center', gap: 5,
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.borderLight, paddingVertical: Spacing.md,
  },
  quickBtnText: { ...Typography.caption, color: Colors.textMuted },

  // Number cards
  numHeader: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  numCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  numFinal: { fontSize: 28, fontWeight: '700', lineHeight: 32 },
  numCompSub: { fontSize: 11, lineHeight: 14 },
  numTitleBlock: { flex: 1 },
  numLabelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  numLabel: { ...Typography.heading, color: Colors.textPrimary },
  authorChip: {
    backgroundColor: Colors.goldTint, borderRadius: Radii.full,
    paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.border,
  },
  authorChipText: { ...Typography.caption, color: Colors.gold, fontSize: 9 },
  numInternal: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  numPlanet: { ...Typography.caption, fontWeight: '600', marginTop: 3 },
  numChainBox: {
    backgroundColor: Colors.surfaceAlt, borderRadius: Radii.sm,
    padding: Spacing.sm, marginTop: 4,
  },
  numChainLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: 3 },
  numDivider: { height: 1, backgroundColor: Colors.borderLight },
  numEssence: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  lsRow: { flexDirection: 'row', gap: Spacing.sm },
  lsBox: { flex: 1, borderRadius: Radii.sm, borderWidth: 1, padding: Spacing.sm, gap: 4 },
  lsTag: { ...Typography.label, fontSize: 10 },
  lsText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  orientBox: {
    backgroundColor: Colors.goldGlow, borderRadius: Radii.sm,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.sm,
  },
  orientLabel: { ...Typography.label, color: Colors.gold, marginBottom: 4 },
  orientText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  exprNote: { ...Typography.caption, color: Colors.textDisabled, fontStyle: 'italic', lineHeight: 16 },

  // Synthesis
  vectorCard: { gap: 0 },
  vectorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, paddingVertical: 10 },
  vectorRowBorder: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  vectorDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  vectorPlanet: { ...Typography.bodySmall, fontWeight: '600' },
  vectorEssence: { ...Typography.caption, color: Colors.textMuted, lineHeight: 18, marginTop: 3 },
  bullet: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 10, alignItems: 'flex-start' },
  bulletDivider: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  bulletText: { ...Typography.bodySmall, color: Colors.textPrimary, flex: 1, lineHeight: 22 },

  // Upsell
  upsell: {
    margin: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  upsellInner: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  upsellTitle: { ...Typography.subheading, color: Colors.textPrimary },
  upsellDesc: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  upsellPrice: {},
  upsellPriceText: { fontSize: 17, fontWeight: '700', color: Colors.gold },

  legal: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', lineHeight: 18, fontSize: 10,
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg,
  },

  // Action bar
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.surfaceDark,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    paddingTop: Spacing.xs,
  },
  actionBtn: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: Spacing.sm },
  actionBtnText: { ...Typography.caption, color: Colors.textMuted, fontSize: 10 },
});
