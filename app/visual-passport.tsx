/**
 * Визуальный паспорт — premium prototype screen v2.
 * Tabs: Карта / Паспорт / Синтез / Практики / Деньги / Глубина
 * Mock data: Артём · 06.05.1986
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Dimensions, Animated, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ConstellationMap } from '@/components/brand/ConstellationMap';
import { Colors, Spacing, Typography, Radii, Shadows, PLANET_COLORS, PLANET_NAMES } from '@/constants/theme';

// ── Mock data (replace with real JSON / context later) ────────────────────────

const MOCK = {
  name: 'Артём',
  dob: '06.05.1986',
  gender: 'Мужской',
  formula: {
    soul:       { final: 6, composite: 6 },
    expression: { final: 2, composite: 11 },
    path:       { final: 8, composite: 35 },
    direction:  { final: 5, composite: 41 },
    result:     { final: 1, composite: 82 },
  },
};

// ── Position data ─────────────────────────────────────────────────────────────

const POSITIONS = [
  {
    key: 'soul', label: 'Число Души', shortLabel: 'Душа',
    role: 'Внутренняя природа',
    tagline: 'Кто вы, когда никого нет рядом',
    description:
      'Природа Венеры: внутреннее стремление к красоте, теплу и качеству жизни. В основе — гармонизатор, создатель пространства, где людям хорошо и безопасно.',
    light: 'Любовь, красота, гармония, тонкое ощущение качества, способность создавать живую атмосферу.',
    shadow: 'Контроль через заботу, перфекционизм в деталях, откладывание собственной жизни ради идеала.',
    orient: 'Создавайте красивое — это ваш ресурс, не привилегия. Учитесь принимать заботу так же, как давать её.',
  },
  {
    key: 'expression', label: 'Число Выражения', shortLabel: 'Выражение',
    role: 'Способ проявления',
    tagline: 'Как вас видят и слышат',
    description:
      'Природа Луны: проявляться через чуткость, контакт и пространство доверия. Сила раскрывается через присутствие, а не через давление или демонстрацию.',
    light: 'Тонкость, эмпатия, дипломатичность, способность чувствовать атмосферу и настраиваться на другого.',
    shadow: 'Зависимость от отклика, страх прямого проявления, ожидание разрешения от окружающих.',
    orient: 'Проявляйтесь через точное присутствие и диалог. Не растворяйтесь в чужом состоянии — это не помощь.',
    authorNote: 'Авторское расширение системы',
  },
  {
    key: 'path', label: 'Число Пути', shortLabel: 'Путь',
    role: 'Движение в мире',
    tagline: 'Каким путём вы идёте',
    description:
      'Природа Сатурна: путь через дисциплину и зрелость. Движение медленное, но строительство надёжное и долгосрочное. Сила — в системности.',
    light: 'Дисциплина, зрелость, способность нести ответственность, строить серьёзное и долгоживущее.',
    shadow: 'Самоизнос через чувство долга, ощущение вечного должника, неспособность позволить себе отдых.',
    orient: 'Инвестируйте в долгое и серьёзное. Позвольте себе останавливаться — отдых встроен в систему.',
  },
  {
    key: 'direction', label: 'Число Направления', shortLabel: 'Направление',
    role: 'Форма раскрытия',
    tagline: 'Через что вы реализуетесь',
    description:
      'Природа Меркурия: реализация через коммуникацию, обучение, связи и упаковку смысла. Поток приходит через речь и движение.',
    light: 'Коммуникация, гибкость, новые связи, способность объяснять сложное через простое.',
    shadow: 'Рассеянность, бегство от глубины, трудность с завершением начатого.',
    orient: 'Выбирайте одно и доводите до результата. Глубина — это не ограничение вашей природы, а её ресурс.',
  },
  {
    key: 'result', label: 'Число Результата', shortLabel: 'Результат',
    role: 'Зрелый итог пути',
    tagline: 'К чему ведёт весь путь',
    description:
      'Природа Солнца: зрелая автономия. Жизнь последовательно ведёт к умению быть собой — без борьбы с миром и без нужды в постоянном одобрении.',
    light: 'Лидерство, воля, инициатива, способность принимать решения и вести за собой.',
    shadow: 'Упрямство, нежелание слышать других, соблазн всё контролировать в одиночку.',
    orient: 'Создавайте своё. Учитесь слышать — это усиливает силу, а не ослабляет её.',
  },
];

// ── Practice cards ────────────────────────────────────────────────────────────

const PRACTICES = [
  {
    icon: 'visibility', type: 'Наблюдение',
    title: 'Утренний сигнал',
    body: 'Три минуты наблюдайте, как ваша природа Венеры хочет проявиться сегодня. Что вы хотите создать, улучшить, сделать красивым — не для других, а для себя?',
    color: Colors.venus,
  },
  {
    icon: 'bolt', type: 'Действие',
    title: 'Один завершённый шаг',
    body: 'Путь Сатурна требует не скорости, а регулярности. Выберите одно дело и доведите до конца — прежде чем брать следующее.',
    color: Colors.saturn,
  },
  {
    icon: 'spa', type: 'Восстановление',
    title: 'Граница через тишину',
    body: 'Выражение Луны истощается без тишины. Одна запланированная пауза без объяснений — это не уход от людей, а часть вашего ресурса.',
    color: Colors.moon,
  },
  {
    icon: 'forum', type: 'Коммуникация',
    title: 'Слово как инструмент',
    body: 'Направление Меркурия реализуется через речь. Сформулируйте мысль письменно перед тем, как говорить вслух — качество изменится.',
    color: Colors.mercury,
  },
];

// ── Money positions ───────────────────────────────────────────────────────────

const MONEY_POSITIONS = [
  {
    pos: 1, label: 'Источник ценности', number: 6, planet: 'Венера',
    desc: 'Денежная энергия начинает двигаться там, где есть вкус, красота, теплота и ощущение качества. Это не luxury — это точность отношений с ценностью.',
    unlocked: true,
  },
  {
    pos: 2, label: 'Способ обмена', number: 5, planet: 'Меркурий',
    desc: 'Поток растёт через речь, контакты, обмен и обучение. Ваш денежный канал — это способность объяснять, передавать, быть в движении.',
    unlocked: true,
  },
  {
    pos: 3, label: 'Удержание ресурса', number: 6, planet: 'Венера',
    desc: 'Зона глубокой монетизации. Открывается в Большом исследовании.',
    unlocked: false,
  },
  {
    pos: 4, label: 'Масштаб реализации', number: 8, planet: 'Сатурн',
    desc: 'Что ограничивает масштаб без системы — и как его выстроить. Открывается в Большом исследовании.',
    unlocked: false,
  },
];

// ── Locked depth sections ─────────────────────────────────────────────────────

const DEPTH_SECTIONS = [
  {
    icon: 'layers', title: 'Глубокий разбор',
    teaser: '22 раздела',
    desc: 'Зоны напряжения, детальная матрица, синтез сильных сторон — с полными формулировками, не тезисами.',
  },
  {
    icon: 'timeline', title: 'Возрастная карта',
    teaser: 'Точки активации',
    desc: 'Ключевые периоды в 18, 27, 36, 45 — что они означают именно для формулы 6—2—8—5—1.',
  },
  {
    icon: 'people', title: 'Совместимость',
    teaser: 'Два кода рядом',
    desc: 'Вектор взаимодействия двух формул. Где усиление, где напряжение, как это работает в паре.',
  },
  {
    icon: 'autorenew', title: 'Личный год 2026',
    teaser: 'Год 3 · Юпитер',
    desc: 'Зоны напряжения, ключевые месяцы и практический ориентир текущего цикла.',
  },
  {
    icon: 'picture-as-pdf', title: 'PDF-разбор',
    teaser: 'Личный документ',
    desc: 'Полный разбор в виде персонального документа — сохраняется, передаётся, возвращаешься.',
  },
];

// ── Tab config ────────────────────────────────────────────────────────────────

type TabId = 'map' | 'passport' | 'synthesis' | 'practices' | 'money' | 'depth';
const TABS: { id: TabId; label: string; premium?: boolean }[] = [
  { id: 'map',       label: 'Карта' },
  { id: 'passport',  label: 'Паспорт' },
  { id: 'synthesis', label: 'Синтез' },
  { id: 'practices', label: 'Практики' },
  { id: 'money',     label: 'Деньги' },
  { id: 'depth',     label: '✦ Глубина', premium: true },
];

const { width: SW } = Dimensions.get('window');

// ── Animated number circle ────────────────────────────────────────────────────

function PulseCircle({ number, color, composite }: { number: number; color: string; composite?: number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 2200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const showComp = composite !== undefined && composite !== number;
  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <View style={[pulseStyles.outer, { borderColor: color + '30' }]}>
        <View style={[pulseStyles.inner, { borderColor: color + '60', backgroundColor: color + '12' }]}>
          <Text style={[pulseStyles.num, { color }]}>{number}</Text>
          {showComp ? <Text style={[pulseStyles.comp, { color: color + 'AA' }]}>{composite}</Text> : null}
        </View>
      </View>
    </Animated.View>
  );
}

const pulseStyles = StyleSheet.create({
  outer: { width: 68, height: 68, borderRadius: 34, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 24, fontWeight: '700', lineHeight: 28 },
  comp: { fontSize: 10, lineHeight: 13 },
});

// ── Expandable number card ────────────────────────────────────────────────────

function NumberCard({ pos, index, finals, composites }: {
  pos: typeof POSITIONS[0];
  index: number;
  finals: number[];
  composites: number[];
}) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const numFinal = finals[index];
  const numComp = composites[index];
  const color = PLANET_COLORS[numFinal] || Colors.gold;
  const showComp = numComp !== numFinal;
  const isExpr = pos.key === 'expression';

  const toggle = () => {
    Animated.spring(anim, {
      toValue: open ? 0 : 1,
      tension: 80, friction: 10, useNativeDriver: false,
    }).start();
    setOpen(v => !v);
  };

  const extraHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Pressable onPress={toggle} style={[numCardStyles.card, { borderColor: color + '28' }]}>
      {/* Header row */}
      <View style={numCardStyles.header}>
        <PulseCircle number={numFinal} color={color} composite={showComp ? numComp : undefined} />
        <View style={numCardStyles.headText}>
          <View style={numCardStyles.headRow}>
            <Text style={numCardStyles.label}>{pos.label}</Text>
            {isExpr ? <View style={numCardStyles.authorChip}><Text style={numCardStyles.authorChipTxt}>авт.</Text></View> : null}
          </View>
          <Text style={[numCardStyles.planet, { color }]}>{PLANET_NAMES[numFinal]} · {pos.role}</Text>
          <Text style={numCardStyles.tagline}>{pos.tagline}</Text>
        </View>
        <MaterialIcons
          name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
          color={Colors.textDisabled}
        />
      </View>

      {/* Expanded detail */}
      {open ? (
        <View style={numCardStyles.detail}>
          <View style={numCardStyles.divider} />
          <Text style={numCardStyles.description}>{pos.description}</Text>

          <View style={numCardStyles.lsRow}>
            <View style={[numCardStyles.lsBox, { borderColor: color + '28', backgroundColor: color + '08' }]}>
              <Text style={[numCardStyles.lsTag, { color }]}>Свет</Text>
              <Text style={numCardStyles.lsText}>{pos.light}</Text>
            </View>
            <View style={[numCardStyles.lsBox, { borderColor: Colors.borderLight }]}>
              <Text style={[numCardStyles.lsTag, { color: Colors.textMuted }]}>Напряжение</Text>
              <Text style={numCardStyles.lsText}>{pos.shadow}</Text>
            </View>
          </View>

          <View style={[numCardStyles.orientBox, { borderColor: color + '22', backgroundColor: color + '06' }]}>
            <Text style={[numCardStyles.orientTag, { color }]}>Ориентир</Text>
            <Text style={numCardStyles.orientText}>{pos.orient}</Text>
          </View>

          {isExpr ? (
            <Text style={numCardStyles.authorNote}>{pos.authorNote} · не является астрологическим прогнозом</Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const numCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, padding: Spacing.lg,
    gap: Spacing.sm, ...Shadows.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headText: { flex: 1, gap: 2 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  label: { ...Typography.subheading, color: Colors.textPrimary },
  authorChip: {
    backgroundColor: Colors.goldTint, borderRadius: Radii.full,
    paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.border,
  },
  authorChipTxt: { ...Typography.caption, color: Colors.gold, fontSize: 9 },
  planet: { ...Typography.caption, fontWeight: '600' },
  tagline: { ...Typography.caption, color: Colors.textDisabled, fontSize: 11, fontStyle: 'italic' },
  detail: { gap: Spacing.sm },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  description: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  lsRow: { flexDirection: 'row', gap: Spacing.sm },
  lsBox: { flex: 1, borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 3 },
  lsTag: { ...Typography.label, fontSize: 10 },
  lsText: { ...Typography.caption, color: Colors.textMuted, lineHeight: 17 },
  orientBox: { borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 3 },
  orientTag: { ...Typography.label, fontSize: 10 },
  orientText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  authorNote: { ...Typography.caption, color: Colors.textDisabled, fontStyle: 'italic', lineHeight: 16, fontSize: 10 },
});

// ── Section header ────────────────────────────────────────────────────────────

function SH({ label, title }: { label: string; title: string }) {
  return (
    <View style={shStyles.wrap}>
      <Text style={shStyles.label}>{label}</Text>
      <Text style={shStyles.title}>{title}</Text>
    </View>
  );
}
const shStyles = StyleSheet.create({
  wrap: { gap: 3, marginBottom: 2 },
  label: { ...Typography.label, color: Colors.gold, letterSpacing: 1.5 },
  title: { ...Typography.heading, color: Colors.textPrimary },
});

// ── Glass card ────────────────────────────────────────────────────────────────

function GC({ children, style, accent }: { children: React.ReactNode; style?: any; accent?: string }) {
  return (
    <View style={[gcStyles.card, accent ? { borderColor: accent + '30' } : {}, style]}>
      {children}
    </View>
  );
}
const gcStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, gap: Spacing.sm,
  },
});

