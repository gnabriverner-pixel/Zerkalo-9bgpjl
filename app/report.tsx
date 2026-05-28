import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/hooks/useApp';
import { CodePassport } from '@/components/feature/CodePassport';
import { MatrixGrid } from '@/components/feature/MatrixGrid';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Colors, Spacing, Typography, Radii, PLANET_NAMES } from '@/constants/theme';
import { PERSONAL_YEAR_MEANINGS, NUMBER_SHORT_MEANINGS } from '@/constants/numerology-data';

const REPORT_SECTIONS = [
  'I. Как читать это исследование',
  'II. Числовой паспорт',
  'III. Первое слово',
  'IV. Число Ума',
  'V. Число Действия',
  'VI. Число Реализации',
  'VII. Число Итога',
  'VIII. Матрица',
  'IX. Главный внутренний конфликт',
  'X. Деньги и реализация',
  'XI. Отношения',
  'XII. Личный год и месяцы',
  'XIII. Возрастная карта',
  'XIV. Практические шаги',
  'XV. Заключение',
];

export default function ReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession, isPremium } = useApp();
  const [activeSection, setActiveSection] = useState(0);

  if (!currentSession || !isPremium) {
    return (
      <View style={[styles.container, styles.locked]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { position: 'absolute', top: insets.top + 16, left: 16 }]}>
          <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
        </Pressable>
        <MaterialIcons name="workspace-premium" size={48} color={Colors.gold} />
        <Text style={styles.lockedTitle}>Глубокий разбор</Text>
        <Text style={styles.lockedBody}>
          Для доступа к полному персональному исследованию необходим оплаченный доступ
        </Text>
        <GoldButton
          title="Получить доступ"
          onPress={() => router.push('/paywall')}
          style={{ marginTop: Spacing.xl }}
        />
      </View>
    );
  }

  const { core, matrix, cycles, name, dateOfBirth } = currentSession;
  const yearMeaning = PERSONAL_YEAR_MEANINGS[cycles.personalYear];

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionRoman}>I</Text>
            <Text style={styles.sectionHeading}>Как читать это исследование</Text>
            <Text style={styles.sectionBody}>
              Этот разбор построен в трёх слоях. Первый слой — жёсткий каркас: расчёты, матрица, составные числа, линии, периоды и логика связей. Второй слой — каноническое значение: что означают эти числа в языке системы. Третий слой — живая интерпретация: как это превращается в характер, стиль жизни, деньги, усталость, внутренний конфликт, чувство достоинства и путь.
            </Text>
            <Text style={styles.sectionBody}>
              Такой подход важен потому, что сухой расчёт без образа не касается души, а чистая поэтика без каркаса быстро превращается в туман. Здесь задача другая: сохранить точность основания и при этом перевести её на язык, который человек способен не только понять умом, но и почувствовать сердцем.
            </Text>
            <PremiumCard style={styles.pullQuote}>
              <Text style={styles.pullQuoteText}>
                Главный принцип исследования: не приукрашивать характер и не упрощать судьбу. Сильная дата не делает человека автоматически счастливым. Она даёт мощность. Вопрос всегда в том, во что эта мощность превращена.
              </Text>
            </PremiumCard>
          </View>
        );
      case 1:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionRoman}>II</Text>
            <Text style={styles.sectionHeading}>Числовой паспорт</Text>
            <CodePassport core={core} name={name} dark />
            <Text style={styles.sectionBody}>
              Базовая формула {name}: {core.soulFinal} — {core.pathFinal} — {core.directionFinal} — {core.resultFinal}.
              {'\n\n'}
              Это одна из требовательных и красивых траекторий. Она говорит: внутри у человека есть природа {PLANET_NAMES[core.soulFinal]}, которая реализуется через {PLANET_NAMES[core.pathFinal]} и приходит к зрелому итогу {PLANET_NAMES[core.resultFinal]}.
            </Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionRoman}>III</Text>
            <Text style={styles.sectionHeading}>Первое слово</Text>
            <Text style={styles.sectionBody}>
              В вашей дате нет ничего случайного. Это не код маленькой жизни. Это код большого внутреннего ресурса, который требует формы.
              {'\n\n'}
              Если смотреть на ваш код целиком, первое ощущение от него — это не слабость. Это дата взрослого человека, который способен вынести больше среднего, собрать больше среднего и нести ответственность дольше среднего.
              {'\n\n'}
              Но у любой сильной даты есть цена. Чем мощнее внутренний мотор, тем важнее, в какой форме он живёт. Иначе сила, которая могла бы строить судьбу, начинает давить на своего же носителя.
            </Text>
            <PremiumCard dark>
              <Text style={styles.pullQuoteLight}>
                {NUMBER_SHORT_MEANINGS[core.soulFinal]} — это внутренняя природа. Но важнее то, как эта природа превращена в форму жизни.
              </Text>
            </PremiumCard>
          </View>
        );
      case 7:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionRoman}>VIII</Text>
            <Text style={styles.sectionHeading}>Матрица</Text>
            <Text style={styles.sectionBody}>Простая матрица рождения, построенная из цифр даты:</Text>
            <PremiumCard dark>
              <MatrixGrid matrix={matrix} mode="simple" dark />
            </PremiumCard>
            <Text style={styles.sectionBody}>Детальная матрица с учётом составных чисел:</Text>
            <PremiumCard dark>
              <MatrixGrid matrix={matrix} mode="detailed" dark />
            </PremiumCard>
            {matrix.emptyDetailed.length > 0 ? (
              <Text style={styles.sectionBody}>
                Пустоты в детальной матрице: {matrix.emptyDetailed.join(', ')} — зоны, которые жизнь предлагает развивать осознанно.
              </Text>
            ) : null}
          </View>
        );
      case 11:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionRoman}>XII</Text>
            <Text style={styles.sectionHeading}>Личный год и месяцы</Text>
            <NumberBadge number={cycles.personalYear} size="xl" label="ЛИЧНЫЙ ГОД 2026" showPlanet style={{ alignSelf: 'center', marginVertical: Spacing.md }} />
            <Text style={styles.sectionBody}>
              {yearMeaning?.title}. {yearMeaning?.focus}
            </Text>
            <Text style={[styles.sectionBody, { color: Colors.textMuted, fontStyle: 'italic' }]}>
              Расчёт: {cycles.yearChain}
            </Text>
          </View>
        );
      case 13:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionRoman}>XIV</Text>
            <Text style={styles.sectionHeading}>Практические шаги</Text>
            {[
              { title: 'Цель на бумаге', body: 'Запишите одну главную цель с конкретным сроком. Неоформленное намерение рассеивает силу.' },
              { title: 'Тело как база', body: 'Сон, движение и ритм дня — не дополнение, а фундамент сильного кода.' },
              { title: 'Оформление знания', body: 'Всё прожитое и понятое должно выходить в форму: текст, схема, урок, объяснение.' },
              { title: 'Честный контакт', body: 'Вместо молчаливого геройства — ясная договорённость. Это усиливает любой код.' },
              { title: 'Качество жизни как дисциплина', body: 'Красота, отдых и удовольствие — не награда за страдание, а норма зрелой жизни.' },
            ].map((step, i) => (
              <PremiumCard key={i} style={styles.stepCard}>
                <Text style={styles.stepNum}>{i + 1}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.body}</Text>
              </PremiumCard>
            ))}
          </View>
        );
      case 14:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionRoman}>XV</Text>
            <Text style={styles.sectionHeading}>Заключение</Text>
            <Text style={styles.sectionBody}>
              В вашей дате нет ничего случайного. Это код большого внутреннего ресурса, который требует формы.
              {'\n\n'}
              Ваш путь не в том, чтобы стать удобнее. Ваш настоящий путь — превратить внутренний огонь в форму, форму — в качество, а качество — в пространство, где становится лучше жить.
            </Text>
            <PremiumCard dark style={styles.finalQuote}>
              <Text style={styles.finalQuoteText}>
                Ваш дар не в том, чтобы всегда быть сильнее.{'\n'}
                Ваш дар в том, чтобы сила перестала быть насилием над собой{'\n'}
                и стала архитектурой зрелой жизни.
              </Text>
              <Text style={styles.finalQuoteAuthor}>— Альберт Анатольевич Вяземский</Text>
            </PremiumCard>
            <DisclaimerBanner />
          </View>
        );
      default:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionRoman}>{REPORT_SECTIONS[activeSection].split('.')[0]}</Text>
            <Text style={styles.sectionHeading}>{REPORT_SECTIONS[activeSection].replace(/^[IVX]+\.\s/, '')}</Text>
            <Text style={styles.sectionBody}>
              Этот раздел раскрывает тему {REPORT_SECTIONS[activeSection].replace(/^[IVX]+\.\s/, '').toLowerCase()} в контексте вашего числового кода {core.soulFinal}–{core.pathFinal}–{core.directionFinal}–{core.resultFinal}.
              {'\n\n'}
              {NUMBER_SHORT_MEANINGS[core.soulFinal]} — это внутренняя природа. {NUMBER_SHORT_MEANINGS[core.pathFinal]} — способ действия. {NUMBER_SHORT_MEANINGS[core.directionFinal]} — путь реализации. {NUMBER_SHORT_MEANINGS[core.resultFinal]} — зрелый итог.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient colors={[Colors.surfaceDark, Colors.surfaceMid]} style={styles.reportHeader}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <MaterialIcons name="close" size={20} color={Colors.textLightMuted} />
        </Pressable>
        <Text style={styles.reportLabel}>БОЛЬШОЕ ПЕРСОНАЛЬНОЕ ИССЛЕДОВАНИЕ</Text>
        <Text style={styles.reportName}>{name}</Text>
        <Text style={styles.reportDate}>{dateOfBirth}</Text>
      </LinearGradient>

      <View style={styles.body}>
        {/* TOC sidebar */}
        <ScrollView style={styles.toc} showsVerticalScrollIndicator={false}>
          {REPORT_SECTIONS.map((section, i) => (
            <Pressable
              key={i}
              onPress={() => setActiveSection(i)}
              style={[styles.tocItem, i === activeSection && styles.tocItemActive]}
            >
              <Text style={[styles.tocText, i === activeSection && styles.tocTextActive]} numberOfLines={2}>
                {section}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Content */}
        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          {renderSection()}
          <View style={styles.navButtons}>
            {activeSection > 0 ? (
              <Pressable onPress={() => setActiveSection(p => p - 1)} style={styles.navBtn}>
                <MaterialIcons name="arrow-back" size={16} color={Colors.gold} />
                <Text style={styles.navBtnText}>Назад</Text>
              </Pressable>
            ) : <View />}
            {activeSection < REPORT_SECTIONS.length - 1 ? (
              <Pressable onPress={() => setActiveSection(p => p + 1)} style={styles.navBtn}>
                <Text style={styles.navBtnText}>Вперёд</Text>
                <MaterialIcons name="arrow-forward" size={16} color={Colors.gold} />
              </Pressable>
            ) : null}
          </View>
          <View style={{ height: insets.bottom + Spacing.xxl }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  locked: { alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl, gap: Spacing.md },
  lockedTitle: { ...Typography.heading, color: Colors.textPrimary, textAlign: 'center' },
  lockedBody: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  reportHeader: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  closeBtn: { alignSelf: 'flex-end', padding: 4, marginBottom: Spacing.sm },
  reportLabel: { ...Typography.label, color: Colors.gold, marginBottom: 4 },
  reportName: { ...Typography.title, color: Colors.textLight },
  reportDate: { ...Typography.caption, color: Colors.textLightMuted, marginTop: 4 },
  body: { flex: 1, flexDirection: 'row' },
  toc: {
    width: 120,
    backgroundColor: Colors.surfaceDark,
    borderRightWidth: 1,
    borderRightColor: 'rgba(196,151,58,0.1)',
  },
  tocItem: {
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  tocItemActive: {
    backgroundColor: Colors.gold + '15',
    borderLeftWidth: 2,
    borderLeftColor: Colors.gold,
  },
  tocText: {
    ...Typography.caption,
    color: Colors.textLightMuted,
    lineHeight: 16,
    fontSize: 10,
  },
  tocTextActive: {
    color: Colors.gold,
    fontWeight: '600',
  },
  mainContent: { flex: 1, backgroundColor: Colors.background },
  sectionContent: { padding: Spacing.lg, gap: Spacing.lg },
  sectionRoman: { ...Typography.label, color: Colors.gold, fontSize: 12 },
  sectionHeading: { ...Typography.title, color: Colors.textPrimary, marginTop: -Spacing.sm },
  sectionBody: { ...Typography.body, color: Colors.textSecondary, lineHeight: 28 },
  pullQuote: {
    backgroundColor: Colors.gold + '08',
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    borderRadius: Radii.md,
    marginTop: Spacing.sm,
  },
  pullQuoteText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  pullQuoteLight: {
    ...Typography.body,
    color: Colors.textLightMuted,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  stepCard: {
    backgroundColor: Colors.surfaceAlt,
    gap: Spacing.xs,
  },
  stepNum: {
    ...Typography.label,
    color: Colors.gold,
    fontSize: 11,
  },
  stepTitle: { ...Typography.subheading, color: Colors.textPrimary },
  stepBody: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  finalQuote: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  finalQuoteText: {
    ...Typography.body,
    color: Colors.textLightMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 28,
  },
  finalQuoteAuthor: {
    ...Typography.caption,
    color: Colors.gold,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  navBtnText: { ...Typography.bodySmall, color: Colors.gold, fontWeight: '600' },
  backBtn: { padding: 4 },
});
