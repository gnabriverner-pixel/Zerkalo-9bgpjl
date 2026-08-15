/**
 * Myth — Personal Myth Lens
 * "Зеркало себя" · Линза 1: Личный миф
 *
 * 4-step ritual using horizontal paging (Animated.ScrollView).
 * Steps:
 *   1. Напряжение / Неясность — what creates inner friction right now
 *   2. Образ состояния — the image that captures your current state
 *   3. Точка живости — where you feel most alive recently
 *   4. Искомое качество — the quality you are seeking
 *
 * After answers: meditative waiting screen (pulsing Orb) → story result.
 *
 * Analytics: myth_started → myth_step_completed(n) → myth_waiting → myth_result_viewed
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
  TextInput, ScrollView, Dimensions, Platform, KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';
import { Motion } from '@/constants/motion';
import { Orb } from '@/components/brand/Orb';
import { analytics } from '@/services/analytics';

const { width: SW } = Dimensions.get('window');

// ── Story content (mock — replace with AI service in canonical product) ──────

interface MythAnswers {
  tension: string;
  image: string;
  aliveness: string;
  quality: string;
}

function generateMythStory(answers: MythAnswers): {
  title: string;
  story: string;
  reflectionQuestion: string;
} {
  // Mock story generation based on answers
  // In canonical product: replace with OpenAI/OnSpace AI call
  const tension = answers.tension || 'внутреннее напряжение';
  const img = answers.image || 'образ состояния';
  const aliveness = answers.aliveness || 'момент живости';
  const quality = answers.quality || 'искомое качество';

  const title = `История о ${quality.toLowerCase()}`;

  const story = `Был человек, который чувствовал внутри себя то, что можно было бы назвать «${tension.toLowerCase()}». Это ощущение не было врагом — оно было вестником. Оно говорило: что-то здесь ищет другой формы.

Когда он закрывал глаза, перед ним возникал образ: ${img.toLowerCase()}. Не как угроза, а как зеркало — показывающее, в каком пространстве он сейчас находится.

Но он помнил и другое. Недавно был момент, когда всё стало настоящим: ${aliveness.toLowerCase()}. Там не было тревоги — только присутствие. Это и было подсказкой.

Он понял, что ищет не решение, а ${quality.toLowerCase()}. Не как достижение — а как способ быть. И в этом поиске было что-то большее, чем просто желание. Это было направление.

Каждый человек в определённый момент встречает своё внутреннее напряжение лицом к лицу. Не чтобы победить его, а чтобы услышать, что оно говорит. Ваше напряжение говорит о ${quality.toLowerCase()}.`;

  const reflectionQuestion = `Если бы это напряжение — «${tension.toLowerCase()}» — было не проблемой, а приглашением: куда бы оно вас звало?`;

  return { title, story, reflectionQuestion };
}

// ── Step question data ────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'tension',
    stepNum: 1,
    label: 'НАПРЯЖЕНИЕ',
    question: 'Что сейчас создаёт внутреннее напряжение или неясность?',
    hint: 'Не ищите «правильный» ответ. Напишите первое, что появляется.',
    placeholder: 'Например: ощущение, что живу не своей жизнью...',
    color: Colors.rahu,
  },
  {
    id: 'image',
    stepNum: 2,
    label: 'ОБРАЗ',
    question: 'Если бы ваше нынешнее состояние было образом — что это было бы?',
    hint: 'Любой образ: предмет, пространство, явление природы, сцена.',
    placeholder: 'Например: комната с закрытыми окнами...',
    color: Colors.saturn,
  },
  {
    id: 'aliveness',
    stepNum: 3,
    label: 'ЖИВОСТЬ',
    question: 'Вспомните момент за последние месяцы, когда вы чувствовали себя наиболее живым.',
    hint: 'Необязательно важное событие. Достаточно момента.',
    placeholder: 'Например: разговор с другом на кухне до рассвета...',
    color: Colors.mercury,
  },
  {
    id: 'quality',
    stepNum: 4,
    label: 'ИСКОМОЕ',
    question: 'Какое качество или состояние вы сейчас ищете в своей жизни?',
    hint: 'Одно слово или короткая фраза.',
    placeholder: 'Например: внутренняя свобода...',
    color: Colors.gold,
  },
];

// ── Step card ─────────────────────────────────────────────────────────────────

function StepCard({
  step, answer, onAnswer, onNext, isLast, progress,
}: {
  step: typeof STEPS[0];
  answer: string;
  onAnswer: (v: string) => void;
  onNext: () => void;
  isLast: boolean;
  progress: number;
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();
  }, [step.id]);

  const canProceed = answer.trim().length > 2;

  return (
    <Animated.View style={[cardStyles.root, { opacity: fade, transform: [{ translateY: slide }] }]}>
      {/* Progress bar */}
      <View style={cardStyles.progressBar}>
        <View style={[cardStyles.progressFill, { width: `${progress}%`, backgroundColor: step.color }]} />
      </View>

      {/* Orb */}
      <View style={cardStyles.orbWrap}>
        <Orb color={step.color} size={80} rotationDuration={10000} />
      </View>

      {/* Step label */}
      <View style={[cardStyles.chip, { backgroundColor: step.color + '12', borderColor: step.color + '28' }]}>
        <Text style={[cardStyles.chipText, { color: step.color }]}>ШАБЛОН {step.stepNum} · {step.label}</Text>
      </View>

      {/* Question */}
      <Text style={cardStyles.question}>{step.question}</Text>
      <Text style={cardStyles.hint}>{step.hint}</Text>

      {/* Input */}
      <TextInput
        value={answer}
        onChangeText={onAnswer}
        placeholder={step.placeholder}
        placeholderTextColor={Colors.textDisabled}
        multiline
        style={[cardStyles.input, { borderColor: answer.trim() ? step.color + '35' : Colors.borderLight }]}
        returnKeyType="done"
        blurOnSubmit
      />

      {/* Next CTA */}
      <Pressable
        onPress={canProceed ? onNext : undefined}
        style={({ pressed }) => [
          cardStyles.nextBtn,
          { borderColor: step.color + (canProceed ? '55' : '20'), backgroundColor: step.color + (canProceed ? '15' : '08') },
          pressed && canProceed && { opacity: 0.8 },
          !canProceed && cardStyles.nextBtnDisabled,
        ]}
        accessibilityLabel={isLast ? 'Собрать историю' : 'Следующий вопрос'}
      >
        <Text style={[cardStyles.nextText, { color: canProceed ? step.color : Colors.textDisabled }]}>
          {isLast ? 'Собрать историю' : 'Следующий вопрос'}
        </Text>
        <MaterialIcons
          name={isLast ? 'auto-stories' : 'arrow-forward'}
          size={16}
          color={canProceed ? step.color : Colors.textDisabled}
        />
      </Pressable>
    </Animated.View>
  );
}

