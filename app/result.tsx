import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import {
  Colors, Spacing, Typography, Radii, Shadows,
  PLANET_COLORS, PLANET_NAMES,
} from '@/constants/theme';
import {
  NUMBER_LABELS, NUMBER_INTERNAL_LABELS, NUMBER_DETAILED,
  NUMBER_POSITION_ESSENCE, EXPRESSION_DETAILED, PLANET_DISCLAIMER,
} from '@/constants/numerology-data';

type Tab = 'passport' | 'numbers' | 'synthesis' | 'depth';

const TABS: { id: Tab; label: string; premium?: boolean }[] = [
  { id: 'passport',  label: 'Паспорт' },
  { id: 'numbers',   label: 'Числа' },
  { id: 'synthesis', label: 'Синтез' },
  { id: 'depth',     label: '✦ Глубина', premium: true },
];

// ── Animated glow circle ──────────────────────────────────────────────────────

function GlowCircle({ final: n, composite, color }: { final: number; composite: number; color: string }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.07, duration: 2400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2400, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const showComp = composite !== n;
  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <View style={[gc.halo, { borderColor: color + '22' }]}>
        <View style={[gc.ring, { borderColor: color + '50', backgroundColor: color + '0E' }]}>
          <Text style={[gc.num, { color }]}>{n}</Text>
          {showComp ? <Text style={[gc.comp, { color: color + 'BB' }]}>{composite}</Text> : null}
        </View>
      </View>
    </Animated.View>
  );
}
const gc = StyleSheet.create({
  halo: { width: 76, height: 76, borderRadius: 38, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ring: { width: 62, height: 62, borderRadius: 31, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 26, fontWeight: '700', lineHeight: 30 },
  comp: { fontSize: 10, lineHeight: 13 },
});

// ── Sub-components ────────────────────────────────────────────────────────────

function SH({ label, title }: { label: string; title: string }) {
  return (
    <View style={sub.sh}>
      <Text style={sub.shLabel}>{label}</Text>
      <Text style={sub.shTitle}>{title}</Text>
    </View>
  );
}

function GCard({ children, style, accent }: { children: React.ReactNode; style?: any; accent?: string }) {
  return (
    <View style={[sub.card, accent ? { borderColor: accent + '30' } : {}, style]}>
      {children}
    </View>
  );
}

function LockedTeaser({ title, sub: subtitle, onPress }: { title: string; sub?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={sub.lockedCard}>
      <View style={sub.lockedInner}>
        <MaterialIcons name="lock" size={16} color={Colors.gold} />
        <View style={{ flex: 1 }}>
          <Text style={sub.lockedTitle}>{title}</Text>
          {subtitle ? <Text style={sub.lockedSub}>{subtitle}</Text> : null}
        </View>
        <MaterialIcons name="arrow-forward" size={16} color={Colors.gold} />
      </View>
    </Pressable>
  );
}

const sub = StyleSheet.create({
  sh: { gap: 3, marginBottom: Spacing.xs },
  shLabel: { ...Typography.label, color: Colors.gold, letterSpacing: 1.5 },
  shTitle: { ...Typography.heading, color: Colors.textPrimary },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, gap: Spacing.sm,
  },
  lockedCard: {
    backgroundColor: Colors.goldTint, borderRadius: Radii.xl,
    borderWidth: 1.5, borderColor: Colors.border, overflow: 'hidden',
  },
  lockedInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  lockedTitle: { ...Typography.bodySmall, color: Colors.gold, fontWeight: '600' },
  lockedSub: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, saveCurrentReport, isPremium, trackEvent } = useApp();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<Tab>('passport');
  const [saved, setSaved] = useState(false);
  const heroFade = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    trackEvent('result_viewed');
    Animated.timing(heroFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  if (!currentSession) {
    return (
      <View style={[styles.noData, { paddingTop: insets.top + Spacing.xxl }]}>
        <MaterialIcons name="calculate" size={52} color={Colors.textMuted} />
        <Text style={styles.noDataTitle}>Нет данных</Text>
        <Pressable onPress={() => router.replace('/(tabs)/calculate')} style={styles.noDataBtn}>
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
    showAlert('Сохранено', `Разбор «${name}» добавлен в сохранённые`);
  };

  const formulaColor = PLANET_COLORS[core.resultFinal] || Colors.gold;

  const numberRows = [
    { key: 'soul',       label: NUMBER_LABELS.soul,       internalLabel: NUMBER_INTERNAL_LABELS.soul,       desc: 'Внутренняя природа', final: core.soulFinal,       composite: core.soulComposite,       chain: core.soulChain,       position: 'soul' as const,       isExpr: false },
    { key: 'expression', label: NUMBER_LABELS.expression, internalLabel: NUMBER_INTERNAL_LABELS.expression, desc: 'Способ проявления',   final: core.expressionFinal, composite: core.expressionComposite, chain: core.expressionChain, position: 'expression' as const, isExpr: true  },
    { key: 'path',       label: NUMBER_LABELS.path,       internalLabel: NUMBER_INTERNAL_LABELS.path,       desc: 'Движение в мире',     final: core.pathFinal,       composite: core.pathComposite,       chain: core.pathChain,       position: 'path' as const,       isExpr: false },
    { key: 'direction',  label: NUMBER_LABELS.direction,  internalLabel: NUMBER_INTERNAL_LABELS.direction,  desc: 'Форма раскрытия',     final: core.directionFinal,  composite: core.directionComposite,  chain: core.directionChain,  position: 'direction' as const,  isExpr: false },
    { key: 'result',     label: NUMBER_LABELS.result,     internalLabel: NUMBER_INTERNAL_LABELS.result,     desc: 'Зрелый итог',         final: core.resultFinal,     composite: core.resultComposite,     chain: core.resultChain,     position: 'result' as const,     isExpr: false },
  ];

  const switchTab = (id: Tab) => {
    setActiveTab(id);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top, paddingBottom: insets.bottom + 72 }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* ── Result header ─────────────────────────────────────────── */}
        <Animated.View style={[styles.header, { opacity: heroFade }]}>
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
              <MaterialIcons name="arrow-back" size={20} color={Colors.textMuted} />
            </Pressable>
            <Pressable onPress={handleSave} style={styles.saveBtn} hitSlop={12}>
              <MaterialIcons
                name={saved ? 'bookmark' : 'bookmark-border'}
                size={20}
                color={saved ? Colors.gold : Colors.textMuted}
              />
            </Pressable>
          </View>

          {/* Identity */}
          <View style={styles.heroIdentity}>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>ЦИФРОВОЙ КОД</Text>
            </View>
            <Text style={styles.heroName} numberOfLines={1}>{name}</Text>
            <Text style={styles.heroMeta}>
              {dateOfBirth}
              {placeOfBirth ? ` · ${placeOfBirth}` : ''}
              {gender && gender !== 'Не указывать' ? ` · ${gender}` : ''}
            </Text>
          </View>

          {/* Five-position formula */}
          <View style={styles.formulaArea}>
            <View style={styles.formulaRow}>
              {numberRows.map((r, i) => {
                const color = PLANET_COLORS[r.final] || Colors.gold;
                const showComp = r.composite !== r.final;
                return (
                  <React.Fragment key={r.key}>
                    <View style={styles.fNode}>
                      <View style={[styles.fCircle, { borderColor: color + '50', backgroundColor: color + '0E' }]}>
                        <Text style={[styles.fNum, { color }]}>{r.final}</Text>
                        {showComp ? <Text style={[styles.fComp, { color: color + 'AA' }]}>{r.composite}</Text> : null}
                      </View>
                      <Text style={styles.fRoleLabel}>{r.label.replace('Число ', '')}</Text>
                    </View>
                    {i < numberRows.length - 1 ? (
                      <View style={styles.fConnector} />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </View>
            <Text style={styles.compositeNote}>
              составные: {core.expressionComposite} / {core.pathComposite} / {core.directionComposite} / {core.resultComposite}
            </Text>
            <Text style={styles.planetNote}>{PLANET_DISCLAIMER}</Text>
          </View>
        </Animated.View>

        {/* ── Sticky tabs ───────────────────────────────────────────── */}
        <View style={styles.tabsWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {TABS.map(t => {
              const isActive = activeTab === t.id;
              const isLocked = t.premium && !isPremium;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => {
                    if (isLocked) { trackEvent('paywall_viewed', { source: 'result_tab' }); router.push('/paywall'); return; }
                    switchTab(t.id);
                  }}
                  style={[styles.tab, isActive && styles.tabActive, t.premium && styles.tabPremium]}
                >
                  {isLocked ? <MaterialIcons name="lock" size={9} color={Colors.gold} style={{ marginRight: 3 }} /> : null}
                  <Text style={[styles.tabText, isActive && styles.tabTextActive, t.premium && !isActive && styles.tabTextPremium]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Tab body ──────────────────────────────────────────────── */}
        <View style={styles.tabBody}>

          {/* ── PASSPORT ────────────────────────────────────────────── */}
          {activeTab === 'passport' ? (
            <View style={styles.section}>
              <SH label="ЦИФРОВОЙ ПАСПОРТ" title="Пять позиций" />

              {/* Premium overview card */}
              <LinearGradient colors={[Colors.surfaceDark, Colors.background]} style={styles.passportHeroCard}>
                <View style={styles.passportHeroTop}>
                  <View style={styles.passportHeroIdent}>
                    <Text style={styles.passportHeroName}>{name}</Text>
                    <Text style={styles.passportHeroDob}>{dateOfBirth}</Text>
                  </View>
                  <View style={[styles.passportHeroBadge, { borderColor: formulaColor + '40' }]}>
                    <Text style={[styles.passportHeroFormula, { color: formulaColor }]}>
                      {core.soulFinal}—{core.expressionFinal}{'\n'}{core.pathFinal}—{core.directionFinal}—{core.resultFinal}
                    </Text>
                  </View>
                </View>
                <View style={styles.passportHeroDivider} />
                {/* Five position rows compact */}
                {numberRows.map((r, i) => {
                  const color = PLANET_COLORS[r.final] || Colors.gold;
                  const showComp = r.composite !== r.final;
                  return (
                    <View key={r.key} style={[styles.passportMiniRow, i > 0 && styles.passportMiniRowBorder]}>
                      <View style={[styles.passportMiniCircle, { borderColor: color + '40', backgroundColor: color + '0A' }]}>
                        <Text style={[styles.passportMiniFinal, { color }]}>{r.final}</Text>
                        {showComp ? <Text style={[styles.passportMiniComp, { color: color + 'AA' }]}>{r.composite}</Text> : null}
                      </View>
                      <View style={styles.passportMiniInfo}>
                        <Text style={styles.passportMiniLabel}>{r.label}</Text>
                        <Text style={styles.passportMiniDesc}>{r.desc}</Text>
                      </View>
                      <View style={styles.passportMiniRight}>
                        <Text style={[styles.passportMiniPlanet, { color }]}>{PLANET_NAMES[r.final]}</Text>
                        {r.isExpr ? <View style={styles.authorChip}><Text style={styles.authorChipText}>авт.</Text></View> : null}
                      </View>
                    </View>
                  );
                })}
              </LinearGradient>

              {/* Calculation chains */}
              <SH label="ФОРМУЛА" title="Цепочки расчёта" />
              <GCard>
                {numberRows.map((r, i) => {
                  const color = PLANET_COLORS[r.final] || Colors.gold;
                  const showComp = r.composite !== r.final;
                  return (
                    <View key={r.key} style={[styles.chainRow, i > 0 && styles.chainRowBorder]}>
                      <View style={styles.chainLeft}>
                        <Text style={styles.chainLabel}>{r.label}</Text>
                        <Text style={styles.chainText}>{r.chain}</Text>
                      </View>
                      <View style={[styles.chainBadge, { borderColor: color + '50' }]}>
                        <Text style={[styles.chainBadgeText, { color }]}>
                          {showComp ? `${r.composite}→${r.final}` : String(r.final)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </GCard>

              {/* Module shortcuts */}
              <SH label="МОДУЛИ" title="Глубже по теме" />
              <View style={styles.quickRow}>
                {[
                  { icon: 'grid-4x4', label: 'Матрица', route: '/matrix-detail' },
                  { icon: 'autorenew', label: 'Циклы',   route: '/cycles' },
                  { icon: 'payments', label: 'Деньги',  route: '/money-code' },
                ].map(m => (
                  <Pressable
                    key={m.label}
                    style={({ pressed }) => [styles.quickBtn, pressed && { opacity: 0.75 }]}
                    onPress={() => router.push(m.route as any)}
                  >
                    <View style={styles.quickBtnIcon}>
                      <MaterialIcons name={m.icon as any} size={20} color={Colors.gold} />
                    </View>
                    <Text style={styles.quickBtnText}>{m.label}</Text>
                    <MaterialIcons name="chevron-right" size={14} color={Colors.textDisabled} />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {/* ── NUMBERS ─────────────────────────────────────────────── */}
          {activeTab === 'numbers' ? (
            <View style={styles.section}>
              <SH label="ЧИСЛА" title="Детальный разбор" />
              {numberRows.map(r => {
                const data = NUMBER_DETAILED[r.final];
                const exprData = r.isExpr ? EXPRESSION_DETAILED[r.final] : null;
                const color = PLANET_COLORS[r.final] || Colors.gold;
                const posEssence = NUMBER_POSITION_ESSENCE[r.position]?.[r.final];
                const showComp = r.composite !== r.final;
                return (
                  <GCard key={r.key} accent={color}>
                    {/* Header */}
                    <View style={styles.numCardHead}>
                      <GlowCircle final={r.final} composite={r.composite} color={color} />
                      <View style={styles.numCardHeadText}>
                        <View style={styles.numLabelRow}>
                          <Text style={styles.numLabel}>{r.label}</Text>
                          {r.isExpr ? (
                            <View style={styles.authorChip}><Text style={styles.authorChipText}>авт.</Text></View>
                          ) : null}
                        </View>
                        <Text style={[styles.numPlanetLine, { color }]}>
                          {PLANET_NAMES[r.final]} · {r.desc}
                        </Text>
                        <View style={styles.numChainInline}>
                          <Text style={styles.numChainText}>{r.chain}</Text>
                        </View>
                      </View>
                    </View>

                    {posEssence ? (
                      <>
                        <View style={styles.divider} />
                        <Text style={styles.numEssence}>{posEssence}</Text>
                      </>
                    ) : null}

                    <View style={styles.lsRow}>
                      <View style={[styles.lsBox, { borderColor: color + '28', backgroundColor: color + '08' }]}>
                        <Text style={[styles.lsTag, { color }]}>Свет</Text>
                        <Text style={styles.lsText}>{exprData ? exprData.light : data?.light}</Text>
                      </View>
                      <View style={[styles.lsBox, { borderColor: Colors.borderLight }]}>
                        <Text style={[styles.lsTag, { color: Colors.textMuted }]}>Напряжение</Text>
                        <Text style={styles.lsText}>{exprData ? exprData.shadow : data?.shadow}</Text>
                      </View>
                    </View>

                    <View style={[styles.orientBox, { borderColor: color + '20', backgroundColor: color + '06' }]}>
                      <Text style={[styles.orientTag, { color }]}>Практический ориентир</Text>
                      <Text style={styles.orientText}>
                        {exprData ? exprData.practicalOrientation : data?.practicalOrientation}
                      </Text>
                    </View>

                    {r.isExpr ? (
                      <Text style={styles.exprNote}>
                        * Авторское расширение системы — показывает способ проявления. Не является астрологическим прогнозом.
                      </Text>
                    ) : null}
                  </GCard>
                );
              })}
            </View>
          ) : null}

          {/* ── SYNTHESIS ───────────────────────────────────────────── */}
          {activeTab === 'synthesis' ? (
            <View style={styles.section}>
              <SH label="СИНТЕЗ" title="Что всё это вместе" />

              {/* Hero synthesis */}
              <LinearGradient colors={[Colors.surfaceDark, '#0E0D0A']} style={styles.synthHero}>
                <View style={styles.synthHeroBadge}>
                  <Text style={styles.synthHeroBadgeText}>КЛЮЧЕВОЙ ВЕКТОР</Text>
                </View>
                <Text style={[styles.synthHeroFormula, { color: formulaColor }]}>
                  {core.soulFinal} — {core.expressionFinal} — {core.pathFinal} — {core.directionFinal} — {core.resultFinal}
                </Text>
                <Text style={styles.synthHeroSub}>{name} · {dateOfBirth}</Text>
                <View style={styles.synthHeroDivider} />
                <Text style={styles.synthHeroVec}>
                  {PLANET_NAMES[core.soulFinal]} внутри — {PLANET_NAMES[core.expressionFinal]} в выражении —{' '}
                  {PLANET_NAMES[core.pathFinal]} на пути — {PLANET_NAMES[core.directionFinal]} в направлении —{' '}
                  {PLANET_NAMES[core.resultFinal]} как результат.
                </Text>
              </LinearGradient>

              <SH label="ГЛАВНАЯ СИЛА" title="Ресурс" />
              <GCard accent={PLANET_COLORS[core.soulFinal]}>
                {[
                  { pos: 'soul',       num: core.soulFinal,       text: `Природа ${PLANET_NAMES[core.soulFinal]} в основе — внутренний стержень и опора. Создаёт качество жизни, а не только результат.` },
                  { pos: 'expression', num: core.expressionFinal,  text: `${PLANET_NAMES[core.expressionFinal]} в выражении (${core.expressionComposite}→${core.expressionFinal}) — сила раскрывается через присутствие, не через давление.` },
                  { pos: 'direction',  num: core.directionFinal,   text: `${NUMBER_LABELS.direction} через ${PLANET_NAMES[core.directionFinal]} (${core.directionComposite}→${core.directionFinal}) — подлинная, а не случайная, через коммуникацию.` },
                  { pos: 'result',     num: core.resultFinal,      text: `${PLANET_NAMES[core.resultFinal]} как Результат (${core.resultComposite}→${core.resultFinal}) — зрелая автономия и право вести собственный курс.` },
                ].map((b, i, arr) => {
                  const color = PLANET_COLORS[b.num] || Colors.gold;
                  return (
                    <View key={b.pos} style={[styles.bulletRow, i < arr.length - 1 && styles.bulletDivider]}>
                      <View style={[styles.bulletDot, { backgroundColor: color }]} />
                      <Text style={styles.bulletText}>{b.text}</Text>
                    </View>
                  );
                })}
              </GCard>

              <SH label="ГЛАВНОЕ НАПРЯЖЕНИЕ" title="Зона задачи" />
              <GCard accent={PLANET_COLORS[core.pathFinal]}>
                <Text style={styles.tensionText}>
                  {PLANET_NAMES[core.soulFinal]} хочет красоты и качества. {PLANET_NAMES[core.expressionFinal]} ищет отклика.{' '}
                  {PLANET_NAMES[core.pathFinal]} требует дисциплины. {PLANET_NAMES[core.directionFinal]} тянет в расширение.{' '}
                  {PLANET_NAMES[core.resultFinal]} требует собственного курса.
                </Text>
                <View style={[styles.vectorBox, { borderColor: PLANET_COLORS[core.pathFinal] + '28', backgroundColor: PLANET_COLORS[core.pathFinal] + '07' }]}>
                  <Text style={[styles.vectorLabel, { color: PLANET_COLORS[core.pathFinal] }]}>Практический вектор</Text>
                  <Text style={styles.vectorText}>
                    Собрать свою систему — не разрушать её в поисках идеальных условий. Выйти с ней в мир через слово, объяснение или публичное присутствие.
                  </Text>
                </View>
              </GCard>

              <SH label="КАК МЕНЯ ВИДЯТ" title="Внешнее впечатление" />
              <GCard>
                <Text style={styles.synthBodyText}>
                  Человек с теплотой и вкусом, который умеет создавать хорошую атмосферу. Заметен через качество присутствия.
                  Первое впечатление — надёжный, внимательный, с ощущением стиля и системности.
                </Text>
              </GCard>

              <SH label="ГДЕ Я РАСКРЫВАЮСЬ" title="Точка потока" />
              <GCard>
                <Text style={styles.synthBodyText}>
                  Раскрытие происходит там, где есть диалог, доверие и возможность объяснять.
                  Не в одиночестве и не в хаосе — а в структурированном контакте с людьми, где слово передаёт смысл.
                </Text>
              </GCard>

              <LockedTeaser
                title="Что мне нельзя терять · Практический план на ближайший период"
                sub="Открывается в Большом исследовании"
                onPress={() => { trackEvent('paywall_viewed', { source: 'synthesis' }); router.push('/paywall'); }}
              />
            </View>
          ) : null}

        </View>

        {/* ── Upsell banner ─────────────────────────────────────────── */}
        <Pressable
          onPress={() => { trackEvent('paywall_viewed', { source: 'result_upsell' }); router.push(isPremium ? '/report' : '/paywall'); }}
          style={({ pressed }) => [styles.upsell, pressed && { opacity: 0.88 }]}
        >
          <LinearGradient
            colors={[Colors.surfaceDark, Colors.background]}
            style={styles.upsellGrad}
          >
            <View style={styles.upsellLeft}>
              <View style={styles.upsellBadge}>
                <MaterialIcons name="workspace-premium" size={10} color={Colors.background} />
                <Text style={styles.upsellBadgeText}>БОЛЬШОЕ ИССЛЕДОВАНИЕ</Text>
              </View>
              <Text style={styles.upsellTitle}>Дом Самопознания</Text>
              <Text style={styles.upsellDesc}>
                Матрица · Циклы · Деньги · Отношения · PDF
              </Text>
            </View>
            <View style={styles.upsellRight}>
              {isPremium
                ? <MaterialIcons name="check-circle" size={28} color={Colors.gold} />
                : (
                  <View>
                    <Text style={styles.upsellPrice}>2 900 ₽</Text>
                    <MaterialIcons name="arrow-forward" size={14} color={Colors.gold} style={{ marginTop: 4 }} />
                  </View>
                )}
            </View>
          </LinearGradient>
        </Pressable>

        <Text style={styles.legal}>
          Система «Цифровой Код» носит информационно-развлекательный и самоисследовательский характер.
          Не является медицинской, психологической, финансовой или юридической консультацией.
        </Text>
      </ScrollView>

      {/* ── Fixed bottom action bar ────────────────────────────────── */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 4 }]}>
        {[
          { icon: saved ? 'bookmark' : 'bookmark-border', label: saved ? 'Сохранено' : 'Сохранить', onPress: handleSave, active: saved },
          { icon: 'grid-4x4', label: 'Матрица',  onPress: () => router.push('/matrix-detail'), active: false },
          { icon: 'autorenew', label: 'Циклы',   onPress: () => router.push('/cycles'),        active: false },
          { icon: 'payments',  label: 'Деньги',  onPress: () => router.push('/money-code'),    active: false },
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

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { gap: 0 },

  noData: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg, backgroundColor: Colors.background },
  noDataTitle: { ...Typography.heading, color: Colors.textSecondary },
  noDataBtn: { backgroundColor: Colors.gold, borderRadius: Radii.lg, paddingHorizontal: Spacing.xl, paddingVertical: 14 },
  noDataBtnText: { ...Typography.button, color: Colors.background, fontWeight: '700' },

  // Header
  header: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Spacing.md,
  },
  backBtn: { padding: 4 },
  saveBtn: { padding: 4 },

  heroIdentity: { gap: 4, marginTop: Spacing.sm },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gold },
  heroBadgeText: { ...Typography.label, color: Colors.gold, letterSpacing: 1.8 },
  heroName: { fontSize: 32, fontWeight: '700', color: Colors.textPrimary, lineHeight: 38, letterSpacing: -0.3 },
  heroMeta: { ...Typography.caption, color: Colors.textMuted },

  formulaArea: { marginTop: Spacing.lg, gap: 8 },
  formulaRow: { flexDirection: 'row', alignItems: 'flex-end' },
  fNode: { flex: 1, alignItems: 'center', gap: 3 },
  fCircle: {
    width: 46, height: 46, borderRadius: 23, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  fNum: { fontSize: 18, fontWeight: '700', lineHeight: 22 },
  fComp: { fontSize: 9, lineHeight: 11 },
  fRoleLabel: { ...Typography.caption, color: Colors.textDisabled, fontSize: 8, textAlign: 'center' },
  fConnector: { width: 1, height: 22, backgroundColor: Colors.borderLight, marginBottom: 18, alignSelf: 'center' },
  compositeNote: { ...Typography.caption, color: Colors.textDisabled, fontStyle: 'italic', fontSize: 10 },
  planetNote: { ...Typography.caption, color: Colors.textDisabled, fontSize: 9, lineHeight: 14, opacity: 0.8 },

  // Tabs
  tabsWrap: { backgroundColor: Colors.surfaceDark, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  tabsContent: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm, paddingTop: 10, gap: Spacing.sm },
  tab: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 7, paddingHorizontal: Spacing.md,
    borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.borderLight,
  },
  tabActive: { borderColor: Colors.border, backgroundColor: Colors.goldTint },
  tabPremium: { borderColor: Colors.border },
  tabText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '500' },
  tabTextActive: { color: Colors.gold, fontWeight: '700' },
  tabTextPremium: { color: Colors.gold },

  tabBody: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  section: { gap: Spacing.lg, paddingBottom: Spacing.lg },

  // Passport tab
  passportHeroCard: {
    borderRadius: Radii.xxl, padding: Spacing.xl, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  passportHeroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  passportHeroIdent: { gap: 3 },
  passportHeroName: { ...Typography.title, color: Colors.textPrimary, fontSize: 20 },
  passportHeroDob: { ...Typography.caption, color: Colors.textMuted },
  passportHeroBadge: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  passportHeroFormula: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textAlign: 'center', lineHeight: 16 },
  passportHeroDivider: { height: 1, backgroundColor: Colors.borderLight },
  passportMiniRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 10 },
  passportMiniRowBorder: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  passportMiniCircle: {
    width: 46, height: 46, borderRadius: 23, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  passportMiniFinal: { fontSize: 18, fontWeight: '700', lineHeight: 22 },
  passportMiniComp: { fontSize: 9, lineHeight: 11 },
  passportMiniInfo: { flex: 1 },
  passportMiniLabel: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  passportMiniDesc: { ...Typography.caption, color: Colors.textMuted, marginTop: 1 },
  passportMiniRight: { alignItems: 'flex-end', gap: 3 },
  passportMiniPlanet: { ...Typography.caption, fontWeight: '600', fontSize: 11 },
  authorChip: {
    backgroundColor: Colors.goldTint, borderRadius: Radii.full,
    paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.border,
  },
  authorChipText: { ...Typography.caption, color: Colors.gold, fontSize: 9 },

  chainRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, paddingVertical: 8 },
  chainRowBorder: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  chainLeft: { flex: 1 },
  chainLabel: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600', marginBottom: 2 },
  chainText: { ...Typography.mono, color: Colors.textMuted },
  chainBadge: { borderWidth: 1, borderRadius: Radii.sm, paddingHorizontal: 7, paddingVertical: 3 },
  chainBadgeText: { ...Typography.label, fontSize: 10 },

  quickRow: { gap: Spacing.sm },
  quickBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.md, minHeight: 54,
  },
  quickBtnIcon: {
    width: 36, height: 36, borderRadius: Radii.sm,
    backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  quickBtnText: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600', flex: 1 },

  // Numbers tab
  numCardHead: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  numCardHeadText: { flex: 1, gap: 3 },
  numLabelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  numLabel: { ...Typography.heading, color: Colors.textPrimary },
  numPlanetLine: { ...Typography.caption, fontWeight: '600' },
  numChainInline: { backgroundColor: Colors.surfaceAlt, borderRadius: Radii.sm, paddingHorizontal: Spacing.sm, paddingVertical: 4 },
  numChainText: { ...Typography.mono, color: Colors.textMuted, fontSize: 11 },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  numEssence: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  lsRow: { flexDirection: 'row', gap: Spacing.sm },
  lsBox: { flex: 1, borderRadius: Radii.sm, borderWidth: 1, padding: Spacing.sm, gap: 4 },
  lsTag: { ...Typography.label, fontSize: 10 },
  lsText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  orientBox: { borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 3 },
  orientTag: { ...Typography.label, fontSize: 10 },
  orientText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  exprNote: { ...Typography.caption, color: Colors.textDisabled, fontStyle: 'italic', lineHeight: 16 },

  // Synthesis tab
  synthHero: {
    borderRadius: Radii.xxl, padding: Spacing.xl, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  synthHeroBadge: {
    backgroundColor: Colors.goldGlow, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.border,
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
  },
  synthHeroBadgeText: { ...Typography.label, color: Colors.gold, fontSize: 9, letterSpacing: 1.2 },
  synthHeroFormula: { fontSize: 28, fontWeight: '700', letterSpacing: 4 },
  synthHeroSub: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic' },
  synthHeroDivider: { height: 1, backgroundColor: Colors.borderLight },
  synthHeroVec: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 24, fontStyle: 'italic' },
  bulletRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 10, alignItems: 'flex-start' },
  bulletDivider: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  bulletDot: { width: 7, height: 7, borderRadius: 4, marginTop: 8 },
  bulletText: { ...Typography.bodySmall, color: Colors.textPrimary, flex: 1, lineHeight: 22 },
  tensionText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 24 },
  vectorBox: { borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, marginTop: 4 },
  vectorLabel: { ...Typography.label, fontSize: 10, marginBottom: 4 },
  vectorText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  synthBodyText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 24 },

  // Upsell
  upsell: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.md,
    borderRadius: Radii.xxl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  upsellGrad: { flexDirection: 'row', alignItems: 'center', padding: Spacing.xl, gap: Spacing.md },
  upsellLeft: { flex: 1, gap: Spacing.sm },
  upsellBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 8, paddingVertical: 4,
  },
  upsellBadgeText: { ...Typography.label, color: Colors.background, fontSize: 9, letterSpacing: 0.8 },
  upsellTitle: { ...Typography.subheading, color: Colors.textPrimary },
  upsellDesc: { ...Typography.caption, color: Colors.textMuted },
  upsellRight: { alignItems: 'flex-end' },
  upsellPrice: { fontSize: 19, fontWeight: '700', color: Colors.gold },

  legal: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', lineHeight: 18, fontSize: 10,
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.lg,
  },

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