// ── Locked depth card ─────────────────────────────────────────────────────────

function LockedDepthCard({ icon, title, teaser, desc, onPress }: {
  icon: string; title: string; teaser: string; desc: string; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [ldStyles.card, pressed && { opacity: 0.82 }]}>
      <View style={ldStyles.left}>
        <View style={ldStyles.iconWrap}>
          <MaterialIcons name={icon as any} size={18} color={Colors.gold} />
        </View>
        <View style={ldStyles.teaserBadge}>
          <Text style={ldStyles.teaserText}>{teaser}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ldStyles.title}>{title}</Text>
        <Text style={ldStyles.desc}>{desc}</Text>
      </View>
      <View style={ldStyles.lockBadge}>
        <MaterialIcons name="lock" size={11} color={Colors.surfaceDark} />
      </View>
    </Pressable>
  );
}
const ldStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.goldTint, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, flexDirection: 'row',
    alignItems: 'center', gap: Spacing.md,
  },
  left: { alignItems: 'center', gap: Spacing.xs },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  teaserBadge: {
    backgroundColor: Colors.border, borderRadius: Radii.full,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  teaserText: { ...Typography.label, color: Colors.gold, fontSize: 8, letterSpacing: 0.5 },
  title: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600', marginBottom: 3 },
  desc: { ...Typography.caption, color: Colors.textMuted, lineHeight: 17 },
  lockBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function VisualPassportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabId>('map');
  const scrollRef = useRef<ScrollView>(null);
  const heroFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heroFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const { formula, name, dob } = MOCK;

  const finals = [
    formula.soul.final, formula.expression.final,
    formula.path.final, formula.direction.final, formula.result.final,
  ];
  const composites = [
    formula.soul.composite, formula.expression.composite,
    formula.path.composite, formula.direction.composite, formula.result.composite,
  ];
  const compStr = [
    formula.expression.composite, formula.path.composite,
    formula.direction.composite, formula.result.composite,
  ].join(' · ');

  const constellationNodes = POSITIONS.map((p, i) => ({
    key: p.key, label: p.label,
    number: finals[i], composite: composites[i],
  }));

  const handlePaywall = () => router.push('/paywall');

  const switchTab = (id: TabId) => {
    setActiveTab(id);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  // synthesis bullets based on formula
  const synthesisBullets = [
    `${PLANET_NAMES[formula.soul.final]} в основе — внутренний стержень красоты, тепла и качества жизни`,
    `${PLANET_NAMES[formula.expression.final]} в выражении — сила раскрывается через чуткость и контакт, не через давление`,
    `${PLANET_NAMES[formula.path.final]} на Пути — движение через дисциплину, зрелость и долгую дистанцию`,
    `${PLANET_NAMES[formula.direction.final]} в Направлении — реализация через речь, объяснение и публичное присутствие`,
    `${PLANET_NAMES[formula.result.final]} как Результат — зрелая автономия, право быть собой и вести собственный курс`,
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 4, paddingBottom: insets.bottom + 80 },
        ]}
        stickyHeaderIndices={[1]}
      >
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <Animated.View style={[styles.hero, { opacity: heroFade }]}>
          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.heroBack} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={18} color={Colors.textMuted} />
          </Pressable>

          {/* Identity line */}
          <View style={styles.heroBadge}>
            <View style={styles.heroBadgeDot} />
            <Text style={styles.heroBadgeText}>ВИЗУАЛЬНЫЙ ПАСПОРТ</Text>
          </View>
          <Text style={styles.heroName}>{name}</Text>
          <Text style={styles.heroDob}>{dob}</Text>

          {/* Five-node formula strip */}
          <View style={styles.formulaStrip}>
            {finals.map((n, i) => {
              const c = PLANET_COLORS[n] || Colors.gold;
              const comp = composites[i];
              const showComp = comp !== n;
              return (
                <React.Fragment key={i}>
                  <View style={styles.fNode}>
                    <View style={[styles.fNodeCircle, { borderColor: c + '55', backgroundColor: c + '10' }]}>
                      <Text style={[styles.fNodeNum, { color: c }]}>{n}</Text>
                    </View>
                    {showComp ? <Text style={[styles.fNodeComp, { color: c + '99' }]}>{comp}</Text> : null}
                    <Text style={styles.fNodeLabel}>{POSITIONS[i].shortLabel}</Text>
                  </View>
                  {i < finals.length - 1 ? (
                    <View style={[styles.fConnector, { backgroundColor: Colors.borderLight }]} />
                  ) : null}
                </React.Fragment>
              );
            })}
          </View>

          <Text style={styles.formulaCompLine}>составные: {compStr}</Text>
          <Text style={styles.formulaPlanetLine}>
            Планеты — метафорический язык системы, не астрологический прогноз
          </Text>
        </Animated.View>

        {/* ── Sticky tabs ───────────────────────────────────────────────── */}
        <View style={styles.tabsBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {TABS.map(t => {
              const isActive = activeTab === t.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => switchTab(t.id)}
                  style={[styles.tab, isActive && styles.tabActive, t.premium && styles.tabPremium]}
                >
                  <Text style={[
                    styles.tabText,
                    isActive && styles.tabTextActive,
                    t.premium && !isActive && styles.tabTextPremium,
                  ]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Tab content ───────────────────────────────────────────────── */}
        <View style={styles.tabBody}>

          {/* MAP ─────────────────────────────────────────────────────── */}
          {activeTab === 'map' ? (
            <View style={styles.section}>
              <SH label="КАРТА ФОРМУЛЫ" title="Личная конфигурация" />

              <View style={styles.constellationWrap}>
                <ConstellationMap nodes={constellationNodes} size={Math.min(SW - 40, 340)} />
              </View>

              {/* Five position overview grid */}
              <View style={styles.posGrid}>
                {POSITIONS.map((pos, i) => {
                  const n = finals[i];
                  const c = composites[i];
                  const color = PLANET_COLORS[n] || Colors.gold;
                  const showComp = c !== n;
                  return (
                    <Pressable
                      key={pos.key}
                      onPress={() => switchTab('passport')}
                      style={({ pressed }) => [
                        styles.posCard,
                        { borderColor: color + '22' },
                        pressed && { opacity: 0.82 },
                      ]}
                    >
                      <View style={[styles.posNumWrap, { backgroundColor: color + '10' }]}>
                        <Text style={[styles.posNum, { color }]}>{n}</Text>
                        {showComp ? <Text style={[styles.posComp, { color: color + 'AA' }]}>{c}</Text> : null}
                      </View>
                      <Text style={styles.posLabel} numberOfLines={2}>{pos.shortLabel}</Text>
                      <Text style={[styles.posPlanet, { color: color + 'CC' }]}>{PLANET_NAMES[n]}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <GC>
                <Text style={styles.mapIntroLabel}>О СИСТЕМЕ</Text>
                <Text style={styles.mapIntroText}>
                  Пять позиций — это не причинная цепочка, а пять независимых слоёв одной формулы.
                  Каждая описывает отдельное измерение: кто вы внутри, как проявляетесь, каким путём движетесь,
                  через что реализуетесь и к чему в итоге приходите.
                </Text>
                <Pressable
                  onPress={() => switchTab('passport')}
                  style={styles.mapCta}
                >
                  <Text style={styles.mapCtaText}>Изучить каждую позицию</Text>
                  <MaterialIcons name="arrow-forward" size={14} color={Colors.gold} />
                </Pressable>
              </GC>
            </View>
          ) : null}

          {/* PASSPORT ─────────────────────────────────────────────────── */}
          {activeTab === 'passport' ? (
            <View style={styles.section}>
              <SH label="ЦИФРОВОЙ ПАСПОРТ" title="Пять измерений" />
              <Text style={styles.passportIntro}>
                Нажмите на карточку, чтобы раскрыть детали позиции.
              </Text>
              {POSITIONS.map((pos, i) => (
                <NumberCard
                  key={pos.key}
                  pos={pos}
                  index={i}
                  finals={finals}
                  composites={composites}
                />
              ))}
            </View>
          ) : null}

          {/* SYNTHESIS ─────────────────────────────────────────────────── */}
          {activeTab === 'synthesis' ? (
            <View style={styles.section}>
              <SH label="СИНТЕЗ" title="Главная формула" />

              {/* Hero synthesis */}
              <LinearGradient
                colors={[Colors.surfaceDark, '#0E0D0A']}
                style={styles.synthHero}
              >
                <View style={styles.synthHeroTop}>
                  <View style={styles.synthHeroBadge}>
                    <Text style={styles.synthHeroBadgeText}>ЛИЧНАЯ ФОРМУЛА</Text>
                  </View>
                  <Text style={styles.synthHeroFormula}>{finals.join(' — ')}</Text>
                  <Text style={styles.synthHeroSub}>{name} · {dob}</Text>
                </View>
                <View style={styles.synthHeroDivider} />
                <Text style={styles.synthHeroVec}>
                  Венера внутри — Луна в выражении — Сатурн на пути — Меркурий в направлении — Солнце как результат.
                </Text>
                <Text style={styles.synthHeroText}>
                  Человек, в котором живут одновременно тяга к красоте и тепловому качеству, способность
                  тонко чувствовать и настраиваться, готовность строить медленно и надёжно — через слово,
                  речь и публичное присутствие — к зрелой автономии и собственному курсу.
                </Text>
              </LinearGradient>

              <SH label="КЛЮЧЕВОЙ ВЕКТОР" title="Пять слоёв" />
              <GC>
                {synthesisBullets.map((b, i, arr) => (
                  <View key={i} style={[styles.synBulletRow, i < arr.length - 1 && styles.synBulletDivider]}>
                    <View style={[styles.synBulletDot, { backgroundColor: PLANET_COLORS[finals[i]] || Colors.gold }]} />
                    <Text style={styles.synBulletText}>{b}</Text>
                  </View>
                ))}
              </GC>

              <SH label="ГЛАВНАЯ СИЛА" title="Ресурс формулы" />
              <GC accent={Colors.venus}>
                {[
                  'Способность создавать живое человеческое пространство — Венера даёт вкус, заботу и эмоциональное качество.',
                  'Тонкое проявление через контакт и доверие — Луна в выражении показывает: присутствие важнее давления.',
                  'Потенциал долгой дистанции — Сатурн на пути даёт способность строить большое при наличии системы.',
                  'Раскрытие через слово — Меркурий в направлении: реализация через речь, объяснение, публичность.',
                ].map((s, i, arr) => (
                  <View key={i} style={[styles.synBulletRow, i < arr.length - 1 && styles.synBulletDivider]}>
                    <MaterialIcons name="brightness-1" size={7} color={Colors.gold} style={{ marginTop: 8 }} />
                    <Text style={[styles.synBulletText, { color: Colors.textPrimary }]}>{s}</Text>
                  </View>
                ))}
              </GC>

              <SH label="ГЛАВНОЕ НАПРЯЖЕНИЕ" title="Зона задачи" />
              <GC accent={Colors.saturn}>
                <Text style={styles.synTensionText}>
                  Венера хочет красоты и мягкости. Луна ищет отклика. Сатурн требует дисциплины.
                  Меркурий тянет в расширение. Солнце требует собственного курса.{'\n\n'}
                  Всё это — в одном человеке, одновременно.
                </Text>
                <View style={[styles.synVectorBox, { borderColor: Colors.saturn + '30', backgroundColor: Colors.saturn + '08' }]}>
                  <Text style={[styles.synVectorLabel, { color: Colors.saturn }]}>Практический вектор</Text>
                  <Text style={styles.synVectorText}>
                    Не растворяться в ожидании идеального отклика. Не распыляться в движении. Собрать свою систему
                    и выйти с ней в мир — через речь, объяснение или публичное присутствие.
                  </Text>
                </View>
              </GC>

              <SH label="КАК МЕНЯ ВИДЯТ" title="Внешнее впечатление" />
              <GC>
                <Text style={styles.synText}>
                  Человек с теплотой и вкусом, который умеет создавать хорошую атмосферу. Заметен через качество
                  присутствия, а не через громкость. Первое впечатление — надёжный, внимательный, с ощущением стиля.
                </Text>
              </GC>

              <SH label="ГДЕ Я РАСКРЫВАЮСЬ" title="Точка потока" />
              <GC>
                <Text style={styles.synText}>
                  Раскрытие происходит там, где есть диалог, доверие и возможность объяснять. Не в одиночестве
                  и не в хаосе — а в структурированном контакте с людьми, где слово передаёт смысл.
                </Text>
              </GC>

              {/* Locked synthesis depth */}
              <Pressable onPress={handlePaywall} style={styles.synthLockedRow}>
                <View style={styles.synthLockedInner}>
                  <MaterialIcons name="lock" size={16} color={Colors.gold} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.synthLockedTitle}>
                      Что мне нельзя терять · Практический вектор на ближайший период
                    </Text>
                    <Text style={styles.synthLockedSub}>Открывается в Большом исследовании</Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={15} color={Colors.gold} />
                </View>
              </Pressable>
            </View>
          ) : null}

          {/* PRACTICES ─────────────────────────────────────────────────── */}
          {activeTab === 'practices' ? (
            <View style={styles.section}>
              <SH label="ПРАКТИКИ" title="Четыре режима" />
              <Text style={styles.practicesIntro}>
                Практики выведены из вашей формулы. Они работают не как советы, а как ориентиры — точки, где ваша природа откликается точнее и быстрее.
              </Text>

              {PRACTICES.map((p, i) => (
                <View key={i} style={[styles.practiceCard, { borderColor: p.color + '25' }]}>
                  <View style={styles.practiceCardTop}>
                    <View style={[styles.practiceIconBg, { backgroundColor: p.color + '15' }]}>
                      <MaterialIcons name={p.icon as any} size={22} color={p.color} />
                    </View>
                    <View style={[styles.practiceTypeBadge, { backgroundColor: p.color + '12', borderColor: p.color + '25' }]}>
                      <Text style={[styles.practiceTypeText, { color: p.color }]}>{p.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.practiceTitle}>{p.title}</Text>
                  <Text style={styles.practiceBody}>{p.body}</Text>
                  <View style={[styles.practiceLine, { backgroundColor: p.color + '25' }]} />
                </View>
              ))}

              <Text style={styles.practiceDisclaimer}>
                Практики носят самоисследовательский характер. Не являются медицинской или психологической рекомендацией.
              </Text>
            </View>
          ) : null}

          {/* MONEY ─────────────────────────────────────────────────────── */}
          {activeTab === 'money' ? (
            <View style={styles.section}>
              <SH label="КОД РЕАЛИЗАЦИИ" title="Карта ценности" />

              <GC>
                <Text style={styles.moneyDisclaimer}>
                  Это не финансовая рекомендация. Раздел описывает личные паттерны отношения к ценности, обмену и реализации — как систему, а не как прогноз.
                </Text>
              </GC>

              {/* Visual formula strip */}
              <LinearGradient colors={[Colors.surfaceDark, Colors.background]} style={styles.moneyFormulaCard}>
                <Text style={styles.moneyFormulaLabel}>ДЕНЕЖНАЯ ФОРМУЛА</Text>
                <View style={styles.moneyFormulaRow}>
                  {MONEY_POSITIONS.map((m, i) => {
                    const color = m.unlocked ? (PLANET_COLORS[m.number] || Colors.gold) : Colors.textDisabled;
                    return (
                      <React.Fragment key={m.pos}>
                        <View style={[styles.moneyFNode, { borderColor: color + '40' }]}>
                          {m.unlocked ? (
                            <>
                              <Text style={[styles.moneyFNum, { color }]}>{m.number}</Text>
                              <Text style={[styles.moneyFPlanet, { color: color + 'BB' }]}>{m.planet}</Text>
                            </>
                          ) : (
                            <MaterialIcons name="lock" size={14} color={Colors.textDisabled} />
                          )}
                        </View>
                        {i < MONEY_POSITIONS.length - 1 ? (
                          <View style={[styles.moneyCon, { backgroundColor: Colors.borderLight }]} />
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </View>
              </LinearGradient>

              {/* Unlocked position cards */}
              {MONEY_POSITIONS.map(m => {
                const color = PLANET_COLORS[m.number] || Colors.gold;
                return m.unlocked ? (
                  <GC key={m.pos} accent={color}>
                    <View style={styles.moneyCardHead}>
                      <View style={[styles.moneyPosBadge, { backgroundColor: color + '12', borderColor: color + '30' }]}>
                        <Text style={[styles.moneyPosNum, { color }]}>{m.pos}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.moneyPosLabel}>{m.label}</Text>
                        <Text style={[styles.moneyPosPlanet, { color }]}>{m.number} · {m.planet}</Text>
                      </View>
                    </View>
                    <Text style={styles.moneyPosDesc}>{m.desc}</Text>
                  </GC>
                ) : (
                  <Pressable key={m.pos} onPress={handlePaywall} style={styles.moneyLockedCard}>
                    <View style={styles.moneyLockedInner}>
                      <View style={[styles.moneyPosBadge, { backgroundColor: Colors.surfaceAlt, borderColor: Colors.borderLight }]}>
                        <Text style={[styles.moneyPosNum, { color: Colors.textDisabled }]}>{m.pos}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.moneyPosLabel, { color: Colors.textDisabled }]}>{m.label}</Text>
                        <Text style={[styles.moneyPosPlanet, { color: Colors.textDisabled }]}>позиция {m.pos}</Text>
                      </View>
                      <MaterialIcons name="lock" size={14} color={Colors.textDisabled} />
                    </View>
                  </Pressable>
                );
              })}

              {/* Summary vector */}
              <GC>
                <Text style={styles.moneyVecLabel}>ФИНАНСОВЫЙ ВЕКТОР</Text>
                <Text style={styles.moneyVecText}>
                  Денежная энергия включается через Венеру (6) — через вкус, красоту и качество отношений.
                  Закрепляется через Меркурий (5) — через речь, контакты и движение смысла.
                  Итоговая Восьмёрка: масштаб приходит через систему, дисциплину и долгую дистанцию — не через случайность.
                </Text>
              </GC>

              <Pressable onPress={handlePaywall} style={styles.moneyCtaCard}>
                <View>
                  <Text style={styles.moneyCtaTitle}>Полный код реализации</Text>
                  <Text style={styles.moneyCtaSub}>Все 4 позиции · Большое исследование</Text>
                </View>
                <View style={styles.moneyCtaRight}>
                  <Text style={styles.moneyCtaPrice}>2 900 ₽</Text>
                  <MaterialIcons name="arrow-forward" size={16} color={Colors.gold} />
                </View>
              </Pressable>
            </View>
          ) : null}

          {/* DEPTH ─────────────────────────────────────────────────────── */}
          {activeTab === 'depth' ? (
            <View style={styles.section}>
              <SH label="БОЛЬШОЕ ИССЛЕДОВАНИЕ" title="Дом Самопознания" />

              {/* Hero banner */}
              <LinearGradient
                colors={[Colors.surfaceDark, Colors.background]}
                style={styles.depthHero}
              >
                <View style={styles.depthHeroBadge}>
                  <MaterialIcons name="workspace-premium" size={10} color={Colors.background} />
                  <Text style={styles.depthHeroBadgeText}>БОЛЬШОЕ ИССЛЕДОВАНИЕ</Text>
                </View>
                <Text style={styles.depthHeroTitle}>Персональный{'\n'}PDF-разбор</Text>
                <Text style={styles.depthHeroDesc}>
                  22 раздела · составные числа · матрица · циклы · деньги · практический план
                </Text>
                <View style={styles.depthFormulaBox}>
                  <Text style={styles.depthFormulaLabel}>Ваша формула</Text>
                  <Text style={styles.depthFormulaValue}>{finals.join(' — ')}</Text>
                  <Text style={styles.depthFormulaSub}>составные: {compStr}</Text>
                </View>
              </LinearGradient>

              {/* What's inside */}
              <SH label="ЧТО ВНУТРИ" title="Закрытые разделы" />

              {DEPTH_SECTIONS.map(d => (
                <LockedDepthCard
                  key={d.title}
                  icon={d.icon}
                  title={d.title}
                  teaser={d.teaser}
                  desc={d.desc}
                  onPress={handlePaywall}
                />
              ))}

              {/* Value statement */}
              <GC>
                <Text style={styles.depthValueText}>
                  Вы уже получили бесплатный паспорт с пятью позициями, картой, синтезом и практиками.{'\n\n'}
                  Полное исследование — это 22 раздела в глубину: составные числа, зоны напряжения,
                  матрица, циклы, денежный код, возрастная карта — и персональный PDF, к которому можно возвращаться.
                </Text>
              </GC>

              {/* CTA */}
              <Pressable
                onPress={handlePaywall}
                style={({ pressed }) => [styles.depthCta, pressed && { opacity: 0.88 }]}
              >
                <LinearGradient
                  colors={[Colors.gold, Colors.goldSoft]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.depthCtaGrad}
                >
                  <Text style={styles.depthCtaText}>Открыть за 2 900 ₽</Text>
                  <MaterialIcons name="arrow-forward" size={18} color={Colors.background} />
                </LinearGradient>
              </Pressable>
              <Text style={styles.depthCtaNote}>
                Разовая покупка · без подписки · не является консультацией
              </Text>
            </View>
          ) : null}

        </View>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <Text style={styles.footer}>
          Система «Цифровой Код» — авторский инструмент самоисследования. Не является медицинской, психологической,
          финансовой или юридической консультацией. Альберт Анатольевич Вяземский.
        </Text>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { gap: 0 },

  // Hero
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surfaceDark,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  heroBack: { paddingVertical: 10, alignSelf: 'flex-start', marginBottom: Spacing.sm },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', marginBottom: Spacing.xs,
  },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gold },
  heroBadgeText: { ...Typography.label, color: Colors.gold, letterSpacing: 1.8 },
  heroName: {
    fontSize: 34, fontWeight: '700', color: Colors.textPrimary,
    lineHeight: 40, letterSpacing: -0.5,
  },
  heroDob: { ...Typography.caption, color: Colors.textMuted, marginBottom: Spacing.sm },

  // Formula strip
  formulaStrip: {
    flexDirection: 'row', alignItems: 'flex-end',
    marginTop: Spacing.sm, gap: 0,
  },
  fNode: { alignItems: 'center', gap: 2, flex: 1 },
  fNodeCircle: {
    width: 46, height: 46, borderRadius: 23, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  fNodeNum: { fontSize: 18, fontWeight: '700', lineHeight: 22 },
  fNodeComp: { fontSize: 9, lineHeight: 11 },
  fNodeLabel: { ...Typography.caption, color: Colors.textDisabled, fontSize: 9 },
  fConnector: { width: 1, height: 24, alignSelf: 'center', marginHorizontal: 2, marginBottom: 14 },
  formulaCompLine: {
    ...Typography.caption, color: Colors.textDisabled,
    fontStyle: 'italic', fontSize: 10, marginTop: Spacing.sm,
  },
  formulaPlanetLine: {
    ...Typography.caption, color: Colors.textDisabled,
    fontSize: 9, marginTop: 3, lineHeight: 14,
  },

  // Tabs
  tabsBar: {
    backgroundColor: Colors.surfaceDark,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  tabsContent: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg,
    paddingVertical: 10, gap: Spacing.sm,
  },
  tab: {
    paddingVertical: 7, paddingHorizontal: Spacing.md,
    borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.borderLight,
  },
  tabActive: { backgroundColor: Colors.goldTint, borderColor: Colors.border },
  tabPremium: { borderColor: Colors.border },
  tabText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '500' },
  tabTextActive: { color: Colors.gold, fontWeight: '700' },
  tabTextPremium: { color: Colors.gold },

  // Content
  tabBody: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  section: { gap: Spacing.lg, paddingBottom: Spacing.xxl },

  // Map tab
  constellationWrap: {
    alignItems: 'center', borderRadius: Radii.xxl,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.borderLight,
    paddingVertical: Spacing.lg,
    overflow: 'hidden',
  },
  posGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  posCard: {
    backgroundColor: Colors.surface, borderWidth: 1, borderRadius: Radii.lg,
    padding: Spacing.md, alignItems: 'center', gap: 4,
    width: '18%', flexGrow: 1,
  },
  posNumWrap: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  posNum: { fontSize: 16, fontWeight: '700' },
  posComp: { fontSize: 8, lineHeight: 10 },
  posLabel: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600', fontSize: 9, textAlign: 'center' },
  posPlanet: { ...Typography.caption, fontSize: 8, textAlign: 'center' },
  mapIntroLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: 4 },
  mapIntroText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  mapCta: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing.sm, marginTop: 4,
  },
  mapCtaText: { ...Typography.caption, color: Colors.gold, fontWeight: '600' },

  // Passport tab
  passportIntro: {
    ...Typography.caption, color: Colors.textDisabled, fontStyle: 'italic',
    lineHeight: 18, marginBottom: Spacing.xs,
  },

  // Synthesis tab
  synthHero: {
    borderRadius: Radii.xxl, padding: Spacing.xl, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  synthHeroTop: { gap: 6 },
  synthHeroBadge: {
    backgroundColor: Colors.goldGlow, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.border,
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
  },
  synthHeroBadgeText: { ...Typography.label, color: Colors.gold, fontSize: 9, letterSpacing: 1.2 },
  synthHeroFormula: {
    fontSize: 30, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 3,
  },
  synthHeroSub: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic' },
  synthHeroDivider: { height: 1, backgroundColor: Colors.borderLight },
  synthHeroVec: {
    ...Typography.bodySmall, color: Colors.gold,
    fontStyle: 'italic', lineHeight: 22,
  },
  synthHeroText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 26 },
  synBulletRow: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingVertical: 10, alignItems: 'flex-start',
  },
  synBulletDivider: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  synBulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  synBulletText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1, lineHeight: 22 },
  synTensionText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 24 },
  synVectorBox: { borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, marginTop: 4 },
  synVectorLabel: { ...Typography.label, fontSize: 10, marginBottom: 4 },
  synVectorText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  synText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 24 },
  synthLockedRow: {
    borderRadius: Radii.xl, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.goldTint,
  },
  synthLockedInner: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, padding: Spacing.md,
  },
  synthLockedTitle: { ...Typography.bodySmall, color: Colors.gold, fontWeight: '600' },
  synthLockedSub: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },

  // Practices tab
  practicesIntro: {
    ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22,
    borderLeftWidth: 2, borderLeftColor: Colors.gold + '45',
    paddingLeft: Spacing.md,
  },
  practiceCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, padding: Spacing.lg, gap: Spacing.sm,
  },
  practiceCardTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  practiceIconBg: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  practiceTypeBadge: {
    borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1,
  },
  practiceTypeText: { ...Typography.label, fontSize: 9, letterSpacing: 0.8 },
  practiceTitle: { ...Typography.subheading, color: Colors.textPrimary, lineHeight: 22 },
  practiceBody: { ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22 },
  practiceDisclaimer: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', fontStyle: 'italic', lineHeight: 17, fontSize: 10,
  },
  practiceLine: { height: 1, borderRadius: 1 },

  // Money tab
  moneyDisclaimer: { ...Typography.caption, color: Colors.textMuted, lineHeight: 18, fontStyle: 'italic' },
  moneyFormulaCard: {
    borderRadius: Radii.xxl, padding: Spacing.xl,
    borderWidth: 1, borderColor: Colors.borderLight, gap: Spacing.md,
  },
  moneyFormulaLabel: { ...Typography.label, color: Colors.gold },
  moneyFormulaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  moneyFNode: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 1.5,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  moneyFNum: { fontSize: 22, fontWeight: '700' },
  moneyFPlanet: { fontSize: 8, fontWeight: '500' },
  moneyCon: { flex: 1, height: 1, maxWidth: 20 },
  moneyCardHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  moneyPosBadge: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  moneyPosNum: { fontSize: 16, fontWeight: '700' },
  moneyPosLabel: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  moneyPosPlanet: { ...Typography.caption, fontWeight: '500', marginTop: 2 },
  moneyPosDesc: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  moneyLockedCard: {
    backgroundColor: Colors.surfaceAlt, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  moneyLockedInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  moneyVecLabel: { ...Typography.label, color: Colors.gold, marginBottom: 4 },
  moneyVecText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 24 },
  moneyCtaCard: {
    backgroundColor: Colors.goldGlow, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  moneyCtaTitle: { ...Typography.subheading, color: Colors.gold },
  moneyCtaSub: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  moneyCtaRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  moneyCtaPrice: { fontSize: 19, fontWeight: '700', color: Colors.gold },

  // Depth tab
  depthHero: {
    borderRadius: Radii.xxl, padding: Spacing.xl, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  depthHeroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 4,
  },
  depthHeroBadgeText: { ...Typography.label, color: Colors.background, fontSize: 9, letterSpacing: 1 },
  depthHeroTitle: { ...Typography.display, color: Colors.textPrimary, lineHeight: 44 },
  depthHeroDesc: { ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22 },
  depthFormulaBox: {
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: Radii.lg,
    padding: Spacing.md, gap: 4, borderWidth: 1, borderColor: Colors.border,
  },
  depthFormulaLabel: { ...Typography.label, color: Colors.gold },
  depthFormulaValue: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 3 },
  depthFormulaSub: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic', fontSize: 11 },
  depthValueText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 24 },
  depthCta: { borderRadius: Radii.lg, overflow: 'hidden', ...Shadows.gold },
  depthCtaGrad: {
    paddingVertical: 18, paddingHorizontal: Spacing.xl,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: Spacing.sm,
  },
  depthCtaText: { ...Typography.button, color: Colors.background, fontWeight: '700', fontSize: 17 },
  depthCtaNote: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', fontSize: 10,
  },

  footer: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', lineHeight: 18, fontSize: 10,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm, paddingBottom: Spacing.lg,
  },
});
