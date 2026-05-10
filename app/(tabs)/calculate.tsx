import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';
import { Colors, Spacing, Typography, Radii, Shadows } from '@/constants/theme';

const GENDER_OPTIONS = ['Не указывать', 'Мужской', 'Женский'];

const FORMULA_LAYERS = [
  { label: 'Душа', desc: 'Внутренняя природа' },
  { label: 'Выражение', desc: 'Способ проявления' },
  { label: 'Путь', desc: 'Движение в мире' },
  { label: 'Направление', desc: 'Форма раскрытия' },
  { label: 'Результат', desc: 'Зрелый итог' },
];

export default function CalculateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { runCalculation } = useApp();
  const { showAlert } = useAlert();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Не указывать');
  const [place, setPlace] = useState('');
  const [intention, setIntention] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDob = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + '.' + cleaned.slice(2);
    if (cleaned.length > 4) formatted = formatted.slice(0, 5) + '.' + cleaned.slice(4, 8);
    setDob(formatted);
  };

  const handleCalculate = async () => {
    if (!dob) {
      showAlert('Введите дату рождения', 'Это единственное обязательное поле');
      return;
    }
    const parts = dob.split('.');
    if (parts.length !== 3 || parts[2].length !== 4) {
      showAlert('Неверный формат', 'Введите дату в формате ДД.ММ.ГГГГ');
      return;
    }
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      showAlert('Проверьте дату', 'День должен быть 1–31, месяц 1–12');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const session = runCalculation(
      name.trim() || 'Ваш код', dob,
      gender !== 'Не указывать' ? gender : undefined,
      place.trim() || undefined,
      intention.trim() || undefined
    );
    setLoading(false);
    if (!session) {
      showAlert('Ошибка расчёта', 'Проверьте правильность даты рождения');
      return;
    }
    router.push('/result');
  };

  const dobFilled = dob.length === 10;
  const inputProgress =
    dob.length === 0 ? null :
    dob.length < 3 ? 'день' :
    dob.length < 6 ? 'месяц' :
    dob.length < 10 ? 'год' : null;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Ваша личная формула</Text>
          <Text style={styles.pageSubtitle}>Один параметр — дата рождения</Text>
        </View>

        {/* Main DOB field */}
        <View style={styles.dobCard}>
          <View style={styles.dobLabelRow}>
            <Text style={styles.dobLabel}>Дата рождения</Text>
            <View style={styles.requiredPill}>
              <Text style={styles.requiredPillText}>обязательно</Text>
            </View>
          </View>

          <TextInput
            style={[
              styles.dobInput,
              dobFilled ? styles.dobInputFilled : null,
            ]}
            value={dob}
            onChangeText={formatDob}
            placeholder="ДД.ММ.ГГГГ"
            placeholderTextColor={Colors.textDisabled}
            keyboardType="numeric"
            maxLength={10}
            accessibilityLabel="Дата рождения"
            returnKeyType="done"
          />

          {inputProgress ? (
            <Text style={styles.dobProgress}>
              Введите {inputProgress}
            </Text>
          ) : dobFilled ? (
            <Text style={styles.dobReady}>
              <MaterialIcons name="check" size={12} color={Colors.gold} /> Дата принята
            </Text>
          ) : null}
        </View>

        {/* Name field */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            Имя <Text style={styles.optional}>— необязательно</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Как к вам обращаться?"
            placeholderTextColor={Colors.textDisabled}
            autoCapitalize="words"
            accessibilityLabel="Имя"
            returnKeyType="next"
          />
        </View>

        {/* Optional toggle */}
        <Pressable
          onPress={() => setShowOptional(p => !p)}
          style={styles.optionalToggle}
          hitSlop={8}
        >
          <MaterialIcons
            name={showOptional ? 'expand-less' : 'expand-more'}
            size={16}
            color={Colors.textMuted}
          />
          <Text style={styles.optionalToggleText}>
            {showOptional ? 'Скрыть доп. поля' : 'Пол, место рождения, намерение'}
          </Text>
        </Pressable>

        {showOptional ? (
          <View style={styles.optionalGroup}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Пол</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map(opt => (
                  <Pressable
                    key={opt}
                    onPress={() => setGender(opt)}
                    style={[styles.genderPill, gender === opt && styles.genderPillActive]}
                  >
                    <Text style={[styles.genderPillText, gender === opt && styles.genderPillTextActive]}>
                      {opt === 'Не указывать' ? 'Не указ.' : opt}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Место рождения</Text>
              <TextInput
                style={styles.input}
                value={place}
                onChangeText={setPlace}
                placeholder="Город"
                placeholderTextColor={Colors.textDisabled}
                autoCapitalize="words"
                accessibilityLabel="Место рождения"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Намерение или вопрос</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={intention}
                onChangeText={setIntention}
                placeholder="С каким вопросом вы обращаетесь к коду?"
                placeholderTextColor={Colors.textDisabled}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                accessibilityLabel="Намерение"
              />
            </View>
          </View>
        ) : null}

        {/* Formula preview */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <MaterialIcons name="layers" size={14} color={Colors.gold} />
            <Text style={styles.previewTitle}>Пять слоёв формулы</Text>
          </View>
          <View style={styles.layersGrid}>
            {FORMULA_LAYERS.map((l, i) => (
              <View key={l.label} style={styles.layerItem}>
                <View style={styles.layerIndex}>
                  <Text style={styles.layerIndexText}>{i + 1}</Text>
                </View>
                <View style={styles.layerText}>
                  <Text style={styles.layerLabel}>{l.label}</Text>
                  <Text style={styles.layerDesc}>{l.desc}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.previewExtras}>
            {['Цепочки расчёта · составные числа', 'Матрица · Циклы · Денежный код'].map(item => (
              <View key={item} style={styles.previewRow}>
                <View style={styles.previewDot} />
                <Text style={styles.previewRowText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Legal */}
        <Text style={styles.legal}>
          Авторская система самоисследования · информационно-развлекательный характер · не является консультацией
        </Text>
      </ScrollView>

      {/* Fixed CTA */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          onPress={handleCalculate}
          disabled={loading}
          style={({ pressed }) => [
            styles.ctaBtn,
            loading && styles.ctaBtnLoading,
            pressed && { opacity: 0.88 },
          ]}
          accessibilityLabel="Рассчитать код"
        >
          {loading ? (
            <Text style={styles.ctaBtnText}>Рассчитываю…</Text>
          ) : (
            <>
              <Text style={styles.ctaBtnText}>Рассчитать код</Text>
              <MaterialIcons name="arrow-forward" size={20} color={Colors.background} />
            </>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.lg, gap: Spacing.lg },

  header: { gap: 6 },
  pageTitle: { ...Typography.title, color: Colors.textPrimary },
  pageSubtitle: { ...Typography.bodySmall, color: Colors.textMuted },

  // DOB card
  dobCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  dobLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dobLabel: { ...Typography.subheading, color: Colors.textPrimary },
  requiredPill: {
    backgroundColor: Colors.goldGlow,
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requiredPillText: { ...Typography.label, color: Colors.gold, fontSize: 9 },
  dobInput: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.borderLight,
  },
  dobInputFilled: {
    color: Colors.gold,
    borderBottomColor: Colors.gold,
  },
  dobProgress: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  dobReady: {
    ...Typography.caption,
    color: Colors.gold,
    marginTop: 2,
  },

  // Fields
  field: { gap: Spacing.sm },
  fieldLabel: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '500' },
  optional: { ...Typography.caption, color: Colors.textMuted, fontWeight: '400' },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: Radii.md,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  inputMulti: { minHeight: 80, paddingTop: Spacing.md },

  optionalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: 4,
  },
  optionalToggleText: { ...Typography.caption, color: Colors.textMuted },
  optionalGroup: { gap: Spacing.lg },

  genderRow: { flexDirection: 'row', gap: Spacing.sm },
  genderPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  genderPillActive: {
    borderColor: Colors.border,
    backgroundColor: Colors.goldTint,
  },
  genderPillText: { ...Typography.bodySmall, color: Colors.textMuted },
  genderPillTextActive: { color: Colors.gold, fontWeight: '600' },

  // Preview card
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  previewTitle: { ...Typography.label, color: Colors.gold },
  layersGrid: { gap: Spacing.sm },
  layerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  layerIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layerIndexText: { ...Typography.label, color: Colors.gold, fontSize: 10 },
  layerText: { flex: 1 },
  layerLabel: { ...Typography.bodySmall, color: Colors.textPrimary, fontWeight: '500' },
  layerDesc: { ...Typography.caption, color: Colors.textMuted, marginTop: 1 },
  previewExtras: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    gap: 6,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  previewDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gold,
    opacity: 0.6,
  },
  previewRowText: { ...Typography.caption, color: Colors.textSecondary },

  legal: {
    ...Typography.caption,
    color: Colors.textDisabled,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 10,
    paddingHorizontal: Spacing.md,
  },

  // Fixed CTA
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  ctaBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radii.lg,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.gold,
  },
  ctaBtnLoading: { opacity: 0.7 },
  ctaBtnText: {
    ...Typography.button,
    color: Colors.background,
    fontWeight: '700',
    fontSize: 16,
  },
});
