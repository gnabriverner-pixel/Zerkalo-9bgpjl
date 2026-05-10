import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  KeyboardAvoidingView, Platform, Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import {
  calculateCoreNumbers, calculateCompatibility, CoreNumbers
} from '@/services/calculations';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { Colors, Spacing, Typography, Radii, PLANET_NAMES, PLANET_COLORS } from '@/constants/theme';

export default function CompatibilityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentSession } = useApp();
  const { showAlert } = useAlert();

  const [name1, setName1] = useState(currentSession?.name || '');
  const [dob1, setDob1] = useState(currentSession?.dateOfBirth || '');
  const [name2, setName2] = useState('');
  const [dob2, setDob2] = useState('');
  const [result, setResult] = useState<{
    core1: CoreNumbers;
    core2: CoreNumbers;
    compatibility: ReturnType<typeof calculateCompatibility>;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const formatDob = (text: string, setter: (v: string) => void) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + '.' + cleaned.slice(2);
    if (cleaned.length > 4) formatted = formatted.slice(0, 5) + '.' + cleaned.slice(4, 8);
    setter(formatted);
  };

  const parseDate = (dob: string) => {
    const parts = dob.split('.');
    if (parts.length !== 3) return null;
    return { day: parseInt(parts[0]), month: parseInt(parts[1]), year: parseInt(parts[2]) };
  };

  const handleCalculate = async () => {
    const d1 = parseDate(dob1);
    const d2 = parseDate(dob2);
    if (!d1 || !d2) {
      showAlert('Введите даты', 'Заполните дату рождения для обоих участников в формате ДД.ММ.ГГГГ');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const core1 = calculateCoreNumbers(d1.day, d1.month, d1.year);
    const core2 = calculateCoreNumbers(d2.day, d2.month, d2.year);
    const compatibility = calculateCompatibility(core1, core2);
    setResult({ core1, core2, compatibility });
    setLoading(false);
  };

  const unionColor = result ? PLANET_COLORS[result.compatibility.unionNumber] || Colors.gold : Colors.gold;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xxl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.textSecondary} />
          </Pressable>
          <View>
            <Text style={styles.pageTitle}>Совместимость</Text>
            <Text style={styles.pageSubtitle}>Вектор взаимодействия двух числовых кодов</Text>
          </View>
        </View>

        {/* Form */}
        <PremiumCard>
          <Text style={styles.formSection}>Участник А</Text>
          <TextInput
            style={styles.input}
            value={name1}
            onChangeText={setName1}
            placeholder="Имя (необязательно)"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { marginTop: Spacing.sm }]}
            value={dob1}
            onChangeText={t => formatDob(t, setDob1)}
            placeholder="Дата рождения ДД.ММ.ГГГГ"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            maxLength={10}
          />

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <View style={styles.separatorIcon}>
              <MaterialIcons name="compare-arrows" size={20} color={Colors.gold} />
            </View>
            <View style={styles.separatorLine} />
          </View>

          <Text style={styles.formSection}>Участник Б</Text>
          <TextInput
            style={styles.input}
            value={name2}
            onChangeText={setName2}
            placeholder="Имя (необязательно)"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { marginTop: Spacing.sm }]}
            value={dob2}
            onChangeText={t => formatDob(t, setDob2)}
            placeholder="Дата рождения ДД.ММ.ГГГГ"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            maxLength={10}
          />
        </PremiumCard>

        <GoldButton
          title="Рассчитать совместимость"
          onPress={handleCalculate}
          fullWidth
          loading={loading}
        />

        {result ? (
          <>
            {/* Codes comparison */}
            <PremiumCard dark style={styles.codesCard}>
              <View style={styles.codesRow}>
                <View style={styles.codeBlock}>
                  <Text style={styles.codePersonName}>{name1 || 'Участник А'}</Text>
                  <Text style={styles.codeDob}>{dob1}</Text>
                  <NumberBadge number={result.core1.resultFinal} composite={result.core1.resultComposite !== result.core1.resultFinal ? result.core1.resultComposite : undefined} size="lg" showPlanet />
                  <Text style={styles.codeFormula}>
                    {result.core1.mindFinal}–{result.core1.actionFinal}–{result.core1.realizationFinal}–{result.core1.resultFinal}
                  </Text>
                </View>

                <View style={styles.unionBadge}>
                  <View style={[styles.unionCircle, { borderColor: unionColor, backgroundColor: unionColor + '15' }]}>
                    <Text style={[styles.unionNumber, { color: unionColor }]}>
                      {result.compatibility.unionNumber}
                    </Text>
                  </View>
                  <Text style={styles.unionLabel}>союз</Text>
                </View>

                <View style={[styles.codeBlock, { alignItems: 'flex-end' }]}>
                  <Text style={styles.codePersonName}>{name2 || 'Участник Б'}</Text>
                  <Text style={styles.codeDob}>{dob2}</Text>
                  <NumberBadge number={result.core2.resultFinal} composite={result.core2.resultComposite !== result.core2.resultFinal ? result.core2.resultComposite : undefined} size="lg" showPlanet />
                  <Text style={styles.codeFormula}>
                    {result.core2.mindFinal}–{result.core2.actionFinal}–{result.core2.realizationFinal}–{result.core2.resultFinal}
                  </Text>
                </View>
              </View>
            </PremiumCard>

            {/* Summary */}
            <PremiumCard>
              <SectionLabel title="Вектор взаимодействия" />
              <Text style={styles.summaryText}>{result.compatibility.summary}</Text>
            </PremiumCard>

            {/* Strengths */}
            <PremiumCard>
              <SectionLabel title="Сильные стороны союза" />
              {result.compatibility.strengthZones.map((s, i) => (
                <View key={i} style={[styles.zoneRow, i > 0 && styles.zoneDivider]}>
                  <View style={[styles.zoneDot, { backgroundColor: Colors.gold }]} />
                  <Text style={styles.zoneText}>{s}</Text>
                </View>
              ))}
            </PremiumCard>

            {/* Tensions */}
            <PremiumCard>
              <SectionLabel title="Зоны напряжения" />
              {result.compatibility.tensionZones.map((s, i) => (
                <View key={i} style={[styles.zoneRow, i > 0 && styles.zoneDivider]}>
                  <View style={[styles.zoneDot, { backgroundColor: Colors.textMuted }]} />
                  <Text style={styles.zoneText}>{s}</Text>
                </View>
              ))}
            </PremiumCard>

            {/* Recommendations */}
            <PremiumCard>
              <SectionLabel title="Практические ориентиры" />
              <Text style={styles.summaryText}>
                Союз раскрывается там, где оба участника приносят свою силу, а не компенсируют чужую слабость.
                Ключ — ясные договорённости, уважение к разным скоростям и зрелый язык чувств без молчаливого геройства.
              </Text>
            </PremiumCard>
          </>
        ) : null}

        <DisclaimerBanner compact />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md, gap: Spacing.lg },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  backBtn: { padding: 4, marginTop: 2 },
  pageTitle: { ...Typography.title, color: Colors.textPrimary },
  pageSubtitle: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  formSection: { ...Typography.subheading, color: Colors.textPrimary, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  separatorIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.gold + '15',
    borderWidth: 1, borderColor: Colors.gold + '40',
    alignItems: 'center', justifyContent: 'center',
  },
  codesCard: { gap: Spacing.md },
  codesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codeBlock: { flex: 1, alignItems: 'flex-start', gap: 4 },
  codePersonName: { ...Typography.subheading, color: Colors.textLight, fontSize: 15 },
  codeDob: { ...Typography.caption, color: Colors.textLightMuted },
  codeFormula: { ...Typography.caption, color: Colors.textLightMuted, letterSpacing: 1, marginTop: 4 },
  unionBadge: { alignItems: 'center', gap: Spacing.xs },
  unionCircle: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  unionNumber: { fontSize: 26, fontWeight: '700' },
  unionLabel: { ...Typography.caption, color: Colors.textLightMuted },
  summaryText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 26 },
  zoneRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: Spacing.sm, alignItems: 'flex-start' },
  zoneDivider: { borderTopWidth: 1, borderTopColor: Colors.borderLight },
  zoneDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  zoneText: { ...Typography.body, color: Colors.textPrimary, flex: 1, lineHeight: 24, fontSize: 15 },
});
