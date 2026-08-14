/**
 * Reveal Sequence — Sequential Archetype Revelation
 * "Зеркало себя" v4 — Product Brief v1 §10
 *
 * NOT a spinner. Each archetype is revealed one by one as a discovery.
 *
 * Dramatic sequence:
 * 1. Первый ключ — Ваша Душа (see archetype, feel it, then read)
 * 2. Второй ключ — Ваше Выражение
 * 3. Первое соединение — "Когда эти две силы встречаются..."
 * 4. Реализация — Путь
 * 5. Направление
 * 6. Полная карта появляется — WOW moment
 * → Navigate to first-mirror
 *
 * Analytics: reveal_started → reveal_key_seen(n) → reveal_connection_seen → reveal_completed
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { analytics } from '@/services/analytics';
import { Colors, Spacing, Typography, Radii, PLANET_NAMES, PLANET_COLORS } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { ARCHETYPES } from '@/constants/archetypes-data';
import {
  MOCK_PROFILE, buildMirrorProfileFromSession,
  type MirrorProfile,
} from '@/services/mirror-data';

const { width: SW } = Dimensions.get('window');

// ── Individual key reveal card ────────────────────────────────────────────────

type RevealStep =
  | { type: 'key'; positionIndex: number; positionLabel: string; roleLabel: string; number: number; archetype: (typeof ARCHETYPES)[number] }
  | { type: 'connection'; soul: number; expression: number }
  | { type: 'map'; positions: MirrorProfile['positions'] }
  | { type: 'composites'; positions: MirrorProfile['positions'] };

function KeyCard({
  step, onContinue, isFinal,
}: {
  step: Extract<RevealStep, { type: 'key' }>;
  onContinue: () => void;
  isFinal: boolean;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;
  const arc = step.archetype;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.keyCard, { opacity: fade, transform: [{ scale }] }]}>
      {/* Step label */}
      <View style={styles.stepTag}>
        <Text style={[styles.stepTagText, { color: arc.color }]}>
          КЛЮЧ {step.positionIndex} · {step.positionLabel.toUpperCase()}
        </Text>
      </View>

      {/* Archetype visual */}
      <View style={styles.arcCenter}>
        <View style={[styles.arcOrbit, { borderColor: arc.color + '22', width: 160, height: 160, borderRadius: 80 }]} />
        <View style={[styles.arcOrbit, { borderColor: arc.color + '35', width: 108, height: 108, borderRadius: 54 }]} />
        <View style={[styles.arcCircle, { borderColor: arc.color + '55', backgroundColor: arc.color + '0E', width: 72, height: 72, borderRadius: 36 }]}>
          <Text style={[styles.arcNum, { color: arc.color }]}>{step.number}</Text>
        </View>
        {/* Orbiting symbol */}
        <View
          style={[
            styles.arcSymbol,
            {
              backgroundColor: arc.color + '15', borderColor: arc.color + '30',
              position: 'absolute', top: 6, right: 16,
            },
          ]}
        >
          <Text style={[styles.arcSymbolText, { color: arc.color }]}>{arc.symbol}</Text>
        </View>
      </View>

      {/* Planet + name */}
      <View style={styles.arcHeader}>
        <Text style={[styles.arcPlanet, { color: arc.color }]}>{arc.planet} · {arc.planetSanskrit}</Text>
        <Text style={styles.arcName}>{arc.name}</Text>
        <Text style={styles.arcRoleLabel}>{step.roleLabel}</Text>
      </View>

      {/* Human core — the archetype described as a human */}
      <View style={[styles.arcHumanBox, { borderColor: arc.color + '20' }]}>
        <Text style={styles.arcHumanText}>{arc.humanCore}</Text>
      </View>

      {/* Light / Shadow brief */}
      <View style={styles.lsRow}>
        <View style={[styles.lsBox, { borderColor: arc.color + '28', backgroundColor: arc.color + '08' }]}>
          <Text style={[styles.lsLabel, { color: arc.color }]}>Свет</Text>
          <Text style={styles.lsText}>{arc.light}</Text>
        </View>
        <View style={[styles.lsBox, { borderColor: Colors.borderLight }]}>
          <Text style={[styles.lsLabel, { color: Colors.textMuted }]}>Тень</Text>
          <Text style={styles.lsText}>{arc.shadow}</Text>
        </View>
      </View>

      {/* Question for recognition */}
      <View style={[styles.questionBox, { borderColor: arc.color + '22' }]}>
        <MaterialIcons name="help-outline" size={14} color={arc.color} />
        <Text style={styles.questionText}>{arc.questionForUser}</Text>
      </View>

      {/* CTA */}
      <Pressable
        onPress={onContinue}
        style={({ pressed }) => [styles.continueCta, { backgroundColor: arc.color + '18', borderColor: arc.color + '40' }, pressed && { opacity: 0.8 }]}
        accessibilityLabel={isFinal ? 'Увидеть всю карту' : 'Следующий ключ'}
      >
        <Text style={[styles.continueText, { color: arc.color }]}>
          {isFinal ? 'Увидеть всю карту' : 'Следующий ключ'}
        </Text>
        <MaterialIcons name="arrow-forward" size={15} color={arc.color} />
      </Pressable>
    </Animated.View>
  );
}