const cardStyles = StyleSheet.create({
  root: {
    flex: 1, paddingHorizontal: Spacing.lg, gap: Spacing.lg,
    justifyContent: 'flex-start',
  },
  progressBar: {
    height: 3, backgroundColor: Colors.borderLight, borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: 3, borderRadius: 2 },
  orbWrap: { alignSelf: 'center', marginVertical: Spacing.sm },
  chip: {
    alignSelf: 'flex-start', borderRadius: Radii.full, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  chipText: { ...Typography.label, fontSize: 9, letterSpacing: 1.5 },
  question: {
    fontSize: 22, fontWeight: '600', color: Colors.textPrimary,
    lineHeight: 30, letterSpacing: -0.2, fontFamily: 'serif',
  },
  hint: { ...Typography.bodySmall, color: Colors.textMuted, lineHeight: 20 },
  input: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    borderWidth: 1, padding: Spacing.md,
    color: Colors.textPrimary, fontSize: 16, lineHeight: 24,
    minHeight: 100, textAlignVertical: 'top',
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: Radii.lg, borderWidth: 1,
    paddingVertical: 16, marginTop: 4,
  },
  nextBtnDisabled: { opacity: 0.5 },
  nextText: { ...Typography.button, fontWeight: '600' },
});

// ── Waiting screen ────────────────────────────────────────────────────────────

