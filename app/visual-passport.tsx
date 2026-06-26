/**
 * Visual Passport — premium prototype screen.
 * Цифровой паспорт · Визуальный паспорт
 *
 * Tabs: Карта / Паспорт / Синтез / Практики / Деньги / Глубина
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Dimensions, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ConstellationMap } from '@/components/brand/ConstellationMap';
import { Colors, Spacing, Typography, Radii, Shadows, PLANET_COLORS, PLANET_NAMES } from '@/constants/theme';

// ── Mock data ─────────────────────────────────────────────────────────────────
// Replace this with real calculated session data later.

const MOCK = {
  name: 'Артём',
  dob: '06.05.1986',
  formula: {
    soul: { final: 6, composite: 6 },
    expression: { final: 2, composite: 11 },
    path: { final: 8, composite: 35 },
    direction: { final: 5, composite: 41 },
    result: { final: 1, composite: 82 },
  },
};

// ── Positions meta ────────────────────────────────────────────────────────────

const POSITIONS = [
  {
    key: 'soul',
    label: 'Число Души',
    shortLabel: 'Душа',
    role: 'Внутренняя природа',
    description:
      'Природа Венеры: стремление к красоте, теплу и качеству жизни. Внутри вы — гармонизатор, создатель пространства, где людям хорошо.',
    light: 'Любовь, красота, гармония, качество жизни, способность создавать пространство.',
    shadow: 'Контроль через заботу, перфекционизм, откладывание своей жизни ради идеала.',
    orient: 'Создавайте красивое — это ваш ресурс, не роскошь. Учитесь принимать заботу.',
  },
  {
    key: 'expression',
    label: 'Число Выражения',
    shortLabel: 'Выражение',
    role: 'Способ проявления',
    description:
      'Природа Луны: проявляться через чуткость, контакт и пространство доверия. Сила раскрывается через присутствие, а не через давление.',
    light: 'Тонкость, эмпатия, дипломатичность, способность чувствовать атмосферу.',
    shadow: 'Зависимость от отклика, страх проявиться прямо, ожидание разрешения от других.',
    orient: 'Проявляйтесь через точное присутствие и диалог, но не растворяйтесь в чужом состоянии.',
    authorNote: 'Авторское расширение системы',
  },
  {
    key: 'path',
    label: 'Число Пути',
    shortLabel: 'Путь',
    role: 'Движение в мире',
    description:
      'Природа Сатурна: ваш путь через дисциплину. Вы движетесь медленно, но строите надёжно и долгосрочно.',
    light: 'Дисциплина, зрелость, способность нести ответственность, строить серьёзное.',
    shadow: 'Самоизнос через долг, ощущение вечного должника, неумение отдыхать.',
    orient: 'Инвестируйте в долгое и серьёзное. Позвольте себе отдыхать — это часть системы.',
  },
  {
    key: 'direction',
    label: 'Число Направления',
    shortLabel: 'Направление',
    role: 'Форма раскрытия',
    description:
      'Природа Меркурия: реализуетесь через коммуникацию, обучение, связи и упаковку смысла.',
    light: 'Коммуникация, гибкость, новые связи, движение, адаптация.',
    shadow: 'Рассеянность, бегство от глубины, неспособность к завершению.',
    orient: 'Выбирайте одно и доводите до результата — глубина это не ограничение, а ресурс.',
  },
  {
    key: 'result',
    label: 'Число Результата',
    shortLabel: 'Результат',
    role: 'Зрелый итог пути',
    description:
      'Природа Солнца: зрелая автономия. Жизнь ведёт к умению быть собой без борьбы с миром.',
    light: 'Лидерство, воля, инициатива, способность принимать решения и вести.',
    shadow: 'Упрямство, нежелание слышать других, соблазн контролировать в одиночку.',
    orient: 'Создавайте своё. Учитесь слышать — это усиливает, а не ослабляет силу.',
  },
];

// ── Practice cards ────────────────────────────────────────────────────────────

const PRACTICES = [
  {
    icon: 'visibility',
    type: 'Наблюдение',
    title: 'Утренний сигнал',
    body: 'Три минуты наблюдайте, как ваша природа Венеры хочет проявиться сегодня. Что вы хотите создать, улучшить, сделать красивым?',
    color: Colors.venus,
  },
  {
    icon: 'bolt',
    type: 'Действие',
    title: 'Один завершённый шаг',
    body: 'Путь Сатурна требует не скорости, а регулярности. Выберите одно дело и доведите до конца, прежде чем расширяться.',
    color: Colors.saturn,
  },
  {
    icon: 'spa',
    type: 'Восстановление',
    title: 'Граница через тишину',
    body: 'Выражение Луны истощается без тишины. Одна запланированная пауза без объяснений — это не уход, а ресурс.',
    color: Colors.moon,
  },
  {
    icon: 'forum',
    type: 'Коммуникация',
    title: 'Слово как инструмент',
    body: 'Направление Меркурия реализуется через речь. Сформулируйте мысль письменно перед тем, как говорить вслух.',
    color: Colors.mercury,
  },
];

// ── Money positions ───────────────────────────────────────────────────────────

const MONEY_POSITIONS = [
  {
    pos: 1, label: 'Денежный триггер', number: 6, planet: 'Венера',
    desc: 'Деньги начинают откликаться там, где есть вкус, красота, доверие и ощущение качества.',
    unlocked: true,
  },
  {
    pos: 2, label: 'Денежный канал', number: 5, planet: 'Меркурий',
    desc: 'Поток растёт через речь, контакты, обмен, обучение и способность быть в движении.',
    unlocked: true,
  },
  {
    pos: 3, label: 'Денежный потенциал', number: 6, planet: 'Венера',
    desc: 'Зона сильной монетизации. Раскрывается в Большом исследовании.',
    unlocked: false,
  },
  {
    pos: 4, label: 'Предел роста', number: 8, planet: 'Сатурн',
    desc: 'Что ограничивает масштаб, если не выстроено. Раскрывается в Большом исследовании.',
    unlocked: false,
  },
];

// ── Locked depth sections ─────────────────────────────────────────────────────

const DEPTH_SECTIONS = [
  {
    icon: 'layers',
    title: 'Глубокий разбор',
    desc: '22 раздела: зоны напряжения, детальная матрица, синтез сильных сторон и практический план.',
  },
  {
    icon: 'timeline',
    title: 'Возрастная карта',
    desc: 'Ключевые точки активации кода — в 18, 27, 36, 45... и что они означают именно для вашей формулы.',
  },
  {
    icon: 'people',
    title: 'Совместимость',
    desc: 'Вектор взаимодействия двух формул. Как коды усиливают или создают напряжение.',
  },
  {
    icon: 'autorenew',
    title: 'Личный год 2026',
    desc: 'Год 3 · Юпитер. Зоны напряжения, ключевые месяцы и практический ориентир цикла.',
  },
];

// ── Tab config ────────────────────────────────────────────────────────────────

type TabId = 'map' | 'passport' | 'synthesis' | 'practices' | 'money' | 'depth';
const TABS: { id: TabId; label: string }[] = [
  { id: 'map', label: 'Карта' },
  { id: 'passport', label: 'Паспорт' },
  { id: 'synthesis', label: 'Синтез' },
  { id: 'practices', label: 'Практики' },
  { id: 'money', label: 'Деньги' },
  { id: 'depth', label: '✦ Глубина' },
];

const { width: SW } = Dimensions.get('window');

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <View style={subStyles.sectionHeader}>
      <Text style={subStyles.sectionLabel}>{label}</Text>
      <Text style={subStyles.sectionTitle}>{title}</Text>
    </View>
  );
}

function GlassCard({ children, style, accent }: { children: React.ReactNode; style?: any; accent?: string }) {
  return (
    <View style={[subStyles.glassCard, accent ? { borderColor: accent + '35' } : {}, style]}>
      {children}
    </View>
  );
}

function LockedDepthCard({ icon, title, desc, onPress }: {
  icon: string; title: string; desc: string; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [subStyles.lockedCard, pressed && { opacity: 0.8 }]}>
      <View style={subStyles.lockedIconWrap}>
        <MaterialIcons name={icon as any} size={20} color={Colors.gold} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={subStyles.lockedTitle}>{title}</Text>
        <Text style={subStyles.lockedDesc}>{desc}</Text>
      </View>
      <View style={subStyles.lockedBadge}>
        <MaterialIcons name="lock" size={11} color={Colors.surfaceDark} />
      </View>
    </Pressable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function VisualPassportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabId>('map');
  const scrollRef = useRef<ScrollView>(null);

  const { formula, name, dob } = MOCK;

  const constellationNodes = [
    { key: 'soul', label: POSITIONS[0].label, number: formula.soul.final, composite: formula.soul.composite },
    { key: 'expression', label: POSITIONS[1].label, number: formula.expression.final, composite: formula.expression.composite },
    { key: 'path', label: POSITIONS[2].label, number: formula.path.final, composite: formula.path.composite },
    { key: 'direction', label: POSITIONS[3].label, number: formula.direction.final, composite: formula.direction.composite },
    { key: 'result', label: POSITIONS[4].label, number: formula.result.final, composite: formula.result.composite },
  ];

  const finals = [
    formula.soul.final, formula.expression.final,
    formula.path.final, formula.direction.final, formula.result.final,
  ];
  const composites = [
    formula.expression.composite, formula.path.composite,
    formula.direction.composite, formula.result.composite,
  ];

  const handlePaywall = () => router.push('/paywall');

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 80 },
        ]}
        stickyHeaderIndices={[1]}
      >
        {/* ── Hero header ───────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <Pressable onPress={() => router.back()} style={styles.heroBack} hitSlop={10}>
            <MaterialIcons name="arrow-back" size={18} color={Colors.textMuted} />
          </Pressable>
          <View style={styles.heroCenter}>
            <View style={styles.heroBadge}>
              <MaterialIcons name="fingerprint" size={10} color={Colors.background} />
              <Text style={styles.heroBadgeText}>ВИЗУАЛЬНЫЙ ПАСПОРТ</Text>
            </View>
            <Text style={styles.heroName}>{name}</Text>
            <Text style={styles.heroDob}>{dob}</Text>
            {/* Formula strip */}
            <View style={styles.formulaStrip}>
              {finals.map((n, i) => {
                const color = PLANET_COLORS[n] || Colors.gold;
                return (
                  <React.Fragment key={i}>
                    <View style={[styles.formulaNode, { borderColor: color + '50' }]}>
                      <Text style={[styles.formulaNodeNum, { color }]}>{n}</Text>
                    </View>
                    {i < finals.length - 1 ? (
                      <View style={[styles.formulaConnector, { backgroundColor: color + '25' }]} />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </View>
            <Text style={styles.formulaComposites}>
              {composites.join(' · ')}
            </Text>
          </View>
        </View>

        {/* ── Sticky tabs ───────────────────────────────────────────────── */}
        <View style={styles.tabsBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {TABS.map(t => {
              const isActive = activeTab === t.id;
              const isDepth = t.id === 'depth';
              return (
                <Pressable
                  key={t.id}
                  onPress={() => {
                    setActiveTab(t.id);
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                  }}
                  style={[
                    styles.tab,
                    isActive && styles.tabActive,
                    isDepth && styles.tabDepth,
                  ]}
                >
                  <Text style={[
                    styles.tabText,
                    isActive && styles.tabTextActive,
                    isDepth && !isActive && styles.tabTextDepth,
                  ]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Tab bodies ────────────────────────────────────────────────── */}
        <View style={styles.tabBody}>

          {/* MAP ─────────────────────────────────────────────────────── */}
          {activeTab === 'map' ? (
            <View style={styles.section}>
              <SectionHeader label="КАРТА ЧИСЕЛ" title="Личная формула" />

              <View style={styles.constellationWrap}>
                <ConstellationMap nodes={constellationNodes} size={Math.min(SW - 40, 340)} />
              </View>

              {/* Number legend below map */}
              <View style={styles.legendGrid}>
                {POSITIONS.map((pos, i) => {
                  const numData = finals[i];
                  const color = PLANET_COLORS[numData] || Colors.gold;
                  const comp = constellationNodes[i].composite;
                  const showComp = comp !== numData;
                  return (
                    <View key={pos.key} style={[styles.legendItem, { borderColor: color + '25' }]}>
                      <View style={[styles.legendDot, { backgroundColor: color }]} />
                      <View style={styles.legendText}>
                        <Text style={[styles.legendNum, { color }]}>
                          {showComp ? `${comp}→${numData}` : numData}
                        </Text>
                        <Text style={styles.legendLabel}>{pos.shortLabel}</Text>
                      </View>
                      <Text style={[styles.legendPlanet, { color: color + 'AA' }]}>
                        {PLANET_NAMES[numData]}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <Text style={styles.planetNote}>
                Планеты — метафорический язык системы, не астрологический прогноз.
              </Text>
            </View>
          ) : null}

          {/* PASSPORT ─────────────────────────────────────────────── */}
          {activeTab === 'passport' ? (
            <View style={styles.section}>
              <SectionHeader label="ЦИФРОВОЙ ПАСПОРТ" title="Пять позиций" />

              {POSITIONS.map((pos, i) => {
                const numFinal = finals[i];
                const numComp = constellationNodes[i].composite;
                const color = PLANET_COLORS[numFinal] || Colors.gold;
                const showComp = numComp !== numFinal;
                const isExpr = pos.key === 'expression';
                return (
                  <GlassCard key={pos.key} accent={color}>
                    {/* Card header */}
                    <View style={styles.passportCardHead}>
                      <LinearGradient
                        colors={[color + '22', color + '08']}
                        style={styles.passportCircleGrad}
                      >
                        <Text style={[styles.passportNum, { color }]}>{numFinal}</Text>
                        {showComp ? (
                          <Text style={[styles.passportComp, { color: color + 'CC' }]}>{numComp}</Text>
                        ) : null}
                      </LinearGradient>
                      <View style={styles.passportHeadText}>
                        <View style={styles.passportLabelRow}>
                          <Text style={styles.passportPosLabel}>{pos.label}</Text>
                          {isExpr ? (
                            <View style={styles.authorTag}>
                              <Text style={styles.authorTagText}>авт.</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={[styles.passportPlanetLabel, { color }]}>
                          {PLANET_NAMES[numFinal]} · {pos.role}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.passportDivider} />
                    <Text style={styles.passportDesc}>{pos.description}</Text>

                    {/* Light / Shadow strip */}
                    <View style={styles.passportLSRow}>
                      <View style={[styles.passportLSBox, { borderColor: color + '25', backgroundColor: color + '07' }]}>
                        <Text style={[styles.passportLSTag, { color }]}>Свет</Text>
                        <Text style={styles.passportLSText}>{pos.light}</Text>
                      </View>
                      <View style={[styles.passportLSBox, { borderColor: Colors.borderLight }]}>
                        <Text style={[styles.passportLSTag, { color: Colors.textMuted }]}>Напряжение</Text>
                        <Text style={styles.passportLSText}>{pos.shadow}</Text>
                      </View>
                    </View>

                    <View style={[styles.passportOrient, { borderColor: color + '20', backgroundColor: color + '05' }]}>
                      <Text style={[styles.passportOrientTag, { color }]}>Ориентир</Text>
                      <Text style={styles.passportOrientText}>{pos.orient}</Text>
                    </View>

                    {isExpr ? (
                      <Text style={styles.authorNote}>{pos.authorNote} · не является астрологическим прогнозом</Text>
                    ) : null}
                  </GlassCard>
                );
              })}
            </View>
          ) : null}

          {/* SYNTHESIS ───────────────────────────────────────────── */}
          {activeTab === 'synthesis' ? (
            <View style={styles.section}>
              <SectionHeader label="СИНТЕЗ" title="Главная формула" />

              {/* Hero synthesis card */}
              <LinearGradient
                colors={[Colors.surfaceDark, '#101008']}
                style={styles.synthesisHero}
              >
                <Text style={styles.synthesisHeroLabel}>ФОРМУЛА</Text>
                <Text style={styles.synthesisHeroFormula}>
                  {finals.join('—')}
                </Text>
                <Text style={styles.synthesisHeroName}>{name} · {dob}</Text>
                <View style={styles.synthesisHeroDivider} />
                <Text style={styles.synthesisHeroText}>
                  Внутри — Венера. Стремление к красоте, теплу и качеству жизни.{'\n\n'}
                  Проявление — Луна. Сила раскрывается через чуткость, контакт и доверие.{'\n\n'}
                  Путь — Сатурн. Движение через дисциплину, зрелость и долгую дистанцию.{'\n\n'}
                  Направление — Меркурий. Реализация через коммуникацию, обучение, упаковку смысла.{'\n\n'}
                  Результат — Солнце. Зрелая автономия. Право быть видимым и вести собственный курс.
                </Text>
              </LinearGradient>

              {/* Strength blocks */}
              <SectionHeader label="РЕСУРС" title="Сильные стороны" />
              <GlassCard>
                {[
                  'Способность создавать живое человеческое пространство — Венера даёт вкус, заботу и эмоциональное качество.',
                  'Тонкое проявление через контакт — Луна в выражении показывает, что сила раскрывается через присутствие.',
                  'Потенциал долгой дистанции — Сатурн в пути даёт способность выстраивать большое при наличии системы.',
                  'Раскрытие через слово и смысл — Меркурий в направлении: реализация через объяснение и публичность.',
                ].map((s, i, arr) => (
                  <View key={i} style={[styles.bulletRow, i < arr.length - 1 && styles.bulletRowDivider]}>
                    <View style={[styles.bulletDot, { backgroundColor: Colors.gold }]} />
                    <Text style={styles.bulletText}>{s}</Text>
                  </View>
                ))}
              </GlassCard>

              {/* Tension block */}
              <SectionHeader label="ЗАДАЧА" title="Главное напряжение" />
              <GlassCard accent={Colors.saturn}>
                <Text style={styles.tensionText}>
                  Венера хочет красоты и мягкости, Луна ищет отклика, Сатурн требует дисциплины,
                  Меркурий тянет в расширение, а Солнце требует собственного курса.
                </Text>
                <View style={[styles.tensionBox, { borderColor: Colors.saturn + '30', backgroundColor: Colors.saturn + '08' }]}>
                  <Text style={[styles.tensionBoxLabel, { color: Colors.saturn }]}>Вектор</Text>
                  <Text style={styles.tensionBoxText}>
                    Не растворяться в ожидании идеального отклика и не распыляться. Собрать свою систему и выйти с ней в мир через речь, объяснение или публичное присутствие.
                  </Text>
                </View>
              </GlassCard>

              {/* Locked synthesis depth */}
              <Pressable onPress={handlePaywall} style={styles.synthesisLockedCard}>
                <View style={styles.synthesisLockedInner}>
                  <MaterialIcons name="lock" size={18} color={Colors.gold} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.synthesisLockedTitle}>
                      Зоны напряжения · Практические ориентиры · Вектор развития
                    </Text>
                    <Text style={styles.synthesisLockedSub}>Открывается в Большом исследовании</Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={16} color={Colors.gold} />
                </View>
              </Pressable>
            </View>
          ) : null}

          {/* PRACTICES ───────────────────────────────────────────── */}
          {activeTab === 'practices' ? (
            <View style={styles.section}>
              <SectionHeader label="ПРАКТИКИ" title="Четыре режима" />
              <Text style={styles.practicesIntro}>
                Практики выведены из вашей формулы. Они работают не как рекомендации, а как ориентиры — точки, где ваша природа откликается быстрее.
              </Text>
              <View style={styles.practiceGrid}>
                {PRACTICES.map((p, i) => (
                  <View key={i} style={[styles.practiceCard, { borderColor: p.color + '30' }]}>
                    <View style={[styles.practiceIconWrap, { backgroundColor: p.color + '12' }]}>
                      <MaterialIcons name={p.icon as any} size={20} color={p.color} />
                    </View>
                    <View style={[styles.practiceTypeBadge, { backgroundColor: p.color + '15', borderColor: p.color + '25' }]}>
                      <Text style={[styles.practiceTypeText, { color: p.color }]}>{p.type}</Text>
                    </View>
                    <Text style={styles.practiceTitle}>{p.title}</Text>
                    <Text style={styles.practiceBody}>{p.body}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.practiceDisclaimer}>
                Практики носят самоисследовательский характер. Не являются медицинской или психологической рекомендацией.
              </Text>
            </View>
          ) : null}

          {/* MONEY ───────────────────────────────────────────────── */}
          {activeTab === 'money' ? (
            <View style={styles.section}>
              <SectionHeader label="ДЕНЕЖНЫЙ КОД" title="Код реализации" />

              <GlassCard>
                <Text style={styles.moneyDisclaimer}>
                  Это не финансовая рекомендация. Раздел описывает личные паттерны отношения к ценности, обмену и реализации.
                </Text>
              </GlassCard>

              {/* Formula */}
              <View style={styles.moneyFormula}>
                {MONEY_POSITIONS.map((m, i) => {
                  const color = PLANET_COLORS[m.number] || Colors.gold;
                  return (
                    <React.Fragment key={m.pos}>
                      <View style={[styles.moneyNode, { borderColor: color + '40' }, !m.unlocked && styles.moneyNodeLocked]}>
                        {m.unlocked ? (
                          <>
                            <Text style={[styles.moneyNodeNum, { color }]}>{m.number}</Text>
                            <Text style={[styles.moneyNodePlanet, { color: color + 'CC' }]}>{m.planet}</Text>
                          </>
                        ) : (
                          <MaterialIcons name="lock" size={16} color={Colors.textDisabled} />
                        )}
                      </View>
                      {i < MONEY_POSITIONS.length - 1 ? (
                        <View style={[styles.moneyConnector, { backgroundColor: Colors.borderLight }]} />
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </View>

              {/* Position cards */}
              {MONEY_POSITIONS.map(m => {
                const color = PLANET_COLORS[m.number] || Colors.gold;
                return m.unlocked ? (
                  <GlassCard key={m.pos} accent={color}>
                    <View style={styles.moneyCardHead}>
                      <View style={[styles.moneyPosBadge, { backgroundColor: color + '15', borderColor: color + '30' }]}>
                        <Text style={[styles.moneyPosText, { color }]}>{m.pos}</Text>
                      </View>
                      <View style={styles.moneyPosInfo}>
                        <Text style={styles.moneyPosLabel}>{m.label}</Text>
                        <Text style={[styles.moneyPosPlanet, { color }]}>{m.number} · {m.planet}</Text>
                      </View>
                    </View>
                    <Text style={styles.moneyPosDesc}>{m.desc}</Text>
                  </GlassCard>
                ) : (
                  <Pressable key={m.pos} onPress={handlePaywall} style={styles.moneyLockedCard}>
                    <View style={styles.moneyLockedInner}>
                      <View style={[styles.moneyPosBadge, { backgroundColor: Colors.surfaceAlt, borderColor: Colors.borderLight }]}>
                        <Text style={[styles.moneyPosText, { color: Colors.textDisabled }]}>{m.pos}</Text>
                      </View>
                      <View style={styles.moneyPosInfo}>
                        <Text style={[styles.moneyPosLabel, { color: Colors.textDisabled }]}>{m.label}</Text>
                        <Text style={[styles.moneyPosPlanet, { color: Colors.textDisabled }]}>Позиция {m.pos}</Text>
                      </View>
                      <MaterialIcons name="lock" size={14} color={Colors.textDisabled} />
                    </View>
                  </Pressable>
                );
              })}

              {/* Financial vector */}
              <GlassCard>
                <Text style={styles.moneyVectorLabel}>ФИНАНСОВЫЙ ВЕКТОР</Text>
                <Text style={styles.moneyVectorText}>
                  Денежный поток включается через Венеру (6). Закрепляется через Меркурий (5). Потенциал снова возвращает к Венере (6). Итоговая восьмёрка: масштаб приходит через систему, дисциплину и долгую дистанцию.
                </Text>
              </GlassCard>

              <Pressable onPress={handlePaywall} style={styles.moneyCtaCard}>
                <Text style={styles.moneyCtaText}>Открыть полный денежный код</Text>
                <Text style={styles.moneyCtaPrice}>2 900 ₽</Text>
              </Pressable>
            </View>
          ) : null}

          {/* DEPTH ───────────────────────────────────────────────── */}
          {activeTab === 'depth' ? (
            <View style={styles.section}>
              <SectionHeader label="БОЛЬШОЕ ИССЛЕДОВАНИЕ" title="Дом Самопознания" />

              <LinearGradient
                colors={[Colors.surfaceDark, Colors.background]}
                style={styles.depthHero}
              >
                <View style={styles.depthHeroBadge}>
                  <MaterialIcons name="workspace-premium" size={12} color={Colors.background} />
                  <Text style={styles.depthHeroBadgeText}>БОЛЬШОЕ ИССЛЕДОВАНИЕ</Text>
                </View>
                <Text style={styles.depthHeroTitle}>Персональный{'\n'}PDF-разбор</Text>
                <Text style={styles.depthHeroDesc}>
                  22 раздела · полная формула · составные числа · матрица · циклы · деньги · практический план
                </Text>
                <View style={styles.depthFormulaBox}>
                  <Text style={styles.depthFormulaLabel}>Ваша формула</Text>
                  <Text style={styles.depthFormulaValue}>{finals.join('—')}</Text>
                  <Text style={styles.depthFormulaComposites}>
                    составные: {composites.join(' / ')}
                  </Text>
                </View>
              </LinearGradient>

              {/* Depth section cards */}
              {DEPTH_SECTIONS.map(d => (
                <LockedDepthCard
                  key={d.title}
                  icon={d.icon}
                  title={d.title}
                  desc={d.desc}
                  onPress={handlePaywall}
                />
              ))}

              {/* CTA */}
              <Pressable
                onPress={handlePaywall}
                style={({ pressed }) => [styles.depthCta, pressed && { opacity: 0.9 }]}
              >
                <Text style={styles.depthCtaText}>Открыть за 2 900 ₽</Text>
              </Pressable>
              <Text style={styles.depthCtaSub}>
                Разовая покупка · без подписки · не является консультацией
              </Text>
            </View>
          ) : null}

        </View>

        {/* ── Footer disclaimer ─────────────────────────────────────── */}
        <Text style={styles.footerLegal}>
          Система «Цифровой Код» носит информационно-развлекательный и самоисследовательский характер.
          Не является медицинской, психологической, финансовой или юридической консультацией.
        </Text>
      </ScrollView>
    </View>
  );
}

// ── Sub-styles ────────────────────────────────────────────────────────────────

const subStyles = StyleSheet.create({
  sectionHeader: { gap: 3, marginBottom: Spacing.xs },
  sectionLabel: { ...Typography.label, color: Colors.gold, letterSpacing: 1.4 },
  sectionTitle: { ...Typography.heading, color: Colors.textPrimary },
  glassCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  lockedCard: {
    backgroundColor: Colors.goldTint,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  lockedIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  lockedTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  lockedDesc: { ...Typography.caption, color: Colors.textMuted, marginTop: 3, lineHeight: 17 },
  lockedBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ── Main styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { gap: 0 },

  // Hero
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surfaceDark,
    gap: Spacing.sm,
  },
  heroBack: { padding: 4, alignSelf: 'flex-start', marginBottom: Spacing.xs },
  heroCenter: { gap: Spacing.sm },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.gold, alignSelf: 'flex-start',
    borderRadius: Radii.full, paddingHorizontal: 10, paddingVertical: 4,
  },
  heroBadgeText: { ...Typography.label, color: Colors.background, fontSize: 9, letterSpacing: 1 },
  heroName: { ...Typography.display, color: Colors.textPrimary, fontSize: 30 },
  heroDob: { ...Typography.caption, color: Colors.textMuted },

  // Formula strip in hero
  formulaStrip: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: Spacing.sm,
  },
  formulaNode: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1.5,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  formulaNodeNum: { fontSize: 18, fontWeight: '700' },
  formulaConnector: {
    flex: 1, height: 1, maxWidth: 16,
  },
  formulaComposites: {
    ...Typography.caption, color: Colors.textDisabled,
    fontStyle: 'italic', fontSize: 10, marginTop: 3,
  },

  // Tabs
  tabsBar: {
    backgroundColor: Colors.surfaceDark,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  tabsContent: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tab: {
    paddingVertical: 7, paddingHorizontal: Spacing.md,
    borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.borderLight,
  },
  tabActive: {
    backgroundColor: Colors.goldTint, borderColor: Colors.border,
  },
  tabDepth: { borderColor: Colors.border },
  tabText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '500' },
  tabTextActive: { color: Colors.gold, fontWeight: '700' },
  tabTextDepth: { color: Colors.gold },

  // Tab body
  tabBody: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  section: { gap: Spacing.lg, paddingBottom: Spacing.xl },

  // Map tab
  constellationWrap: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.xxl,
    borderWidth: 1, borderColor: Colors.borderLight,
    paddingVertical: Spacing.lg,
    overflow: 'hidden',
  },
  legendGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderWidth: 1,
    borderRadius: Radii.lg, paddingHorizontal: Spacing.md, paddingVertical: 10,
    width: '47%',
  },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { flex: 1 },
  legendNum: { fontSize: 16, fontWeight: '700' },
  legendLabel: { ...Typography.caption, color: Colors.textMuted, fontSize: 10 },
  legendPlanet: { ...Typography.caption, fontSize: 10, fontWeight: '500' },
  planetNote: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', fontStyle: 'italic', lineHeight: 17,
  },

  // Passport tab
  passportCardHead: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  passportCircleGrad: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  passportNum: { fontSize: 28, fontWeight: '700', lineHeight: 32 },
  passportComp: { fontSize: 11, lineHeight: 14 },
  passportHeadText: { flex: 1 },
  passportLabelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  passportPosLabel: { ...Typography.subheading, color: Colors.textPrimary },
  passportPlanetLabel: { ...Typography.caption, fontWeight: '600', marginTop: 4 },
  authorTag: {
    backgroundColor: Colors.goldTint, borderRadius: Radii.full,
    paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: Colors.border,
  },
  authorTagText: { ...Typography.caption, color: Colors.gold, fontSize: 9 },
  passportDivider: { height: 1, backgroundColor: Colors.borderLight },
  passportDesc: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  passportLSRow: { flexDirection: 'row', gap: Spacing.sm },
  passportLSBox: {
    flex: 1, borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 3,
  },
  passportLSTag: { ...Typography.label, fontSize: 10 },
  passportLSText: { ...Typography.caption, color: Colors.textMuted, lineHeight: 17 },
  passportOrient: {
    borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 3,
  },
  passportOrientTag: { ...Typography.label, fontSize: 10 },
  passportOrientText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  authorNote: {
    ...Typography.caption, color: Colors.textDisabled,
    fontStyle: 'italic', lineHeight: 16, fontSize: 10,
  },

  // Synthesis tab
  synthesisHero: {
    borderRadius: Radii.xxl, padding: Spacing.xl, gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  synthesisHeroLabel: { ...Typography.label, color: Colors.gold },
  synthesisHeroFormula: { fontSize: 32, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 4 },
  synthesisHeroName: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic' },
  synthesisHeroDivider: { height: 1, backgroundColor: Colors.borderLight },
  synthesisHeroText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 26 },
  bulletRow: {
    flexDirection: 'row', gap: Spacing.sm, paddingVertical: 10, alignItems: 'flex-start',
  },
  bulletRowDivider: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  bulletText: { ...Typography.bodySmall, color: Colors.textPrimary, flex: 1, lineHeight: 22 },
  tensionText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 24 },
  tensionBox: {
    borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, marginTop: Spacing.xs,
  },
  tensionBoxLabel: { ...Typography.label, fontSize: 10, marginBottom: 4 },
  tensionBoxText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  synthesisLockedCard: {
    borderRadius: Radii.xl, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.goldTint, overflow: 'hidden',
  },
  synthesisLockedInner: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, padding: Spacing.md,
  },
  synthesisLockedTitle: { ...Typography.bodySmall, color: Colors.gold, fontWeight: '600' },
  synthesisLockedSub: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },

  // Practices tab
  practicesIntro: {
    ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 22,
    borderLeftWidth: 2, borderLeftColor: Colors.gold + '50',
    paddingLeft: Spacing.md,
  },
  practiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  practiceCard: {
    width: '47%',
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, padding: Spacing.md, gap: Spacing.sm,
  },
  practiceIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start',
  },
  practiceTypeBadge: {
    alignSelf: 'flex-start', borderRadius: Radii.full,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1,
  },
  practiceTypeText: { ...Typography.label, fontSize: 9, letterSpacing: 0.8 },
  practiceTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600', lineHeight: 18 },
  practiceBody: { ...Typography.caption, color: Colors.textMuted, lineHeight: 17 },
  practiceDisclaimer: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', fontStyle: 'italic', lineHeight: 17, fontSize: 10,
  },

  // Money tab
  moneyDisclaimer: {
    ...Typography.caption, color: Colors.textMuted, lineHeight: 18, fontStyle: 'italic',
  },
  moneyFormula: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, justifyContent: 'center',
  },
  moneyNode: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 1.5, backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  moneyNodeLocked: { borderColor: Colors.borderLight, backgroundColor: Colors.surfaceAlt },
  moneyNodeNum: { fontSize: 20, fontWeight: '700' },
  moneyNodePlanet: { fontSize: 8, fontWeight: '500', marginTop: 1 },
  moneyConnector: { flex: 1, height: 1, maxWidth: 18 },
  moneyCardHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  moneyPosBadge: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  moneyPosText: { fontSize: 15, fontWeight: '700' },
  moneyPosInfo: { flex: 1 },
  moneyPosLabel: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  moneyPosPlanet: { ...Typography.caption, fontWeight: '500', marginTop: 2 },
  moneyPosDesc: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  moneyLockedCard: {
    backgroundColor: Colors.surfaceAlt, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden',
  },
  moneyLockedInner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md,
  },
  moneyVectorLabel: { ...Typography.label, color: Colors.gold, marginBottom: 4 },
  moneyVectorText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  moneyCtaCard: {
    backgroundColor: Colors.goldGlow, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  moneyCtaText: { ...Typography.subheading, color: Colors.gold },
  moneyCtaPrice: { fontSize: 18, fontWeight: '700', color: Colors.gold },

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
  depthFormulaComposites: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic', fontSize: 11 },
  depthCta: {
    backgroundColor: Colors.gold, borderRadius: Radii.lg,
    paddingVertical: 17, alignItems: 'center', ...Shadows.gold,
  },
  depthCtaText: { ...Typography.button, color: Colors.background, fontWeight: '700', fontSize: 16 },
  depthCtaSub: {
    ...Typography.caption, color: Colors.textDisabled, textAlign: 'center', fontSize: 10,
  },

  // Footer
  footerLegal: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', lineHeight: 18, fontSize: 10,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
});