// ── Connection card — "Когда эти две силы встречаются" ───────────────────────

function ConnectionCard({
  step, onContinue, profile,
}: {
  step: Extract<RevealStep, { type: 'connection' }>;
  onContinue: () => void;
  profile: MirrorProfile;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  const soulPos = profile.positions[0];
  const exprPos = profile.positions[1];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();
  }, []);

  const connectionText = buildConnectionText(soulPos.finalNumber, exprPos.finalNumber, profile);

  return (
    <Animated.View style={[styles.keyCard, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={styles.stepTag}>
        <Text style={[styles.stepTagText, { color: Colors.gold }]}>ПЕРВОЕ СОЕДИНЕНИЕ</Text>
      </View>

      {/* Two archetype nodes connected */}
      <View style={styles.connectionNodes}>
        <View style={styles.connectionNode}>
          <View style={[styles.connCircle, { borderColor: soulPos.planetColor + '55', backgroundColor: soulPos.planetColor + '10' }]}>
            <Text style={[styles.connNum, { color: soulPos.planetColor }]}>{soulPos.finalNumber}</Text>
          </View>
          <Text style={[styles.connLabel, { color: soulPos.planetColor }]}>{soulPos.planet}</Text>
          <Text style={styles.connRole}>Душа</Text>
        </View>
        <View style={styles.connectionLine}>
          <View style={styles.connectionDot} />
          <View style={styles.connectionDash} />
          <View style={styles.connectionDot} />
        </View>
        <View style={styles.connectionNode}>
          <View style={[styles.connCircle, { borderColor: exprPos.planetColor + '55', backgroundColor: exprPos.planetColor + '10' }]}>
            <Text style={[styles.connNum, { color: exprPos.planetColor }]}>{exprPos.finalNumber}</Text>
          </View>
          <Text style={[styles.connLabel, { color: exprPos.planetColor }]}>{exprPos.planet}</Text>
          <Text style={styles.connRole}>Выражение</Text>
        </View>
      </View>

      <Text style={styles.connectionTitle}>Когда эти две силы встречаются…</Text>

      <View style={styles.connectionBody}>
        <Text style={styles.connectionText}>{connectionText}</Text>
      </View>

      <Pressable
        onPress={onContinue}
        style={({ pressed }) => [styles.continueCta, { backgroundColor: Colors.goldGlow, borderColor: Colors.border }, pressed && { opacity: 0.8 }]}
      >
        <Text style={[styles.continueText, { color: Colors.gold }]}>Увидеть реализацию</Text>
        <MaterialIcons name="arrow-forward" size={15} color={Colors.gold} />
      </Pressable>
    </Animated.View>
  );
}

// ── Full map reveal — WOW moment ──────────────────────────────────────────────

function MapReveal({
  step, onContinue, profile,
}: {
  step: Extract<RevealStep, { type: 'map' }>;
  onContinue: () => void;
  profile: MirrorProfile;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;
  const dotsScale = step.positions.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();

    step.positions.forEach((_, i) => {
      setTimeout(() => {
        Animated.spring(dotsScale[i], { toValue: 1, ...Motion.spring.bouncy, useNativeDriver: true }).start();
      }, i * 200);
    });
  }, []);

  return (
    <Animated.View style={[styles.keyCard, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={styles.stepTag}>
        <Text style={[styles.stepTagText, { color: Colors.gold }]}>ВАША КАРТА</Text>
      </View>

      <Text style={styles.mapWowText}>
        Вот она.{'\n'}Вся целиком.
      </Text>

      {/* Formula — all five */}
      <View style={styles.mapPositions}>
        {step.positions.map((pos, i) => (
          <React.Fragment key={pos.key}>
            <Animated.View style={[styles.mapNode, { transform: [{ scale: dotsScale[i] }] }]}>
              <View style={[styles.mapCircle, { borderColor: pos.planetColor + '55', backgroundColor: pos.planetColor + '0E' }]}>
                <Text style={[styles.mapNum, { color: pos.planetColor }]}>{pos.finalNumber}</Text>
                {pos.compositeNumber !== pos.finalNumber ? (
                  <Text style={[styles.mapComp, { color: pos.planetColor + 'AA' }]}>{pos.compositeNumber}</Text>
                ) : null}
              </View>
              <Text style={styles.mapLabel} numberOfLines={2}>
                {pos.label.replace('Число ', '')}
              </Text>
              <Text style={[styles.mapPlanet, { color: pos.planetColor + 'BB' }]}>{pos.planet}</Text>
            </Animated.View>
            {i < step.positions.length - 1 ? (
              <View style={styles.mapLine} />
            ) : null}
          </React.Fragment>
        ))}
      </View>

      {/* Recognition moment */}
      <View style={[styles.recognitionBox, { borderColor: Colors.border }]}>
        <Text style={styles.recognitionText}>{profile.recognition.headline}</Text>
      </View>

      <Text style={styles.mapNote}>
        Планеты — метафорический язык системы, не астрологический прогноз
      </Text>

      <Pressable
        onPress={onContinue}
        style={({ pressed }) => [styles.mapCta, pressed && { opacity: 0.88 }]}
        accessibilityLabel="Посмотреть глубже"
      >
        <LinearGradient
          colors={[Colors.gold, Colors.goldSoft]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.mapCtaGrad}
        >
          <Text style={styles.mapCtaText}>Посмотреть глубже</Text>
          <MaterialIcons name="arrow-forward" size={17} color={Colors.background} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

// ── Helper: connection text ───────────────────────────────────────────────────

function buildConnectionText(soul: number, expr: number, profile: MirrorProfile): string {
  const soulPos = profile.positions[0];
  const exprPos = profile.positions[1];

  // These are hand-written for the most common combinations.
  // In canonical product: replace with interpretation service.
  const combinations: Record<string, string> = {
    '6_2': `Одна часть вашей формулы стремится к красоте и гармонии — и отдаёт её окружающим. Другая ищет отклика, прежде чем действовать. Вместе они могут давать высокое качество контакта и тепло, которое люди ощущают. Но иногда — ожидание идеального момента затягивается дольше, чем нужно.`,
    '1_1': `Обе части вашей формулы работают на инициативу. Это мощно, когда есть цель. Но иногда такое сочетание создаёт сложность с тем, чтобы остановиться и услышать другого.`,
    '8_5': `Одна часть строит медленно и серьёзно. Другая стремится к движению и расширению. Это внутреннее противоречие может быть источником силы — или источником постоянного напряжения, пока не найден баланс.`,
  };

  const key = `${soul}_${expr}`;
  if (combinations[key]) return combinations[key];

  // Generic fallback
  return `${soulPos.planet} внутри и ${exprPos.planet} в выражении — это не одно и то же направление. ${soulPos.humanDescription.split('.')[0]}. Но проявляется через ${exprPos.humanDescription.split('.')[0].toLowerCase()}. Именно здесь часто рождается и самое интересное напряжение.`;
}

// ── Composite numbers reveal ─────────────────────────────────────────────────

function CompositesReveal({
  step, onContinue, profile,
}: {
  step: Extract<RevealStep, { type: 'composites' }>;
  onContinue: () => void;
  profile: MirrorProfile;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  // Positions that have a meaningful composite (composite ≠ final)
  const withComposite = step.positions.filter(p => p.compositeNumber !== p.finalNumber);
  const singleDigit = step.positions.filter(p => p.compositeNumber === p.finalNumber);

  const rowFades = step.positions.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();

    step.positions.forEach((_, i) => {
      setTimeout(() => {
        Animated.timing(rowFades[i], { toValue: 1, duration: 350, useNativeDriver: true }).start();
      }, 160 + i * 130);
    });
  }, []);

  return (
    <Animated.View style={[styles.keyCard, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={styles.stepTag}>
        <Text style={[styles.stepTagText, { color: Colors.gold }]}>ЗА ЧИСЛАМИ</Text>
      </View>

      <Text style={styles.compositeTitle}>
        В каждой позиции есть двойное дно.
      </Text>
      <Text style={styles.compositeSubtitle}>
        Итоговое число рождается из составного. Две восьмёрки могут звучать совершенно по-разному — если одна пришла из 17, а другая из 35.
      </Text>

      {/* Positions with composite depth */}
      {withComposite.length > 0 ? (
        <View style={styles.compositesBlock}>
          <Text style={[styles.compositeBlockLabel, { color: Colors.gold }]}>Составные числа в вашей формуле</Text>
          {step.positions.map((pos, i) => {
            const hasDepth = pos.compositeNumber !== pos.finalNumber;
            return (
              <Animated.View
                key={pos.key}
                style={[styles.compositeRow, { opacity: rowFades[i] }, !hasDepth && styles.compositeRowDim]}
              >
                {/* Role label */}
                <Text style={styles.compositeRoleLabel}>
                  {pos.label.replace('Число ', '')}
                </Text>

                {/* Chain visual */}
                <View style={styles.compositeChainRow}>
                  {hasDepth ? (
                    <>
                      <View style={[styles.compositeChainNum, { borderColor: pos.planetColor + '60', backgroundColor: pos.planetColor + '0D' }]}>
                        <Text style={[styles.compositeChainBig, { color: pos.planetColor }]}>{pos.compositeNumber}</Text>
                        <Text style={[styles.compositeChainTag, { color: pos.planetColor + 'AA' }]}>состав</Text>
                      </View>
                      <MaterialIcons name="arrow-forward" size={14} color={Colors.borderLight} style={{ marginHorizontal: 2 }} />
                      <View style={[styles.compositeChainNum, { borderColor: pos.planetColor + '40', backgroundColor: 'transparent' }]}>
                        <Text style={[styles.compositeChainBig, { color: pos.planetColor }]}>{pos.finalNumber}</Text>
                        <Text style={[styles.compositeChainTag, { color: pos.planetColor + 'AA' }]}>итог</Text>
                      </View>
                      {/* Chain formula */}
                      <View style={styles.compositeChainFormula}>
                        <Text style={styles.compositeChainFormulaText}>{pos.calculationChain}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={[styles.compositeChainNum, { borderColor: pos.planetColor + '30', backgroundColor: 'transparent' }]}>
                        <Text style={[styles.compositeChainBig, { color: pos.planetColor + 'BB' }]}>{pos.finalNumber}</Text>
                        <Text style={[styles.compositeChainTag, { color: pos.planetColor + '88' }]}>изначально</Text>
                      </View>
                      <Text style={styles.compositeChainSingle}>однозначное</Text>
                    </>
                  )}
                </View>

                {/* Composite insight text — only for those with depth */}
                {hasDepth ? (
                  <View style={[styles.compositeInsightBox, { borderColor: pos.planetColor + '20' }]}>
                    <Text style={styles.compositeInsightText}>
                      {buildCompositeInsight(pos.compositeNumber, pos.finalNumber, pos.planet)}
                    </Text>
                  </View>
                ) : null}
              </Animated.View>
            );
          })}
        </View>
      ) : null}

      {/* Bridge text toward Deep */}
      <View style={[styles.compositeBridgeBox, { borderColor: Colors.gold + '22' }]}>
        <MaterialIcons name="lock-outline" size={14} color={Colors.gold} />
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={[styles.compositeBridgeTitle, { color: Colors.gold }]}>Глубина остаётся</Text>
          <Text style={styles.compositeBridgeText}>
            В полном исследовании составные числа раскрываются как отдельный слой смысла. Каждое — это не просто путь к итогу, а собственная история.
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onContinue}
        style={({ pressed }) => [styles.mapCta, pressed && { opacity: 0.88 }]}
        accessibilityLabel="Открыть полный паспорт"
      >
        <LinearGradient
          colors={[Colors.gold, Colors.goldSoft]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.mapCtaGrad}
        >
          <Text style={styles.mapCtaText}>Открыть полный паспорт</Text>
          <MaterialIcons name="arrow-forward" size={17} color={Colors.background} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

function buildCompositeInsight(composite: number, final: number, planet: string): string {
  // Hand-crafted insight for common composites. Canonical: replace with interpretation service.
  const insights: Record<number, string> = {
    11: 'Одиннадцать — усиленная чуткость. Луна, но ярче: тонкость восприятия доведена до предела. Два рядом — это интенсивность контакта.',
    22: 'Двадцать два — строитель крупного масштаба. Форма, умноженная на форму. Архитектор, которому нужны большие задачи.',
    33: 'Тридцать три — знание как призвание. Юпитер в двойной силе: обучать, передавать, создавать системы понимания.',
    35: 'Тридцать пять — Меркурий внутри Юпитера. Знание и движение одновременно. Путь медленный, но коммуникация делает его живым.',
    41: 'Сорок один — форма ищет выхода. Раху создаёт основание, единица толкает вперёд. Направление может проявиться неожиданно.',
    82: 'Восемьдесят два — Луна в основании Сатурна. Чуткость как ресурс для большого строительства. Итог созревает медленно, но он настоящий.',
    14: 'Четырнадцать — Раху и Меркурий. Желание структуры встречается с желанием движения. Это напряжение и есть источник.',
    16: 'Шестнадцать — Солнце и Венера. Личная сила ищет красоту как форму выражения.',
    19: 'Девятнадцать — Солнце и Марс. Двойная воля. Лидерство через действие, а не через статус.',
    28: 'Двадцать восемь — Луна и Сатурн. Чувствительность выдерживает тяжесть. Зрелость приходит через опыт близости.',
  };
  if (insights[composite]) return insights[composite];
  // Generic
  return `${composite} → ${final}: за итоговым числом стоит путь, который его образовал. Одинаковый результат из разных составных — это другой характер.`;
}

// ── Progress dots ─────────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.progressDots}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.progressDot,
            i <= current ? styles.progressDotActive : {},
          ]}
        />
      ))}
    </View>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function RevealScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const containerFade = useRef(new Animated.Value(0)).current;

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

  const { positions } = profile;

  // Build steps
  const STEPS: RevealStep[] = [
    { type: 'key', positionIndex: 1, positionLabel: 'Число Души', roleLabel: 'Внутренняя природа', number: positions[0].finalNumber, archetype: ARCHETYPES[positions[0].finalNumber] },
    { type: 'key', positionIndex: 2, positionLabel: 'Число Выражения', roleLabel: 'Способ проявления', number: positions[1].finalNumber, archetype: ARCHETYPES[positions[1].finalNumber] },
    { type: 'connection', soul: positions[0].finalNumber, expression: positions[1].finalNumber },
    { type: 'key', positionIndex: 3, positionLabel: 'Число Пути', roleLabel: 'Движение в мире', number: positions[2].finalNumber, archetype: ARCHETYPES[positions[2].finalNumber] },
    { type: 'key', positionIndex: 4, positionLabel: 'Число Направления', roleLabel: 'Форма раскрытия', number: positions[3].finalNumber, archetype: ARCHETYPES[positions[3].finalNumber] },
    { type: 'map', positions },
    { type: 'composites', positions },
  ];

  useEffect(() => {
    analytics.track('reveal_started');
    Animated.timing(containerFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleNext = () => {
    const step = STEPS[stepIndex];
    if (step.type === 'key') {
      analytics.track('reveal_key_seen', { key_index: step.positionIndex, archetype_number: step.number });
    } else if (step.type === 'connection') {
      analytics.track('reveal_connection_seen');
    } else if (step.type === 'map') {
      analytics.track('reveal_map_viewed');
    } else if (step.type === 'composites') {
      analytics.track('reveal_completed');
      router.replace('/first-mirror');
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      // Fade out current, then advance
      Animated.timing(containerFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setStepIndex(i => i + 1);
        Animated.timing(containerFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    } else {
      analytics.track('reveal_completed');
      router.replace('/first-mirror');
    }
  };

  const handleSkip = () => {
    analytics.track('reveal_skipped', { at_step: stepIndex });
    router.replace('/first-mirror');
  };

  const currentStep = STEPS[stepIndex];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text style={styles.headerTitle}>
          {currentSession?.name ? currentSession.name : 'Ваш код'}
        </Text>
        <Pressable onPress={handleSkip} hitSlop={12}>
          <Text style={styles.skipText}>Пропустить</Text>
        </Pressable>
      </View>

      {/* Progress */}
      <ProgressDots total={STEPS.length} current={stepIndex} />

      {/* Step content */}
      <Animated.ScrollView
        key={stepIndex}
        style={{ opacity: containerFade, flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {currentStep.type === 'key' ? (
          <KeyCard
            step={currentStep}
            onContinue={handleNext}
            isFinal={stepIndex === STEPS.length - 3}
          />
        ) : currentStep.type === 'connection' ? (
          <ConnectionCard step={currentStep} onContinue={handleNext} profile={profile} />
        ) : currentStep.type === 'map' ? (
          <MapReveal step={currentStep} onContinue={handleNext} profile={profile} />
        ) : (
          <CompositesReveal step={currentStep} onContinue={handleNext} profile={profile} />
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm,
  },
  headerTitle: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
  skipText: { ...Typography.caption, color: Colors.textMuted, textDecorationLine: 'underline' },

  progressDots: {
    flexDirection: 'row', justifyContent: 'center', gap: 7,
    paddingVertical: Spacing.sm,
  },
  progressDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  progressDotActive: { backgroundColor: Colors.gold, width: 24 },

  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },

  // Key card
  keyCard: {
    backgroundColor: Colors.surface, borderRadius: Radii.xxl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.xl, gap: Spacing.lg,
  },
  stepTag: { alignSelf: 'flex-start' },
  stepTagText: { ...Typography.label, letterSpacing: 1.5 },

  arcCenter: {
    alignItems: 'center', justifyContent: 'center',
    height: 180, position: 'relative',
  },
  arcOrbit: { position: 'absolute', borderWidth: 1, borderStyle: 'dashed' },
  arcCircle: {
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    gap: 0,
  },
  arcNum: { fontSize: 28, fontWeight: '700', lineHeight: 32 },
  arcSymbol: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  arcSymbolText: { fontSize: 18 },

  arcHeader: { alignItems: 'center', gap: 3 },
  arcPlanet: { ...Typography.label, letterSpacing: 1.2 },
  arcName: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.2 },
  arcRoleLabel: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic' },

  arcHumanBox: {
    borderWidth: 1, borderRadius: Radii.xl, padding: Spacing.md,
  },
  arcHumanText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 26 },

  lsRow: { flexDirection: 'row', gap: Spacing.sm },
  lsBox: { flex: 1, borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.sm, gap: 4 },
  lsLabel: { ...Typography.label, fontSize: 10 },
  lsText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },

  questionBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    borderWidth: 1, borderRadius: Radii.xl, padding: Spacing.md,
  },
  questionText: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22, flex: 1 },

  continueCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, borderWidth: 1, borderRadius: Radii.lg,
    paddingVertical: 16, marginTop: 4,
  },
  continueText: { ...Typography.button, fontWeight: '600' },

  // Connection card
  connectionNodes: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  connectionNode: { alignItems: 'center', gap: 6, flex: 1 },
  connCircle: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  connNum: { fontSize: 24, fontWeight: '700' },
  connLabel: { ...Typography.label, fontSize: 9 },
  connRole: { ...Typography.caption, color: Colors.textMuted },
  connectionLine: {
    flexDirection: 'row', alignItems: 'center', gap: 3, flex: 0.6, justifyContent: 'center',
  },
  connectionDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.gold + '60' },
  connectionDash: { flex: 1, height: 1, backgroundColor: Colors.borderLight },

  connectionTitle: {
    fontSize: 20, fontWeight: '600', color: Colors.textPrimary,
    lineHeight: 28, textAlign: 'center',
  },
  connectionBody: {
    backgroundColor: Colors.surfaceDark, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.md,
  },
  connectionText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 26 },

  // Map reveal
  mapWowText: {
    fontSize: 30, fontWeight: '700', color: Colors.textPrimary,
    lineHeight: 38, letterSpacing: -0.5, textAlign: 'center',
  },
  mapPositions: { flexDirection: 'row', alignItems: 'flex-end' },
  mapNode: { flex: 1, alignItems: 'center', gap: 4 },
  mapCircle: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  mapNum: { fontSize: 20, fontWeight: '700', lineHeight: 24 },
  mapComp: { fontSize: 9, lineHeight: 12 },
  mapLabel: { ...Typography.caption, color: Colors.textPrimary, fontWeight: '600', fontSize: 9, textAlign: 'center' },
  mapPlanet: { ...Typography.caption, fontSize: 8, textAlign: 'center' },
  mapLine: { width: 1, height: 24, backgroundColor: Colors.borderLight, alignSelf: 'center', marginBottom: 28 },

  recognitionBox: {
    backgroundColor: Colors.surfaceDark, borderRadius: Radii.xl,
    borderWidth: 1, padding: Spacing.md,
  },
  recognitionText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 26 },

  mapNote: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', fontSize: 9, fontStyle: 'italic',
  },
  mapCta: { borderRadius: Radii.lg, overflow: 'hidden', marginTop: 4 },
  mapCtaGrad: {
    paddingVertical: 17, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: Spacing.sm,
  },
  mapCtaText: { ...Typography.button, color: Colors.background, fontWeight: '700', fontSize: 16 },

  // Composites
  compositeTitle: {
    fontSize: 22, fontWeight: '700', color: Colors.textPrimary,
    lineHeight: 30, letterSpacing: -0.2,
  },
  compositeSubtitle: {
    ...Typography.body, color: Colors.textSecondary, lineHeight: 26,
  },
  compositesBlock: {
    backgroundColor: Colors.surfaceDark, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  compositeBlockLabel: {
    ...Typography.label, letterSpacing: 1.2,
    paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.xs,
  },
  compositeRow: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    gap: Spacing.xs, borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  compositeRowDim: { opacity: 0.5 },
  compositeRoleLabel: {
    ...Typography.label, color: Colors.textMuted, fontSize: 10, letterSpacing: 0.8,
  },
  compositeChainRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, flexWrap: 'wrap',
  },
  compositeChainNum: {
    minWidth: 52, height: 52, borderRadius: Radii.sm, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', gap: 1,
  },
  compositeChainBig: { fontSize: 22, fontWeight: '700', lineHeight: 26 },
  compositeChainTag: { fontSize: 8, lineHeight: 10 },
  compositeChainFormula: {
    flex: 1, backgroundColor: Colors.background, borderRadius: Radii.xs,
    paddingHorizontal: Spacing.xs, paddingVertical: 4,
  },
  compositeChainFormulaText: {
    ...Typography.caption, color: Colors.textDisabled, fontFamily: 'monospace', fontSize: 10,
  },
  compositeChainSingle: {
    ...Typography.caption, color: Colors.textDisabled, fontStyle: 'italic', marginLeft: Spacing.xs,
  },
  compositeInsightBox: {
    borderWidth: 1, borderRadius: Radii.sm, padding: Spacing.xs,
    marginTop: 2,
  },
  compositeInsightText: {
    ...Typography.caption, color: Colors.textSecondary, lineHeight: 18,
  },
  compositeBridgeBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    borderWidth: 1, borderRadius: Radii.xl, padding: Spacing.md,
  },
  compositeBridgeTitle: { ...Typography.label, letterSpacing: 1 },
  compositeBridgeText: {
    ...Typography.caption, color: Colors.textMuted, lineHeight: 18,
  },
});