function WaitingScreen({ onDone }: { onDone: () => void }) {
  const orbScale = useRef(new Animated.Value(0.85)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const [textIndex, setTextIndex] = useState(0);

  const WAITING_TEXTS = [
    'История собирается из ваших образов...',
    'Ищем внутреннюю тему...',
    'Соединяем четыре нити...',
    'Почти готово...',
  ];

  useEffect(() => {
    // Pulse orb
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbScale, { toValue: 1.08, duration: 1800, useNativeDriver: true }),
        Animated.timing(orbScale, { toValue: 0.85, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    // Cycle through texts
    let i = 0;
    const cycle = () => {
      textFade.setValue(0);
      setTextIndex(i);
      Animated.timing(textFade, { toValue: 1, duration: 400, useNativeDriver: true }).start(() => {
        i++;
        if (i < WAITING_TEXTS.length) {
          setTimeout(cycle, 900);
        } else {
          setTimeout(onDone, 700);
        }
      });
    };
    setTimeout(cycle, 400);
  }, []);

  return (
    <View style={waitStyles.root}>
      <Animated.View style={{ transform: [{ scale: orbScale }] }}>
        <Orb color={Colors.mythPrimary} size={140} rotationDuration={6000} />
      </Animated.View>
      <Animated.Text style={[waitStyles.text, { opacity: textFade }]}>
        {WAITING_TEXTS[textIndex]}
      </Animated.Text>
      <Text style={waitStyles.sub}>
        История рождается из ваших собственных образов
      </Text>
    </View>
  );
}

const waitStyles = StyleSheet.create({
  root: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  text: {
    fontSize: 20, fontWeight: '500', color: Colors.textPrimary,
    textAlign: 'center', lineHeight: 28, fontFamily: 'serif',
  },
  sub: {
    ...Typography.caption, color: Colors.textMuted, textAlign: 'center',
    fontStyle: 'italic',
  },
});

// ── Story result screen ───────────────────────────────────────────────────────

function StoryResult({
  answers, insets, onOpenCode, onMeeting,
}: {
  answers: MythAnswers;
  insets: { bottom: number; top: number };
  onOpenCode: () => void;
  onMeeting: () => void;
}) {
  const { title, story, reflectionQuestion } = generateMythStory(answers);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, ...Motion.spring.gentle, useNativeDriver: true }),
    ]).start();
  }, []);

  const chips = [
    { label: 'Напряжение', value: answers.tension },
    { label: 'Образ', value: answers.image },
    { label: 'Живость', value: answers.aliveness },
    { label: 'Искомое', value: answers.quality },
  ];

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      style={{ opacity: fade, transform: [{ translateY: slide }] }}
      contentContainerStyle={[resultStyles.content, { paddingBottom: insets.bottom + 80 }]}
    >
      {/* Myth orb */}
      <View style={resultStyles.orbWrap}>
        <Orb color={Colors.mythPrimary} size={100} rotationDuration={20000} />
      </View>

      <View style={resultStyles.badge}>
        <MaterialIcons name="auto-stories" size={12} color={Colors.mythPrimary} />
        <Text style={resultStyles.badgeText}>ВАША ИСТОРИЯ</Text>
      </View>

      {/* Story title */}
      <Text style={resultStyles.storyTitle}>{title}</Text>

      {/* Story text */}
      <View style={resultStyles.storyBody}>
        {story.split('\n\n').map((para, i) => (
          <Text key={i} style={resultStyles.storyPara}>{para}</Text>
        ))}
      </View>

      {/* Source chips */}
      <View style={resultStyles.sourcesWrap}>
        <Text style={resultStyles.sourcesLabel}>Из ваших образов:</Text>
        <View style={resultStyles.chips}>
          {chips.map(c => (
            c.value ? (
              <View key={c.label} style={resultStyles.chip}>
                <Text style={resultStyles.chipLabel}>{c.label}</Text>
                <Text style={resultStyles.chipValue}>{c.value}</Text>
              </View>
            ) : null
          ))}
        </View>
      </View>

      {/* Reflection question */}
      <View style={[resultStyles.reflectionBox, { borderColor: Colors.mythPrimary + '25' }]}>
        <MaterialIcons name="help-outline" size={14} color={Colors.mythPrimary} />
        <Text style={resultStyles.reflectionText}>{reflectionQuestion}</Text>
      </View>

      {/* CTAs */}
      <Pressable
        onPress={onOpenCode}
        style={({ pressed }) => [resultStyles.codeCta, pressed && { opacity: 0.88 }]}
      >
        <LinearGradient
          colors={[Colors.gold, Colors.goldSoft]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={resultStyles.codeCtaGrad}
        >
          <MaterialIcons name="fingerprint" size={16} color={Colors.background} />
          <Text style={resultStyles.codeCtaText}>Открыть второе зеркало — Цифровой код</Text>
        </LinearGradient>
      </Pressable>

      <Pressable
        onPress={onMeeting}
        style={({ pressed }) => [resultStyles.meetingCta, pressed && { opacity: 0.82 }]}
      >
        <View style={[styles.meetingMiniOrbs]}>
          <View style={[styles.meetingDot, { backgroundColor: Colors.mythPrimary }]} />
          <View style={[styles.meetingDot, { backgroundColor: Colors.gold, marginLeft: -5 }]} />
        </View>
        <Text style={resultStyles.meetingCtaText}>Перейти ко Встрече зеркал</Text>
        <MaterialIcons name="arrow-forward" size={14} color={Colors.gold} />
      </Pressable>

      <Text style={resultStyles.disclaimer}>
        История сгенерирована на основе ваших ответов. Носит образно-исследовательский характер. Не является психологической консультацией.
      </Text>
    </Animated.ScrollView>
  );
}

const resultStyles = StyleSheet.create({
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.lg, paddingTop: Spacing.lg },
  orbWrap: { alignSelf: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center',
    backgroundColor: Colors.mythGlow, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.mythDim,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  badgeText: { ...Typography.label, color: Colors.mythPrimary, fontSize: 9, letterSpacing: 1.5 },
  storyTitle: {
    fontSize: 26, fontWeight: '400', color: Colors.textPrimary,
    lineHeight: 34, textAlign: 'center', fontFamily: 'serif',
  },
  storyBody: {
    backgroundColor: Colors.surface, borderRadius: Radii.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
    padding: Spacing.lg, gap: Spacing.md,
  },
  storyPara: {
    ...Typography.body, color: Colors.textSecondary, lineHeight: 28,
  },
  sourcesWrap: { gap: Spacing.sm },
  sourcesLabel: { ...Typography.label, color: Colors.textMuted, letterSpacing: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.surface, borderRadius: Radii.lg,
    borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.sm, maxWidth: '48%',
  },
  chipLabel: { ...Typography.label, color: Colors.mythPrimary, fontSize: 9, marginBottom: 2 },
  chipValue: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 16 },
  reflectionBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    borderWidth: 1, borderRadius: Radii.xl, padding: Spacing.md,
  },
  reflectionText: {
    ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22, flex: 1,
    fontStyle: 'italic',
  },
  codeCta: { borderRadius: Radii.lg, overflow: 'hidden', ...Shadows.gold },
  codeCtaGrad: {
    paddingVertical: 16, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: Spacing.sm,
  },
  codeCtaText: { ...Typography.button, color: Colors.background, fontWeight: '700' },
  meetingCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.sm,
  },
  meetingCtaText: { ...Typography.bodySmall, color: Colors.gold, fontWeight: '600' },
  disclaimer: {
    ...Typography.caption, color: Colors.textDisabled,
    textAlign: 'center', lineHeight: 17, fontSize: 10, fontStyle: 'italic',
  },
});

// ── Main ─────────────────────────────────────────────────────────────────────

type Phase = 'ritual' | 'waiting' | 'result';

export default function MythScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('ritual');
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    tension: '', image: '', aliveness: '', quality: '',
  });

  const headerFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    analytics.track('myth_started');
  }, []);

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex) / STEPS.length) * 100;

  const handleNext = async () => {
    if (Platform.OS !== 'web') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    analytics.track('myth_step_completed', { step: stepIndex + 1 });

    if (stepIndex < STEPS.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      // Move to waiting
      analytics.track('myth_waiting');
      setPhase('waiting');
    }
  };

  const handleWaitingDone = () => {
    analytics.track('myth_result_viewed');
    setPhase('result');
  };

  const handleOpenCode = () => {
    router.push('/(tabs)/calculate');
  };

  const handleMeeting = () => {
    router.push('/meeting');
  };

  const mythAnswers: MythAnswers = {
    tension: answers.tension,
    image: answers.image,
    aliveness: answers.aliveness,
    quality: answers.quality,
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      {phase !== 'result' ? (
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={18} color={Colors.textMuted} />
          </Pressable>
          <Text style={styles.headerTitle}>Личный миф</Text>
          {phase === 'ritual' ? (
            <Text style={styles.headerStep}>{stepIndex + 1} / {STEPS.length}</Text>
          ) : (
            <View style={{ width: 32 }} />
          )}
        </View>
      ) : (
        <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={18} color={Colors.textMuted} />
          </Pressable>
          <Text style={styles.headerTitle}>Ваша история</Text>
          <View style={{ width: 32 }} />
        </View>
      )}

      {/* Content by phase */}
      {phase === 'ritual' ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        >
          <StepCard
            step={currentStep}
            answer={answers[currentStep.id]}
            onAnswer={v => setAnswers(a => ({ ...a, [currentStep.id]: v }))}
            onNext={handleNext}
            isLast={stepIndex === STEPS.length - 1}
            progress={progress}
          />
        </ScrollView>
      ) : phase === 'waiting' ? (
        <WaitingScreen onDone={handleWaitingDone} />
      ) : (
        <StoryResult
          answers={mythAnswers}
          insets={{ bottom: insets.bottom, top: insets.top }}
          onOpenCode={handleOpenCode}
          onMeeting={handleMeeting}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm,
    backgroundColor: Colors.surfaceDark + 'F0',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  headerTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '600' },
  headerStep: { ...Typography.caption, color: Colors.textMuted, minWidth: 32, textAlign: 'right' },
  scrollContent: { flexGrow: 1, paddingTop: Spacing.lg },
  meetingMiniOrbs: { flexDirection: 'row' },
  meetingDot: { width: 14, height: 14, borderRadius: 7 },
});
